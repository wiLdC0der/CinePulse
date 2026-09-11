import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Film,
  title = "No movies found",
  description = "We couldn't find any movies matching your search criteria. Try adjusting your filters.",
  actionLabel = "Explore Popular Movies",
  actionTo = "/discover"
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 my-8 bg-slate-900/50 border border-slate-800/80 rounded-2xl">
      <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4 border border-slate-700/50">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-bold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-md shadow-red-950/40"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
