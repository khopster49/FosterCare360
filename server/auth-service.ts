import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { users, User } from '@shared/schema';
import { eq } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Mock email transport for development
// In production, you'd use a real SMTP service
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'default_user',
    pass: process.env.EMAIL_PASS || 'default_pass'
  }
});

class AuthService {
  /**
   * Register a new user
   */
  async register(email: string, password: string, firstName: string, lastName: string, phoneNumber: string = ''): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new Error('Email is already registered');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Generate verification token
      const verificationToken = uuidv4();
      const verificationExpiry = new Date();
      verificationExpiry.setHours(verificationExpiry.getHours() + 24); // Token valid for 24 hours
      
      // Insert new user
      const [user] = await db.insert(users).values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber,
        verificationToken,
        verificationTokenExpiry: verificationExpiry,
        verified: false,
        createdAt: new Date(),
      }).returning();
      
      // Send verification email
      await this.sendVerificationEmail(email, verificationToken);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Verify a user's email using the token
   */
  async verifyEmail(token: string): Promise<boolean> {
    try {
      // Find user with matching token
      const [user] = await db.select()
        .from(users)
        .where(eq(users.verificationToken, token));
      
      if (!user) {
        throw new Error('Invalid verification token');
      }
      
      // Check if token is expired
      if (user.verificationTokenExpiry && new Date() > user.verificationTokenExpiry) {
        throw new Error('Verification token has expired');
      }
      
      // Update user as verified
      await db.update(users)
        .set({ 
          verified: true,
          verificationToken: null,
          verificationTokenExpiry: null
        })
        .where(eq(users.id, user.id));
      
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  /**
   * Authenticate a user
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Check if user is verified
      if (!user.verified) {
        throw new Error('Please verify your email before logging in');
      }
      
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        throw new Error('Invalid email or password');
      }
      
      // Update last login
      await db.update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        // For security reasons, still return true even if user not found
        return true;
      }
      
      // Generate reset token
      const resetToken = uuidv4();
      const resetExpiry = new Date();
      resetExpiry.setHours(resetExpiry.getHours() + 1); // Token valid for 1 hour
      
      // Update user with reset token
      await db.update(users)
        .set({ 
          resetPasswordToken: resetToken,
          resetPasswordExpiry: resetExpiry
        })
        .where(eq(users.id, user.id));
      
      // Send password reset email
      await this.sendPasswordResetEmail(email, resetToken);
      
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      // Find user with matching token
      const [user] = await db.select()
        .from(users)
        .where(eq(users.resetPasswordToken, token));
      
      if (!user) {
        throw new Error('Invalid reset token');
      }
      
      // Check if token is expired
      if (user.resetPasswordExpiry && new Date() > user.resetPasswordExpiry) {
        throw new Error('Reset token has expired');
      }
      
      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update user with new password
      await db.update(users)
        .set({ 
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpiry: null
        })
        .where(eq(users.id, user.id));
      
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.email, email));
      
      return user;
    } catch (error) {
      console.error('Find user by email error:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findUserById(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, id));
      
      return user;
    } catch (error) {
      console.error('Find user by ID error:', error);
      throw error;
    }
  }

  /**
   * Send verification email
   */
  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationLink = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@fosteringapplication.com',
      to: email,
      subject: 'Verify Your Email - Fostering Application',
      html: `
        <h1>Fostering Application Email Verification</h1>
        <p>Thank you for registering with us. Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not register for an account, you can ignore this email.</p>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email
   */
  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@fosteringapplication.com',
      to: email,
      subject: 'Reset Your Password - Fostering Application',
      html: `
        <h1>Fostering Application Password Reset</h1>
        <p>You requested to reset your password. Please click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, you can ignore this email.</p>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

export const authService = new AuthService();