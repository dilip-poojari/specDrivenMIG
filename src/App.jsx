import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Theme, Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction } from '@carbon/react';
import { Menu, Close } from '@carbon/icons-react';
import Navigation from './components/Navigation';
import MigrationDashboard from './screens/MigrationDashboard';
import ConnectAccount from './screens/ConnectAccount';
import ResourceInventory from './screens/ResourceInventory';
import Recommendation from './screens/Recommendation';
import ProvisionVPC from './screens/ProvisionVPC';
import DataMigration from './screens/DataMigration';
import Validation from './screens/Validation';
import './App.css';

function App() {
  const [isAccountConnected, setIsAccountConnected] = useState(true);
  const [justScanned, setJustScanned] = useState(false);
  const [navOpen, setNavOpen] = useState(true);

  return (
    <Theme theme="g100">
      <Router basename="/specDrivenMIG">
        <div className="app">
          <Header aria-label="IBM Cloud Migration Hub">
            <HeaderGlobalAction
              aria-label="Toggle navigation"
              onClick={() => setNavOpen(!navOpen)}
            >
              {navOpen ? <Close size={20} /> : <Menu size={20} />}
            </HeaderGlobalAction>
            <HeaderName prefix="IBM">
              Cloud Migration Hub
            </HeaderName>
          </Header>
          
          <Navigation isOpen={navOpen} onToggle={() => setNavOpen(!navOpen)} />
          
          <Routes>
            <Route
              path="/"
              element={
                isAccountConnected ?
                  <MigrationDashboard showScanSuccess={justScanned} onDismissScanSuccess={() => setJustScanned(false)} /> :
                  <Navigate to="/connect" replace />
              }
            />
            <Route
              path="/connect"
              element={<ConnectAccount onConnect={() => { setIsAccountConnected(true); setJustScanned(true); }} />}
            />
            <Route path="/inventory" element={<ResourceInventory />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/provision" element={<ProvisionVPC />} />
            <Route path="/migration" element={<DataMigration />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </Theme>
  );
}

export default App;

// Made with Bob
