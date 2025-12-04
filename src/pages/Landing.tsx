import { useState, useEffect, useRef, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Bot, TrendingUp, ArrowRight, Plus, GripHorizontal, ChevronRight, Globe, Layers, Cpu, Move, X } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { supabase } from '../lib/supabase';

// --- 1. HEAVY SCROLL SYSTEM (MOMENTUM) ---

const SmoothScrollWrapper = ({ children }: { children: ReactNode }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  
  // Connect to window scroll
  const { scrollY } = useScroll();
  
  // "Heavy" spring physics - stiffer and more damped for weight
  const smoothY = useSpring(scrollY, {
    damping: 20,    // Higher = less oscillation (heavier feel)
    stiffness: 90,  // Lower = slower response (heavier feel)
    mass: 1.5       // Higher = more inertia
  });

  // Inverse transform to move content up as we scroll down
  const y = useTransform(smoothY, (value) => -value);

  // Sync content height for the "fake" scroll container
  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (contentRef.current) resizeObserver.observe(contentRef.current);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <div style={{ height: contentHeight }} className="w-full" />
      <motion.div 
        ref={contentRef}
        style={{ y }} 
        className="fixed top-0 left-0 w-full will-change-transform z-10"
      >
        {children}
      </motion.div>
    </>
  );
};

// --- 2. INTERACTIVE HOVER SYSTEM (TEAL SPOTLIGHT) ---

const SpotlightOverlay = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Updated to Teal RGB (0, 224, 208)
  const background = useMotionTemplate`
    radial-gradient(
      800px circle at ${mouseX}px ${mouseY}px,
      rgba(0, 224, 208, 0.08),
      transparent 80%
    )
  `;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{ background }}
    />
  );
};

// --- 3. UI COMPONENTS (Green/Teal Aesthetic) ---

const CoordinateLabel = ({ x, y, className = "" }: { x: number; y: number; className?: string }) => (
  <div className={`absolute font-mono text-[9px] tracking-[0.2em] text-accent-500/60 pointer-events-none select-none ${className}`}>
    X:{x} <span className="mx-1"></span> Y:{y}
  </div>
);

const GlowLine = ({ vertical = false, delay = 0, duration = 4 }: { vertical?: boolean; delay?: number; duration?: number }) => (
  <div className={`absolute bg-accent-500/10 ${vertical ? 'w-px h-full' : 'h-px w-full'} overflow-hidden pointer-events-none z-0`}>
    <motion.div
      initial={{ [vertical ? 'y' : 'x']: '-100%' }}
      animate={{ [vertical ? 'y' : 'x']: '100%' }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      // Increased shadow opacity for "more glower effect"
      className={`absolute bg-accent-500 ${vertical ? 'w-px h-48' : 'h-px w-48'} shadow-[0_0_25px_4px_rgba(0,224,208,0.7)]`}
    />
  </div>
);

const RollingText = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <div className="relative overflow-hidden inline-block leading-tight">
    <motion.span
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className="block"
    >
      {text}
    </motion.span>
  </div>
);

// Interactive Card with stronger Teal Glow
const InteractiveCard = ({ children, className = "", title, subtitle }: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
  };

  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group bg-[#020404] border border-neutral-900 overflow-hidden ${className}`}
    >
      {/* Spotlight Border Effect - Stronger Teal */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 224, 208, 0.5), transparent 40%)`,
        }}
      />
      {/* Inner Mask */}
      <div className="absolute inset-[1px] bg-[#020404] z-10" />
      
      {/* Content */}
      <div className="relative z-20 h-full">
        {children}
      </div>
    </div>
  );
};

const DraggableWindow = ({ title, children, x, y, initialX = 0, initialY = 0, width = "w-80" }: any) => (
  <motion.div
    drag
    dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
    dragElastic={0.1}
    initial={{ opacity: 0, x: initialX, y: initialY + 50 }}
    whileInView={{ opacity: 1, x: initialX, y: initialY }}
    viewport={{ once: true }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className={`absolute ${width} bg-[#030808]/90 backdrop-blur-md border border-neutral-800 shadow-[0_0_40px_-10px_rgba(0,224,208,0.15)] z-20 cursor-grab active:cursor-grabbing group`}
    style={{ left: x, top: y }}
  >
    {/* Window Header */}
    <div className="h-8 flex items-center justify-between px-3 border-b border-neutral-800 bg-[#050A0A]/50 select-none group-hover:border-accent-500/40 transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-accent-500/20 rounded-sm flex items-center justify-center">
          <Plus className="w-2 h-2 text-accent-500" />
        </div>
        <span className="text-[9px] font-mono tracking-widest text-neutral-400 group-hover:text-accent-400 uppercase transition-colors">{title}</span>
      </div>
      <div className="flex items-center gap-2 text-neutral-700">
        <GripHorizontal className="w-3 h-3" />
      </div>
    </div>
    
    {/* Window Content */}
    <div className="p-6 relative">
      <div className="absolute top-0 right-0 p-2 opacity-50">
        <div className="w-1 h-1 bg-accent-500 rounded-full shadow-[0_0_5px_rgba(0,224,208,1)]" />
      </div>
      {children}
    </div>
    
    {/* Corner Accents - Teal */}
    <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(0,224,208,0.8)]" />
    <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(0,224,208,0.8)]" />
  </motion.div>
);

