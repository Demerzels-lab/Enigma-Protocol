import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Pools from './pages/Pools';
import DeFi from './pages/DeFi';
import Settings from './pages/Settings';
import TerminalGridBackground from './components/TerminalGridBackground';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen"> 
          <TerminalGridBackground /> 
          <Navigation />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/pools" element={<Pools />} />
            <Route path="/defi" element={<DeFi />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;