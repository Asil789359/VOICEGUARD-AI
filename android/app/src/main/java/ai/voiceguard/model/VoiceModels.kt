package ai.voiceguard.model

enum class DetectionStatus {
    LIKELY_HUMAN,
    POSSIBLE_VOICE_CLONE,
    LIKELY_SYNTHETIC,
    UNCERTAIN
}

enum class ThreatLevel {
    LOW,
    MODERATE,
    SUSPICIOUS,
    HIGH,
    CRITICAL
}

data class AcousticFeatures(
    val spectralCentroid: Int, // Hz
    val spectralFlatness: Float, // 0 - 1
    val zeroCrossingRate: Float, // 0 - 0.5
    val pitchStability: Int, // %
    val roboticArtifacts: Int, // %
    val prosodyVariance: Int, // %
    val temporalContinuity: Int // %
)

data class ScamSignal(
    val type: String,
    val labelEn: String,
    val labelTa: String,
    val weight: Int
)

data class ScamAnalysis(
    val scamScore: Int,
    val threatLevel: ThreatLevel,
    val transcript: String,
    val detectedSignals: List<ScamSignal>
)

data class AnalysisResult(
    val id: String,
    val timestamp: Long,
    val audioName: String,
    val durationSeconds: Int,
    val authenticityScore: Int, // 0 - 100
    val status: DetectionStatus,
    val confidence: Int, // 0 - 100
    val acousticFeatures: AcousticFeatures,
    val scamAnalysis: ScamAnalysis,
    val overallThreat: ThreatLevel,
    val explanationEn: String,
    val explanationTa: String,
    val keySignals: List<String>
)
