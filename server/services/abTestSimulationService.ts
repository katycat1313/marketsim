import { 
  ABTest, 
  ABTestVariant, 
  InsertABTest, 
  InsertABTestVariant,
  SimulationParameter 
} from '@shared/schema';

// Main interface for the A/B Test Simulation Service
export interface ABTestSimulationService {
  createTest(testData: CreateABTestParams): Promise<number>;
  getTest(testId: number): Promise<ABTestResult | null>;
  getTestVariants(testId: number): Promise<ABTestVariant[]>;
  runSimulation(testId: number): Promise<SimulationResult>;
  getSimulationResults(testId: number): Promise<SimulationResult | null>;
}

// Parameters for creating a new A/B test
export interface CreateABTestParams {
  name: string;
  status?: string; // 'active', 'paused', 'completed', 'draft'
  campaignId?: number;
  testVariable: string; // 'headline', 'description', 'image', 'cta', etc.
  startDate: Date;
  endDate?: Date;
  audience?: string;
  trafficAllocation?: number; // Percentage of traffic allocated to the test (1-100)
  confidenceThreshold?: number; // Statistical confidence threshold (typically 95%)
  controlVariant: string; // The original/control variant content
  testVariants: string[]; // The test variant content
}

// Complete A/B test result with variants and statistics
export interface ABTestResult extends ABTest {
  variants: ABTestVariantResult[];
  dailyData?: DailyMetric[];
  winningVariant?: WinningVariant;
  insights?: string[];
}

// Extended variant type with calculated metrics
export interface ABTestVariantResult extends Omit<ABTestVariant, 'improvementPercent'> {
  improvementPercent: string; // Using string to match the decimal in database
}

// Daily performance data for charting
export interface DailyMetric {
  date: string;
  [key: string]: string | number; // Variant name to metric value mapping
}

// Winning variant information
export interface WinningVariant {
  id: number;
  name: string;
  improvement: string;
  projectedAnnualSavings: number;
}

// Complete simulation result
export interface SimulationResult {
  testId: number;
  status: string;
  confidenceLevel: number;
  dailyData: DailyMetric[];
  variants: ABTestVariantResult[];
  winningVariant?: WinningVariant;
  insights: string[];
}

// Implementation of the A/B Test Simulation Service
export class ABTestSimulation implements ABTestSimulationService {
  private storage: any;
  
  constructor(storage: any) {
    this.storage = storage;
  }
  
