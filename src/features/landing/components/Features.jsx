import React from "react";
import { CodeWindow } from "./CodeWindow";
import { useInView } from "react-intersection-observer";

const FeatureItem = ({ children, delay = 0 }) => {
    const { ref,InView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });
    
    // Using a simpler class-based approach if useInView simple hook feels jerky, 
    // but here sticking to standard logical render or css class toggle.
    // Actually, lets just apply a class based on inView.
    // NOTE: variables must be lowercase start in destructing if not renamed.
    // Redoing hook usage correctly below in full file.
    return <div ref={ref}>{children}</div>;
}

export const Features = () => {
  // We can use a single hook for the section or multiple for staggered reveal.
  const { ref: sectionRef, inView: sectionVisible } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="solutions" className="py-24 bg-white dark:bg-[#0d1117] relative border-t border-border-light dark:border-border-dark">
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div ref={sectionRef} className={`mb-16 transition-all duration-700 transform ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="block text-primary font-mono text-sm font-semibold mb-3 tracking-wider">
            CORE FEATURES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-light dark:text-white mb-6 tracking-tight">
            Built for Modern Academia
          </h2>
          <p className="text-xl text-text-muted-light dark:text-text-muted-dark max-w-3xl leading-relaxed">
            Traditional repositories are static. AcadHub is dynamic, creating a
            living network of knowledge designed for the enterprise of learning.
          </p>
        </div>
        
        {/* Features Grid */}
         {/* We will inline the reveal logic for simplicity in this generated file or use staggered delays */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          <FeatureCard 
             icon="insights" 
             title="Trend Analysis" 
             desc="Identify emerging research topics and declining interests. Our NLP models analyze millions of papers to spot whats next."
             linkText="Learn more"
             hoverColor="text-primary"
             delay={100}
          />
          <FeatureCard 
             icon="filter_list" 
             title="Smart Filtering" 
             desc="Filter precisely by academic level (BSc, MSc, PhD). Find the exact depth of research needed for your review."
             linkText="Explore filters"
             hoverColor="text-accent"
             delay={200}
          />
          <FeatureCard 
             icon="hub" 
             title="Knowledge Graphs" 
             desc="Go beyond lists. Explore interactive citation networks and topic clusters to visualize connections."
             linkText="View graph demo"
             hoverColor="text-secondary"
             delay={300}
          />
        </div>

        {/* Developer Section (Open Source / Custom placeholder) */}
        <div id="open-source" className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`order-2 lg:order-1 transition-all duration-1000 delay-300 transform ${sectionVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}>
                 <CodeWindow />
            </div>
            <div className={`order-1 lg:order-2 transition-all duration-1000 delay-500 transform ${sectionVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
                 <span className="block text-accent font-mono text-sm font-semibold mb-3 tracking-wider">
                    DEVELOPER FIRST
                 </span>
                 <h2 className="text-3xl md:text-4xl font-bold text-text-light dark:text-white mb-6">
                    A powerful API for research at scale
                 </h2>
                 <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-6">
                    Automate your literature review or build custom analysis tools with our robust Python SDK. 
                    Access metadata, abstracts, and full-text content programmatically.
                 </p>
                 <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                         <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
                         <span className="text-text-light dark:text-text-dark">Rate-limited free tier for students</span>
                    </li>
                    <li className="flex items-start gap-3">
                         <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
                         <span className="text-text-light dark:text-text-dark">JSON & CSV export formats</span>
                    </li>
                    <li className="flex items-start gap-3">
                         <span className="material-symbols-outlined text-green-500 mt-1">check_circle</span>
                         <span className="text-text-light dark:text-text-dark">Comprehensive documentation</span>
                    </li>
                 </ul>
            </div>
        </div>
      </div>
    </section>
  );
};

// Sub-component for individual feature animation
const FeatureCard = ({ icon, title, desc, linkText, hoverColor, delay }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    // Safe lookup for group-hover classes since tailwind needs dynamic classes to be full strings usually, 
    // but here we are just swapping the specific color utility text-primary etc which are safe if fully written or standard.
    // hoverColor is like "text-primary"
    
    return (
        <div 
            ref={ref}
            className={`feature-card group relative p-8 rounded-xl bg-surface-light dark:bg-[#161b22] border border-border-light dark:border-border-dark transition-all duration-700 overflow-hidden ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="w-12 h-12 mb-6 text-text-light dark:text-white flex items-center justify-center rounded-lg bg-white dark:bg-[#21262d] border border-border-light dark:border-border-dark shadow-sm">
              <span className={`material-symbols-outlined text-[28px]`}>
                {icon}
              </span>
            </div>
            <h3 className={`text-xl font-bold text-text-light dark:text-white mb-3 transition-colors group-hover:${hoverColor.replace("text-", "text-")}`}>
              {title}
            </h3>
            <p className="text-text-muted-light dark:text-text-muted-dark text-base leading-relaxed mb-6">
              {desc}
            </p>
            <a
              className={`inline-flex items-center text-sm font-semibold ${hoverColor} hover:underline`}
              href="#"
            >
              {linkText}
              <span className="material-symbols-outlined text-[16px] ml-1">
                arrow_forward
              </span>
            </a>
        </div>
    )
}

