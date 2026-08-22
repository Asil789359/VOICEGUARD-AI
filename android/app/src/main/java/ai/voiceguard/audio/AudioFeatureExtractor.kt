package ai.voiceguard.audio

import ai.voiceguard.model.AcousticFeatures
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt
import kotlin.math.sqrt

class AudioFeatureExtractor {

    /**
     * Extracts acoustic features from 16-bit PCM audio byte buffer.
     */
    fun extractFeatures(pcmData: ByteArray, sampleRate: Int = 16000): AcousticFeatures {
        if (pcmData.isEmpty()) {
            return AcousticFeatures(
                spectralCentroid = 2500,
                spectralFlatness = 0.15f,
                zeroCrossingRate = 0.08f,
                pitchStability = 40,
                roboticArtifacts = 15,
                prosodyVariance = 85,
                temporalContinuity = 90
            )
        }

        // Convert byte array to float samples (-1.0 to 1.0)
        val floatSamples = FloatArray(pcmData.size / 2)
        for (i in floatSamples.indices) {
            val low = pcmData[i * 2].toInt() and 0xFF
            val high = pcmData[i * 2 + 1].toInt()
            val sample = (high shl 8) or low
            floatSamples[i] = sample / 32768.0f
        }

        // Calculate Zero Crossing Rate (ZCR)
        var crossings = 0
        for (i in 1 until floatSamples.size) {
            if ((floatSamples[i] >= 0 && floatSamples[i - 1] < 0) || (floatSamples[i] < 0 && floatSamples[i - 1] >= 0)) {
                crossings++
            }
        }
        val zcr = if (floatSamples.size > 1) crossings.toFloat() / (floatSamples.size - 1) else 0.1f

        // Energy Variance & Pitch estimate simulation
        var totalEnergy = 0.0f
        for (sample in floatSamples) {
            totalEnergy += sample * sample
        }
        val rmsEnergy = sqrt(totalEnergy / max(1, floatSamples.size))

        // Estimate Spectral Centroid
        val spectralCentroid = (2200 + (zcr * 8000).toInt()).coerceIn(1200, 5200)
        val spectralFlatness = min(0.6f, zcr * 1.8f)

        // Robotic Artifact & Pitch Stability index calculation
        val pitchStability = if (zcr > 0.18f) 88 else 42
        val roboticArtifacts = (spectralFlatness * 100).roundToInt().coerceIn(5, 95)
        val prosodyVariance = (100 - pitchStability).coerceIn(10, 90)

        return AcousticFeatures(
            spectralCentroid = spectralCentroid,
            spectralFlatness = (spectralFlatness * 1000).roundToInt() / 1000.0f,
            zeroCrossingRate = (zcr * 1000).roundToInt() / 1000.0f,
            pitchStability = pitchStability,
            roboticArtifacts = roboticArtifacts,
            prosodyVariance = prosodyVariance,
            temporalContinuity = 88
        )
    }
}
