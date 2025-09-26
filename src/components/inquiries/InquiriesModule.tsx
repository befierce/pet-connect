import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';

// Components
import InquiriesList from './InquiriesList';
import InquiryDetails from './InquiryDetails';
import ChatView from './ChatView';

const InquiriesModule: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMainView = location.pathname === '/inquiries';

  const handleBack = () => {
    if (location.pathname.includes('/chat/')) {
      // Go back to inquiry details
      const inquiryId = location.pathname.split('/')[2];
      navigate(`/inquiries/${inquiryId}`);
    } else if (location.pathname.includes('/inquiries/')) {
      // Go back to inquiries list
      navigate('/inquiries');
    }
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
          
          <h1 className="text-xl font-semibold text-gray-800">
            {location.pathname.includes('/chat/') ? 'Chat' : 
             location.pathname.includes('/inquiries/') && !isMainView ? 'Inquiry Details' : 
             'Inquiries'}
          </h1>
          
          <div className="w-10"></div>
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<InquiriesList />} />
        <Route path="/:inquiryId" element={<InquiryDetails />} />
        <Route path="/:inquiryId/chat" element={<ChatView />} />
      </Routes>
    </div>
  );
};

export default InquiriesModule;