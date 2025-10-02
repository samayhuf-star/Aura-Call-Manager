import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Campaigns from './components/Campaigns';
import Numbers from './components/Numbers';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Targets from './components/Targets';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('Dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Campaigns':
        return <Campaigns />;
      case 'Numbers':
        return <Numbers />;
      case 'Targets':
        return <Targets />;
      case 'Reports':
        return <Reports />;
      case 'Settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background-dark text-text-primary">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
