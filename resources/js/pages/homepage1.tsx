import React, { useState } from "react";
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import LoginModal from "./auth/signin";

interface HomePageProps {
  title: string;
}

const currentDate = () => {
  return new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function HomePage(props: HomePageProps) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      <div className="bg-white text-black px-4 md:px-16 py-6 font-sans">
      <Head title={props.title}/>
      <header className="flex justify-between items-center border-b pb-3 mb-3">
        <div className="flex items-center gap-4 border-r pr-4">
          <span className="text-sm text-gray-600">{currentDate()}</span>
        </div>
        <h1 className="text-2xl font-bold">NusantaraTimes</h1>
        <button
            onClick={() => setShowLogin(true)}
            className="border px-4 py-1 rounded text-sm hover:bg-gray-100"
          >
            Login
          </button>
      </header>

      <nav className="flex justify-center border-b pb-3 gap-5 mb-8 text-sm text-gray-700 font-medium">
        {["Olahraga", "Politik", "Kesehatan", "Nasional", "Ekonomi", "Sains", "Hukum"].map(cat => (
          <a key={cat} href="#" className="hover:text-black">{cat}</a>
        ))}
      </nav>

      <section className="mb-10 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4">Top Stories</h2>
          <h3 className="text-lg font-semibold mb-2">Kocak! Bebek Kakinya Dua Puluh Lima Ribu Buah</h3>
          <p className="text-sm text-gray-600 mb-4">Lorem ipsum dolor sit amet consectetur adipiscing elit...</p>
          <div className="bg-gray-300 w-full h-48" />
        </div>
        
        <div className="border-l pl-4">
          <h2 className="text-xl font-bold mb-4">Berita Terkini</h2>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-2 items-start pb-2">
              <div className="bg-gray-300 w-20 h-14" />
              <div>
                <p className="text-xs text-gray-500 mb-1">28 Februari 2025</p>
                <h4 className="text-sm font-medium leading-tight">Buah Naga Ternyata Merupakan Keturunan Naga</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="text-center border py-10 mb-8 text-gray-500">Ads</div>
        <h2 className="text-xl font-bold mb-4">You Must Know</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <div className="bg-gray-300 w-full h-32 mb-2" />
              <p className="text-sm font-medium">Buah Naga Ternyata Merupakan Keturunan Naga</p>
              <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Olahraga</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
            <div key={i}className="flex gap-3 items-start">
              <div className="bg-gray-300 w-40 h-20 flex-shirnk-0" />
              <p className="text-sm font-medium leading-tight">Buah Naga Ternyata Merupakan Keturunan Naga</p>
              <p className="text-xs text-gray-500">Lorem ipsum dolor sit amet...</p>
            </div>
          ))}
        </div>
      </section>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    </>
  );
}
