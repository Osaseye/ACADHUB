import React from "react";

export const Input = ({ label, id, type = "text", error, className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-text-light dark:text-text-dark"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 bg-white dark:bg-[#0d1117] border rounded-md shadow-sm outline-none transition-all
          ${error 
            ? "border-red-500 focus:ring-2 focus:ring-red-500/50" 
            : "border-border-light dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/50"
          }
          text-text-light dark:text-white placeholder-text-muted-light dark:placeholder-text-muted-dark
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};
