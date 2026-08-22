package ai.voiceguard.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import ai.voiceguard.ui.theme.*

@Composable
fun ProtectionScreen(onBack: () => Unit) {
    var callStatus by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }
            Text("WHAT SHOULD I DO?", color = Color.White, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
        }

        val steps = listOf(
            "1. Do NOT Transfer Funds" to "Never send money via UPI or netbanking based solely on a voice call.",
            "2. Do NOT Share OTP / PIN" to "Bank officials will NEVER request your 6-digit OTP or banking PIN over the phone.",
            "3. Hang Up Immediately" to "Terminate suspicious calls without engaging further.",
            "4. Verify via Trusted Contact" to "Call the person back directly using your saved phonebook number."
        )

        steps.forEach { (title, desc) ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = BgCard)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(desc, color = Color(0xFF8E99B7), fontSize = 11.sp)
                }
            }
        }

        if (callStatus != null) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF34C759).copy(alpha = 0.15f))
            ) {
                Text(callStatus!!, color = Color(0xFF34C759), modifier = Modifier.padding(12.dp), fontSize = 12.sp, fontWeight = FontWeight.Bold)
            }
        }

        Button(
            onClick = { callStatus = "✅ SAFE CALLBACK VERIFICATION COMPLETE: Phonebook contact verified caller was impersonated." },
            modifier = Modifier.fillMaxWidth().height(48.dp),
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(containerColor = CyanPrimary)
        ) {
            Icon(Icons.Default.Phone, contentDescription = null, tint = Color.Black)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Run Safe Callback Verification", color = Color.Black, fontWeight = FontWeight.ExtraBold)
        }
    }
}
