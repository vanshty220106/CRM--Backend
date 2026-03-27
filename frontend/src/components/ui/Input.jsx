import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, type = 'text', icon, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          icon && 'pl-10',
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
