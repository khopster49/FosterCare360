import { Request, Response, Router } from 'express';
import { authService } from './auth-service';
import { registerSchema, loginSchema } from '@shared/schema';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { pool } from './db';
import path from 'path';

const PgSession = connectPgSimple(session);

export const authRouter = Router();

// Configure session middleware
export const configureSession = (app: any) => {
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: 'sessions'
      }),
      secret: process.env.SESSION_SECRET || 'foster-app-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      }
    })
  );
};

// Registration endpoint
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const parsedBody = registerSchema.safeParse(req.body);
    
    if (!parsedBody.success) {
      return res.status(400).json({ 
        message: 'Invalid registration data', 
        errors: parsedBody.error.errors 
      });
    }
    
    const { email, password, firstName, lastName, phoneNumber } = parsedBody.data;
    
    const user = await authService.register(
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    );
    
    // Remove sensitive information
    const { password: _, ...safeUser } = user;
    
    return res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: safeUser
    });
  } catch (error: any) {
    console.error('Registration endpoint error:', error);
    
    return res.status(400).json({
      message: error.message || 'Registration failed'
    });
  }
});

// Email verification endpoint
authRouter.get('/verify-email', async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    
    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }
    
    await authService.verifyEmail(token);
    
    // Redirect to login page with success message
    return res.redirect('/login?verified=true');
  } catch (error: any) {
    console.error('Email verification endpoint error:', error);
    
    // Redirect to error page
    return res.redirect('/verify-error?message=' + encodeURIComponent(error.message));
  }
});

// Login endpoint
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const parsedBody = loginSchema.safeParse(req.body);
    
    if (!parsedBody.success) {
      return res.status(400).json({ 
        message: 'Invalid login data', 
        errors: parsedBody.error.errors 
      });
    }
    
    const { email, password } = parsedBody.data;
    
    const user = await authService.login(email, password);
    
    // Set user in session
    req.session.userId = user.id;
    
    // Remove sensitive information
    const { password: _, ...safeUser } = user;
    
    return res.status(200).json({
      message: 'Login successful',
      user: safeUser
    });
  } catch (error: any) {
    console.error('Login endpoint error:', error);
    
    return res.status(401).json({
      message: error.message || 'Invalid email or password'
    });
  }
});

// Logout endpoint
authRouter.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to logout' });
    }
    
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logout successful' });
  });
});

// Request password reset
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    await authService.requestPasswordReset(email);
    
    return res.status(200).json({
      message: 'If your email is registered, you will receive password reset instructions'
    });
  } catch (error: any) {
    console.error('Password reset request endpoint error:', error);
    
    return res.status(500).json({
      message: 'Failed to process password reset request'
    });
  }
});

// Reset password with token
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Token and new password are required' 
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }
    
    await authService.resetPassword(token, newPassword);
    
    return res.status(200).json({
      message: 'Password has been reset successfully'
    });
  } catch (error: any) {
    console.error('Password reset endpoint error:', error);
    
    return res.status(400).json({
      message: error.message || 'Failed to reset password'
    });
  }
});

// Get current user
authRouter.get('/me', async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await authService.findUserById(req.session.userId);
    
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Remove sensitive information
    const { password, ...safeUser } = user;
    
    return res.status(200).json({
      user: safeUser
    });
  } catch (error: any) {
    console.error('Get current user endpoint error:', error);
    
    return res.status(500).json({
      message: 'Failed to retrieve user information'
    });
  }
});

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  next();
};