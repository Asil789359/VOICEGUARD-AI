package ai.voiceguard.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ai.voiceguard.ui.theme.*

@Composable
fun HomeScreen(
    onNavigateRecording: () => Unit,
    onNavigateSample: (sampleTag: String) => Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .background(Brush.linearGradient(listOf(CyanPrimary, BluePrimary)), RoundedCornerShape(10.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.Shield, contentDescription = null, tint = Color.Black)
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text("VOICEGUARD AI", color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
                    Text("On-Device AI Security", color = Color(0xFF8E99B7), fontSize = 10.sp)
                }
            }

            Box(
                modifier = Modifier
                    .background(Color(0xFF34C759).copy(alpha = 0.15f), CircleShape)
                    .border(1.dp, Color(0xFF34C759).copy(alpha = 0.4f), CircleShape)
                    .padding(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text("On-Device", color = Color(0xFF34C759), fontSize = 10.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Hero Banner Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = BgCard)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("Protect yourself from AI Voice Impersonation", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("On-device AI voice clone, synthetic speech and social engineering scam detection.", color = Color(0xFF8E99B7), fontSize = 12.sp)

                Button(
                    onClick = onNavigateRecording,
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary)
                ) {
                    Icon(Icons.Default.Mic, contentDescription = null, tint = Color.Black)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("ANALYZE VOICE SAMPLE", color = Color.Black, fontWeight = FontWeight.ExtraBold)
                }
            }
        }

        // Voice Clone Challenge Section
        Text("VOICE CLONE CHALLENGE", color = CyanPrimary, fontWeight = FontWeight.Bold, fontSize = 12.sp)

        val samples = listOf(
            Triple("Test A", "Genuine Human Voice", "human"),
            Triple("Test B", "AI Synthetic Bank Scam", "synth"),
            Triple("Test C", "Voice-Cloned Emergency Scam", "clone")
        )

        samples.forEach { (tag, title, type) ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onNavigateSample(type) },
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF141828))
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(tag, color = CyanPrimary, fontWeight = FontWeight.Bold, fontSize = 10.sp)
                        Text(title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    }
                    Icon(Icons.Default.PlayArrow, contentDescription = null, tint = CyanPrimary)
                }
            }
        }
    }
}
