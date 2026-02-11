import React from "react";

export const Pipeline = () => {
  return (
    <section className="py-24 bg-white dark:bg-[#0d1117] overflow-hidden border-t border-border-light dark:border-border-dark">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
          <div className="max-w-2xl">
            <span className="block text-accent font-mono text-sm font-semibold mb-3 tracking-wider">
              PIPELINE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-text-light dark:text-white mb-6 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl text-text-muted-light dark:text-text-muted-dark">
              From raw search to refined insight. A seamless pipeline designed for
              academic rigor.
            </p>
          </div>
          <div className="hidden md:block">
            <a
              className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-2 group"
              href="#"
            >
              View Documentation
              <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
        <div className="relative mt-12">
          <div className="hidden md:block absolute top-[28px] left-0 w-full h-[2px] pipeline-line z-0"></div>
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="relative group">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-[#0d1117] border-2 border-border-light dark:border-border-dark flex items-center justify-center shadow-sm z-10 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors text-2xl">
                    search
                  </span>
                </div>
                <div className="flex-1 h-[2px] bg-transparent md:hidden"></div>
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-white mb-2">
                1. Semantic Search
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm leading-relaxed mb-4">
                Input your topic. Our engine understands context, finding relevant
                projects across all levels.
              </p>
              <div className="bg-surface-light dark:bg-[#161b22] p-4 rounded-md border border-border-light dark:border-border-dark font-mono text-xs text-text-muted-dark">
                <span className="text-purple-500">query</span>
                ("machine learning")
                <br />
                <span className="text-text-muted-light">.filter</span>
                (level="MSc")
                <br />
                <span className="text-green-500">.execute()</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-[#0d1117] border-2 border-border-light dark:border-border-dark flex items-center justify-center shadow-sm z-10 group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark group-hover:text-accent transition-colors text-2xl">
                    psychology
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-white mb-2">
                2. AI Extraction
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm leading-relaxed mb-4">
                We scan full-text PDFs, extracting methodology and assigning
                quality scores instantly.
              </p>
              <div className="bg-surface-light dark:bg-[#161b22] p-4 rounded-md border border-border-light dark:border-border-dark font-mono text-xs text-text-muted-dark">
                <span className="text-blue-500">await</span> extract_entities()
                <br />
                <span className="text-text-muted-light">=&gt;</span> {"{"}{" "}
                methodology: <span className="text-orange-400">"CNN"</span> {"}"}
                <br />
                <span className="text-green-500">DONE</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-[#0d1117] border-2 border-border-light dark:border-border-dark flex items-center justify-center shadow-sm z-10 group-hover:border-secondary group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-text-muted-light dark:text-text-muted-dark group-hover:text-secondary transition-colors text-2xl">
                    bar_chart
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-white mb-2">
                3. Visual Insights
              </h3>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm leading-relaxed mb-4">
                Get a comprehensive dashboard of the research landscape,
                exportable for your thesis.
              </p>
              <div className="bg-surface-light dark:bg-[#161b22] p-4 rounded-md border border-border-light dark:border-border-dark font-mono text-xs text-text-muted-dark flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-secondary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-sm">
                    download
                  </span>
                </div>
                <span>report_final.pdf generated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
