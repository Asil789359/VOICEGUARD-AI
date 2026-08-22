import { ControlledSample } from '../types';

export const CONTROLLED_SAMPLES: ControlledSample[] = [
  {
    id: 'sample-human-a',
    tag: 'Test A',
    title: 'Genuine Human Voice',
    subtitle: 'Natural speech, organic pitch variance & prosody',
    type: 'human',
    transcript: 'Hey Mom, just calling to check if you reached home safely from the station. Call me back when you get a chance!',
    expectedResult: {
      id: 'res-test-a',
      timestamp: Date.now(),
      audioName: 'Test A — Human Voice Sample.wav',
      durationSeconds: 6,
      authenticityScore: 18,
      status: 'LIKELY_HUMAN',
      confidence: 96,
      acousticFeatures: {
        spectralCentroid: 2450,
        spectralFlatness: 0.12,
        zeroCrossingRate: 0.08,
        pitchStability: 42,
        roboticArtifacts: 4,
        prosodyVariance: 88,
        temporalContinuity: 92
      },
      scamAnalysis: {
        scamScore: 5,
        threatLevel: 'LOW',
        transcript: 'Hey Mom, just calling to check if you reached home safely from the station. Call me back when you get a chance!',
        detectedSignals: []
      },
      overallThreat: 'LOW',
      explanationEn: 'This recording exhibits natural human speech patterns: organic pitch modulations, consistent micro-pauses, and standard spectral harmonics without synthetic neural vocoder artifacts.',
      explanationTa: 'இந்த குரல் பதிவில் இயற்கையான மனித பேச்சு முறைகள், சாதாரண சுருதி வேறுபாடுகள் மற்றும் தெளிவான ஒலி அலைகள் உள்ளன.',
      keySignals: [
        'Natural fundamental frequency (F0) contour',
        'Organic breath & pause micro-timing',
        'Normal spectral roll-off without phase distortion',
        'No social engineering threat indicators detected'
      ],
      isControlledSample: true
    }
  },
  {
    id: 'sample-synth-b',
    tag: 'Test B',
    title: 'AI Synthetic Speech Scam',
    subtitle: 'Neural vocoder generated, robotic phase artifacts',
    type: 'synthetic',
    transcript: 'Urgent notice from State Bank Security. Your primary account is suspended. Share your 6-digit OTP code immediately to unblock your account.',
    expectedResult: {
      id: 'res-test-b',
      timestamp: Date.now(),
      audioName: 'Test B — AI Synthetic Bank Scam.mp3',
      durationSeconds: 8,
      authenticityScore: 94,
      status: 'LIKELY_SYNTHETIC',
      confidence: 94,
      acousticFeatures: {
        spectralCentroid: 4800,
        spectralFlatness: 0.48,
        zeroCrossingRate: 0.22,
        pitchStability: 96,
        roboticArtifacts: 89,
        prosodyVariance: 14,
        temporalContinuity: 98
      },
      scamAnalysis: {
        scamScore: 92,
        threatLevel: 'CRITICAL',
        transcript: 'Urgent notice from State Bank Security. Your primary account is suspended. Share your 6-digit OTP code immediately to unblock your account.',
        detectedSignals: [
          {
            type: 'otp_pin',
            labelEn: 'OTP / Credential Request',
            labelTa: 'OTP / கடவுச்சொல் கோரிக்கை',
            weight: 95
          },
          {
            type: 'urgency',
            labelEn: 'High Pressure Urgency',
            labelTa: 'அவசர நிலை மனஅழுத்தம்',
            weight: 85
          },
          {
            type: 'impersonation',
            labelEn: 'Bank Authority Impersonation',
            labelTa: 'வங்கி அதிகாரி போல் நடித்தல்',
            weight: 90
          }
        ]
      },
      overallThreat: 'CRITICAL',
      explanationEn: 'HIGH SYNTHETIC VOICE RISK. Audio exhibits telltale neural text-to-speech signatures: unnatural pitch monotony, robotic high-frequency spectral phase discontinuities, and high-risk bank credential phishing language.',
      explanationTa: 'எச்சரிக்கை: இந்த குரல் செயற்கை AI மூலம் உருவாக்கப்பட்டது. இதில் OTP மற்றும் வங்கி கணக்கு தகவல்களை கேட்கும் மோசடி அறிகுறிகள் உள்ளன.',
      keySignals: [
        'High-frequency spectral centroid anomaly (4800 Hz)',
        'Abnormal pitch rigidity (96% static F0 contour)',
        'Neural vocoder frame boundary artifacts',
        'CRITICAL: Demands confidential OTP digits'
      ],
      isControlledSample: true
    }
  },
  {
    id: 'sample-clone-c',
    tag: 'Test C',
    title: 'Voice-Cloned Family Scam',
    subtitle: 'Zero-shot cloned voice + urgent money transfer demand',
    type: 'clone',
    transcript: 'Hi son, I was in a terrible road accident. I am at the clinic and urgently need 50,000 rupees sent to this UPI number right away. Don\'t call back, just send the money!',
    expectedResult: {
      id: 'res-test-c',
      timestamp: Date.now(),
      audioName: 'Test C — Voice Cloned Emergency Fraud.m4a',
      durationSeconds: 10,
      authenticityScore: 89,
      status: 'POSSIBLE_VOICE_CLONE',
      confidence: 91,
      acousticFeatures: {
        spectralCentroid: 3900,
        spectralFlatness: 0.38,
        zeroCrossingRate: 0.18,
        pitchStability: 88,
        roboticArtifacts: 82,
        prosodyVariance: 28,
        temporalContinuity: 90
      },
      scamAnalysis: {
        scamScore: 96,
        threatLevel: 'CRITICAL',
        transcript: 'Hi son, I was in a terrible road accident. I am at the clinic and urgently need 50,000 rupees sent to this UPI number right away. Don\'t call back, just send the money!',
        detectedSignals: [
          {
            type: 'money_request',
            labelEn: 'Urgent UPI Money Transfer (₹50,000)',
            labelTa: 'அவசர பணப்பரிமாற்றம் கோரிக்கை (₹50,000)',
            weight: 98
          },
          {
            type: 'impersonation',
            labelEn: 'Family Member Impersonation',
            labelTa: 'குடும்ப உறுப்பினர் போல் நடித்தல்',
            weight: 92
          },
          {
            type: 'urgency',
            labelEn: 'Coercive Emergency Claim',
            labelTa: 'அவசர விபத்து கூற்று',
            weight: 90
          }
        ]
      },
      overallThreat: 'CRITICAL',
      explanationEn: 'POSSIBLE VOICE CLONE & IMPERSONATION SCAM. Spectral characteristics indicate a cloned target voice overlay with synthetic prosodic flattening, paired with extreme emergency financial coercion.',
      explanationTa: 'எச்சரிக்கை: குடும்ப உறுப்பினர் குரலை AI மூலம் போலியாக உருவாக்கி (Voice Clone) ₹50,000 பணம் கேட்கும் மோசடி கண்டறியப்பட்டது.',
      keySignals: [
        'Voice cloning timbre synthesis markers',
        'Synthetic breath noise insertion anomaly',
        'High-pressure social engineering coercion (₹50,000 demand)',
        'Direct instruction to avoid secondary phone verification'
      ],
      isControlledSample: true
    }
  }
];
