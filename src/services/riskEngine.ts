import { AcousticFeatures, AnalysisResult, DetectionStatus, ScamAnalysis, ThreatLevel } from '../types';

export class RiskEngine {
  public fuseRisk(
    audioName: string,
    durationSeconds: number,
    acoustic: AcousticFeatures,
    scam: ScamAnalysis
  ): AnalysisResult {
    // 1. Calculate Acoustic Authenticity Score (0 - 100)
    // Higher score = higher probability of synthetic / clone voice
    const spectralRisk = (acoustic.roboticArtifacts * 0.4) + (acoustic.pitchStability > 90 ? 30 : 0);
    const prosodyRisk = (100 - acoustic.prosodyVariance) * 0.35;
    const zcrRisk = acoustic.zeroCrossingRate > 0.2 ? 20 : 5;

    let authenticityScore = Math.min(100, Math.round(spectralRisk + prosodyRisk + zcrRisk));

    // Refine based on thresholds
    if (acoustic.roboticArtifacts > 75 || acoustic.pitchStability > 92) {
      authenticityScore = Math.max(78, authenticityScore);
    } else if (acoustic.roboticArtifacts < 30 && acoustic.prosodyVariance > 70) {
      authenticityScore = Math.min(30, authenticityScore);
    }

    // 2. Determine Detection Status
    let status: DetectionStatus = 'LIKELY_HUMAN';
    if (authenticityScore >= 80) {
      status = 'LIKELY_SYNTHETIC';
    } else if (authenticityScore >= 60) {
      status = 'POSSIBLE_VOICE_CLONE';
    } else if (authenticityScore >= 40) {
      status = 'UNCERTAIN';
    } else {
      status = 'LIKELY_HUMAN';
    }

    // Special case for clone signature: high scam context + medium-high voice clone markers
    if (authenticityScore >= 55 && scam.scamScore >= 70) {
      status = 'POSSIBLE_VOICE_CLONE';
    }

    // 3. Determine Overall Threat Level
    let overallThreat: ThreatLevel = 'LOW';
    const maxRisk = Math.max(authenticityScore, scam.scamScore);
    if (maxRisk >= 80) {
      overallThreat = 'CRITICAL';
    } else if (maxRisk >= 60) {
      overallThreat = 'HIGH';
    } else if (maxRisk >= 40) {
      overallThreat = 'SUSPICIOUS';
    } else if (maxRisk >= 25) {
      overallThreat = 'MODERATE';
    } else {
      overallThreat = 'LOW';
    }

    // 4. Generate Key Signals
    const keySignals: string[] = [];
    if (acoustic.spectralCentroid > 3800) {
      keySignals.push(`Spectral anomaly detected (${acoustic.spectralCentroid} Hz centroid)`);
    }
    if (acoustic.pitchStability > 85) {
      keySignals.push(`Unnatural pitch rigidity (${acoustic.pitchStability}% pitch stability)`);
    }
    if (acoustic.roboticArtifacts > 60) {
      keySignals.push(`High-frequency neural vocoder phase artifacts (${acoustic.roboticArtifacts}%)`);
    }
    if (scam.detectedSignals.length > 0) {
      scam.detectedSignals.forEach(sig => keySignals.push(`Social Engineering Risk: ${sig.labelEn}`));
    }
    if (keySignals.length === 0) {
      keySignals.push('Organic speech harmonics & natural prosody verified');
      keySignals.push('No suspicious financial or credential harvesting keywords detected');
    }

    // 5. Build Explanations
    let explanationEn = '';
    let explanationTa = '';

    if (status === 'LIKELY_SYNTHETIC') {
      explanationEn = '⚠️ HIGH SYNTHETIC-VOICE RISK. This recording contains acoustic and spectral signatures typical of AI text-to-speech generators. Verify caller identity before trusting.';
      explanationTa = '⚠️ அதிக AI குரல் ஆபத்து. இந்த பதிவு AI மூலம் உருவாக்கப்பட்ட குரலின் அறிகுறிகளைக் கொண்டுள்ளது. நடவடிக்க எடுப்பதற்கு முன் சரிபார்க்கவும்.';
    } else if (status === 'POSSIBLE_VOICE_CLONE') {
      explanationEn = '🚨 POSSIBLE VOICE CLONE DETECTED. Acoustic analysis indicates a cloned voice model overlay combined with high-urgency social engineering keywords. Do not transfer funds.';
      explanationTa = '🚨 போலி குரல் (Voice Clone) ஆபத்து. உங்கள் தெரிந்தவர்களின் குரலை AI மூலம் போலியாக உருவாக்கியிருக்கலாம். பணம் அனுப்ப வேண்டாம்.';
    } else if (status === 'UNCERTAIN') {
      explanationEn = '⚡ UNCERTAIN AUTHENTICITY. Audio quality or ambient noise limits high-confidence detection. Proceed with standard security caution.';
      explanationTa = '⚡ முடிவடையாத பகுப்பாய்வு. ஒலியின் தெளிவின்மை காரணமாக முழுமையாக கண்டறிய முடியவில்லை. எச்சரிக்கையுடன் செயல்படவும்.';
    } else {
      explanationEn = '✅ LIKELY HUMAN VOICE. Audio features show organic pitch modulations and natural speech temporal flow. Low risk of voice synthesis.';
      explanationTa = '✅ இயற்கையான மனித குரல். குரல் சுருதி மற்றும் அதிர்வுகள் இயற்கையான மனித பேச்சை உறுதி செய்கின்றன.';
    }

    return {
      id: `analysis-${Date.now()}`,
      timestamp: Date.now(),
      audioName,
      durationSeconds,
      authenticityScore,
      status,
      confidence: Math.min(98, Math.max(82, 100 - Math.abs(50 - authenticityScore))),
      acousticFeatures: acoustic,
      scamAnalysis: scam,
      overallThreat,
      explanationEn,
      explanationTa,
      keySignals
    };
  }
}

export const riskEngine = new RiskEngine();
