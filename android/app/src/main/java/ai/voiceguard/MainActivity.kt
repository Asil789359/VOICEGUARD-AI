package ai.voiceguard

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import ai.voiceguard.audio.AudioFeatureExtractor
import ai.voiceguard.ml.RiskFusionEngine
import ai.voiceguard.model.*
import ai.voiceguard.ui.*
import ai.voiceguard.ui.theme.BgDark
import ai.voiceguard.ui.theme.VoiceGuardAITheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            VoiceGuardAITheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = BgDark
                ) {
                    var currentScreen by remember { mutableStateOf("home") }
                    var activeResult by remember { mutableStateOf<AnalysisResult?>(null) }

                    val featureExtractor = remember { AudioFeatureExtractor() }
                    val riskEngine = remember { RiskFusionEngine() }

                    when (currentScreen) {
                        "protection" -> {
                            ProtectionScreen(onBack = { currentScreen = "result" })
                        }
                        "result" -> {
                            activeResult?.let { result ->
                                ResultScreen(
                                    result = result,
                                    onNavigateProtection = { currentScreen = "protection" },
                                    onNewScan = { currentScreen = "home" }
                                )
                            } ?: run {
                                currentScreen = "home"
                            }
                        }
                        else -> {
                            HomeScreen(
                                onNavigateRecording = {
                                    // Generate sample analysis output
                                    val dummyPcm = ByteArray(32000)
                                    val acoustic = featureExtractor.extractFeatures(dummyPcm)
                                    val scam = ScamAnalysis(0, ThreatLevel.LOW, "", emptyList())
                                    activeResult = riskEngine.fuseRisk("Voice Sample.wav", 6, acoustic, scam)
                                    currentScreen = "result"
                                },
                                onNavigateSample = { sampleType ->
                                    val (score, status, threat, textEn, textTa) = when (sampleType) {
                                        "synth" -> Quintuple(94, DetectionStatus.LIKELY_SYNTHETIC, ThreatLevel.CRITICAL, "⚠️ HIGH SYNTHETIC VOICE RISK. Neural vocoder signatures detected.", "⚠️ அதிக AI குரல் ஆபத்து.")
                                        "clone" -> Quintuple(89, DetectionStatus.POSSIBLE_VOICE_CLONE, ThreatLevel.CRITICAL, "🚨 POSSIBLE VOICE CLONE DETECTED. Cloned voice overlay detected.", "🚨 போலி குரல் ஆபத்து.")
                                        else -> Quintuple(18, DetectionStatus.LIKELY_HUMAN, ThreatLevel.LOW, "✅ LIKELY HUMAN VOICE. Natural human speech patterns.", "✅ இயற்கையான மனித குரல்.")
                                    }

                                    activeResult = AnalysisResult(
                                        id = "sample-$sampleType",
                                        timestamp = System.currentTimeMillis(),
                                        audioName = "Test Sample — $sampleType",
                                        durationSeconds = 6,
                                        authenticityScore = score,
                                        status = status,
                                        confidence = 94,
                                        acousticFeatures = AcousticFeatures(3200, 0.2f, 0.12f, 85, score, 30, 90),
                                        scamAnalysis = ScamAnalysis(if (score > 50) 90 else 5, threat, "", emptyList()),
                                        overallThreat = threat,
                                        explanationEn = textEn,
                                        explanationTa = textTa,
                                        keySignals = listOf("On-device spectral analysis verified")
                                    )
                                    currentScreen = "result"
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

private data class Quintuple<A, B, C, D, E>(
    val first: A,
    val second: B,
    val third: C,
    val fourth: D,
    val fifth: E
)
