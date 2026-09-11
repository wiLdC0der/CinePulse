import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message = "Failed to load movie data. Please try again.", onRetry }) => {
  return (
    <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-5 my-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-red-200">Something went wrong</h4>
          <p className="text-xs text-red-300/80 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
