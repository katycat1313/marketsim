import { storage } from "../storage";
import { db } from "../db";
import { dataVisualizationChallenges } from "../../shared/schema";

/**
 * Service for managing data visualization challenges
 */
class DataVisualizationService {
  /**
   * Seed the database with predefined data visualization challenges if they don't exist
   */
  async seedChallenges() {
    try {
      const existingChallenges = await storage.listDataVisualizationChallenges();
      
      if (existingChallenges.length === 0) {
        console.log("Seeding data visualization challenges...");
        
        // Sample challenges
        const challenges = [
          {
            title: "Sales Performance Dashboard",
            description: "Create a dashboard to visualize quarterly sales performance across different regions and product categories.",
            difficulty: "intermediate",
            industry: "Retail",
            expectedTime: 60,
            datasets: ["quarterly_sales"],
            requiredCharts: JSON.stringify(["bar", "line", "pie"]),
            dataset: {
              quarters: ["Q1", "Q2", "Q3", "Q4"],
              regions: ["North", "South", "East", "West"],
              products: ["Electronics", "Clothing", "Home Goods", "Sports"],
              data: [
                { quarter: "Q1", region: "North", product: "Electronics", sales: 45000 },
                { quarter: "Q1", region: "North", product: "Clothing", sales: 23000 },
                { quarter: "Q1", region: "North", product: "Home Goods", sales: 18000 },
                { quarter: "Q1", region: "North", product: "Sports", sales: 12000 },
                { quarter: "Q1", region: "South", product: "Electronics", sales: 38000 },
                { quarter: "Q1", region: "South", product: "Clothing", sales: 19000 },
                { quarter: "Q1", region: "South", product: "Home Goods", sales: 22000 },
                { quarter: "Q1", region: "South", product: "Sports", sales: 14000 },
                { quarter: "Q1", region: "East", product: "Electronics", sales: 52000 },
                { quarter: "Q1", region: "East", product: "Clothing", sales: 29000 },
                { quarter: "Q1", region: "East", product: "Home Goods", sales: 15000 },
                { quarter: "Q1", region: "East", product: "Sports", sales: 18000 },
                { quarter: "Q1", region: "West", product: "Electronics", sales: 35000 },
                { quarter: "Q1", region: "West", product: "Clothing", sales: 17000 },
                { quarter: "Q1", region: "West", product: "Home Goods", sales: 23000 },
                { quarter: "Q1", region: "West", product: "Sports", sales: 19000 },
                { quarter: "Q2", region: "North", product: "Electronics", sales: 48000 },
                { quarter: "Q2", region: "North", product: "Clothing", sales: 26000 },
                { quarter: "Q2", region: "North", product: "Home Goods", sales: 21000 },
                { quarter: "Q2", region: "North", product: "Sports", sales: 16000 },
                { quarter: "Q2", region: "South", product: "Electronics", sales: 41000 },
                { quarter: "Q2", region: "South", product: "Clothing", sales: 22000 },
                { quarter: "Q2", region: "South", product: "Home Goods", sales: 25000 },
                { quarter: "Q2", region: "South", product: "Sports", sales: 17000 },
                { quarter: "Q2", region: "East", product: "Electronics", sales: 55000 },
                { quarter: "Q2", region: "East", product: "Clothing", sales: 32000 },
                { quarter: "Q2", region: "East", product: "Home Goods", sales: 19000 },
                { quarter: "Q2", region: "East", product: "Sports", sales: 21000 },
                { quarter: "Q2", region: "West", product: "Electronics", sales: 39000 },
                { quarter: "Q2", region: "West", product: "Clothing", sales: 20000 },
                { quarter: "Q2", region: "West", product: "Home Goods", sales: 27000 },
                { quarter: "Q2", region: "West", product: "Sports", sales: 22000 },
                { quarter: "Q3", region: "North", product: "Electronics", sales: 52000 },
                { quarter: "Q3", region: "North", product: "Clothing", sales: 29000 },
                { quarter: "Q3", region: "North", product: "Home Goods", sales: 24000 },
                { quarter: "Q3", region: "North", product: "Sports", sales: 18000 },
                { quarter: "Q3", region: "South", product: "Electronics", sales: 44000 },
                { quarter: "Q3", region: "South", product: "Clothing", sales: 25000 },
                { quarter: "Q3", region: "South", product: "Home Goods", sales: 28000 },
                { quarter: "Q3", region: "South", product: "Sports", sales: 19000 },
                { quarter: "Q3", region: "East", product: "Electronics", sales: 58000 },
                { quarter: "Q3", region: "East", product: "Clothing", sales: 35000 },
                { quarter: "Q3", region: "East", product: "Home Goods", sales: 23000 },
                { quarter: "Q3", region: "East", product: "Sports", sales: 24000 },
                { quarter: "Q3", region: "West", product: "Electronics", sales: 42000 },
                { quarter: "Q3", region: "West", product: "Clothing", sales: 23000 },
                { quarter: "Q3", region: "West", product: "Home Goods", sales: 30000 },
                { quarter: "Q3", region: "West", product: "Sports", sales: 25000 },
                { quarter: "Q4", region: "North", product: "Electronics", sales: 60000 },
                { quarter: "Q4", region: "North", product: "Clothing", sales: 35000 },
                { quarter: "Q4", region: "North", product: "Home Goods", sales: 30000 },
                { quarter: "Q4", region: "North", product: "Sports", sales: 22000 },
                { quarter: "Q4", region: "South", product: "Electronics", sales: 50000 },
                { quarter: "Q4", region: "South", product: "Clothing", sales: 30000 },
                { quarter: "Q4", region: "South", product: "Home Goods", sales: 32000 },
                { quarter: "Q4", region: "South", product: "Sports", sales: 23000 },
                { quarter: "Q4", region: "East", product: "Electronics", sales: 65000 },
                { quarter: "Q4", region: "East", product: "Clothing", sales: 40000 },
                { quarter: "Q4", region: "East", product: "Home Goods", sales: 27000 },
                { quarter: "Q4", region: "East", product: "Sports", sales: 28000 },
                { quarter: "Q4", region: "West", product: "Electronics", sales: 48000 },
                { quarter: "Q4", region: "West", product: "Clothing", sales: 28000 },
                { quarter: "Q4", region: "West", product: "Home Goods", sales: 35000 },
                { quarter: "Q4", region: "West", product: "Sports", sales: 30000 },
              ]
            },
            objectives: [
              "Create a bar chart showing total sales by quarter",
              "Create a line chart showing sales trends by region over quarters",
              "Create a pie chart showing product category distribution for a selected region",
              "Add proper labels, legends, and titles to all charts"
            ],
            recommendedChartType: "mixed",
            hints: [
              "Use a combination of different chart types for different aspects of the data",
              "Consider using filters to allow users to explore different regions or product categories",
              "Use appropriate colors to differentiate between categories"
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            title: "Marketing Campaign Performance",
            description: "Analyze and visualize the effectiveness of different marketing channels across various metrics.",
            difficulty: "beginner",
            industry: "Marketing",
            expectedTime: 45,
            datasets: ["marketing_channels"],
            requiredCharts: JSON.stringify(["line", "bar", "stacked"]),
            dataset: {
              channels: ["Social Media", "Email", "Search", "Display Ads", "Affiliate"],
              metrics: ["Clicks", "Conversions", "Cost", "Revenue"],
              dates: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              data: [
                { channel: "Social Media", metric: "Clicks", Jan: 12500, Feb: 15000, Mar: 16700, Apr: 18200, May: 19500, Jun: 21000 },
                { channel: "Social Media", metric: "Conversions", Jan: 350, Feb: 410, Mar: 460, Apr: 495, May: 530, Jun: 580 },
                { channel: "Social Media", metric: "Cost", Jan: 5000, Feb: 5500, Mar: 6000, Apr: 6300, May: 6700, Jun: 7000 },
                { channel: "Social Media", metric: "Revenue", Jan: 12000, Feb: 14000, Mar: 15500, Apr: 17000, May: 18500, Jun: 20500 },
                { channel: "Email", metric: "Clicks", Jan: 8500, Feb: 9200, Mar: 9800, Apr: 10300, May: 11000, Jun: 11500 },
                { channel: "Email", metric: "Conversions", Jan: 420, Feb: 450, Mar: 480, Apr: 510, May: 540, Jun: 570 },
                { channel: "Email", metric: "Cost", Jan: 2000, Feb: 2100, Mar: 2200, Apr: 2300, May: 2400, Jun: 2500 },
                { channel: "Email", metric: "Revenue", Jan: 15000, Feb: 16200, Mar: 17000, Apr: 18500, May: 19800, Jun: 21000 },
                { channel: "Search", metric: "Clicks", Jan: 22000, Feb: 24000, Mar: 25500, Apr: 27000, May: 28500, Jun: 30000 },
                { channel: "Search", metric: "Conversions", Jan: 950, Feb: 1050, Mar: 1120, Apr: 1200, May: 1280, Jun: 1350 },
                { channel: "Search", metric: "Cost", Jan: 12000, Feb: 13000, Mar: 13500, Apr: 14200, May: 15000, Jun: 16000 },
                { channel: "Search", metric: "Revenue", Jan: 38000, Feb: 42000, Mar: 45000, Apr: 48000, May: 51000, Jun: 55000 },
                { channel: "Display Ads", metric: "Clicks", Jan: 15000, Feb: 16200, Mar: 17500, Apr: 18800, May: 20000, Jun: 21500 },
                { channel: "Display Ads", metric: "Conversions", Jan: 320, Feb: 350, Mar: 380, Apr: 410, May: 440, Jun: 470 },
                { channel: "Display Ads", metric: "Cost", Jan: 7500, Feb: 8000, Mar: 8500, Apr: 9000, May: 9500, Jun: 10000 },
                { channel: "Display Ads", metric: "Revenue", Jan: 14000, Feb: 15500, Mar: 16800, Apr: 18200, May: 19500, Jun: 21000 },
                { channel: "Affiliate", metric: "Clicks", Jan: 7500, Feb: 8200, Mar: 8900, Apr: 9500, May: 10200, Jun: 11000 },
                { channel: "Affiliate", metric: "Conversions", Jan: 280, Feb: 310, Mar: 340, Apr: 370, May: 400, Jun: 430 },
                { channel: "Affiliate", metric: "Cost", Jan: 4000, Feb: 4300, Mar: 4600, Apr: 4900, May: 5200, Jun: 5500 },
                { channel: "Affiliate", metric: "Revenue", Jan: 11000, Feb: 12500, Mar: 13800, Apr: 15200, May: 16500, Jun: 18000 }
              ]
            },
            objectives: [
              "Create a line chart showing the trend of clicks for each channel over time",
              "Create a bar chart comparing conversion rates (conversions/clicks) across channels",
              "Create a stacked bar chart showing the cost vs. revenue for each channel",
              "Calculate and visualize ROI (Return on Investment) for each channel"
            ],
            recommendedChartType: "line",
            hints: [
              "Organize your data to create derived metrics like conversion rate (conversions/clicks) and ROI (revenue-cost)/cost",
              "Use appropriate colors to differentiate between channels",
              "Consider using secondary axes for metrics with different scales"
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            title: "Website User Behavior Analysis",
            description: "Analyze user behavior patterns on a website to identify optimization opportunities.",
            difficulty: "advanced",
            industry: "Web Analytics",
            expectedTime: 90,
            datasets: ["user_behavior", "flow_data"],
            requiredCharts: JSON.stringify(["heatmap", "sankey", "scatter"]),
            dataset: {
              pages: ["Home", "Products", "Blog", "About", "Contact", "Cart", "Checkout"],
              metrics: ["Pageviews", "Avg Time on Page", "Bounce Rate", "Conversion Rate"],
              devices: ["Desktop", "Mobile", "Tablet"],
              data: [
                { page: "Home", device: "Desktop", pageviews: 25000, avgTimeOnPage: 65, bounceRate: 35, conversionRate: 4.2 },
                { page: "Home", device: "Mobile", pageviews: 35000, avgTimeOnPage: 45, bounceRate: 48, conversionRate: 2.8 },
                { page: "Home", device: "Tablet", pageviews: 8000, avgTimeOnPage: 55, bounceRate: 40, conversionRate: 3.5 },
                { page: "Products", device: "Desktop", pageviews: 18000, avgTimeOnPage: 120, bounceRate: 25, conversionRate: 6.5 },
                { page: "Products", device: "Mobile", pageviews: 22000, avgTimeOnPage: 85, bounceRate: 38, conversionRate: 4.3 },
                { page: "Products", device: "Tablet", pageviews: 5500, avgTimeOnPage: 95, bounceRate: 32, conversionRate: 5.2 },
                { page: "Blog", device: "Desktop", pageviews: 12000, avgTimeOnPage: 180, bounceRate: 18, conversionRate: 2.1 },
                { page: "Blog", device: "Mobile", pageviews: 15000, avgTimeOnPage: 120, bounceRate: 32, conversionRate: 1.5 },
                { page: "Blog", device: "Tablet", pageviews: 4000, avgTimeOnPage: 150, bounceRate: 25, conversionRate: 1.8 },
                { page: "About", device: "Desktop", pageviews: 7500, avgTimeOnPage: 90, bounceRate: 40, conversionRate: 1.2 },
                { page: "About", device: "Mobile", pageviews: 9500, avgTimeOnPage: 60, bounceRate: 55, conversionRate: 0.8 },
                { page: "About", device: "Tablet", pageviews: 2500, avgTimeOnPage: 75, bounceRate: 48, conversionRate: 1.0 },
                { page: "Contact", device: "Desktop", pageviews: 5500, avgTimeOnPage: 70, bounceRate: 15, conversionRate: 7.5 },
                { page: "Contact", device: "Mobile", pageviews: 8500, avgTimeOnPage: 45, bounceRate: 28, conversionRate: 5.2 },
                { page: "Contact", device: "Tablet", pageviews: 2000, avgTimeOnPage: 60, bounceRate: 22, conversionRate: 6.3 },
                { page: "Cart", device: "Desktop", pageviews: 6000, avgTimeOnPage: 110, bounceRate: 12, conversionRate: 22.5 },
                { page: "Cart", device: "Mobile", pageviews: 7000, avgTimeOnPage: 75, bounceRate: 25, conversionRate: 15.8 },
                { page: "Cart", device: "Tablet", pageviews: 1800, avgTimeOnPage: 90, bounceRate: 18, conversionRate: 18.5 },
                { page: "Checkout", device: "Desktop", pageviews: 4500, avgTimeOnPage: 180, bounceRate: 8, conversionRate: 65.0 },
                { page: "Checkout", device: "Mobile", pageviews: 5000, avgTimeOnPage: 150, bounceRate: 18, conversionRate: 45.5 },
                { page: "Checkout", device: "Tablet", pageviews: 1200, avgTimeOnPage: 165, bounceRate: 12, conversionRate: 55.0 }
              ],
              flowData: [
                { from: "Home", to: "Products", value: 12500 },
                { from: "Home", to: "Blog", value: 7500 },
                { from: "Home", to: "About", value: 4500 },
                { from: "Home", to: "Contact", value: 3000 },
                { from: "Products", to: "Cart", value: 6500 },
                { from: "Products", to: "Home", value: 3500 },
                { from: "Products", to: "Blog", value: 2000 },
                { from: "Blog", to: "Products", value: 4000 },
                { from: "Blog", to: "Home", value: 3500 },
                { from: "Blog", to: "About", value: 1500 },
                { from: "About", to: "Home", value: 2500 },
                { from: "About", to: "Contact", value: 2000 },
                { from: "About", to: "Products", value: 1500 },
                { from: "Contact", to: "Home", value: 2000 },
                { from: "Contact", to: "Products", value: 1500 },
                { from: "Cart", to: "Checkout", value: 5000 },
                { from: "Cart", to: "Products", value: 2000 },
                { from: "Cart", to: "Home", value: 1000 }
              ]
            },
            objectives: [
              "Create a heatmap showing key metrics for each page and device combination",
              "Visualize the user flow between pages using a Sankey diagram",
              "Create a scatter plot comparing bounce rate and conversion rate by page",
              "Create a dashboard with multiple visualizations to tell a cohesive story about user behavior"
            ],
            recommendedChartType: "heatmap",
            hints: [
              "Use appropriate color scales for heatmaps (e.g., red for high bounce rates, green for high conversion rates)",
              "Consider normalizing metrics to better compare across pages with different traffic volumes",
              "Look for opportunities to identify friction points in the user journey"
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        // Insert challenges
        for (const challenge of challenges) {
          await db.insert(dataVisualizationChallenges).values(challenge);
        }
        
        console.log(`Seeded ${challenges.length} data visualization challenges`);
        return true;
      } else {
        console.log(`Found ${existingChallenges.length} existing data visualization challenges, skipping seed`);
        return false;
      }
    } catch (error) {
      console.error("Error seeding data visualization challenges:", error);
      throw error;
    }
  }
}

export const dataVisualizationService = new DataVisualizationService();