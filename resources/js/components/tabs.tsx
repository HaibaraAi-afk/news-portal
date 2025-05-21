import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Tabs() {
  const currentUrl = usePage().url; // Get current URL path
  const [active, setActive] = useState('');

  useEffect(() => {
    if (currentUrl.includes('/drafts')) {
      setActive('drafts');
    } else {
      setActive('content');
    }
  }, [currentUrl]);

  return (
    <div className="bg-gray-200 rounded border-b border-gray-700 flex">
      <button
        className={`px-4 py-2 text-sm font-semibold ${
          active === 'content' ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-300'
        }`}
        onClick={() => router.visit('/dashboard/author/posts')}
      >
        Content
      </button>
      <button
        className={`px-4 py-2 text-sm font-semibold ${
          active === 'drafts' ? 'bg-gray-900 text-white' : 'text-black hover:bg-gray-300'
        }`}
        onClick={() => router.visit('/dashboard/author/posts/drafts')}
      >
        Draft
      </button>
    </div>
  );
}
