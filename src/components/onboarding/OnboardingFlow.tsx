import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import RoleSelectionStep from './steps/RoleSelectionStep';

// Profile Setup Steps
import EssentialIdentityStep from './steps/EssentialIdentityStep';
import ServiceSpecializationStep from './steps/ServiceSpecializationStep';
import FirstServiceStep from './steps/FirstServiceStep';
import ContactPreferencesStep from './steps/ContactPreferencesStep';

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    totalSteps, 
    data,
    nextStep, 
    prevStep, 
    isStepComplete, 
    canSkipStep, 
    skipStep,
    completeOnboarding 
  } = useOnboarding();
  const { user, updateProfile } = useAuth();

  const steps = [
    { component: RoleSelectionStep, title: 'Tell Us About You', subtitle: 'How will you use PetConnect?' },
    { component: EssentialIdentityStep, title: 'Your Profile', subtitle: 'Help pet families find you' },
    { component: ServiceSpecializationStep, title: 'Your Specialties', subtitle: 'What animals do you work with?' },
    { component: FirstServiceStep, title: 'Your First Service', subtitle: 'Create your signature offering' },
    { component: ContactPreferencesStep, title: 'How Clients Reach You', subtitle: 'Choose your preferred methods' },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;
  const isLastStep = currentStep === totalSteps;
  const canProceed = isStepComplete(currentStep);
  const isProfileStep = true; // All remaining steps are profile steps

  const handleNext = () => {
    if (isLastStep) {
      console.log('=== COMPLETING ONBOARDING ===');
      console.log('Final onboarding data validation:', {
        role: data.role,
        displayName: data.displayName,
        location: data.location,
        experienceLevel: data.experienceLevel,
        animalTypes: data.animalTypes,
        serviceCategories: data.serviceCategories,
        contactMethods: data.contactMethods,
        phoneNumber: data.phoneNumber,
        hasRequiredContactInfo: data.contactMethods.phone || data.contactMethods.whatsapp ? !!data.phoneNumber : true
      });
      
      // Validate required fields before proceeding
      if (!data.role || !data.displayName || !data.location || !data.experienceLevel) {
        console.error('Missing required fields for onboarding completion');
        return;
      }
      
      const hasContactMethod = Object.values(data.contactMethods).some(method => method);
      if (!hasContactMethod) {
        console.error('No contact method selected');
        return;
      }
      
      const needsPhone = data.contactMethods.phone || data.contactMethods.whatsapp;
      if (needsPhone && !data.phoneNumber) {
        console.error('Phone number required for selected contact methods');
        return;
      }
      
      console.log('Onboarding data being sent to updateProfile:', {
        role: data.role,
        display_name: data.displayName || user?.user_metadata?.full_name || '',
        location: data.location,
        experience_level: data.experienceLevel,
        animal_types: data.animalTypes,
        service_categories: data.serviceCategories,
        contact_methods: data.contactMethods,
        phone_number: data.phoneNumber,
      });
      
      // Mark profile as complete and redirect to dashboard
      const profileUpdates = {
        role: data.role,
        display_name: data.displayName || user?.user_metadata?.full_name || '',
        location: data.location || '',
        experience_level: data.experienceLevel || 'beginner',
        animal_types: data.animalTypes || [],
        service_categories: data.serviceCategories || [],
        contact_methods: data.contactMethods || {},
        phone_number: data.phoneNumber || '',
      };
      
      console.log('About to call updateProfile with:', profileUpdates);
      
      updateProfile(profileUpdates).then(() => {
        console.log('Profile update successful, completing onboarding...');
        console.log('About to call completeOnboarding and navigate to dashboard');
        
        // Save first service if it exists
        const saveAdditionalData = async () => {
          try {
            // Save first service
            if (data.firstService && data.firstService.title && user) {
              console.log('Saving first service:', data.firstService);
              const { error: serviceError } = await supabase
                .from('services')
                .insert({
                  communicator_id: user.id,
                  title: data.firstService.title,
                  description: data.firstService.description,
                  duration: data.firstService.duration,
                  price: data.firstService.price,
                  service_type: data.firstService.title.toLowerCase().includes('communication') ? 'communication' :
                               data.firstService.title.toLowerCase().includes('behavioral') ? 'behavioral' :
                               data.firstService.title.toLowerCase().includes('healing') ? 'healing' : 'communication',
                  is_active: true
                });
              
              if (serviceError) {
                console.error('Error saving first service:', serviceError);
              } else {
                console.log('First service saved successfully');
              }
            }
            
            // Save certifications if they exist
            if (data.certifications && data.certifications.length > 0 && user) {
              console.log('Saving certifications:', data.certifications);
              const certificationsToInsert = data.certifications.map(cert => ({
                user_id: user.id,
                name: cert.name,
                issuer: cert.issuer,
                issue_date: cert.date,
                certificate_image: cert.imageUrl || null,
                is_verified: false
              }));
              
              const { error: certError } = await supabase
                .from('certifications')
                .insert(certificationsToInsert);
              
              if (certError) {
                console.error('Error saving certifications:', certError);
              } else {
                console.log('Certifications saved successfully');
              }
            }
          } catch (error) {
            console.error('Error saving additional onboarding data:', error);
          }
        };
        
        saveAdditionalData().finally(() => {
          completeOnboarding();
          navigate('/dashboard');
        });
      }).catch((error) => {
        console.error('Error updating profile during onboarding completion:', error);
        // Still navigate to dashboard even if profile update fails
        navigate('/dashboard');
      });
    } else {
      nextStep();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      prevStep();
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  const getStepCategory = () => {
    return 'Profile Setup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-cream to-peach-50">
      {/* Progress Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-sm mx-auto">
          {/* Step Category */}
          <div className="text-center mb-2">
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              {getStepCategory()}
            </span>
          </div>
          
          {/* Title and Subtitle */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-bold text-gray-800 font-poppins">
              {steps[currentStep - 1].title}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {steps[currentStep - 1].subtitle}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-xs text-purple-600 font-medium">
                {Math.round(getProgressPercentage())}% complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-4 pb-32">
        <div className="max-w-sm mx-auto">
          <CurrentStepComponent />
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between gap-3">
            {/* Back Button */}
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center space-x-2 px-4 py-3 text-gray-600 font-medium hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}
            
            {/* Skip Button (if applicable) */}
            {canSkipStep(currentStep) && (
              <button
                onClick={skipStep}
                className="px-4 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Skip for now
              </button>
            )}
            
            {/* Continue Button */}
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg disabled:shadow-none flex-shrink-0"
            >
              <span>{isLastStep ? 'Complete Setup' : 'Continue'}</span>
              {!isLastStep && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Helpful Text */}
          <div className="text-center mt-3">
            <p className="text-xs text-gray-500">
              ✨ You can always update this later in your profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;