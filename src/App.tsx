import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { WalletProvider, useWallet } from './contexts/WalletContext';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Pools from './pages/Pools';
import DeFi from './pages/DeFi';
import Settings from './pages/Settings';
import TerminalGridBackground from './components/TerminalGridBackground';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { account } = useWallet();
  const location = useLocation();

  if (!account) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen"> 
          <Navigation />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes - Only accessible with connected wallet */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/marketplace" 
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pools" 
              element={
                <ProtectedRoute>
                  <Pools />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/defi" 
              element={
                <ProtectedRoute>
                  <DeFi />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;