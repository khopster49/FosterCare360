import { Router, Request, Response } from 'express';
import { isAuthenticated } from './auth-routes';
import { db } from './db';
import { applicants } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const applicationsRouter = Router();

// Get all applications for the current user
applicationsRouter.get('/user', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Fetch all applications for this user
    const applications = await db
      .select()
      .from(applicants)
      .where(eq(applicants.userId, userId))
      .orderBy(applicants.saveDate);
    
    return res.status(200).json(applications);
  } catch (error: any) {
    console.error('Error fetching user applications:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

// Get a specific application by ID
applicationsRouter.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const applicationId = parseInt(req.params.id);
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (isNaN(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    // Fetch the specific application
    const [application] = await db
      .select()
      .from(applicants)
      .where(eq(applicants.id, applicationId));
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Ensure the user owns this application
    if (application.userId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to access this application' });
    }
    
    return res.status(200).json(application);
  } catch (error: any) {
    console.error('Error fetching application:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch application',
      error: error.message
    });
  }
});

// Update application progress
applicationsRouter.patch('/:id/progress', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId;
    const applicationId = parseInt(req.params.id);
    const { step } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (isNaN(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID' });
    }
    
    if (typeof step !== 'number' || step < 0) {
      return res.status(400).json({ message: 'Invalid step value' });
    }
    
    // Fetch the application to ensure it exists and belongs to the user
    const [application] = await db
      .select()
      .from(applicants)
      .where(eq(applicants.id, applicationId));
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (application.userId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this application' });
    }
    
    // Update the last completed step if the new step is further along
    if (step > (application.lastCompletedStep || 0)) {
      await db
        .update(applicants)
        .set({ 
          lastCompletedStep: step,
          saveDate: new Date()
        })
        .where(eq(applicants.id, applicationId));
    }
    
    return res.status(200).json({ 
      message: 'Application progress updated',
      step
    });
  } catch (error: any) {
    console.error('Error updating application progress:', error);
    return res.status(500).json({ 
      message: 'Failed to update application progress',
      error: error.message
    });
  }
});