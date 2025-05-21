import { Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import route from 'ziggy-js';

export default function Sidebar() {
  const { auth } = usePage<SharedData>().props;

  return (
    <aside className="fixed top-0 left-0 w-64 bg-gray-300 text-white h-screen p-5 border-r z-50">
       <Link href="/" className="text-2xl font-bold text-black">
        NusantaraTimes
        </Link>
      <h2 className="text-lg text-black font-bold mb-8">Portal Author</h2>
      <ul>
      <li><Link href="/dashboard/author/dashboard" className="block py-2 hover-gray text-black">Dashboard</Link></li>
      <li><Link href="/dashboard/author/posts" className="block py-2 text-black">Posts</Link></li>
      </ul>
      <div className="mt-10 text-sm">Logged in as<br /><strong>{auth.user.name}</strong></div> 
    </aside>
  );
}
