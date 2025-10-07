import { LayoutType } from './types';

interface BalancingDecorProps {
  layoutType: LayoutType;
  itemCount: number;
}

/**
 * Decorative elements that balance the page when there are few items
 * Provides visual interest without cluttering the minimal aesthetic
 */
export default function BalancingDecor({ layoutType, itemCount }: BalancingDecorProps) {
  // Only show decor for 1-3 items
  if (itemCount > 3) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Subtle geometric shapes in the background */}
      {layoutType === 'single-centered' && (
        <>
          {/* Top right circle */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50 blur-3xl"></div>

          {/* Bottom left circle */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-slate-50 to-slate-100 opacity-40 blur-3xl"></div>
        </>
      )}

      {layoutType === 'duo-horizontal' && (
        <>
          {/* Top center accent */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-gray-50 to-transparent opacity-30 blur-3xl"></div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </>
      )}

      {layoutType === 'trio-asymmetric' && (
        <>
          {/* Diagonal accent */}
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-gradient-to-bl from-slate-50 to-transparent opacity-25 blur-3xl"></div>
        </>
      )}
    </div>
  );
}
