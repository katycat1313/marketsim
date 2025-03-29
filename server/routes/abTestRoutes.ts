import express, { Request, Response } from 'express';
import { storage } from '../storage';
import { ABTestSimulation } from '../services/abTestSimulationService';
import { z } from 'zod';

const router = express.Router();
const abTestSimulation = new ABTestSimulation(storage);

/**
 * Get all A/B tests 
 * Optional query parameters: userId, campaignId
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const campaignId = req.query.campaignId ? Number(req.query.campaignId) : undefined;
    
    const tests = await storage.getABTests(userId, campaignId);
    res.json(tests);
  } catch (error) {
    console.error('Error getting AB tests:', error);
    res.status(500).json({ error: 'Failed to retrieve A/B tests' });
  }
});

/**
 * Get a specific A/B test by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const testId = Number(req.params.id);
    const test = await storage.getABTest(testId);
    
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    res.json(test);
  } catch (error) {
    console.error('Error getting AB test:', error);
    res.status(500).json({ error: 'Failed to retrieve A/B test details' });
  }
});

/**
 * Get variants for a specific A/B test
 */
router.get('/:id/variants', async (req: Request, res: Response) => {
  try {
    const testId = Number(req.params.id);
    const variants = await storage.getABTestVariants(testId);
    
    res.json(variants);
  } catch (error) {
    console.error('Error getting AB test variants:', error);
    res.status(500).json({ error: 'Failed to retrieve A/B test variants' });
  }
});

/**
 * Get simulation results for an A/B test
 */
router.get('/:id/results', async (req: Request, res: Response) => {
  try {
    const testId = Number(req.params.id);
    const results = await storage.getSimulationResult(testId);
    
    if (!results) {
      return res.status(404).json({ error: 'Simulation results not found' });
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error getting simulation results:', error);
    res.status(500).json({ error: 'Failed to retrieve simulation results' });
  }
});

/**
 * Create a new A/B test
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const createTestSchema = z.object({
      name: z.string(),
      status: z.enum(['draft', 'active', 'paused', 'completed']).optional().default('draft'),
      campaignId: z.number().optional(),
      testVariable: z.string(),
      startDate: z.string().or(z.date()),
      endDate: z.string().or(z.date()).optional(),
      audience: z.string().optional(),
      trafficAllocation: z.number().min(1).max(100).optional().default(100),
      confidenceThreshold: z.number().min(50).max(99.9).optional().default(95),
      controlVariant: z.string(),
      testVariants: z.array(z.string()).min(1)
    });
    
    const validatedData = createTestSchema.parse(req.body);
    
    // Create the A/B test
    const startDate = new Date(validatedData.startDate);
    const endDate = validatedData.endDate ? new Date(validatedData.endDate) : undefined;
    
    const testId = await abTestSimulation.createTest({
      ...validatedData,
      startDate,
      endDate
    });
    
    const newTest = await storage.getABTest(testId);
    res.status(201).json(newTest);
  } catch (error) {
    console.error('Error creating AB test:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid test data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create A/B test' });
  }
});

/**
 * Update an existing A/B test
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const testId = Number(req.params.id);
    const test = await storage.getABTest(testId);
    
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    const updateSchema = z.object({
      name: z.string().optional(),
      status: z.enum(['draft', 'active', 'paused', 'completed']).optional(),
      endDate: z.string().or(z.date()).optional(),
      audience: z.string().optional(),
      trafficAllocation: z.number().min(1).max(100).optional(),
      confidenceThreshold: z.number().min(50).max(99.9).optional()
    });
    
    const validatedData = updateSchema.parse(req.body);
    
    // Convert string dates to Date objects
    const updates: any = { ...validatedData };
    if (typeof updates.endDate === 'string') {
      updates.endDate = new Date(updates.endDate);
    }
    
    await storage.updateABTest(testId, updates);
    const updatedTest = await storage.getABTest(testId);
    
    res.json(updatedTest);
  } catch (error) {
    console.error('Error updating AB test:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid update data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to update A/B test' });
  }
});

/**
 * Delete an A/B test
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const testId = Number(req.params.id);
    const test = await storage.getABTest(testId);
    
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    await storage.deleteABTest(testId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting AB test:', error);
    res.status(500).json({ error: 'Failed to delete A/B test' });
  }
});

/**
 * Run simulation for an A/B test
 */
router.post('/:id/simulate', async (req: Request, res: Response) => {
  try {
    const testId = Number(req.params.id);
    const test = await storage.getABTest(testId);
    
    if (!test) {
      return res.status(404).json({ error: 'A/B test not found' });
    }
    
    // Run the simulation
    const results = await abTestSimulation.runSimulation(testId);
    
    // Mark the test as completed
    await storage.updateABTest(testId, { status: 'completed' });
    
    res.json(results);
  } catch (error) {
    console.error('Error running simulation:', error);
    res.status(500).json({ error: 'Failed to run A/B test simulation' });
  }
});

export default router;