import express from 'express';
import bodyParser from 'body-parser';
import { db } from './db'; // Import your database instance
import { Campaign } from '@shared/schema'; // Adjust import based on your schema setup

const app = express();
const port = 5000; // Always serve on port 5000

app.use(bodyParser.json());

// Sample API endpoint to get campaigns
app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await db.select().from('campaigns'); // Assuming you have a campaigns table
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sample API endpoint to create a campaign
app.post('/api/campaigns', async (req, res) => {
    const newCampaign: Campaign = req.body; // Capture the campaign data from request body
    try {
        const createdCampaign = await db.insert('campaigns').values(newCampaign);
        res.status(201).json(createdCampaign); // Respond with created campaign data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sample API endpoint to get simulation data for a specific campaign
app.get('/api/campaigns/:id/simulation', async (req, res) => {
    const campaignId = req.params.id;
    // Logic to retrieve simulation data for the specified campaign
    try {
        const simulationData = await getSimulationData(campaignId); // Function to fetch simulation data
        res.json(simulationData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Sample function to get simulation data (you'll need to define this)
async function getSimulationData(campaignId: string) {
    // Logic to fetch and return simulation data based on campaignId
    return {
        qualityScore: 8,
        insights: ["Good engagement", "Consider improving visuals"]
    };
}

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});