const GlowBorder = ({ children, className = "" }: any) => (
  <div className={`relative group ${className}`}>
    <div className="absolute inset-0 border border-accent-500/20" />
    {/* Animated Corners - Teal */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-accent-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-accent-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-accent-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-accent-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Scanline Effect - Teal tint */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-[linear-gradient(rgba(0,224,208,0.1)_1px,transparent_1px)] bg-[length:100%_4px] transition-opacity duration-500" />
    
    {children}
  </div>
);

const StatTicker = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col justify-center border-r border-neutral-800 p-6 last:border-r-0 hover:bg-accent-500/10 transition-colors group h-full">
    <span className="text-[9px] font-mono text-neutral-500 mb-1 tracking-widest uppercase group-hover:text-accent-400 transition-colors">{label}</span>
    <span className="text-xl md:text-2xl font-display font-medium text-neutral-300 group-hover:text-white transition-colors group-hover:drop-shadow-[0_0_5px_rgba(0,224,208,0.5)]">{value}</span>
  </div>
);

// --- MAIN PAGE ---

export default function Landing() {
  const [stats, setStats] = useState({ agents: 6, users: 12847, apy: 26.8, tvl: 125 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count } = await supabase.from('ai_agents').select('*', { count: 'exact', head: true }).eq('active', true);
        if (count) setStats(prev => ({ ...prev, agents: count }));
      } catch (e) {}
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-[#000202] text-text-primary overflow-hidden selection:bg-accent-500/30 selection:text-white font-body relative">
      
      <SpotlightOverlay />
      
      <SmoothScrollWrapper>
        {/* ---------------- HERO SECTION ---------------- */}
        <section className="relative h-screen min-h-[900px] w-full border-b border-neutral-800 flex flex-col justify-center overflow-hidden">
          {/* Static Grid - slightly teal tinted */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,224,208,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,224,208,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />
          
          {/* Animated Glow Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-[15%] h-full w-px"><GlowLine vertical delay={0} duration={8} /></div>
            <div className="absolute right-[25%] h-full w-px"><GlowLine vertical delay={4} duration={10} /></div>
            <div className="absolute top-[30%] w-full h-px"><GlowLine delay={2} duration={12} /></div>
          </div>

          <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 h-full items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 pt-20 pl-4 md:pl-12">
              <CoordinateLabel x={12} y={24} className="-top-24 left-0" />
              
              <div className="mb-8">
                <h1 className="text-[13vw] lg:text-[8rem] leading-[0.8] font-display font-bold tracking-tighter text-white mix-blend-difference">
                  <RollingText text="THE" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600 block drop-shadow-[0_0_20px_rgba(0,224,208,0.4)]">
                    <RollingText text="VISION" delay={0.15} />
                  </span>
                </h1>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6, duration: 0.8 }}
                className="max-w-xl pl-2"
              >
                <div className="w-12 h-1 bg-accent-500 mb-8 shadow-[0_0_10px_rgba(0,224,208,0.8)]" />
                <p className="text-xl md:text-2xl text-neutral-400 font-light leading-snug mb-10">
                  Enigma Protocol rebuilds communication for the <span className="text-white">autonomous age</span>. 
                  Where identity, privacy, and yield live entirely <span className="text-accent-400">on-chain</span>.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <Link to="/dashboard" className="group relative">
                    <div className="absolute -inset-0.5 bg-accent-500/40 blur-md opacity-40 group-hover:opacity-100 transition duration-500 rounded-sm" />
                    <button className="relative bg-[#020404] border border-neutral-800 text-white px-8 py-4 flex items-center gap-4 font-mono text-xs tracking-[0.2em] uppercase transition-all duration-300 group-hover:bg-[#030808] group-hover:border-accent-500 shadow-[0_0_20px_rgba(0,224,208,0.1)]">
                      <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(0,224,208,1)]" />
                      Enter Protocol
                    </button>
                  </Link>
                  <Link to="/docs" className="group flex items-center gap-2 px-4 py-2">
                    <span className="font-mono text-xs tracking-widest text-neutral-500 group-hover:text-accent-400 uppercase transition-colors">Read Documentation</span>
                    <ArrowRight className="w-3 h-3 text-neutral-500 group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Area */}
            <div className="lg:col-span-5 relative h-full hidden lg:block pointer-events-none">
              <div className="absolute inset-0 pointer-events-auto perspective-[1000px]">
                {/* Floating Window 1 */}
                <DraggableWindow title="SYSTEM_STATUS" x="15%" y="25%" initialY={-20} width="w-72">
                  <div className="flex items-start justify-between mb-4">
                    <Shield className="w-6 h-6 text-accent-500 drop-shadow-[0_0_8px_rgba(0,224,208,0.6)]" />
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-accent-500 rounded-full shadow-[0_0_5px_rgba(0,224,208,1)]" />
                      <div className="w-1 h-1 bg-accent-500/30 rounded-full" />
                    </div>
                  </div>
                  <h3 className="text-lg font-display font-bold text-white mb-2">Zero-Knowledge</h3>
                  <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                    `{'>'}` Proof verification: <span className="text-accent-500">VALID</span><br/>
                    `{'>'}` Sender: <span className="text-neutral-600">HIDDEN</span><br/>
                    `{'>'}` Receiver: <span className="text-neutral-600">HIDDEN</span>
                  </p>
                  <div className="mt-4 h-px w-full bg-neutral-800 relative overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-1/2 h-full bg-accent-500 blur-[2px]" 
                    />
                  </div>
                </DraggableWindow>

                {/* Floating Window 2 */}
                <DraggableWindow title="AGENT_LINK" x="45%" y="50%" initialY={40} width="w-80">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-accent-500/10 rounded flex items-center justify-center border border-accent-500/20 shadow-[0_0_15px_rgba(0,224,208,0.1)]">
                      <Bot className="w-4 h-4 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white">ERC-8004 AI</h3>
                      <p className="text-[10px] text-accent-500 font-mono flex items-center gap-2">
                        <span className="w-1 h-1 bg-accent-500 rounded-full animate-ping" />
                        STATUS: OPTIMIZING
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 mb-2">
                    {[80, 45, 90, 60].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: "20%" }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                        className="bg-accent-500/40 w-full rounded-sm min-h-[20px] shadow-[0_0_5px_rgba(0,224,208,0.2)]"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono text-right">YIELD_OPTIMIZATION_V2.1</p>
                </DraggableWindow>
              </div>
            </div>
          </div>
          
          {/* Bottom Ticker Bar */}
          <div className="absolute bottom-0 left-0 w-full h-24 border-t border-neutral-800 bg-[#020404]/80 backdrop-blur-md z-20">
            <div className="container mx-auto h-full grid grid-cols-2 md:grid-cols-4">
              <StatTicker label="TOTAL VALUE LOCKED" value={`$${stats.tvl}M`} />
              <StatTicker label="ACTIVE AGENTS" value={`0${stats.agents}`} />
              <StatTicker label="AVG YIELD APY" value={`${stats.apy}%`} />
              <StatTicker label="PRIVACY SCORE" value="98.5/100" />
            </div>
          </div>
        </section>


        {/* ---------------- THE CORE (GRID) ---------------- */}
        <section className="relative py-32 bg-[#020404]">
          <CoordinateLabel x={0} y={1} className="top-8 left-8" />
          <GlowLine delay={2} />

          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8 px-4 border-l border-accent-500/30 pl-8">
              <div>
                <span className="text-accent-500 font-mono text-xs tracking-widest mb-2 block drop-shadow-[0_0_5px_rgba(0,224,208,0.5)]">SYSTEM_INFRASTRUCTURE</span>
                <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                  THE CORE
                </h2>
                <p className="text-neutral-400 max-w-md text-lg font-light">
                  Core infrastructure powering privacy-preserving DeFi with AI intelligence.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 border border-neutral-800 rounded-full flex items-center justify-center relative animate-[spin_20s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-500 rounded-full shadow-[0_0_15px_2px_rgba(0,224,208,1)]" />
                  <div className="w-24 h-24 border border-neutral-800 rounded-full opacity-50" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: Zap, 
                  title: "Instant Privacy", 
                  desc: "Deploy privacy-preserving transactions in seconds. No waiting for mixers.",
                  code: "ZK_SNARKS_V2"
                },
                { 
                  icon: Layers, 
                  title: "Smart Routing", 
                  desc: "AI agents route funds through optimal paths to maximize anonymity set.",
                  code: "MULTI_HOP_RT"
                },
                { 
                  icon: TrendingUp, 
                  title: "Yield Max", 
                  desc: "Automated strategies rebalance to capture the highest APY across protocols.",
                  code: "AUTO_COMPOUND"
                }
              ].map((item, idx) => (
                <InteractiveCard key={idx} className="min-h-[340px]">
                  <div className="p-8 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-10">
                        <div className="w-12 h-12 bg-[#050A0A] flex items-center justify-center border border-neutral-800 shadow-[inset_0_0_20px_rgba(0,224,208,0.05)]">
                          <item.icon className="w-6 h-6 text-accent-500" />
                        </div>
                        <span className="text-[9px] font-mono text-neutral-600 border border-neutral-800 px-2 py-1 rounded-full group-hover:text-accent-500 group-hover:border-accent-500/30 transition-colors">{item.code}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-accent-100 transition-colors">{item.title}</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    
                    <div className="pt-6 border-t border-neutral-900 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-neutral-600 group-hover:text-accent-500 transition-colors">READ MORE</span>
                      <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300" />
                    </div>
                  </div>
                </InteractiveCard>
              ))}
            </div>
          </div>
        </section>


        {/* ---------------- EXECUTION TIMELINE ---------------- */}
        <section className="relative py-32 border-y border-neutral-800 bg-[#000202]">
          <GlowLine delay={1} />
          <CoordinateLabel x={24} y={50} className="top-12 left-12" />
          
          <div className="container mx-auto px-6 max-w-7xl mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              EXECUTION <span className="text-neutral-700">PROTOCOL</span>
            </h2>
            <p className="text-neutral-400 max-w-lg font-mono text-xs tracking-widest uppercase">
              // From connection to harvesting
            </p>
          </div>

          <div className="w-full overflow-x-auto pb-12 pl-6 md:pl-[max(2rem,calc((100vw-80rem)/2))] hide-scrollbar cursor-grab active:cursor-grabbing">
            <div className="flex gap-px w-max bg-neutral-800 border-l border-neutral-800">
              {[
                { num: "01", title: "Initialize", desc: "Connect wallet & generate ZK identity.", icon: Globe },
                { num: "02", title: "Select Agent", desc: "Choose strategy from the AI marketplace.", icon: Bot },
                { num: "03", title: "Execution", desc: "Agent deploys funds via stealth address.", icon: Cpu },
                { num: "04", title: "Harvest", desc: "Withdraw anonymous rewards to fresh wallet.", icon: TrendingUp },
              ].map((step, i) => (
                <div key={i} className="w-[300px] md:w-[400px] h-[300px] relative group bg-[#020404] p-10 flex flex-col justify-between hover:bg-[#050A0A] transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-5xl font-display font-bold text-neutral-800 group-hover:text-accent-500/10 transition-colors">{step.num}</span>
                    <step.icon className="w-6 h-6 text-neutral-600 group-hover:text-accent-500 transition-colors drop-shadow-[0_0_5px_rgba(0,224,208,0.5)]" />
                  </div>
                  
                  <div>
                    <div className="w-8 h-px bg-neutral-800 group-hover:bg-accent-500 mb-6 transition-colors shadow-[0_0_10px_rgba(0,224,208,0.8)]" />
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-neutral-500 text-sm group-hover:text-neutral-400 transition-colors">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ---------------- CAPABILITIES LIST (EDITORIAL) ---------------- */}
        <section className="relative flex flex-col md:flex-row border-b border-neutral-800">
          {/* Sticky Title */}
          <div className="md:w-1/3 border-r border-neutral-800 p-12 md:sticky md:top-0 h-fit md:h-screen bg-[#010303] z-10 flex flex-col justify-between">
            <div>
              <CoordinateLabel x={0} y={4} className="relative mb-8 block" />
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tight">
                SYSTEM<br />CAPABILITIES
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-xs">
                Advanced privacy primitives available for immediate deployment. 
                The Enigma ecosystem expands based on community governance.
              </p>
              <Link to="/dashboard" className="text-accent-500 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                <span className="border-b border-accent-500 group-hover:border-white transition-colors pb-0.5">Explore All</span> 
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="hidden md:block opacity-30">
               {/* Decorative Element */}
               <svg width="60" height="60" viewBox="0 0 60 60" className="animate-[spin_10s_linear_infinite]">
                 <circle cx="30" cy="30" r="28" stroke="#333" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                 <circle cx="30" cy="30" r="10" stroke="#00E0D0" strokeWidth="2" fill="none" />
               </svg>
            </div>
          </div>

          {/* List Items */}
          <div className="md:w-2/3 bg-[#020404]">
            {[
              { t: 'Privacy Lending', d: 'Lend and borrow assets using Zero-Knowledge proofs of solvency. Your history remains yours.', label: "01" },
              { t: 'Anonymous Staking', d: 'Stake assets with complete anonymity. Rewards are dispensed to a fresh stealth address.', label: "02" },
              { t: 'Stealth Farming', d: 'AI agents automatically rotate funds between pools to maximize yield while obfuscating the trail.', label: "03" },
              { t: 'Cross-Chain Bridge', d: 'Seamlessly bridge assets across EVM chains without linking your identities.', label: "04" }
            ].map((cap, i) => (
              <GlowBorder key={i}>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ margin: "-10%" }}
                  className="min-h-[40vh] border-b border-neutral-800 p-12 md:p-20 flex flex-col justify-center hover:bg-accent-500/5 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 text-[10rem] font-display font-bold text-neutral-900 pointer-events-none group-hover:text-neutral-800 transition-colors select-none">
                    {cap.label}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-mono text-accent-500 border border-accent-500/30 px-2 py-1 rounded bg-accent-500/5 shadow-[0_0_10px_rgba(0,224,208,0.2)]">MODULE_{cap.label}</span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 group-hover:text-accent-200 transition-colors">{cap.t}</h3>
                    <p className="text-neutral-400 text-lg max-w-md leading-relaxed">{cap.d}</p>
                  </div>
                </motion.div>
              </GlowBorder>
            ))}
          </div>
        </section>


        {/* ---------------- FOOTER CTA ---------------- */}
        <section className="py-32 relative overflow-hidden bg-[#000202]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,224,208,0.08),transparent_70%)]" />
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-[7rem] font-display font-bold text-white mb-12 tracking-tighter leading-none">
              READY TO GO <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-accent-400 to-teal-900 drop-shadow-[0_0_30px_rgba(0,224,208,0.3)]">DARK?</span>
            </h2>
            
            <div className="flex justify-center">
              <Link to="/auth" className="group relative inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-teal-600 blur-lg opacity-40 group-hover:opacity-80 transition duration-300 rounded-lg" />
                <button className="relative bg-[#050A0A] border border-neutral-700 text-white px-12 py-6 font-mono text-sm uppercase tracking-[0.2em] hover:bg-[#081010] transition-all flex items-center gap-4 rounded-lg group-hover:border-accent-500">
                  <span>Initialize Protocol</span>
                  <div className="w-px h-4 bg-neutral-700" />
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent-500" />
                </button>
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent shadow-[0_0_20px_rgba(0,224,208,1)]" />
        </section>
      </SmoothScrollWrapper>
    </div>
  );
}