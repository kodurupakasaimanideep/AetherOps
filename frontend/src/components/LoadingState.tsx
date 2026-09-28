import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Analyzing system state & searching memory engine...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
};
