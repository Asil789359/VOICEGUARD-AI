import React, { useState } from 'react';
import { ShieldCheck, PhoneCall, AlertOctagon, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import { AppLanguage } from '../types';

interface ProtectionAssistantProps {
  language: AppLanguage;
  onBack: () => void;
}

export const ProtectionAssistant: React.FC<ProtectionAssistantProps> = ({ language, onBack }) => {
  const [isVerifyingCall, setIsVerifyingCall] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);

  const simulateSafeCallback = () => {
    setIsVerifyingCall(true);
    setCallStatus('Dialing trusted phonebook contact directly...');
    setTimeout(() => {
      setCallStatus('Connected to genuine line. Confirming identity...');
    }, 2000);
    setTimeout(() => {
      setCallStatus('✅ SAFE VERIFICATION COMPLETE: Contact confirmed caller was impersonated.');
      setIsVerifyingCall(false);
    }, 4500);
  };

  const stepsEn = [
    { title: '1. Do NOT Transfer Funds', desc: 'Never send money via UPI, NetBanking, or cash based solely on a voice request.' },
    { title: '2. Do NOT Disclose OTP / PIN', desc: 'Bank representatives & officials will NEVER ask for 6-digit OTP or UPI PINs over the phone.' },
    { title: '3. End Suspicious Call Immediately', desc: 'Hang up and do not engage further with the suspicious voice caller.' },
    { title: '4. Verify via Known Phonebook Number', desc: 'Call the person or organization back using your saved address book number or official website.' }
  ];

  const stepsTa = [
    { title: '1. பணத்தை அனுப்ப வேண்டாம்', desc: 'குரல் அழைப்பின் அடிப்படையில் UPI அல்லது வங்கி மூலம் பணம் அனுப்ப வேண்டாம்.' },
    { title: '2. OTP / PIN பகிர வேண்டாம்', desc: 'வங்கி அதிகாரிகளோ அல்லது குடும்பத்தினரோ OTP எண்களைக் கேட்க மாட்டார்கள்.' },
    { title: '3. உடனே அழைப்பைத் துண்டிக்கவும்', desc: 'சந்தேகத்திற்குரிய அழைப்பைத் துண்டித்து தனித்து செயல்படவும்.' },
    { title: '4. தெரிந்த எண்ணை நேரடியாக அழைக்கவும்', desc: 'உங்கள் தொலைபேசி புத்தகத்தில் உள்ள எண்ணுக்கு நேரடியாக அழைத்து சரிபார்க்கவும்.' }
  ];

  const currentSteps = language === 'ta' ? stepsTa : stepsEn;

  return (
    <div className="w-full flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs text-[#8E99B7] hover:text-white px-2 py-1 rounded-lg bg-[#ffffff08]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Result</span>
        </button>
        <span className="text-xs font-bold text-[#00F2FE]">SAFETY PROTOCOL</span>
      </div>

      {/* Hero Banner */}
      <div className="w-full glass-panel-glow p-4 rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#00F2FE20] border border-[#00F2FE50] flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-6 h-6 text-[#00F2FE]" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-white">
            {language === 'ta' ? 'பாதுகாப்பு நடவடிக்கை வழிகாட்டி' : 'WHAT SHOULD I DO NEXT?'}
          </h2>
          <p className="text-[11px] text-[#8E99B7]">
            {language === 'ta'
              ? 'சந்தேகத்திற்குரிய குரல் கண்டறியப்பட்டால் பின்பற்ற வேண்டிய படிகள்'
              : 'Follow these recommended verification steps to protect yourself.'}
          </p>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex flex-col gap-2.5">
        {currentSteps.map((step, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-[#141828] border border-[#ffffff10] flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-[#00F2FE15] border border-[#00F2FE40] text-[#00F2FE] font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">{step.title}</h4>
              <p className="text-[11px] text-[#8E99B7] mt-0.5 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Safe Verification Assistant Call Simulator */}
      <div className="w-full glass-panel p-4 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#34C759]" />
          <span className="text-xs font-bold text-white">VERIFY SAFELY VIA ALTERNATIVE CHANNEL</span>
        </div>
        <p className="text-[11px] text-[#8E99B7]">
          Simulate calling back your trusted contact using a verified phone number from your contact book.
        </p>

        {callStatus && (
          <div className="p-3 rounded-xl bg-[#34C75915] border border-[#34C75940] text-xs text-[#34C759] font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{callStatus}</span>
          </div>
        )}

        <button
          onClick={simulateSafeCallback}
          disabled={isVerifyingCall}
          className="btn-cyan w-full py-2.5 text-xs font-bold"
        >
          <PhoneCall className="w-4 h-4 text-black stroke-[2.5]" />
          <span>{isVerifyingCall ? 'Connecting Safe Channel...' : 'Run Safe Callback Verification'}</span>
        </button>
      </div>

      <div className="p-3 rounded-xl bg-[#ffffff05] border border-[#ffffff08] text-[10px] text-[#5C6784] text-center">
        VOICEGUARD AI provides safety guidance and AI probability scoring. Always independently confirm identity prior to high-risk transactions.
      </div>
    </div>
  );
};
