export interface PatientDetails {
  fullName: string;
  fatherName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
}

export interface BloodProbability {
  group: string;
  percentage: number;
}

export interface AnalysisResult {
  detected: boolean;
  patientDetails?: PatientDetails;
  fingerprintType?: 'Loop' | 'Whorl' | 'Arch' | 'Composite';
  predictedBloodGroup?: string;
  confidenceScore?: number;
  reasoning?: string;
  probabilities?: BloodProbability[];
  error?: string;
  reportDate?: string;
  reportId?: string;
}

export enum AppState {
  IDLE = 'IDLE',
  FORM = 'FORM',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}