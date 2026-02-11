import React from 'react';

export const CTA = () => {
  return (
    <section className="py-28 relative overflow-hidden bg-[#0a0e14]">
      <div className="absolute inset-0 opacity-20">
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <pattern height="20" id="network-grid" patternUnits="userSpaceOnUse" width="20">
              <circle cx="2" cy="2" fill="#1d4ed8" r="1"></circle>
              <path d="M 2 2 L 22 22" stroke="#1d4ed8" strokeOpacity="0.2" strokeWidth="0.5"></path>
              <path d="M 2 2 L 22 -18" stroke="#1d4ed8" strokeOpacity="0.2" strokeWidth="0.5"></path>
            </pattern>
          </defs>
          <rect fill="url(#network-grid)" height="100%" width="100%"></rect>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-transparent to-[#0a0e14]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e14] via-transparent to-[#0a0e14]"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
          Ready to accelerate your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            academic journey?
          </span>
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of researchers who are already using AcadHub to power their literature reviews and thesis work.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#0a0e14] font-bold rounded-full hover:bg-gray-100 transition-colors text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Explore Research
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-white font-bold rounded-full border border-gray-600 hover:border-white transition-colors text-lg flex items-center justify-center gap-2 group">
            Upload Your Project
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
