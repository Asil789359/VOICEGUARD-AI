import { ScamAnalysis, ScamSignal, ThreatLevel } from '../types';

export class ScamDetector {
  private scamPatterns: Array<{
    regex: RegExp;
    type: ScamSignal['type'];
    labelEn: string;
    labelTa: string;
    weight: number;
  }> = [
    {
      regex: /(otp|one time password|pin|cvv|password|verification code|share code|6-digit|4-digit)/i,
      type: 'otp_pin',
      labelEn: 'OTP / Credential Harvesting Request',
      labelTa: 'OTP / ரகசிய குறியீடு கோரிக்கை',
      weight: 95
    },
    {
      regex: /(transfer|send money|₹|rupees|upi|google pay|phonepe|paytm|bank account|deposit|₹50,000|50000|cash)/i,
      type: 'money_request',
      labelEn: 'Urgent Financial / Money Transfer Demand',
      labelTa: 'அவசர பணப்பரிமாற்றக் கோரிக்கை',
      weight: 92
    },
    {
      regex: /(emergency|accident|clinic|hospital|police|arrest|kidnap|help me|trapped|jail|urgent)/i,
      type: 'urgency',
      labelEn: 'High Pressure Emergency Claim',
      labelTa: 'அவசர விபத்து கூற்று',
      weight: 88
    },
    {
      regex: /(brother|son|daughter|mother|father|mom|dad|relative|family|friend)/i,
      type: 'impersonation',
      labelEn: 'Family Member Impersonation Signal',
      labelTa: 'குடும்ப உறுப்பினர் போல் நடித்தல்',
      weight: 85
    },
    {
      regex: /(state bank|rbi|customs|cyber cell|police officer|manager|customer care|service center|blocked|suspended)/i,
      type: 'impersonation',
      labelEn: 'Official / Bank Authority Impersonation',
      labelTa: 'வங்கி அல்லது அரசு அதிகாரி போல் நடித்தல்',
      weight: 90
    },
    {
      regex: /(don't call|don't tell|keep secret|immediately|right now|hurry|or else|within 5 minutes)/i,
      type: 'threat',
      labelEn: 'Coercive Isolation & Threat',
      labelTa: 'அச்சுறுத்தல் மற்றும் அவசர அழுத்தம்',
      weight: 86
    }
  ];

  public analyzeText(transcript: string): ScamAnalysis {
    const detectedSignals: ScamSignal[] = [];

    if (!transcript || transcript.trim().length === 0) {
      return {
        scamScore: 0,
        threatLevel: 'LOW',
        transcript: '',
        detectedSignals: []
      };
    }

    let totalWeight = 0;

    for (const pattern of this.scamPatterns) {
      if (pattern.regex.test(transcript)) {
        detectedSignals.push({
          type: pattern.type,
          labelEn: pattern.labelEn,
          labelTa: pattern.labelTa,
          weight: pattern.weight
        });
        totalWeight += pattern.weight;
      }
    }

    // Normalize scam score 0 - 100
    const rawScore = Math.min(100, Math.round(totalWeight * 0.45));
    const scamScore = detectedSignals.length > 0 ? Math.max(25, rawScore) : 0;

    let threatLevel: ThreatLevel = 'LOW';
    if (scamScore >= 80) {
      threatLevel = 'CRITICAL';
    } else if (scamScore >= 60) {
      threatLevel = 'HIGH';
    } else if (scamScore >= 35) {
      threatLevel = 'SUSPICIOUS';
    } else if (scamScore >= 15) {
      threatLevel = 'MODERATE';
    }

    return {
      scamScore,
      threatLevel,
      transcript,
      detectedSignals
    };
  }
}

export const scamDetector = new ScamDetector();
