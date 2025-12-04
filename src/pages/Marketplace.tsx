import { useEffect, useState } from 'react';
import { Bot, Search, Filter, X, Shield, Terminal, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { generateMockAgents, Agent } from '../lib/mockData';
import AgentCard from '../components/marketplace/AgentCard';
import CapabilitiesDisplay from '../components/marketplace/CapabilitiesDisplay';
import AgentActivationModal from '../components/marketplace/AgentActivationModal';

// --- Types for Logs ---
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

  useEffect(() => {
    // Initial Load
    setTimeout(() => {
      const data = generateMockAgents();
      setAgents(data);
      setFilteredAgents(data);
      setIsLoading(false);
    }, 800);

    // Live Log Generator
    const logInterval = setInterval(() => {
      const actions = [
        { action: "Rebalancing Liquidity Pool", type: 'info' },
        { action: "Harvested Yield", profit: "+$124.50", type: 'success' },
        { action: "Executed Arbitrage Trade", profit: "+$42.10", type: 'success' },
        { action: "Detected Slippage Spike", type: 'warning' },
        { action: "Verifying ZK Proof", type: 'info' },
        { action: "Scanning Mempool", type: 'info' }
      ];
      
      if (Math.random() > 0.4) {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)] || { name: "System" };
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
  }, [agents]); // Re-run if agents load

  // Filtering Logic
  useEffect(() => {
    let filtered = agents;
    if (selectedType !== 'all') filtered = filtered.filter(agent => agent.agent_type === selectedType);
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(query) ||
        agent.agent_type.toLowerCase().includes(query)
      );
    }
    setFilteredAgents(filtered);
  }, [selectedType, searchQuery, agents]);

  // Handlers
  const handleViewDetails = (agent: Agent) => setSelectedAgent(agent);
  const handleSelectAgent = (agent: Agent) => { setActivatingAgent(agent); setShowActivationModal(true); };
  const handleActivateAgent = async (agentId: string) => { await new Promise(resolve => setTimeout(resolve, 2000)); };

  const agentTypes = [
    { value: 'all', label: 'ALL SYSTEMS' },
    { value: 'strategy', label: 'STRATEGY' },
    { value: 'risk_management', label: 'RISK OPS' },
    { value: 'arbitrage', label: 'ARBITRAGE' },
    { value: 'liquidity', label: 'LIQUIDITY' },
    { value: 'privacy', label: 'PRIVACY' },
  ];

  return (
    <div className="min-h-screen text-text-primary pt-28 pb-12 px-6 bg-[#000202]">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="mb-12 border-b border-neutral-800 pb-8 flex justify-between items-end">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white">Agent Marketplace</h1>
              <p className="text-neutral-400 text-lg">
                Deploy autonomous ERC-8004 agents. <span className="text-accent-500 font-mono text-sm ml-2">// VERIFIED_EXECUTION</span>
              </p>
            </div>
          </div>

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
              [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-[#030505] border border-neutral-800 animate-pulse" />)
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

          {/* LIVE AGENT OPERATIONS CONSOLE */}
          <div className="border border-neutral-800 bg-[#050A0A] p-6 rounded-lg">
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
                       className="flex items-center gap-4 text-xs font-mono border-l-2 border-transparent hover:border-accent-500 pl-2 py-1 transition-colors"
                     >
                       <span className="text-neutral-600 select-none">[{log.timestamp}]</span>
                       <span className="text-accent-400 font-bold min-w-[140px]">{log.agentName}</span>
                       <span className={`${
                         log.type === 'success' ? 'text-green-400' : 
                         log.type === 'warning' ? 'text-yellow-500' : 'text-neutral-400'
                       }`}>
                         {log.action}
                       </span>
                       {log.profit && <span className="ml-auto text-green-500 bg-green-500/10 px-1 rounded">{log.profit}</span>}
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>

              {/* Right: Network Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black border border-neutral-800 p-4 flex flex-col justify-center items-center">
                  <Cpu className="w-6 h-6 text-neutral-500 mb-2" />
                  <span className="text-2xl font-display font-bold text-white">42ms</span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Avg Execution Time</span>
                </div>
                <div className="bg-black border border-neutral-800 p-4 flex flex-col justify-center items-center">
                  <CheckCircle2 className="w-6 h-6 text-accent-500 mb-2" />
                  <span className="text-2xl font-display font-bold text-white">99.9%</span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Uptime</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Detail Modal (Simplified for brevity, assumes existing components handle the layout) */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setSelectedAgent(null)}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()} className="bg-[#0A0A0A] border border-neutral-800 w-full max-w-2xl p-8 shadow-2xl relative">
            <button onClick={() => setSelectedAgent(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white"><X /></button>
            <h2 className="text-3xl font-display font-bold text-white mb-2">{selectedAgent.name}</h2>
            <div className="flex gap-2 mb-6">
              <span className="px-2 py-1 bg-accent-500/10 text-accent-500 text-[10px] font-mono uppercase rounded border border-accent-500/20">
                {selectedAgent.agent_type.replace('_', ' ')}
              </span>
            </div>
            <p className="text-neutral-400 mb-8">{selectedAgent.description}</p>
            <div className="grid grid-cols-3 gap-px bg-neutral-800 border border-neutral-800 mb-8">
               <div className="bg-[#0C0C0C] p-4 text-center"><div className="text-xl font-bold text-white">{selectedAgent.performance_metrics.successRate}%</div><div className="text-[10px] text-neutral-500">SUCCESS</div></div>
               <div className="bg-[#0C0C0C] p-4 text-center"><div className="text-xl font-bold text-white">{selectedAgent.performance_metrics.averageApy}%</div><div className="text-[10px] text-neutral-500">APY</div></div>
               <div className="bg-[#0C0C0C] p-4 text-center"><div className="text-xl font-bold text-white">{selectedAgent.performance_metrics.totalExecutions}</div><div className="text-[10px] text-neutral-500">EXECS</div></div>
            </div>
            <CapabilitiesDisplay capabilities={selectedAgent.capabilities} agentType={selectedAgent.agent_type} />
            <button onClick={() => { handleSelectAgent(selectedAgent); setSelectedAgent(null); }} className="w-full mt-8 bg-accent-500 text-black py-4 font-bold font-mono uppercase hover:bg-accent-400 transition-colors">
              Deploy Agent
            </button>
          </motion.div>
        </div>
      )}

      <AgentActivationModal agent={activatingAgent} isOpen={showActivationModal} onClose={() => { setShowActivationModal(false); setActivatingAgent(null); }} onActivate={handleActivateAgent} />
    </div>
  );
}