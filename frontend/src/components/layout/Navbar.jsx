import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Input } from '../ui/Input';

export function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="w-full max-w-md hidden sm:block">
          <Input 
            placeholder="Search complaints..." 
            icon={<Search className="h-4 w-4" />}
            className="bg-slate-50 border-transparent focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-500 transition-colors">
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