  // Create a new A/B test
  async createTest(params: CreateABTestParams): Promise<number> {
    try {
      // Create the base test
      const test: InsertABTest = {
        name: params.name,
        status: params.status || 'active',
        campaignId: params.campaignId || 0, // Use 0 instead of null for numeric field
        testVariable: params.testVariable,
        startDate: params.startDate,
        endDate: params.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Default to 14 days
        confidenceLevel: null,
        winningVariantId: null,
        conclusions: null
      };
      
      const testId = await this.storage.createABTest(test);
      
      // Create the control variant
      const controlVariant: InsertABTestVariant = {
        abTestId: testId,
        name: 'Control',
        isControl: true,
        value: params.controlVariant,
        impressions: 0,
        clicks: 0,
        conversions: "0",
        cost: "0",
        ctr: null,
        conversionRate: null,
        cpa: null,
        improvementPercent: "0" // Always 0 for control
      };
      
      await this.storage.createABTestVariant(controlVariant);
      
      // Create the test variants
      for (let i = 0; i < params.testVariants.length; i++) {
        const variant: InsertABTestVariant = {
          abTestId: testId,
          name: `Variant ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
          isControl: false,
          value: params.testVariants[i],
          impressions: 0,
          clicks: 0,
          conversions: "0",
          cost: "0",
          ctr: null,
          conversionRate: null,
          cpa: null,
          improvementPercent: null
        };
        
        await this.storage.createABTestVariant(variant);
      }
      
      return testId;
    } catch (error) {
      console.error('Error creating A/B test:', error);
      throw error;
    }
  }
  
  // Get a complete A/B test with variants
  async getTest(testId: number): Promise<ABTestResult | null> {
    try {
      const test = await this.storage.getABTest(testId);
      if (!test) return null;
      
      const variants = await this.getTestVariants(testId);
      const simulationResult = await this.getSimulationResults(testId);
      
      return {
        ...test,
        variants: variants.map(v => ({
          ...v,
          improvementPercent: this.calculateImprovement(v, variants.find(cv => cv.isControl)!)
        })),
        dailyData: simulationResult?.dailyData || [],
        winningVariant: simulationResult?.winningVariant,
        insights: simulationResult?.insights
      };
    } catch (error) {
      console.error('Error getting A/B test:', error);
      throw error;
    }
  }
  
  // Get variants for a specific test
  async getTestVariants(testId: number): Promise<ABTestVariant[]> {
    try {
      return await this.storage.getABTestVariants(testId);
    } catch (error) {
      console.error('Error getting A/B test variants:', error);
      throw error;
    }
  }
  
  // Run a simulation for an A/B test
  async runSimulation(testId: number): Promise<SimulationResult> {
    try {
      const test = await this.storage.getABTest(testId);
      if (!test) throw new Error(`A/B test with ID ${testId} not found`);
      
      const variants = await this.getTestVariants(testId);
      if (variants.length === 0) throw new Error(`No variants found for A/B test with ID ${testId}`);
      
      const controlVariant = variants.find(v => v.isControl);
      if (!controlVariant) throw new Error(`No control variant found for A/B test with ID ${testId}`);
      
      // Get simulation parameters (could come from the database)
      const simulationParams = this.getDefaultSimulationParameters();
      
      // Generate simulated data
      const simulatedVariants = this.simulateVariantPerformance(variants, simulationParams);
      
      // Generate daily data for charts
      const dailyData = this.generateDailyData(test.startDate, test.endDate || new Date(), simulatedVariants);
      
      // Determine the winning variant
      const { winningVariant, confidenceLevel } = this.determineWinningVariant(simulatedVariants, controlVariant);
      
      // Generate insights
      const insights = this.generateInsights(test, simulatedVariants, winningVariant);
      
      // Update the test with results
      if (winningVariant) {
        await this.storage.updateABTest(testId, {
          confidenceLevel,
          winningVariantId: winningVariant.id,
          status: 'completed',
          conclusions: insights.join(' ')
        });
        
        // Update variant performances
        for (const variant of simulatedVariants) {
          await this.storage.updateABTestVariant(variant.id, {
            impressions: variant.impressions,
            clicks: variant.clicks,
            conversions: variant.conversions.toString(),
            cost: variant.cost.toString(),
            ctr: variant.ctr ? variant.ctr.toString() : null,
            conversionRate: variant.conversionRate ? variant.conversionRate.toString() : null,
            cpa: variant.cpa ? variant.cpa.toString() : null,
            improvementPercent: variant.improvementPercent
          });
        }
      }
      
      const result: SimulationResult = {
        testId,
        status: 'completed',
        confidenceLevel,
        dailyData,
        variants: simulatedVariants,
        winningVariant: winningVariant ? {
          id: winningVariant.id,
          name: winningVariant.name,
          improvement: winningVariant.improvementPercent,
          projectedAnnualSavings: this.calculateProjectedSavings(winningVariant, controlVariant)
        } : undefined,
        insights
      };
      
      // Store the simulation result
      await this.storage.saveSimulationResult(testId, result);
      
      return result;
    } catch (error) {
      console.error('Error running A/B test simulation:', error);
      throw error;
    }
  }
  
  // Get stored simulation results
  async getSimulationResults(testId: number): Promise<SimulationResult | null> {
    try {
      return await this.storage.getSimulationResult(testId);
    } catch (error) {
      console.error('Error getting simulation results:', error);
      throw error;
    }
  }
  
  // Helper functions for simulation
  
  // Get default simulation parameters
  private getDefaultSimulationParameters(): SimulationParameter {
    return {
      id: 0,
      name: 'Default',
      industry: 'general',
      marketSize: "1000000",
      competitionLevel: "0.5",
      seasonalityPatterns: [
        { month: 1, factor: 1.0 },
        { month: 2, factor: 1.0 },
        { month: 3, factor: 1.05 },
        { month: 4, factor: 1.1 },
        { month: 5, factor: 1.0 },
        { month: 6, factor: 0.95 },
        { month: 7, factor: 0.9 },
        { month: 8, factor: 0.9 },
        { month: 9, factor: 1.0 },
        { month: 10, factor: 1.1 },
        { month: 11, factor: 1.2 },
        { month: 12, factor: 1.3 }
      ],
      userBehaviorModel: 'standard',
      clickThroughModel: 'gaussian',
      conversionModel: 'logistic',
      budgetExhaustionModel: 'linear',
      adFatigueModel: 'exponential',
      randomVariationFactor: "0.15",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  // Simulate variant performance
  private simulateVariantPerformance(
    variants: ABTestVariant[], 
    params: SimulationParameter
  ): ABTestVariantResult[] {
    const controlVariant = variants.find(v => v.isControl);
    if (!controlVariant) throw new Error('No control variant found');
    
    // Base metrics for the control variant
    const baseImpressions = 10000;
    const baseCTR = 0.05 + (Math.random() * 0.01); // Around 5% CTR
    const baseConversionRate = 0.1 + (Math.random() * 0.02); // Around 10% conversion rate
    const baseCost = 1500; // $1500 spent
    
    // Calculate control variant metrics
    const controlClicks = Math.floor(baseImpressions * baseCTR);
    const controlConversions = parseFloat((controlClicks * baseConversionRate).toFixed(2));
    const controlCPA = parseFloat((baseCost / controlConversions).toFixed(2));
    
    const simulatedVariants: ABTestVariantResult[] = [];
    
    // First, set the control variant metrics
    simulatedVariants.push({
      ...controlVariant,
      impressions: baseImpressions,
      clicks: controlClicks,
      conversions: controlConversions.toString(),
      cost: baseCost.toString(),
      ctr: baseCTR.toString(),
      conversionRate: baseConversionRate.toString(),
      cpa: controlCPA.toString(),
      improvementPercent: "0" // Control is baseline
    });
    
    // Now simulate the test variants
    for (const variant of variants.filter(v => !v.isControl)) {
      // Each variant has different performance based on its value
      // In a real implementation, this would use ML or heuristics to generate realistic performance
      // For this demo, we'll use random variations around the control, with some variants doing better
      
      // Positivity score based on the content (this is a simplified heuristic)
      // In a real implementation, this would be a much more sophisticated algorithm
      // that analyzes the content for effectiveness
      const positivityScore = this.getPositivityScore(variant.value, controlVariant.value);
      
      // Apply the positivity score to adjust metrics
      const randomFactor = typeof params.randomVariationFactor === 'string' 
        ? parseFloat(params.randomVariationFactor) 
        : params.randomVariationFactor;
      
      const variantCTR = baseCTR * (1 + positivityScore.ctrImpact * randomFactor);
      const variantConvRate = baseConversionRate * (1 + positivityScore.convRateImpact * randomFactor);
      
      const variantClicks = Math.floor(baseImpressions * variantCTR);
      const variantConversions = parseFloat((variantClicks * variantConvRate).toFixed(2));
      const variantCPA = parseFloat((baseCost / variantConversions).toFixed(2));
      
      // Calculate improvement percentage over control (lower CPA is better)
      const improvementPercent = ((controlCPA - variantCPA) / controlCPA * 100).toFixed(1);
      
      simulatedVariants.push({
        ...variant,
        impressions: baseImpressions,
        clicks: variantClicks,
        conversions: variantConversions.toString(),
        cost: baseCost.toString(),
        ctr: variantCTR.toString(),
        conversionRate: variantConvRate.toString(),
        cpa: variantCPA.toString(),
        improvementPercent
      });
    }
    
    return simulatedVariants;
  }
  
  // Generate a positivity score for a variant (simplified for demonstration)
  private getPositivityScore(variantValue: string, controlValue: string): { ctrImpact: number; convRateImpact: number } {
    // This is a very simplified version - in a real implementation, this would use NLP or a pre-trained model
    
    // Check for positive language patterns
    const positiveWords = ['boost', 'improve', 'increase', 'double', 'grow', 'save', 'free', 'now', 'today', 'exclusive'];
    const actionWords = ['get', 'try', 'start', 'discover', 'learn', 'find', 'see', 'unlock'];
    const emotionalWords = ['amazing', 'incredible', 'revolutionary', 'exciting', 'powerful', 'ultimate'];
    
    let ctrScore = 0;
    let convScore = 0;
    
    // Analyze for positive words (affects CTR)
    for (const word of positiveWords) {
      if (variantValue.toLowerCase().includes(word)) ctrScore += 0.1;
    }
    
    // Analyze for action words (affects conversion rate)
    for (const word of actionWords) {
      if (variantValue.toLowerCase().includes(word)) convScore += 0.08;
    }
    
    // Analyze for emotional words (affects both)
    for (const word of emotionalWords) {
      if (variantValue.toLowerCase().includes(word)) {
        ctrScore += 0.07;
        convScore += 0.05;
      }
    }
    
    // Check length (shorter is often better for headlines)
    if (variantValue.length < controlValue.length && variantValue.length > 15) {
      ctrScore += 0.05;
    }
    
    // Check for numbers (often improve CTR)
    if (/\d+/.test(variantValue)) {
      ctrScore += 0.15;
    }
    
    // Check for question marks (often improve engagement)
    if (variantValue.includes('?')) {
      ctrScore += 0.12;
    }
    
    // Add some randomness
    ctrScore += (Math.random() * 0.3) - 0.15;  // -0.15 to +0.15
    convScore += (Math.random() * 0.3) - 0.15; // -0.15 to +0.15
    
    return {
      ctrImpact: ctrScore,
      convRateImpact: convScore
    };
  }
  
  // Generate daily performance data for charting
  private generateDailyData(startDate: Date, endDate: Date, variants: ABTestVariantResult[]): DailyMetric[] {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dailyData: DailyMetric[] = [];
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dataPoint: DailyMetric = {
        date: currentDate.toISOString().split('T')[0]
      };
      
      // Add metrics for each variant (with some daily variation)
      for (const variant of variants) {
        // Add daily variation to CTR (-10% to +10% of base value)
        const dailyVariation = (Math.random() * 0.2) - 0.1;
        const ctrValue = typeof variant.ctr === 'string' ? parseFloat(variant.ctr) : 0;
        const adjustedCTR = ctrValue * (1 + dailyVariation);
        
        dataPoint[`${variant.name} CTR`] = adjustedCTR;
      }
      
      dailyData.push(dataPoint);
    }
    
    return dailyData;
  }
  
  // Determine winning variant and confidence level
  private determineWinningVariant(
    variants: ABTestVariantResult[], 
    controlVariant: ABTestVariant
  ): { winningVariant: ABTestVariantResult | undefined; confidenceLevel: number } {
    // In a real implementation, this would perform statistical analysis
    // For this demo, we'll use a simplified approach
    
    // Filter to only non-control variants
    const testVariants = variants.filter(v => !v.isControl);
    
    // Find the variant with the best improvement
    const bestVariants = [...testVariants].sort((a, b) => {
      const aImprovement = parseFloat(a.improvementPercent || "0");
      const bImprovement = parseFloat(b.improvementPercent || "0");
      return bImprovement - aImprovement;
    });
    
    const winningVariant = bestVariants.length > 0 ? bestVariants[0] : undefined;
    
    // Calculate a confidence level
    // In a real implementation, this would be based on statistical tests
    // For this demo, we'll base it on the improvement percentage and sample size
    let confidenceLevel = 0;
    
    if (winningVariant && winningVariant.improvementPercent) {
      // Higher improvement = higher confidence
      const improvementValue = parseFloat(winningVariant.improvementPercent);
      confidenceLevel = 0.75 + (Math.min(improvementValue, 30) / 100);
      
      // Add some randomness (0.85 to 0.99 range)
      confidenceLevel = Math.min(0.99, confidenceLevel + (Math.random() * 0.14));
    }
    
    return { winningVariant, confidenceLevel };
  }
  
  // Generate insights based on the test results
  private generateInsights(
    test: ABTest,
    variants: ABTestVariantResult[],
    winningVariant?: ABTestVariantResult
  ): string[] {
    const insights: string[] = [];
    const controlVariant = variants.find(v => v.isControl);
    
    if (!controlVariant) return ['No control variant found in the test.'];
    
    // General insights
    insights.push(`Your A/B test "${test.name}" for ${test.testVariable} ran for ${variants[0].impressions} impressions.`);
    
    // If we have a winner
    if (winningVariant && winningVariant.improvementPercent) {
      const improvementValue = parseFloat(winningVariant.improvementPercent);
      if (improvementValue > 0) {
        insights.push(`"${winningVariant.name}" outperformed the control variant with a ${improvementValue.toFixed(1)}% improvement in cost per acquisition.`);
        
        // Add more specific insights based on the test variable
        if (test.testVariable === 'headline') {
          insights.push(`Headlines that create a sense of urgency or exclusivity tend to perform better than generic messages.`);
        } else if (test.testVariable === 'cta') {
          insights.push(`Action-oriented call-to-action buttons that clearly communicate value work best for your audience.`);
        } else if (test.testVariable === 'image') {
          insights.push(`Visual content that shows your product in use resonates better with your target audience.`);
        }
      } else {
        insights.push(`None of the tested variants significantly outperformed the control. Consider testing more distinct variations.`);
      }
    } else {
      insights.push(`No clear winner was identified in this test. Consider running a follow-up test with more distinct variations.`);
    }
    
    // Recommendations for next steps
    insights.push(`Based on these results, we recommend implementing the winning variant in your marketing campaigns and conducting further tests to continue optimizing performance.`);
    
    return insights;
  }
  
  // Calculate improvement percentage between a variant and the control
  private calculateImprovement(variant: ABTestVariant, controlVariant: ABTestVariant): string {
    if (variant.isControl || !variant.cpa || !controlVariant.cpa) return "0";
    
    // Lower CPA is better, so improvement is (control CPA - variant CPA) / control CPA
    const controlCPANum = parseFloat(controlVariant.cpa);
    const variantCPANum = parseFloat(variant.cpa);
    return ((controlCPANum - variantCPANum) / controlCPANum * 100).toFixed(1);
  }
  
  // Calculate projected annual savings
  private calculateProjectedSavings(variant: ABTestVariant, controlVariant: ABTestVariant): number {
    if (!variant.cpa || !controlVariant.cpa) return 0;
    
    const variantCPANum = parseFloat(variant.cpa);
    const controlCPANum = parseFloat(controlVariant.cpa);
    
    if (variantCPANum >= controlCPANum) return 0;
    
    // Assume 1000 conversions per month at control CPA
    const monthlyConversions = 1000;
    
    // Calculate monthly cost at each CPA
    const monthlyControlCost = monthlyConversions * controlCPANum;
    const monthlyVariantCost = monthlyConversions * variantCPANum;
    
    // Calculate savings and annualize
    const monthlySavings = monthlyControlCost - monthlyVariantCost;
    return Math.round(monthlySavings * 12);
  }
}