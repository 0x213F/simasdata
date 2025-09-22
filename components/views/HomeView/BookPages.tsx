import { BlogPost } from '@/lib/supabase';

export default function BookPages({ post }: { post: BlogPost }) {
  // Helper function to render pane content
  const renderPaneContent = (text?: string, imageUrl?: string) => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt="Blog post content"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else if (text) {
      return (
        <div className="text-slate-800 text-base leading-relaxed text-center">
          {text}
        </div>
      );
    } else {
      return (
        <div className="text-slate-400 text-base text-center">
          No content available
        </div>
      );
    }
  };

  return (
    <>
      {/* Mobile: Stacked Layout */}
      <div className="flex flex-col md:hidden gap-4 items-center">
        {/* Page 1 */}
        <div
          className={`bg-white rounded-lg shadow-lg aspect-square flex items-center justify-center border border-slate-200 ${post.pane_1_imgurl ? 'p-0 overflow-hidden' : 'p-6'}`}
          style={{ width: 'min(70vw, 60vh)' }}
        >
          {renderPaneContent(post.pane_1_text, post.pane_1_imgurl)}
        </div>

        {/* Page 2 */}
        <div
          className={`bg-white rounded-lg shadow-lg aspect-square flex items-center justify-center border border-slate-200 ${post.pane_2_imgurl ? 'p-0 overflow-hidden' : 'p-6'}`}
          style={{ width: 'min(70vw, 60vh)' }}
        >
          {renderPaneContent(post.pane_2_text, post.pane_2_imgurl)}
        </div>
      </div>

      {/* Desktop: Side-by-side Layout */}
      <div className="hidden md:flex gap-8 items-center justify-center">
        {/* Left Page */}
        <div
          className={`bg-white rounded-lg shadow-lg aspect-square flex items-center justify-center border border-slate-200 ${post.pane_1_imgurl ? 'p-0 overflow-hidden' : 'p-8'}`}
          style={{ width: 'min(35vw, 40vh)' }}
        >
          {renderPaneContent(post.pane_1_text, post.pane_1_imgurl)}
        </div>

        {/* Right Page */}
        <div
          className={`bg-white rounded-lg shadow-lg aspect-square flex items-center justify-center border border-slate-200 ${post.pane_2_imgurl ? 'p-0 overflow-hidden' : 'p-8'}`}
          style={{ width: 'min(35vw, 40vh)' }}
        >
          {renderPaneContent(post.pane_2_text, post.pane_2_imgurl)}
        </div>
      </div>
    </>
  );
}