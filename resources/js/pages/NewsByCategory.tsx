// src/Pages/NewsByCategory.tsx
import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import FormLogin from '../formLogin';
import CategoryNav from '../components/CategoryNav';
import NewsCard from '../components/NewsCard';

interface NewsItem {
  id: number;
  title: string;
  caption: string;
  category: string;
  image?: string;
  author: {
    name: string;
  };
  published_at: string;
}

const NewsByCategory = ({ category: initialCategory }: { category: string }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  
  // Ambil data user dari halaman
  const { auth } = usePage<SharedData>().props;
  const [showFormLogin, setShowFormLogin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNewsByCategory(selectedCategory);
  }, [selectedCategory]);

  const fetchNewsByCategory = (category: string) => {
    setLoading(true);
    fetch(`/api/news/published?category=${category}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setNews(data.data);
        } else {
          console.error('Failed to fetch news:', data.message);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
        setLoading(false);
      });
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    router.visit(`/news/category/${category.toLowerCase()}`);
  };

  return (
    <div className="bg-white text-black px-4 md:px-16 py-6 font-sans min-h-screen">
      <Head title={`Berita ${selectedCategory}`} />
      
      {/* Header Sama seperti Homepage */}
      <header className="flex justify-between items-center border-b pb-3 mb-3">
        <div className="flex items-center gap-4 border-r pr-4">
          <span className="text-sm text-gray-600">{new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</span>
        </div>
        <Link href="/" className="text-2xl font-bold">NusantaraTimes</Link>
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
                    href={auth.user?.role === 'admin' ? '/dashboard/admin/dashboard' : '/dashboard/author/dashboard'}
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
            <button onClick={() => setShowFormLogin(true)} className="border px-4 py-1 rounded text-sm hover:bg-gray-100">
              Login
            </button>
            {showFormLogin && <FormLogin onClose={() => setShowFormLogin(false)} />}
          </>
        )}
      </header>

      {/* Gunakan CategoryNav dengan prop activeCategory */}
      <CategoryNav 
        onSelectCategory={handleSelectCategory} 
        activeCategory={selectedCategory} 
      />
      
      {/* Konten Utama */}
      <main className="py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Berita {selectedCategory}</h1>
        
        {loading ? (
          <div className="text-center py-8">Memuat berita...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-8">Tidak ada berita dalam kategori ini.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <NewsCard
                key={item.id}
                id={item.id}
                title={item.title}
                caption={item.caption || ''}
                category={item.category}
                image={item.image}
                author={item.author}
                published_at={item.published_at}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer Sama seperti Homepage */}
      <footer className="border-t mt-12 pt-6 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} NusantaraTimes. All rights reserved.
      </footer>
    </div>
  );
};

export default NewsByCategory;