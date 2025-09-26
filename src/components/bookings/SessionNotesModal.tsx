import React, { useState } from 'react';
import { X, Save, Star, Calendar } from 'lucide-react';
import { BookingData, SessionNotes } from '../../types/booking';

interface SessionNotesModalProps {
  booking: BookingData;
  onClose: () => void;
  onSave: (notes: SessionNotes) => void;
}

export const SessionNotesModal: React.FC<SessionNotesModalProps> = ({ booking, onClose, onSave }) => {
  const [notes, setNotes] = useState<SessionNotes>(booking.notes);
  const [newNextStep, setNewNextStep] = useState('');

  const handleSave = () => {
    onSave({
      ...notes,
      completedAt: notes.completedAt || new Date().toISOString(),
    });
  };

  const handleRatingChange = (rating: number) => {
    setNotes(prev => ({ ...prev, rating }));
  };

  const addNextStep = () => {
    if (newNextStep.trim()) {
      setNotes(prev => ({
        ...prev,
        nextSteps: [...prev.nextSteps, newNextStep.trim()]
      }));
      setNewNextStep('');
    }
  };

  const removeNextStep = (index: number) => {
    setNotes(prev => ({
      ...prev,
      nextSteps: prev.nextSteps.filter((_, i) => i !== index)
    }));
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(star)}
            className={`w-6 h-6 ${
              star <= notes.rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 hover:text-yellow-300'
            } transition-colors`}
          >
            <Star className="w-6 h-6" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {notes.rating > 0 && `(${notes.rating}/5)`}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Session Notes</h2>
            <p className="text-gray-600">
              {booking.clientInfo.name} & {booking.petInfo.name} • {booking.sessionDetails.type} session
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Session Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Rating
            </label>
            {renderStarRating()}
          </div>

          {/* Pre-Session Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pre-Session Notes
            </label>
            <textarea
              value={notes.preSession}
              onChange={(e) => setNotes(prev => ({ ...prev, preSession: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Notes prepared before the session..."
            />
          </div>

          {/* Session Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Summary *
            </label>
            <textarea
              value={notes.sessionSummary}
              onChange={(e) => setNotes(prev => ({ ...prev, sessionSummary: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="What happened during the session? Key communications and interactions..."
              required
            />
          </div>

          {/* Key Insights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Key Insights & Messages
            </label>
            <textarea
              value={notes.insights}
              onChange={(e) => setNotes(prev => ({ ...prev, insights: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Important messages from the pet, emotional insights, behavioral observations..."
            />
          </div>

          {/* Recommendations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendations for Client
            </label>
            <textarea
              value={notes.recommendations}
              onChange={(e) => setNotes(prev => ({ ...prev, recommendations: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Advice, suggestions, or actions for the pet owner..."
            />
          </div>

          {/* Next Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Next Steps
            </label>
            
            {notes.nextSteps.length > 0 && (
              <div className="space-y-2 mb-3">
                {notes.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-1 px-3 py-2 bg-gray-50 rounded border text-sm">
                      {step}
                    </span>
                    <button
                      onClick={() => removeNextStep(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex space-x-2">
              <input
                type="text"
                value={newNextStep}
                onChange={(e) => setNewNextStep(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNextStep()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a next step or action item..."
              />
              <button
                onClick={addNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Private Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Private Notes
              <span className="text-xs text-gray-500 ml-2">(Not shared with client)</span>
            </label>
            <textarea
              value={notes.privateNotes}
              onChange={(e) => setNotes(prev => ({ ...prev, privateNotes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Personal observations, client notes, follow-up reminders..."
            />
          </div>

          {/* Follow-up Required */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="followUpNeeded"
              checked={notes.followUpNeeded}
              onChange={(e) => setNotes(prev => ({ ...prev, followUpNeeded: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="followUpNeeded" className="text-sm font-medium text-gray-700">
              Follow-up session recommended
            </label>
          </div>

          {/* Session Completion Time */}
          {notes.completedAt && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <Calendar className="w-4 h-4" />
              <span>
                Session completed on {new Date(notes.completedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              These notes will be saved and a summary will be sent to the client.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};