import { Router } from "express";
import { storage } from "../storage";
import { ABTestSimulation } from "../services/abTestSimulationService";
import { z } from "zod";

const router = Router();
const abTestService = new ABTestSimulation(storage);

// Create a new A/B test
router.post("/", async (req, res) => {
  try {
    const createABTestSchema = z.object({
      name: z.string(),
      testVariable: z.string(),
      controlVariant: z.string(),
      testVariants: z.array(z.string()),
      campaignId: z.number().optional(),
      audience: z.string().optional(),
      startDate: z.string().transform(val => new Date(val)),
      endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
      confidenceThreshold: z.number().optional(),
      trafficAllocation: z.number().optional()
    });

    const validData = createABTestSchema.parse(req.body);
    const testId = await abTestService.createTest(validData);
    
    res.status(201).json({ id: testId, message: "A/B test created successfully" });
  } catch (error) {
    console.error("Error creating A/B test:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
  }
});

// Get a specific A/B test with its variants and results
router.get("/:id", async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    if (isNaN(testId)) {
      return res.status(400).json({ error: "Invalid test ID" });
    }
    
    const test = await abTestService.getTest(testId);
    if (!test) {
      return res.status(404).json({ error: "A/B test not found" });
    }
    
    res.json(test);
  } catch (error) {
    console.error("Error fetching A/B test:", error);
    res.status(500).json({ error: "Failed to fetch A/B test" });
  }
});

// List all A/B tests (optionally filtered by campaign)
router.get("/", async (req, res) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : undefined;
    const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    const tests = await storage.getABTests(userId, campaignId);
    res.json(tests);
  } catch (error) {
    console.error("Error listing A/B tests:", error);
    res.status(500).json({ error: "Failed to list A/B tests" });
  }
});

// Run a simulation for an A/B test
router.post("/:id/simulate", async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    if (isNaN(testId)) {
      return res.status(400).json({ error: "Invalid test ID" });
    }
    
    const test = await storage.getABTest(testId);
    if (!test) {
      return res.status(404).json({ error: "A/B test not found" });
    }
    
    const simulationResult = await abTestService.runSimulation(testId);
    res.json(simulationResult);
  } catch (error) {
    console.error("Error running A/B test simulation:", error);
    res.status(500).json({ error: "Failed to run simulation" });
  }
});

// Get the simulation results for an A/B test
router.get("/:id/results", async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    if (isNaN(testId)) {
      return res.status(400).json({ error: "Invalid test ID" });
    }
    
    const results = await abTestService.getSimulationResults(testId);
    if (!results) {
      return res.status(404).json({ error: "Simulation results not found" });
    }
    
    res.json(results);
  } catch (error) {
    console.error("Error fetching simulation results:", error);
    res.status(500).json({ error: "Failed to fetch simulation results" });
  }
});

// Update an A/B test
router.patch("/:id", async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    if (isNaN(testId)) {
      return res.status(400).json({ error: "Invalid test ID" });
    }
    
    const updateSchema = z.object({
      name: z.string().optional(),
      status: z.string().optional(),
      endDate: z.string().transform(val => new Date(val)).optional(),
      conclusions: z.string().optional()
    });
    
    const validData = updateSchema.parse(req.body);
    await storage.updateABTest(testId, validData);
    
    res.json({ message: "A/B test updated successfully" });
  } catch (error) {
    console.error("Error updating A/B test:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : "Invalid request" });
  }
});

// Delete an A/B test
router.delete("/:id", async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    if (isNaN(testId)) {
      return res.status(400).json({ error: "Invalid test ID" });
    }
    
    await storage.deleteABTest(testId);
    res.json({ message: "A/B test deleted successfully" });
  } catch (error) {
    console.error("Error deleting A/B test:", error);
    res.status(500).json({ error: "Failed to delete A/B test" });
  }
});

export default router;