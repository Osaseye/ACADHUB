import React from "react";

export const Hero = () => {
  return (
    <section id="product" className="relative pt-24 pb-32 overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNkMGQ3ZGUiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:[mask-image:linear-gradient(to_bottom,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-12 lg:text-center flex flex-col items-center">

          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight text-text-light dark:text-white mb-6 leading-[1] text-center max-w-4xl mx-auto">
            Intelligent Research <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Future Scholars
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-text-muted-light dark:text-text-muted-dark mb-10 max-w-2xl text-center leading-normal font-light mx-auto">
            Leverage AI to connect millions of academic papers. Visualize data,
            discover trends, and accelerate your thesis workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-4 max-w-xl mx-auto mb-16">
            <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-opacity-90 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2 text-lg">
              Get Started for Free
              <span className="material-symbols-outlined text-[20px]">
                rocket_launch
              </span>
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-surface-dark hover:bg-surface-light dark:hover:bg-[#21262d] text-text-light dark:text-white font-semibold border border-border-light dark:border-border-dark rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-lg">
              View Documentation
              <span className="material-symbols-outlined text-[20px]">
                description
              </span>
            </button>
          </div>

          <div className="w-full max-w-5xl mx-auto relative rounded-xl overflow-hidden shadow-2xl border border-border-light dark:border-border-dark bg-black group">
             {/* Abstract Video Player UI */}
             <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                {/* Simulated Thumbnail / Video Content */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('/assets/dashboard-preview.png')] bg-cover bg-center"></div> 
                {/* Note: In a real app, use an <img /> or <video /> tag here. */}
                
                {/* Play Button Overlay */}
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 cursor-pointer group-hover:scale-110 transition-transform z-10">
                     <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40">
                        <span className="material-symbols-outlined text-white text-4xl ml-1">play_arrow</span>
                     </div>
                </div>

                {/* Video UI Controls (Cosmetic) */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-end px-6 py-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                        <div className="w-1/3 h-full bg-primary relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
                        </div>
                     </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

