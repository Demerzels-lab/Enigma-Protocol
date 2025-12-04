import { Agent, generateMockAgents } from './mockData';

const STORAGE_KEY = 'enigma_simulation_state_v1';

interface SimulationState {
  agents: Agent[];
  lastUpdated: number;
}

// Helper to get state from local storage or initialize it
const getState = (): SimulationState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  // First time load: Generate fresh mock data
  const initialAgents = generateMockAgents();
  
  // Create initial state
  const newState = {
    agents: initialAgents,
    lastUpdated: Date.now()
  };
  
  // Save immediately
  saveState(newState);
  return newState;
};

// Helper to save state back to local storage
const saveState = (state: SimulationState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// --- Public API ---

// Get all agents (for Marketplace)
export const getSimulationAgents = () => {
  return getState().agents;
};

// Get only active agents (for Dashboard)
export const getActiveSimulationAgents = () => {
  return getState().agents.filter(a => a.status === 'active');
};

// Activate an agent by ID
export const activateAgentInSimulation = (agentId: string) => {
  const state = getState();
  const agentIndex = state.agents.findIndex(a => a.id === agentId);
  
  if (agentIndex !== -1) {
    // Update status to active
    state.agents[agentIndex].status = 'active';
    
    // Boost metrics slightly to show it's "fresh" and working
    state.agents[agentIndex].performance_metrics.totalExecutions += 1;
    
    saveState(state);
    return state.agents[agentIndex];
  }
  return null;
};

// Reset simulation (useful for debugging)
export const resetSimulation = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};