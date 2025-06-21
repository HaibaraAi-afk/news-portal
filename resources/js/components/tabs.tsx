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
    <div className="flex border-b bg-white border-gray-200 rounded-t-2xl">
  <button
    className={`px-4 py-3 text-sm font-medium ${
      active === 'content' 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
    }`}
        onClick={() => router.visit('/dashboard/author/posts')}
      >
        Content
  </button>
  <button
    className={`px-4 py-3 text-sm font-medium ${
      active === 'drafts' 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
    }`}
        onClick={() => router.visit('/dashboard/author/posts/drafts')}
      >
        Draft
      </button>
    </div>
  );
}
