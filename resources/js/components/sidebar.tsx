import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function Sidebar() {
  const page = usePage<SharedData>();
  const { auth } = page.props;
  const { url } = page;

  const isActive = (path: string) => url.startsWith(path);

  return (
    <aside className="fixed top-0 left-0 w-64 bg-gray-800 text-white h-screen p-5 border-r z-50">
      <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
        NusantaraTimes
      </Link>
      <h2 className="text-lg font-bold mb-8 mt-4 text-gray-300">Portal Author</h2>
      <ul className="space-y-2">
        <li>
          <Link 
            href="/dashboard/author/dashboard" 
            className={`block py-2 px-4 rounded transition-colors ${
              isActive('/dashboard/author/dashboard') 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            href="/dashboard/author/posts" 
            className={`block py-2 px-4 rounded transition-colors ${
              isActive('/dashboard/author/posts') 
                ? 'bg-gray-900 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Posts
          </Link>
        </li>
      </ul>
      <div className="mt-10 text-sm text-gray-400">
        Logged in as<br />
        <strong className="text-white">{auth.user.name}</strong>
      </div> 
    </aside>
  );
}
