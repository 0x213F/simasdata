import { ArrowLeft, ArrowRight } from 'lucide-react';
import { formatTimestamp } from './utils';

export default function NavigationButtons({
  onNavigateNewer,
  onNavigateOlder,
  cooldownActive,
  timestamp
}: {
  onNavigateNewer: () => void;
  onNavigateOlder: () => void;
  cooldownActive: boolean;
  timestamp: string;
}) {
  const formattedDate = formatTimestamp(timestamp);

  return (
    <>
      {/* Mobile Navigation - Stacked Layout */}
      <div className="flex flex-col md:hidden gap-4 items-center">
        {/* Timestamp */}
        <div className="text-slate-500 text-sm font-mono tracking-wider">
          {formattedDate}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onNavigateNewer}
            disabled={cooldownActive}
            className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center cursor-pointer group"
            title="Newer post (page left)"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:rotate-9 transition-transform duration-200" />
          </button>

          <button
            onClick={onNavigateOlder}
            disabled={cooldownActive}
            className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center cursor-pointer group"
            title="Older post (page right)"
          >
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:-rotate-9 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* Desktop Navigation - Left/Right Panel Layout */}
      <div className="hidden md:flex gap-8 items-center justify-center mt-6">
        {/* Left Panel - Same width as blog post (w-80) */}
        <div className="w-80 flex items-center justify-start">
          <div className="text-slate-500 text-sm font-mono tracking-wider">
            {formattedDate}
          </div>
        </div>

        {/* Right Panel - Same width as blog post (w-80) */}
        <div className="w-80 flex items-center justify-end">
          <div className="flex gap-4">
            <button
              onClick={onNavigateNewer}
              disabled={cooldownActive}
              className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center cursor-pointer group"
              title="Newer post (page left)"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:rotate-9 transition-transform duration-200" />
            </button>

            <button
              onClick={onNavigateOlder}
              disabled={cooldownActive}
              className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center cursor-pointer group"
              title="Older post (page right)"
            >
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:-rotate-9 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}