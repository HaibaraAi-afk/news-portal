import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function Sidebar() {
  const { auth } = usePage<SharedData>().props;

  // Ambil URL dari page agar bisa deteksi link aktif
  const { url } = usePage();
  const isActive = (path: string) => url.startsWith(path);

  return (
    <aside className="fixed top-0 left-0 w-64 bg-gray-800 text-white h-screen p-5 border-r z-50">
      <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300">
        NusantaraTimes
      </Link>
      <h2 className="text-lg font-bold mb-8 mt-4 text-gray-300">Portal Admin</h2>
      <ul className="space-y-2">
        <li>
          <Link 
            href="/dashboard/admin/dashboard"
            className={`block py-2 px-4 rounded transition-colors ${
              isActive('/dashboard/admin/dashboard')
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link 
            href="/dashboard/admin/addauthor"
            className={`block py-2 px-4 rounded transition-colors ${
              isActive('/dashboard/admin/addauthor')
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Add Author
          </Link>
        </li>
        <li>
          <Link 
            href="/dashboard/admin/news"
            className={`block py-2 px-4 rounded transition-colors ${
              isActive('/dashboard/admin/news')
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            News
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
