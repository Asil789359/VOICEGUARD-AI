export type DetectionStatus = 'LIKELY_HUMAN' | 'POSSIBLE_VOICE_CLONE' | 'LIKELY_SYNTHETIC' | 'UNCERTAIN';
export type ThreatLevel = 'LOW' | 'MODERATE' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL';
export type AppLanguage = 'en' | 'ta';

export interface AcousticFeatures {
  spectralCentroid: number; // Hz (0 - 8000)
  spectralFlatness: number; // (0 - 1)
  zeroCrossingRate: number; // (0 - 0.5)
  pitchStability: number; // % (0 - 100)
  roboticArtifacts: number; // % (0 - 100)
  prosodyVariance: number; // % (0 - 100)
  temporalContinuity: number; // % (0 - 100)
}

export interface ScamSignal {
  type: 'urgency' | 'money_request' | 'otp_pin' | 'impersonation' | 'threat' | 'suspicious_link';
  labelEn: string;
  labelTa: string;
  weight: number; // 0 - 100
}

export interface ScamAnalysis {
  scamScore: number; // 0 - 100
  threatLevel: ThreatLevel;
  transcript: string;
  detectedSignals: ScamSignal[];
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  audioName: string;
  durationSeconds: number;
  authenticityScore: number; // 0 - 100 (0 = human, 100 = synthetic)
  status: DetectionStatus;
  confidence: number; // 0 - 100
  acousticFeatures: AcousticFeatures;
  scamAnalysis: ScamAnalysis;
  overallThreat: ThreatLevel;
  explanationEn: string;
  explanationTa: string;
  keySignals: string[];
  isControlledSample?: boolean;
}

export interface ControlledSample {
  id: string;
  title: string;
  subtitle: string;
  tag: 'Test A' | 'Test B' | 'Test C';
  type: 'human' | 'synthetic' | 'clone';
  audioUrl?: string;
  transcript: string;
  expectedResult: AnalysisResult;
}
