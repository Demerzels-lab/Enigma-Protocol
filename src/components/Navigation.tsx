import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, Github, Twitter, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Privacy Pools', path: '/pools' },
    { name: 'DeFi', path: '/defi' },
    { name: 'Settings', path: '/settings' },
  ];

  // Check if we're on landing page
  const isLandingPage = location.pathname === '/';

  const isActive = (path: string) => location.pathname === path;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-50/90 backdrop-blur-md border-b terminal-border">
      {/* Coordinate Label */}
      <div className="absolute top-2 left-4 coordinate-label">X:0 Y:0</div>
      
      <div className="container mx-auto px-8 py-2">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img src="/logo.jpeg" alt="Masquerade Logo" className="w-8 h-8 md:w-24 md:h-24 rounded transition-all duration-normal group-hover:glow-purple" />
              <div className="absolute inset-0 blur-lg opacity-30 group-hover:opacity-50 transition-opacity">
                <img src="/logo.jpeg" alt="Masquerade Logo" className="w-8 h-8 rounded" />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Show full navbar for non-landing pages */}
            {!isLandingPage && (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-fast uppercase tracking-wider ${
                      isActive(item.path)
                        ? 'text-accent-500 bg-neutral-100 terminal-border'
                        : 'text-neutral-300 hover:text-text-primary hover:terminal-border hover:bg-neutral-100/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
            
            {/* Social Media Icons - Always show */}
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/Demerzels-lab/masquerade-privacy-defi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-300 hover:text-accent-500 transition-all duration-fast hover:terminal-border hover:bg-neutral-100/50 rounded-md"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/masqueradedefi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-neutral-300 hover:text-accent-500 transition-all duration-fast hover:terminal-border hover:bg-neutral-100/50 rounded-md"
                aria-label="Twitter/X"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            
            {account ? (
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 bg-neutral-100 rounded-md flex items-center space-x-2 terminal-border">
                  <div className="w-2 h-2 bg-semantic-success rounded-full animate-pulse-glow shadow-glow"></div>
                  <Wallet className="w-4 h-4 text-accent-500" />
                  <span className="text-sm font-mono text-text-primary">{formatAddress(account)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-semantic-error/20 border border-semantic-error/50 text-semantic-error rounded-md text-sm font-medium hover:bg-semantic-error/30 transition-all duration-fast uppercase tracking-wider"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="px-6 py-2 bg-accent-500/20 border border-accent-500/50 text-accent-500 rounded-md font-medium hover:bg-accent-500/30 hover:border-accent-500 transition-all duration-fast hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 uppercase tracking-wider"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}</span>
              </button>
            )}
            
            {/* Entry Button to Dashboard - Always show */}
            <Link
              to="/dashboard"
              className="px-6 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded-md font-medium hover:bg-purple-500/30 hover:border-purple-500 transition-all duration-fast hover:shadow-glow uppercase tracking-wider flex items-center space-x-2"
            >
              <span>ENTER</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
          <div className="md:hidden py-4 space-y-2 border-t terminal-border mt-2">
            {/* Show full navbar for non-landing pages */}
            {!isLandingPage && (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-md text-sm font-medium transition-all duration-fast uppercase tracking-wider ${
                      isActive(item.path)
                        ? 'text-accent-500 bg-neutral-100 terminal-border'
                        : 'text-neutral-300 hover:text-text-primary hover:bg-neutral-100/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
            
            {/* Entry Button to Dashboard - Mobile */}
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded-md text-center font-medium uppercase tracking-wider"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>ENTER DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
            
            {/* Social Media Icons - Mobile */}
            <div className="px-4 py-3 border-t terminal-border mt-4 pt-4">
              <div className="flex items-center justify-center space-x-6">
                <a
                  href="https://github.com/Demerzels-lab/masquerade-privacy-defi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-neutral-300 hover:text-accent-500 transition-all duration-fast hover:terminal-border hover:bg-neutral-100/50 rounded-md"
                  aria-label="GitHub"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="https://x.com/masqueradedefi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 text-neutral-300 hover:text-accent-500 transition-all duration-fast hover:terminal-border hover:bg-neutral-100/50 rounded-md"
                  aria-label="Twitter/X"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
            
            {account ? (
              <div className="space-y-2">
                <div className="px-4 py-3 bg-neutral-100 rounded-md flex items-center justify-center space-x-2 terminal-border">
                  <Wallet className="w-4 h-4 text-accent-500" />
                  <span className="text-sm font-mono">{formatAddress(account)}</span>
                </div>
                <button
                  onClick={() => {
                    disconnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-semantic-error/20 border border-semantic-error/50 text-semantic-error rounded-md text-center font-medium uppercase tracking-wider"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  connectWallet();
                  setMobileMenuOpen(false);
                }}
                disabled={isConnecting}
                className="w-full px-4 py-3 bg-accent-500/20 border border-accent-500/50 text-accent-500 rounded-md text-center font-medium disabled:opacity-50 uppercase tracking-wider"
              >
                {isConnecting ? 'CONNECTING...' : 'CONNECT WALLET'}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
