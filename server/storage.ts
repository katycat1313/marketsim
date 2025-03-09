import { 
  type Persona, type Campaign, type SimulationData,
  type InsertPersona, type InsertCampaign, type InsertSimulationData 
} from "@shared/schema";

export interface IStorage {
  // Persona operations
  createPersona(persona: InsertPersona): Promise<Persona>;
  getPersona(id: number): Promise<Persona | undefined>;
  listPersonas(): Promise<Persona[]>;

  // Campaign operations
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  listCampaigns(): Promise<Campaign[]>;

  // Simulation operations
  addSimulationData(data: InsertSimulationData): Promise<SimulationData>;
  getSimulationData(campaignId: number): Promise<SimulationData[]>;
}

export class MemStorage implements IStorage {
  private personas: Map<number, Persona>;
  private campaigns: Map<number, Campaign>;
  private simulationData: Map<number, SimulationData>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.personas = new Map();
    this.campaigns = new Map();
    this.simulationData = new Map();
    this.currentIds = { persona: 1, campaign: 1, simulation: 1 };
  }

  async createPersona(persona: InsertPersona): Promise<Persona> {
    const id = this.currentIds.persona++;
    const newPersona = { ...persona, id };
    this.personas.set(id, newPersona);
    return newPersona;
  }

  async getPersona(id: number): Promise<Persona | undefined> {
    return this.personas.get(id);
  }

  async listPersonas(): Promise<Persona[]> {
    return Array.from(this.personas.values());
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentIds.campaign++;
    const newCampaign = { 
      ...campaign, 
      id, 
      createdAt: new Date() 
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async listCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async addSimulationData(data: InsertSimulationData): Promise<SimulationData> {
    const id = this.currentIds.simulation++;
    const newData = { ...data, id };
    this.simulationData.set(id, newData);
    return newData;
  }

  async getSimulationData(campaignId: number): Promise<SimulationData[]> {
    return Array.from(this.simulationData.values())
      .filter(data => data.campaignId === campaignId);
  }
}

export const storage = new MemStorage();
