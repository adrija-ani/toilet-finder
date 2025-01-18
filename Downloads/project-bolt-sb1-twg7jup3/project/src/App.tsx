import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import Map from './components/Map';
import ToiletDetails from './components/ToiletDetails';
import type { ToiletLocation } from './types';

function App() {
  const [selectedToilet, setSelectedToilet] = useState<ToiletLocation | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <MapPin className="text-blue-500" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Toilet Finder</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Map onToiletSelect={setSelectedToilet} />
          </div>
          <div>
            {selectedToilet ? (
              <ToiletDetails
                toilet={selectedToilet}
                onClose={() => setSelectedToilet(null)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <p className="text-gray-500 text-center">
                  Select a toilet on the map to see details
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;