import React, { useState, useEffect } from 'react';
import { Calendar, Users, Upload, Settings as SettingsIcon, List, BarChart3 } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { BirthdayList } from './components/BirthdayList';
import { PersonForm } from './components/PersonForm';
import { FileUpload } from './components/FileUpload';
import { Settings } from './components/Settings';
import { usePeople } from './hooks/usePeople';
import { requestNotificationPermission } from './utils/notifications';

type View = 'dashboard' | 'list' | 'add' | 'import' | 'settings';

function App() {
  const { people, settings, loading, addPerson, updatePerson, deletePerson, importPeople, updateSettings, markCelebrated } = usePeople();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Request notification permission on app load
    requestNotificationPermission();

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'list', label: 'All Birthdays', icon: List },
    { id: 'add', label: 'Add Person', icon: Users },
    { id: 'import', label: 'Import Excel', icon: Upload },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Birthday Tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">Birthday Tracker</h1>
            </div>
            
            {isInstallable && (
              <button
                onClick={handleInstallApp}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Install App
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as View)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      currentView === item.id
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {currentView === 'dashboard' && (
              <Dashboard people={people} />
            )}
            
            {currentView === 'list' && (
              <BirthdayList 
                people={people} 
                onUpdatePerson={updatePerson}
                onDeletePerson={deletePerson}
                onMarkCelebrated={markCelebrated}
              />
            )}
            
            {currentView === 'add' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Person</h2>
                <PersonForm 
                  onSubmit={(person) => {
                    addPerson(person);
                    setCurrentView('list');
                  }}
                  onCancel={() => setCurrentView('list')}
                />
              </div>
            )}
            
            {currentView === 'import' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Import from Excel</h2>
                <FileUpload 
                  onImport={(newPeople) => {
                    importPeople(newPeople);
                    setCurrentView('list');
                  }}
                />
              </div>
            )}
            
            {currentView === 'settings' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                <Settings 
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  people={people}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;