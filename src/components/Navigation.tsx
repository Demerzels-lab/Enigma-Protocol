import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Wallet, Github, Twitter, ArrowRight, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  // Define public vs private routes
  const navItems = [
    { name: 'Home', path: '/', public: true },
    { name: 'Dashboard', path: '/dashboard', public: false },
    { name: 'Marketplace', path: '/marketplace', public: false },
    { name: 'Privacy Pools', path: '/pools', public: false },
    { name: 'DeFi', path: '/defi', public: false },
    { name: 'Settings', path: '/settings', public: false },
  ];

  // Filter items: Show item if it is public OR if user is logged in (account exists)
  const visibleNavItems = navItems.filter(item => item.public || account);

  // Check if we're on landing page (to style differently if needed, or hide certain elements)
  const isLandingPage = location.pathname === '/';
  const isActive = (path: string) => location.pathname === path;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAuthRedirect = () => {
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000202]/80 backdrop-blur-md border-b border-neutral-800">
      {/* Coordinate Label */}
      <div className="absolute top-2 left-4 coordinate-label">X:0 Y:0</div>
      
      <div className="container mx-auto px-8 py-2">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img src="/logo.jpeg" alt="Enigma Protocol Logo" className="w-8 h-8 md:w-10 md:h-10 rounded transition-all duration-normal group-hover:shadow-[0_0_15px_rgba(0,224,208,0.5)]" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight hidden md:block">ENIGMA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation Links - Filtered by Auth State */}
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-xs font-mono font-medium transition-all duration-fast uppercase tracking-widest ${
                  isActive(item.path)
                    ? 'text-accent-500 bg-accent-500/10 border border-accent-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Divider */}
            <div className="h-6 w-px bg-neutral-800 mx-2" />

            {/* Social Media Icons */}
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/Demerzels-lab/Enigma-Protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/EnigmaProtocol"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            
            {/* Wallet / Auth Action */}
            {account ? (
              <div className="flex items-center space-x-3 ml-2">
                <div className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md flex items-center space-x-2 group hover:border-accent-500/30 transition-colors">
                  <div className="w-1.5 h-1.5 bg-accent-500 rounded-full shadow-[0_0_8px_rgba(0,224,208,0.8)]"></div>
                  <Wallet className="w-3 h-3 text-neutral-400" />
                  <span className="text-xs font-mono text-neutral-300">{formatAddress(account)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 border border-red-900/30 text-red-500/80 rounded-md text-xs font-mono hover:bg-red-900/10 hover:text-red-400 transition-all uppercase tracking-widest"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* On Landing page, we might want a direct Connect button, or a login button to /auth */}
                {isLandingPage ? (
                   <button
                   onClick={handleAuthRedirect}
                   className="px-6 py-2 bg-accent-500/10 border border-accent-500/50 text-accent-500 rounded-sm font-mono text-xs hover:bg-accent-500/20 hover:border-accent-400 transition-all flex items-center space-x-2 uppercase tracking-widest shadow-[0_0_15px_rgba(0,224,208,0.1)]"
                 >
                   <LogIn className="w-3 h-3" />
                   <span>Login</span>
                 </button>
                ) : (
                  <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="px-6 py-2 bg-white text-black border border-white rounded-sm font-mono text-xs hover:bg-neutral-200 transition-all flex items-center space-x-2 uppercase tracking-widest disabled:opacity-50"
                  >
                    <Wallet className="w-3 h-3" />
                    <span>{isConnecting ? '...' : 'Connect'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-300 hover:text-accent-500 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-neutral-800 mt-2 bg-[#000202]">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-md text-sm font-mono uppercase tracking-widest ${
                  isActive(item.path)
                    ? 'text-accent-500 bg-neutral-900'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {account ? (
              <div className="pt-4 mt-4 border-t border-neutral-800 space-y-3 px-4">
                <div className="flex items-center space-x-2 text-neutral-400 font-mono text-xs">
                  <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                  <span>{formatAddress(account)}</span>
                </div>
                <button
                  onClick={() => {
                    disconnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-red-900/10 border border-red-900/30 text-red-500 rounded-md text-center font-mono text-xs uppercase tracking-widest"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-neutral-800 px-4">
                <button
                  onClick={() => {
                    connectWallet();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isConnecting}
                  className="w-full px-4 py-3 bg-white text-black rounded-md text-center font-mono text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}