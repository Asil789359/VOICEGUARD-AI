package ai.voiceguard.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ai.voiceguard.model.AnalysisResult
import ai.voiceguard.ui.theme.*

@Composable
fun ResultScreen(
    result: AnalysisResult,
    onNavigateProtection: () => Unit,
    onNewScan: () => Unit
) {
    var lang by remember { mutableStateOf("en") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Threat Banner
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = if (result.authenticityScore >= 60) Color(0xFFFF3B30).copy(alpha = 0.15f) else Color(0xFF34C759).copy(alpha = 0.15f)
            )
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Security, contentDescription = null, tint = if (result.authenticityScore >= 60) RiskCritical else RiskLow)
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        "${result.overallThreat} THREAT LEVEL",
                        color = if (result.authenticityScore >= 60) RiskCritical else RiskLow,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 14.sp
                    )
                }

                IconButton(onClick = { lang = if (lang == "en") "ta" else "en" }) {
                    Icon(Icons.Default.VolumeUp, contentDescription = "Play Audio Alert", tint = CyanPrimary)
                }
            }
        }

        // Score Meter
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = BgCard)
        ) {
            Column(
                modifier = Modifier.padding(20.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("VOICE AUTHENTICITY RISK SCORE", color = Color(0xFF8E99B7), fontSize = 11.sp, fontWeight = FontWeight.Bold)

                Box(
                    modifier = Modifier
                        .size(110.dp)
                        .background(Color.Black, CircleShape)
                        .border(4.dp, if (result.authenticityScore >= 60) RiskCritical else RiskLow, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(result.authenticityScore.toString(), color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.ExtraBold)
                        Text("/ 100", color = Color(0xFF8E99B7), fontSize = 10.sp)
                    }
                }

                Text(
                    result.status.name.replace("_", " "),
                    color = if (result.authenticityScore >= 60) RiskCritical else RiskLow,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )

                Text(
                    if (lang == "ta") result.explanationTa else result.explanationEn,
                    color = Color.White,
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center
                )
            }
        }

        // Action Buttons
        Button(
            onClick = onNavigateProtection,
            modifier = Modifier.fillMaxWidth().height(48.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary)
        ) {
            Text("WHAT SHOULD I DO NEXT?", color = Color.Black, fontWeight = FontWeight.ExtraBold)
            Spacer(modifier = Modifier.weight(1f))
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color.Black)
        }

        OutlinedButton(
            onClick = onNewScan,
            modifier = Modifier.fillMaxWidth().height(48.dp),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text("Analyze Another Audio Sample", color = Color.White)
        }
    }
}
