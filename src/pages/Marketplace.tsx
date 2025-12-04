import { useEffect, useState } from 'react';
import { Bot, Search, X, Terminal, Cpu, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { Agent, generateMockAgents } from '../lib/mockData';
import { getSimulationAgents, activateAgentInSimulation } from '../lib/simulationStore';
import AgentCard from '../components/marketplace/AgentCard';
import CapabilitiesDisplay from '../components/marketplace/CapabilitiesDisplay';
import AgentActivationModal from '../components/marketplace/AgentActivationModal';

// --- Types for Live Logs ---
interface AgentLog {
  id: string;
  agentName: string;
  action: string;
  profit?: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

export default function Marketplace() {
  const { account } = useWallet();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activatingAgent, setActivatingAgent] = useState<Agent | null>(null);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Live Logs State
  const [logs, setLogs] = useState<AgentLog[]>([]);

  // --- 1. Load Data from Store ---
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      // Fetch from persistent store to keep sync with Dashboard
      const data = getSimulationAgents();
      setAgents(data);
      setFilteredAgents(data);
      setIsLoading(false);
    }, 800);
  }, []);

  // --- 2. Live Log Generator Effect ---
  useEffect(() => {
    const logInterval = setInterval(() => {
      const actions = [
        { action: "Rebalancing Liquidity Pool", type: 'info' },
        { action: "Harvested Yield", profit: "+$124.50", type: 'success' },
        { action: "Executed Arbitrage Trade", profit: "+$42.10", type: 'success' },
        { action: "Detected Slippage Spike", type: 'warning' },
        { action: "Verifying ZK Proof", type: 'info' },
        { action: "Scanning Mempool", type: 'info' }
      ];
      
      // Randomly add a log 40% of the time
      if (Math.random() > 0.4) {
        const randomAgent = agents.length > 0 
          ? agents[Math.floor(Math.random() * agents.length)] 
          : { name: "System" };
          
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const newLog: AgentLog = {
          id: Date.now().toString(),
          agentName: randomAgent.name,
          action: randomAction.action,
          profit: randomAction.profit,
          type: randomAction.type as any,
          timestamp: new Date().toLocaleTimeString([], { hour12: false })
        };
        
        setLogs(prev => [newLog, ...prev].slice(0, 6)); // Keep last 6 logs
      }
    }, 2000);

    return () => clearInterval(logInterval);
  }, [agents]);

  // --- 3. Filtering Logic ---
  useEffect(() => {
    let filtered = agents;
    if (selectedType !== 'all') {
      filtered = filtered.filter(agent => agent.agent_type === selectedType);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(query) ||
        agent.agent_type.toLowerCase().includes(query)
      );
    }
    setFilteredAgents(filtered);
  }, [selectedType, searchQuery, agents]);

  // --- Handlers ---
  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleSelectAgent = (agent: Agent) => {
    setActivatingAgent(agent);
    setShowActivationModal(true);
  };

  const handleActivateAgent = async (agentId: string) => {
    // 1. Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. Activate in Persistent Store
    activateAgentInSimulation(agentId);
    
    // 3. Refresh local list to show updated status
    const updatedAgents = getSimulationAgents();
    setAgents(updatedAgents);
    
    console.log(`Agent ${agentId} activated successfully`);
  };

  const agentTypes = [
    { value: 'all', label: 'ALL SYSTEMS' },
    { value: 'strategy', label: 'STRATEGY' },
    { value: 'risk_management', label: 'RISK OPS' },
    { value: 'arbitrage', label: 'ARBITRAGE' },
    { value: 'liquidity', label: 'LIQUIDITY' },
    { value: 'privacy', label: 'PRIVACY' },
  ];

  return (
    <div className="min-h-screen text-text-primary pt-28 pb-12 px-6 bg-[#000202] font-body">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12 border-b border-neutral-800 pb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">Agent Marketplace</h1>
              <p className="text-neutral-400 text-lg">
                Deploy autonomous ERC-8004 agents. <span className="text-accent-500 font-mono text-sm ml-2">// VERIFIED_EXECUTION</span>
              </p>
            </div>
            {account && (
              <div className="px-4 py-2 bg-accent-500/10 border border-accent-500/30 rounded text-xs font-mono text-accent-500">
                WALLET: {account.slice(0,6)}...
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {agentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase border transition-all duration-300 ${
                    selectedType === type.value
                      ? 'bg-accent-500/10 border-accent-500 text-accent-400'
                      : 'bg-[#050A0A] border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="SEARCH_PROTOCOL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#050A0A] border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-accent-500 font-mono text-xs transition-colors"
              />
            </div>
          </div>

          {/* AGENTS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-96 bg-[#030505] border border-neutral-800 animate-pulse" />
              ))
            ) : (
              filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onViewDetails={handleViewDetails}
                  onSelectAgent={handleSelectAgent}
                />
              ))
            )}
          </div>

          {!isLoading && filteredAgents.length === 0 && (
            <div className="text-center py-24 border border-dashed border-neutral-800 bg-[#030505]/50 mb-12">
              <Bot className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 font-mono text-sm">NO_AGENTS_FOUND</p>
            </div>
          )}

          {/* LIVE AGENT OPERATIONS CONSOLE */}
          <div className="border border-neutral-800 bg-[#050A0A] p-6 rounded-lg relative overflow-hidden">
            {/* Scanline */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-500/50 to-transparent opacity-20" />

            <div className="flex items-center justify-between mb-6 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-accent-500" />
                <h3 className="font-mono font-bold text-white uppercase tracking-wider">Live Agent Operations</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                <span className="text-[10px] font-mono text-green-500">SYSTEM_ONLINE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Logs */}
              <div className="space-y-2 h-48 overflow-hidden relative">
                 <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#050A0A] to-transparent z-10" />
                 <AnimatePresence initial={false}>
                   {logs.map((log) => (
                     <motion.div
                       key={log.id}
                       initial={{ opacity: 0, x: -20, height: 0 }}
                       animate={{ opacity: 1, x: 0, height: 'auto' }}
                       exit={{ opacity: 0 }}
                       className="flex items-center gap-4 text-xs font-mono border-l-2 border-transparent hover:border-accent-500 pl-2 py-1 transition-colors group"
                     >
                       <span className="text-neutral-600 select-none group-hover:text-neutral-500">[{log.timestamp}]</span>
                       <span className="text-accent-400 font-bold min-w-[140px] truncate">{log.agentName}</span>
                       <span className={`truncate ${
                         log.type === 'success' ? 'text-green-400' : 
                         log.type === 'warning' ? 'text-yellow-500' : 'text-neutral-400'
                       }`}>
                         {log.action}
                       </span>
                       {log.profit && <span className="ml-auto text-green-500 bg-green-500/10 px-1 rounded border border-green-500/20">{log.profit}</span>}
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>

              {/* Right: Network Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black border border-neutral-800 p-4 flex flex-col justify-center items-center group hover:border-accent-500/30 transition-colors">
                  <Cpu className="w-6 h-6 text-neutral-600 group-hover:text-accent-500 mb-2 transition-colors" />
                  <span className="text-2xl font-display font-bold text-white">42ms</span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase group-hover:text-accent-500/70">Avg Execution Time</span>
                </div>
                <div className="bg-black border border-neutral-800 p-4 flex flex-col justify-center items-center group hover:border-green-500/30 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-neutral-600 group-hover:text-green-500 mb-2 transition-colors" />
                  <span className="text-2xl font-display font-bold text-white">99.9%</span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase group-hover:text-green-500/70">Uptime</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAgent(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0A0A0A] border border-neutral-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_-10px_rgba(0,224,208,0.15)] relative"
          >
            <button 
              onClick={() => setSelectedAgent(null)} 
              className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="mb-8">
                <span className="text-accent-500 font-mono text-xs tracking-widest uppercase mb-2 block">
                  AGENT_ID: {selectedAgent.id.split('-')[1]}
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{selectedAgent.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-accent-500/10 text-accent-500 text-[10px] font-mono uppercase rounded border border-accent-500/20">
                    {selectedAgent.agent_type.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-[10px] font-mono uppercase rounded border border-neutral-700">
                    {selectedAgent.trust_model}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-px bg-neutral-800 border border-neutral-800 mb-8">
                 <div className="bg-[#0C0C0C] p-6 text-center">
                   <div className="text-2xl font-display font-bold text-green-500">{selectedAgent.performance_metrics.successRate}%</div>
                   <div className="text-[10px] font-mono text-neutral-500 uppercase mt-1">Success Rate</div>
                 </div>
                 <div className="bg-[#0C0C0C] p-6 text-center">
                   <div className="text-2xl font-display font-bold text-white">{selectedAgent.performance_metrics.averageApy}%</div>
                   <div className="text-[10px] font-mono text-neutral-500 uppercase mt-1">Avg APY</div>
                 </div>
                 <div className="bg-[#0C0C0C] p-6 text-center">
                   <div className="text-2xl font-display font-bold text-white">{(selectedAgent.performance_metrics.totalExecutions / 1000).toFixed(1)}k</div>
                   <div className="text-[10px] font-mono text-neutral-500 uppercase mt-1">Executions</div>
                 </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-widest mb-2">Description</h3>
                  <p className="text-neutral-300 leading-relaxed">{selectedAgent.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-mono text-neutral-400 uppercase tracking-widest mb-4">Capabilities</h3>
                  <CapabilitiesDisplay capabilities={selectedAgent.capabilities} agentType={selectedAgent.agent_type} />
                </div>
              </div>

              <div className="flex gap-4 border-t border-neutral-800 pt-6">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="flex-1 py-4 border border-neutral-700 text-neutral-300 font-mono text-xs uppercase tracking-widest hover:bg-neutral-900 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleSelectAgent(selectedAgent);
                    setSelectedAgent(null);
                  }}
                  className="flex-1 py-4 bg-accent-500 text-black font-bold font-mono text-xs uppercase tracking-widest hover:bg-accent-400 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Deploy Agent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Activation Modal */}
      <AgentActivationModal
        agent={activatingAgent}
        isOpen={showActivationModal}
        onClose={() => {
          setShowActivationModal(false);
          setActivatingAgent(null);
        }}
        onActivate={handleActivateAgent}
      />
    </div>
  );
}