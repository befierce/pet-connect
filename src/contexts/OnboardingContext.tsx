import React, { createContext, useContext, useState } from 'react';

interface Service {
  id: string;
  title: string;
  duration: number;
  price: number;
  description: string;
}

interface OnboardingData {
  role: 'communicator' | 'parent' | '';
  termsAccepted: boolean;
  
  // Essential Profile (Step 1)
  displayName: string;
  location: string;
  experienceLevel: 'beginner' | 'intermediate' | 'expert' | '';
  
  // Service Specialization (Step 2)
  animalTypes: string[];
  serviceCategories: string[];
  
  // First Service (Step 3)
  firstService: Service | null;
  
  // Contact Preferences (Step 4)
  contactMethods: {
    email: boolean;
    phone: boolean;
    whatsapp: boolean;
    video: boolean;
    inPerson: boolean;
  };
  phoneNumber?: string;
  
  // Optional enhancements (post-setup)
  profilePicture?: string;
  bio?: string;
  certifications: any[];
  portfolioImages: string[];
  introVideo?: string;
  socialLinks: {
    website?: string;
    instagram?: string;
    youtube?: string;
  };
}

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  data: OnboardingData;
  updateData: (stepData: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isStepComplete: (step: number) => boolean;
  canSkipStep: (step: number) => boolean;
  skipStep: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

const initialData: OnboardingData = {
  role: '',
  termsAccepted: false,
  
  // Essential Profile
  displayName: '',
  location: '',
  experienceLevel: '',
  
  // Service Specialization
  animalTypes: [],
  serviceCategories: [],
  
  // First Service
  firstService: null,
  
  // Contact Preferences
  contactMethods: {
    email: false,
    phone: false,
    whatsapp: false,
    video: false,
    inPerson: false,
  },
  
  // Optional enhancements
  certifications: [],
  portfolioImages: [],
  socialLinks: {},
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  
  // Total steps: 5 profile steps
  const totalSteps = 5;

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const skipStep = () => {
    if (canSkipStep(currentStep)) {
      nextStep();
    }
  };

  const completeOnboarding = () => {
    // Mark onboarding as complete and redirect to dashboard
    console.log('Onboarding completed with data:', data);
    // Clear onboarding data after completion
    setData(initialData);
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: // Role + Terms
        return !!(data.role && data.termsAccepted);
      case 2: // Essential identity
        return !!(data.displayName && data.location && data.experienceLevel);
      case 3: // Service specialization
        return data.animalTypes.length > 0 && data.serviceCategories.length > 0;
      case 4: // First service
        return !!data.firstService;
      case 5: // Contact preferences
        const hasContactMethod = Object.values(data.contactMethods).some(method => method);
        const needsPhone = data.contactMethods.phone || data.contactMethods.whatsapp;
        const hasPhoneWhenNeeded = !needsPhone || (data.phoneNumber && data.phoneNumber.trim() !== '');
        
        console.log('Contact preferences step completion check:', {
          hasContactMethod,
          needsPhone,
          hasPhoneWhenNeeded,
          phoneNumber: data.phoneNumber,
          contactMethods: data.contactMethods
        });
        
        return hasContactMethod && hasPhoneWhenNeeded;
      default:
        return false;
    }
  };

  const canSkipStep = (step: number): boolean => {
    // Only step 3 can be skipped (service specialization can be generic)
    return step === 3;
  };

  const value = {
    currentStep,
    totalSteps,
    data,
    updateData,
    nextStep,
    prevStep,
    goToStep,
    isStepComplete,
    canSkipStep,
    skipStep,
    completeOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};