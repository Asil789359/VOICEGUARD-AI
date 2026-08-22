package ai.voiceguard.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val BgDark = Color(0xFF080A10)
val BgCard = Color(0xFF111420)
val CyanPrimary = Color(0xFF00F2FE)
val BluePrimary = Color(0xFF4FACFE)
val RiskLow = Color(0xFF34C759)
val RiskHigh = Color(0xFFFF9500)
val RiskCritical = Color(0xFFFF3B30)

private val DarkColorScheme = darkColorScheme(
    primary = CyanPrimary,
    secondary = BluePrimary,
    background = BgDark,
    surface = BgCard,
    onPrimary = Color.Black,
    onBackground = Color.White,
    onSurface = Color.White
)

@Composable
fun VoiceGuardAITheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
