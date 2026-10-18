import React from 'react';

interface TestModeBannerProps {
  isTestMode?: boolean;
}

export const TestModeBanner: React.FC<TestModeBannerProps> = ({ isTestMode = false }) => {
  if (!isTestMode) return null;

  return (
    <div className="bg-[#FFD54A] text-[#071E38] text-xs font-heading font-bold py-1.5 px-4 text-center border-b border-[#071E38]/10 flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#C0392B] animate-ping" />
      <span>TEST MODE ACTIVE: Razorpay test keys in use. Payments will be simulated.</span>
    </div>
  );
};
