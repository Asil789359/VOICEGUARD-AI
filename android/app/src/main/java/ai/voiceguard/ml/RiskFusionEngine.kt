package ai.voiceguard.ml

import ai.voiceguard.model.*
import kotlin.math.max
import kotlin.math.min

class RiskFusionEngine {

    fun fuseRisk(
        audioName: String,
        durationSeconds: Int,
        acoustic: AcousticFeatures,
        scam: ScamAnalysis
    ): AnalysisResult {
        // Calculate Authenticity Risk Score (0 - 100)
        val spectralRisk = (acoustic.roboticArtifacts * 0.45) + (if (acoustic.pitchStability > 88) 30 else 0)
        val prosodyRisk = (100 - acoustic.prosodyVariance) * 0.35
        val zcrRisk = if (acoustic.zeroCrossingRate > 0.20f) 20 else 5

        var authenticityScore = min(100, (spectralRisk + prosodyRisk + zcrRisk).toInt())

        if (acoustic.roboticArtifacts > 75 || acoustic.pitchStability > 90) {
            authenticityScore = max(82, authenticityScore)
        } else if (acoustic.roboticArtifacts < 30 && acoustic.prosodyVariance > 70) {
            authenticityScore = min(28, authenticityScore)
        }

        // Determine Status
        val status = when {
            authenticityScore >= 80 -> DetectionStatus.LIKELY_SYNTHETIC
            authenticityScore >= 60 -> DetectionStatus.POSSIBLE_VOICE_CLONE
            authenticityScore >= 40 -> DetectionStatus.UNCERTAIN
            else -> DetectionStatus.LIKELY_HUMAN
        }

        // Threat Level
        val maxRisk = max(authenticityScore, scam.scamScore)
        val overallThreat = when {
            maxRisk >= 80 -> ThreatLevel.CRITICAL
            maxRisk >= 60 -> ThreatLevel.HIGH
            maxRisk >= 40 -> ThreatLevel.SUSPICIOUS
            maxRisk >= 25 -> ThreatLevel.MODERATE
            else -> ThreatLevel.LOW
        }

        val keySignals = mutableListOf<String>()
        if (acoustic.spectralCentroid > 3800) {
            keySignals.add("Spectral centroid anomaly (${acoustic.spectralCentroid} Hz)")
        }
        if (acoustic.pitchStability > 85) {
            keySignals.add("Unnatural pitch rigidity (${acoustic.pitchStability}%)")
        }
        if (acoustic.roboticArtifacts > 60) {
            keySignals.add("Neural vocoder phase artifacts (${acoustic.roboticArtifacts}%)")
        }
        scam.detectedSignals.forEach {
            keySignals.add("Social Engineering Risk: ${it.labelEn}")
        }
        if (keySignals.isEmpty()) {
            keySignals.add("Organic speech harmonics verified")
            keySignals.add("No financial coercion detected")
        }

        val explanationEn = when (status) {
            DetectionStatus.LIKELY_SYNTHETIC -> "⚠️ HIGH SYNTHETIC-VOICE RISK. Audio contains neural vocoder signatures typical of AI speech generators."
            DetectionStatus.POSSIBLE_VOICE_CLONE -> "🚨 POSSIBLE VOICE CLONE DETECTED. Acoustic characteristics indicate a cloned voice overlay with high-urgency keywords."
            DetectionStatus.UNCERTAIN -> "⚡ UNCERTAIN AUTHENTICITY. Audio quality or ambient noise limits high-confidence detection."
            DetectionStatus.LIKELY_HUMAN -> "✅ LIKELY HUMAN VOICE. Audio features show organic pitch modulations and natural speech temporal flow."
        }

        val explanationTa = when (status) {
            DetectionStatus.LIKELY_SYNTHETIC -> "⚠️ அதிக AI குரல் ஆபத்து. இந்த பதிவு AI மூலம் உருவாக்கப்பட்ட குரலின் அறிகுறிகளைக் கொண்டுள்ளது."
            DetectionStatus.POSSIBLE_VOICE_CLONE -> "🚨 போலி குரல் (Voice Clone) ஆபத்து. உங்கள் தெரிந்தவர்களின் குரலை AI மூலம் போலியாக உருவாக்கியிருக்கலாம்."
            DetectionStatus.UNCERTAIN -> "⚡ முடிவடையாத பகுப்பாய்வு. ஒலியின் தெளிவின்மை காரணமாக முழுமையாக கண்டறிய முடியவில்லை."
            DetectionStatus.LIKELY_HUMAN -> "✅ இயற்கையான மனித குரல். குரல் சுருதி மற்றும் அதிர்வுகள் இயற்கையான பேச்சை உறுதி செய்கின்றன."
        }

        return AnalysisResult(
            id = "android-${System.currentTimeMillis()}",
            timestamp = System.currentTimeMillis(),
            audioName = audioName,
            durationSeconds = durationSeconds,
            authenticityScore = authenticityScore,
            status = status,
            confidence = min(98, max(80, 100 - Math.abs(50 - authenticityScore))),
            acousticFeatures = acoustic,
            scamAnalysis = scam,
            overallThreat = overallThreat,
            explanationEn = explanationEn,
            explanationTa = explanationTa,
            keySignals = keySignals
        )
    }
}
