import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const AvailabilityStep: React.FC = () => {
  const { data, updateData } = useOnboarding();
  const [availability, setAvailability] = useState(data.availability || {});

  const weekdays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
  ];

  const toggleTimeSlot = (day: string, time: string) => {
    const daySlots = availability[day] || [];
    const updatedSlots = daySlots.includes(time)
      ? daySlots.filter(slot => slot !== time)
      : [...daySlots, time];
    
    const updatedAvailability = {
      ...availability,
      [day]: updatedSlots
    };
    
    setAvailability(updatedAvailability);
    updateData({ availability: updatedAvailability });
  };

  const toggleAllDay = (day: string) => {
    const daySlots = availability[day] || [];
    const updatedSlots = daySlots.length === timeSlots.length ? [] : [...timeSlots];
    
    const updatedAvailability = {
      ...availability,
      [day]: updatedSlots
    };
    
    setAvailability(updatedAvailability);
    updateData({ availability: updatedAvailability });
  };

  const getTotalSlots = () => {
    return Object.values(availability).reduce((total, slots) => total + slots.length, 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">
          Set Your Availability
        </h2>
        <p className="text-gray-600">
          Choose when you're available for sessions
        </p>
      </div>

      {/* Summary */}
      <div className="bg-purple-50 rounded-xl p-4 text-center">
        <Clock className="w-8 h-8 text-purple-primary mx-auto mb-2" />
        <p className="text-purple-primary font-semibold">
          {getTotalSlots()} time slots selected
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Clients will see these as available booking times
        </p>
      </div>

      {/* Availability Grid */}
      <div className="space-y-4">
        {weekdays.map((day) => {
          const daySlots = availability[day] || [];
          const isAllSelected = daySlots.length === timeSlots.length;
          
          return (
            <div key={day} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{day}</h3>
                <button
                  onClick={() => toggleAllDay(day)}
                  className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                    isAllSelected
                      ? 'bg-purple-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = daySlots.includes(time);
                  
                  return (
                    <button
                      key={time}
                      onClick={() => toggleTimeSlot(day, time)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-purple-primary text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              
              {daySlots.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="bg-teal-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Availability Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• You can always update your availability later</li>
          <li>• Consider different time zones of your clients</li>
          <li>• Leave buffer time between sessions for notes</li>
          <li>• Block out personal time for self-care</li>
        </ul>
      </div>

      {/* Empty State */}
      {getTotalSlots() === 0 && (
        <div className="text-center py-6 bg-gray-50 rounded-xl">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-800 mb-1">No availability set</h3>
          <p className="text-gray-600 text-sm">Select your available time slots above</p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityStep;