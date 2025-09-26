import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

// Import existing components but update them for the new design
import { BookingsHistory } from './BookingsHistory';

const BookingsModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainView = location.pathname === '/bookings';

  const handleBack = () => {
    navigate('/bookings');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          {!isMainView ? (
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
          ) : (
            <div></div>
          )}
          
          <h1 className="text-xl font-semibold text-gray-800">Bookings & History</h1>
          <p className="text-sm text-gray-600">Manage sessions and view history</p>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/*" element={<BookingsHistory />} />
      </Routes>
    </div>
  );
};

export default BookingsModule;