import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';

export default function HomePage({ title }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={title} />
            <header className="flex justify-between items-center border-b pb-3 mb-3">
                {auth.user ? (
                    <div className="relative group">
                        <button className="border px-4 py-1 rounded text-sm hover:bg-gray-100">
                            {auth.user.name || auth.user.email.split('@')[0]}
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                            <Link 
                                href={auth.user.role === 'admin' ? '/admin' : '/dashboard'} 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                ) : null}
            </header>
        </>
    );
}
//                         className={`w-full bg-blue-500 text-white py-2 rounded ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}