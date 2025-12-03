import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, Bot, Eye, TrendingUp, ArrowRight, CheckCircle, Wallet, Layers, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const [stats, setStats] = useState({
    agents: 0,
    users: 0,
    apy: 0,
    tvl: 0
  });

  const fetchPlatformStats = async () => {
    try {
      const { count: agentsCount } = await supabase
        .from('ai_agents')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);

      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      const { data: apyData } = await supabase
        .from('ai_agents')
        .select('avg_yield')
        .eq('active', true);

      const avgApy = apyData && apyData.length > 0 
        ? (apyData.reduce((sum, agent) => sum + agent.avg_yield, 0) / apyData.length).toFixed(1)
        : '26.8';

      setStats({
        agents: agentsCount || 6,
        users: usersCount || 1,
        apy: parseFloat(avgApy),
        tvl: 125 // Static fallback as per requirements
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      setStats({ agents: 6, users: 1, apy: 26.8, tvl: 125 });
    }
  };

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const visionFeatures = [
    {
      icon: Lock,
      title: 'Privacy-First DeFi',
      description: 'Complete transaction anonymity with zero-knowledge proofs'
    },
    {
      icon: Bot,
      title: 'AI-Powered Agents',
      description: 'ERC-8004 compliant agents for automated yield optimization'
    },
    {
      icon: Shield,
      title: 'zkMechanism',
      description: 'Advanced cryptography for secure privacy preservation'
    }
  ];

  const coreFeatures = [
    {
      icon: Zap,
      title: 'Instant Privacy',
      description: 'Deploy privacy-preserving transactions in seconds'
    },
    {
      icon: Layers,
      title: 'Smart Routing',
      description: 'AI agents optimize across multiple protocols'
    },
    {
      icon: TrendingUp,
      title: 'Yield Maximization',
      description: 'Automated strategies for maximum returns'
    }
  ];

  const capabilities = [
    {
      title: 'Privacy Lending',
      description: 'Lend and borrow with ZK proof of income without revealing identity or transaction history'
    },
    {
      title: 'Anonymous Staking',  
      description: 'Stake assets with complete anonymity, automated compounding, and privacy-preserving rewards'
    },
    {
      title: 'Stealth Yield Farming',
      description: 'AI agents optimize yield farming strategies with full transaction privacy protection'
    },
    {
      title: 'Cross-Chain Privacy',
      description: 'Seamlessly operate across multiple chains while maintaining complete privacy'
    }
  ];

  const howItWorks = [
    {
      number: '01',
      highlight: 'Private & Secure',
      title: 'Connect Wallet',
      description: 'Connect your MetaMask and start anonymous transactions using Zero Knowledge authentication',
      action: 'Click "Connect Wallet" and follow instructions',
      icon: Wallet
    },
    {
      number: '02',
      highlight: 'ERC-8004 Compliant',
      title: 'Choose Strategy',
      description: 'Choose AI agents from marketplace or set custom DeFi strategies with privacy preservation',
      action: 'Browse AI agents or set custom strategy',
      icon: Layers
    },
    {
      number: '03',
      highlight: 'Automated Yield',
      title: 'AI Execution',
      description: 'AI agents will execute strategies automatically with ZK proofs for every transaction',
      action: 'Monitor real-time performance dashboard',
      icon: Zap
    },
    {
      number: '04',
      highlight: 'Anonymous Withdrawal',
      title: 'Harvest Profits',
      description: 'Harvest yield farming results with complete anonymity using stealth addresses',
      action: 'Claim anonymous rewards and reinvest or withdraw',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Scroll Snap Container */}
      <div className="scroll-snap-container">
        {/* Section 1: THE VISION */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-8 py-24 scroll-snap-start">
          {/* Coordinate Label */}
          <div className="coordinate-label absolute top-20 left-4 text-white/50 text-xs">X:0 Y:0</div>
          
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
              {/* Left Column - THE VISION */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="content-overlay p-6 lg:p-8 max-w-lg mx-auto lg:mx-0"
                >
                  <h1 className="section-title text-3xl lg:text-5xl font-bold mb-4">
                    THE VISION
                  </h1>
                  <p className="text-base lg:text-lg text-white/80 mb-6">
                    Privacy-first DeFi powered by AI agents
                  </p>
                  <div className="coordinate-label text-white/30 text-xs">X:1 Y:1</div>
                </motion.div>
              </div>

              {/* Right Column - Feature Cards */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                {/* Desktop: Improved overlapping layout with better spacing */}
                <div className="hidden lg:block relative h-[600px]">
                  {visionFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className={`overlay-block absolute p-8 ${
                        index === 0 ? 'top-20 left-0 w-80' :
                        index === 1 ? 'bottom-36 left-60 z-10 w-80' :
                        '-bottom-4 right-0 z-20 w-80'
                      }`}
                    >
                      <div className="coordinate-label text-white/30 text-xs">
                        X:{index + 2} Y:1
                      </div>
                      <div className="flex items-center space-x-4 mb-4">
                        <feature.icon className="w-8 h-8 text-purple-400 flex-shrink-0" />
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-white/70 text-base leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
                
                {/* Mobile/Tablet: Stacked layout */}
                <div className="lg:hidden space-y-4">
                  {visionFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="overlay-block p-4 sm:p-6"
                    >
                      <div className="coordinate-label text-white/30 text-xs">
                        X:{index + 2} Y:1
                      </div>
                      <div className="flex items-center space-x-3 mb-3">
                        <feature.icon className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: THE CORE */}
        <section className="min-h-screen flex items-center justify-center px-8 py-24 scroll-snap-start">
          {/* Coordinate Label */}
          <div className="coordinate-label absolute top-24 left-8 text-white/50 text-sm">X:0 Y:1</div>
          
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="coordinate-label text-white/30 text-xs">X:1 Y:2</div>
              <h2 className="section-title text-4xl lg:text-5xl font-bold mb-4">
                THE CORE
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Core infrastructure powering privacy-preserving DeFi with AI intelligence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="overlay-block p-6"
                >
                  <div className="coordinate-label text-white/30 text-xs">X:{index + 2} Y:2</div>
                  <div className="flex items-center space-x-3 mb-4">
                    <feature.icon className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-white/70">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Dynamic Stats Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="stats-overlay max-w-4xl mx-auto"
            >
              <div className="coordinate-label text-white/30 text-xs">X:1 Y:3</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.agents}+</div>
                  <div className="text-white/70 text-sm">AI Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.users}</div>
                  <div className="text-white/70 text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.apy}%</div>
                  <div className="text-white/70 text-sm">Avg APY</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">${stats.tvl}M</div>
                  <div className="text-white/70 text-sm">TVL</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 3: CAPABILITIES */}
        <section className="min-h-screen flex items-center justify-center px-8 py-24 scroll-snap-start">
          {/* Coordinate Label */}
          <div className="coordinate-label absolute top-24 left-8 text-white/50 text-sm">X:0 Y:2</div>
          
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="coordinate-label text-white/30 text-xs">X:1 Y:4</div>
              <h2 className="section-title text-4xl lg:text-5xl font-bold mb-4">
                CAPABILITIES
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Advanced privacy solutions for the future of decentralized finance
              </p>
            </motion.div>

            <div className="space-y-8">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="overlay-block p-8"
                >
                  <div className="coordinate-label text-white/30 text-xs">X:2 Y:{index + 4}</div>
                  <div className="flex items-start space-x-4">
                    <div className="capability-number">0{index + 1}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3">{capability.title}</h3>
                      <p className="text-white/70 leading-relaxed">{capability.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: HOW IT WORKS */}
        <section className="min-h-screen flex items-center justify-center px-8 py-24 scroll-snap-start">
          {/* Coordinate Label */}
          <div className="coordinate-label absolute top-24 left-8 text-white/50 text-sm">X:0 Y:3</div>
          
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="coordinate-label text-white/30 text-xs">X:1 Y:8</div>
              <h2 className="section-title text-4xl lg:text-5xl font-bold mb-4">
                HOW IT WORKS
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                From wallet connection to profit harvesting in 4 simple steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="overlay-block p-6 relative"
                >
                  <div className="coordinate-label text-white/30 text-xs">X:{index + 2} Y:8</div>
                  
                  {/* Step Number */}
                  <div className="text-6xl font-bold text-purple-400/20 mb-4">
                    {step.number}
                  </div>
                  
                  {/* Highlight Badge */}
                  <div className="inline-block bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full mb-4">
                    {step.highlight}
                  </div>
                  
                  {/* Icon */}
                  <div className="mb-4">
                    <step.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  
                  {/* Description */}
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Action */}
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-purple-300 text-sm font-medium">
                      {step.action}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}