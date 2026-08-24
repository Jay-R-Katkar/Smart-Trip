import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ItineraryPlanner } from './components/ItineraryPlanner';
import { ItineraryDisplay } from './components/ItineraryDisplay';
import { HotelSearch } from './components/HotelSearch';
import { BudgetTracker } from './components/BudgetTracker';
import { AlertsPanel } from './components/AlertsPanel';
import { GuideProfiles } from './components/GuideProfiles';
import { SafetyDashboard } from './components/SafetyDashboard';
import { SOSModal } from './components/SOSModal';
import { SavedTripsModal } from './components/SavedTripsModal';
import { 
  getDestinations, 
  generateItinerary, 
  getAlerts,
  getBudgetSummary 
} from './services/api';
import { Sparkles, Shield, Heart, ExternalLink, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [destinations, setDestinations] = useState([]);
  const [itineraryData, setItineraryData] = useState(null);
  const [currentTripId, setCurrentTripId] = useState(1);
  const [selectedDestination, setSelectedDestination] = useState('Paris');
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isSavedTripsOpen, setIsSavedTripsOpen] = useState(false);
  const [isLoadingItinerary, setIsLoadingItinerary] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(2);

  // Load destinations & alerts on initial load
  useEffect(() => {
    async function loadInitialData() {
      try {
        const destRes = await getDestinations();
        if (destRes?.destinations) {
          setDestinations(destRes.destinations);
        }
        const alertsRes = await getAlerts('Paris');
        if (alertsRes?.alerts) {
          setUnreadAlertsCount(alertsRes.alerts.length);
        }
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    }
    loadInitialData();
  }, []);

  // Handle Itinerary Generation
  const handleGenerateItinerary = async (formData) => {
    setIsLoadingItinerary(true);
    setSelectedDestination(formData.destination);
    try {
      const res = await generateItinerary(formData);
      if (res && res.success) {
        setItineraryData(res);
        setActiveTab('itinerary');
      }
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
    } finally {
      setIsLoadingItinerary(false);
    }
  };

  // Reset to create new itinerary
  const handleResetItinerary = () => {
    setItineraryData(null);
  };

  // Load a saved trip
  const handleSelectTrip = (trip) => {
    setSelectedDestination(trip.destination);
    setCurrentTripId(trip.id || 1);
    if (trip.itinerary) {
      try {
        const parsed = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : trip.itinerary;
        setItineraryData(parsed);
      } catch {
        setItineraryData(null);
      }
    }
    setActiveTab('itinerary');
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Main Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSOSClick={() => setIsSOSOpen(true)}
        onSavedTripsClick={() => setIsSavedTripsOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        selectedCity={selectedDestination}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* MODULE 1: ITINERARY PLANNER & DISPLAY */}
        {activeTab === 'itinerary' && (
          <div>
            {itineraryData ? (
              <ItineraryDisplay 
                itinerary={itineraryData} 
                onBack={handleResetItinerary}
                onSaveSuccess={() => setUnreadAlertsCount(prev => prev + 1)}
              />
            ) : (
              <ItineraryPlanner 
                destinations={destinations}
                onGenerateItinerary={handleGenerateItinerary}
                isLoading={isLoadingItinerary}
              />
            )}
          </div>
        )}

        {/* MODULE 2: HOTELS & FLIGHTS SEARCH */}
        {activeTab === 'hotels' && (
          <HotelSearch 
            selectedCity={selectedDestination} 
            tripId={currentTripId}
          />
        )}

        {/* MODULE 3: BUDGET TRACKER */}
        {activeTab === 'budget' && (
          <BudgetTracker 
            tripId={currentTripId} 
            destination={selectedDestination}
          />
        )}

        {/* MODULE 4: SMART ALERTS */}
        {activeTab === 'alerts' && (
          <AlertsPanel 
            city={selectedDestination} 
          />
        )}

        {/* MODULE 5: LOCAL GUIDES MATCHING */}
        {activeTab === 'guides' && (
          <GuideProfiles 
            city={selectedDestination} 
            tripId={currentTripId}
          />
        )}

        {/* MODULE 6: SAFETY & SOS COMMAND DASHBOARD */}
        {activeTab === 'safety' && (
          <SafetyDashboard 
            city={selectedDestination} 
            onTriggerSOS={() => setIsSOSOpen(true)}
          />
        )}
      </main>

      {/* EMERGENCY SOS POPUP MODAL */}
      <SOSModal 
        isOpen={isSOSOpen} 
        onClose={() => setIsSOSOpen(false)}
        city={selectedDestination}
      />

      {/* SAVED TRIPS MODAL */}
      <SavedTripsModal 
        isOpen={isSavedTripsOpen}
        onClose={() => setIsSavedTripsOpen(false)}
        onSelectTrip={handleSelectTrip}
      />

      {/* Modern Hackathon Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
              ST
            </div>
            <span className="font-bold text-slate-200">SmartTrip</span>
            <span className="text-slate-500">• 48-Hour Travel Automation Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-emerald-400" /> Pure Logic + APIs</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-400" /> Haversine Optimization</span>
            <span className="text-slate-700">|</span>
            <span>Razorpay Sandbox</span>
          </div>

          <p className="text-slate-500">
            Built with ❤️ for Travel Hackathon 2026
          </p>
        </div>
      </footer>
    </div>
  );
}