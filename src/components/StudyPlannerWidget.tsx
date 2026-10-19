import React, { useState } from 'react';

export const StudyPlannerWidget: React.FC = () => {
  const [subjectsCount, setSubjectsCount] = useState(5);
  const [targetSgpa, setTargetSgpa] = useState(9.2);
  const [dailyHours, setDailyHours] = useState(3);

  const estimatedDaysToMaster = Math.max(7, Math.round(25 - dailyHours * 2));

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#0B3561]/15 shadow-xl space-y-8 relative overflow-hidden">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="bg-[#12A5B0]/20 text-[#0B3561] font-heading font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-widest">
          Interactive Study Planner
        </span>
        <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#0B3561]">
          Calculate Your Semester Exam Readiness
        </h3>
        <p className="font-body text-xs text-[#3C5D81]">
          Customize your semester workload and see how PyNotes structured handwritten modules accelerate your preparation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6 bg-[#F7FAFC] p-6 sm:p-8 rounded-2xl border border-[#0B3561]/10">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-heading font-bold text-[#0B3561]">
              <span>Number of Semester Subjects:</span>
              <span className="text-[#12A5B0] text-sm">{subjectsCount} Subjects</span>
            </div>
            <input
              type="range"
              min="3"
              max="8"
              value={subjectsCount}
              onChange={e => setSubjectsCount(Number(e.target.value))}
              className="w-full accent-[#12A5B0]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-heading font-bold text-[#0B3561]">
              <span>Target Semester SGPA:</span>
              <span className="text-[#12A5B0] text-sm">{targetSgpa} / 10.0</span>
            </div>
            <input
              type="range"
              min="7.0"
              max="10.0"
              step="0.1"
              value={targetSgpa}
              onChange={e => setTargetSgpa(Number(e.target.value))}
              className="w-full accent-[#12A5B0]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-heading font-bold text-[#0B3561]">
              <span>Daily Study Commitment:</span>
              <span className="text-[#12A5B0] text-sm">{dailyHours} Hours / Day</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={dailyHours}
              onChange={e => setDailyHours(Number(e.target.value))}
              className="w-full accent-[#12A5B0]"
            />
          </div>
        </div>

        {/* Results Card */}
        <div className="bg-gradient-to-br from-[#0B3561] to-[#071E38] text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6 text-center flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-heading font-bold text-[10px] text-[#FFD54A] uppercase tracking-wider">
              Estimated Completion Time
            </span>
            <h4 className="font-display font-black italic text-4xl text-white">
              {estimatedDaysToMaster} Days
            </h4>
            <p className="text-[11px] text-[#DDF3F4]/80">With PyNotes Handwritten Modules</p>
          </div>

          <div className="space-y-2 pt-4 border-t border-white/10 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-[#DDF3F4]">Time Saved vs PDFs:</span>
              <span className="font-bold text-[#FFD54A]">65% Faster</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#DDF3F4]">Revision Speed:</span>
              <span className="font-bold text-[#FFD54A]">1 Night Before Exam</span>
            </div>
          </div>

          <a
            href="/subjects"
            className="block bg-[#12A5B0] text-[#071E38] font-heading font-black py-3 rounded-xl text-xs hover:brightness-105 transition shadow-md uppercase tracking-wider text-center"
          >
            Start Studying Now →
          </a>
        </div>
      </div>
    </div>
  );
};
