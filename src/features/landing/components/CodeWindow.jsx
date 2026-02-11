import React, { useState, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme
import "prismjs/themes/prism-coy.css";      // Light theme (optional, but CSS conflicts might occur if simply importing both. 
// A better approach for Prism themes in light/dark mode with exact control is usually manual CSS or specialized dynamic imports.
// For now, I will use Tailwind classes to style the container and let Prism handle the syntax colors which are usually fine in both or typically dark-oriented code blocks are acceptable in light mode too for contrast.)
// However, the user specifically asked for Light Mode in the code window.
// Standard Prism themes inject global styles. To support both, we often need to scope them or switch them. 
// Given the complexity of hot-swapping Prism CSS files in React without a reload, I will stick to a neutral or dark code appearance (like most IDEs even in light OS theme) 
// BUT I will change the *Window Frame* and *Background* to respond to light mode as requested.

const codeSnippet = `import acadhub

# Initialize the research assistant
client = acadhub.Client(api_key="ah_live_x9z2...")

# Search for latest papers on "CRISPR"
papers = client.search(
    query="genetic engineering",
    filter={"year": "2024", "citations": ">50"}
)

# Generate AI summaries
for paper in papers:
    print(f"Analyzing: {paper.title}")
    summary = client.summarize(paper.id)`;

export const CodeWindow = () => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(codeSnippet.slice(0, index));
      index++;
      if (index > codeSnippet.length) {
        clearInterval(intervalId);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, []);

  const highlightedCode = Prism.highlight(
    displayedText,
    Prism.languages.python,
    "python"
  );

  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-2xl bg-white dark:bg-[#0d1117] border border-border-light dark:border-border-dark font-mono text-sm leading-relaxed relative z-20 transform transition-transform hover:scale-[1.01] duration-500">
      {/* Window Header */}
      <div className="flex items-center px-4 py-3 bg-surface-light dark:bg-[#161b22] border-b border-border-light dark:border-border-dark">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
        </div>
        <div className="ml-4 text-xs text-text-muted-light dark:text-text-muted-dark font-sans opacity-70">research_script.py</div>
      </div>

      {/* Code Area */}
      {/* We keep the background dark for code readability usually, but user asked for light mode support. 
          If we want a truly light editor, we need text updates. 
          For simplicty and contrast, a light editor usually has white bg and dark text.
      */}
      <div className="p-6 overflow-x-auto min-h-[300px] bg-white dark:bg-[#0d1117] text-gray-800 dark:text-gray-200">
        <style>{`
            /* Override Prism Default Text Colors for Light Mode if needed via CSS specificity or just reliance on standard text classes */
            /* Actually, Prism themes are powerful. Let us treat the code block as "always dark" for high contrast aesthetics generally favoured 
               OR we assume the prism-tomorrow.css is loaded. 
               If we want light mode code, we might need a different tokenizer strategy or CSS override.
               For this iteration, I will make the *container* light, and the code text dark using global styles if possible, 
               but primarily I will ensure the surrounding UI is light-aware.
               
               To properly support light syntax highlighting without loading a second CSS file, 
               we often just rely on the fact that code editors are often dark. 
               However, to support the user request "code window needs to have a light mode",
               I will ensure the background and text colors flip.
            */
            .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
                color: #a67f59; /* Example override or reliance on theme */
            }
        `}</style>
        <pre className="m-0 bg-transparent p-0 font-mono text-[13px] leading-6 whitespace-pre-wrap break-words">
          <code
            className="language-python"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            style={{ textShadow: "none" }} // Remove prism default shadow if any
          />
          <span className="inline-block w-2.5 h-5 ml-1 align-middle bg-primary animate-pulse" />
        </pre>
      </div>
    </div>
  );
};

