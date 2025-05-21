// src/components/header.tsx
import { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import CategoryNav from './CategoryNav';
import FormLogin from '../formLogin';
import type { SharedData } from '@/types';


const currentDate = () => {
  return new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function Header({ date }: { date: string }) {
  const [open, setOpen] = useState(false);
  const [showFormLogin, setShowFormLogin] = useState(false);
  const { auth } = usePage<SharedData>().props;

  return (
    <div id="header" className="bg-white text-black px-4 md:px-16 py-6 font-sans sticky top-0 z-50 border-b">
      {/* Bagian header utama */}
      <div className="flex justify-between items-center pb-3">
        <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{currentDate()}</span>
        </div>
        <h1 className="text-2xl font-bold">NusantaraTimes</h1>

        {/* Auth Section */}
        {auth?.user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="border px-4 py-1 rounded text-sm hover:bg-gray-100"
            >
              {auth?.user?.name || auth?.user?.email?.split('@')[0]}
            </button>
            {open && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                {(auth.user.role === 'admin' || auth.user.role === 'author') && (
                  <Link
                    href={auth.user.role === 'admin'
                      ? '/Dashboard/Admin/dashboard'
                      : '/dashboard/author/dashboard'}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowFormLogin(true)}
              className="border px-4 py-1 rounded text-sm hover:bg-gray-100"
            >
              Login
            </button>
            {showFormLogin && <FormLogin onClose={() => setShowFormLogin(false)} />}
          </>
        )}
      </div>

      {/* Bagian Category Nav */}
      <CategoryNav onSelectCategory={() => {}} />
    </div>
  );
}
