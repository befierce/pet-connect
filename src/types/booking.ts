export interface ClientInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  timezone: string;
  joinedDate: string;
}

export interface PetInfo {
  id: string;
  name: string;
  type: string;
  breed?: string;
  age?: number;
  photo?: string;
  specialNeeds?: string;
  previousSessions: number;
}

export interface SessionDetails {
  id: string;
  type: 'communication' | 'behavioral' | 'healing' | 'mediumship';
  duration: 30 | 60 | 90;
  scheduledDate?: string;
  scheduledTime?: string;
  platform?: 'zoom' | 'meet' | 'phone';
  meetingLink?: string;
  specialRequests?: string;
  packageType?: 'single' | 'package-3' | 'package-5';
}

export interface PaymentInfo {
  amount: number;
  currency: string;
  method: 'bank-transfer' | 'paypal' | 'stripe' | 'cash';
  proofImage?: string;
  transactionId?: string;
  paidAt?: string;
}

export interface SessionNotes {
  preSession: string;
  sessionSummary: string;
  insights: string;
  recommendations: string;
  privateNotes: string;
  rating: number;
  followUpNeeded: boolean;
  nextSteps: string[];
  completedAt?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
  read: boolean;
}

export type BookingStatus = 
  | 'payment-pending' 
  | 'payment-confirmed' 
  | 'scheduled' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no-show';

export interface BookingData {
  id: string;
  clientInfo: ClientInfo;
  petInfo: PetInfo;
  sessionDetails: SessionDetails;
  paymentInfo: PaymentInfo;
  status: BookingStatus;
  notes: SessionNotes;
  communications: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  status?: BookingStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  serviceType?: string[];
  clientName?: string;
  petName?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface SearchFilters extends FilterOptions {
  query: string;
  sortBy: 'date' | 'amount' | 'status' | 'client';
  sortOrder: 'asc' | 'desc';
}