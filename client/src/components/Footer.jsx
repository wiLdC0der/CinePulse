import React from 'react';
import { Film } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-red-600 flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">
              Cine<span className="text-red-500">Pulse</span>
            </span>
          </div>

          <div className="text-center text-xs text-slate-500 max-w-md">
            This product uses the TMDB API but is not endorsed or certified by TMDB. Movie metadata, artwork, and descriptions are powered by TMDB.
          </div>

          <div className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} CinePulse Movie Discovery. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
