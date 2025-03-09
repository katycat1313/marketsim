import { supabase } from "@/lib/supabase";
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

export class SupabaseStorage implements IStorage {
  async createPersona(persona: InsertPersona): Promise<Persona> {
    const { data, error } = await supabase
      .from('personas')
      .insert(persona)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPersona(id: number): Promise<Persona | undefined> {
    const { data, error } = await supabase
      .from('personas')
      .select()
      .eq('id', id)
      .single();

    if (error) return undefined;
    return data;
  }

  async listPersonas(): Promise<Persona[]> {
    const { data, error } = await supabase
      .from('personas')
      .select();

    if (error) throw error;
    return data || [];
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        ...campaign,
        status: 'active',
        createdAt: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const { data, error } = await supabase
      .from('campaigns')
      .select()
      .eq('id', id)
      .single();

    if (error) return undefined;
    return data;
  }

  async listCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select();

    if (error) throw error;
    return data || [];
  }

  async addSimulationData(data: InsertSimulationData): Promise<SimulationData> {
    const { data: simData, error } = await supabase
      .from('simulation_data')
      .insert({
        ...data,
        date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return simData;
  }

  async getSimulationData(campaignId: number): Promise<SimulationData[]> {
    const { data, error } = await supabase
      .from('simulation_data')
      .select()
      .eq('campaignId', campaignId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

// Export a singleton instance
export const storage = new SupabaseStorage();