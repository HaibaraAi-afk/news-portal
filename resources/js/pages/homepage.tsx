import React, { useState } from "react";
import { Head, Link, usePage, router } from '@inertiajs/react'; // Tambahkan router
import FormLogin from '../formLogin';
import CategoryNav from "@/components/CategoryNav";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image: string;
  category: string;
  published_at: string;
  likes_count: number;
  views_count: number;
}

interface HomePageProps {
  topStories?: NewsItem[];
  recentNews?: NewsItem[];
  popularNews?: NewsItem[];
  nasionalNews?: NewsItem[];
  auth: {
    user?: {
      id: number;
      name: string;
      email: string;
      role: string;
      image?: string;
    } | null;
  };
}

const currentDate = () => {
  return new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function HomePage() {
  const { props } = usePage<HomePageProps>();
  const { 
    topStories = [], 
    recentNews = [], 
    popularNews = [], 
    nasionalNews = [], 
    auth 
  } = props as any; // Gunakan as any untuk sementara
  
  const [showFormLogin, setShowFormLogin] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Nasional');
  const [categoryNews, setCategoryNews] = useState<NewsItem[]>([]);

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    // Menggunakan Inertia untuk mendapatkan berita berdasarkan kategori
    router.get(`/news/category/${cat.toLowerCase()}`, {}, {
      preserveState: true,
      onSuccess: (page) => {
        // Pastikan data ada sebelum di-set
        if (page.props.news) {
          setCategoryNews(page.props.news);
        } else {
          setCategoryNews([]);
        }
      }
    });
  };

  // Gunakan categoryNews jika ada, jika tidak gunakan data default
  const displayTopStories = categoryNews.length > 0 
    ? categoryNews.slice(0, 1) 
    : topStories;

  const displayRecentNews = categoryNews.length > 0
    ? categoryNews.slice(1, 5)
    : recentNews;

  return (
    <>
      <div className="bg-white text-black px-4 md:px-16 py-6 font-sans">
        <Head title="Home Page" />
        <header className="flex justify-between items-center border-b pb-3 mb-3">
          <div className="flex items-center gap-4 border-r pr-4">
            <span className="text-sm text-gray-600">{currentDate()}</span>
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

        <CategoryNav 
          onSelectCategory={handleCategoryClick} 
          activeCategory={selectedCategory}
        />

        <section className="mb-10 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Top Stories</h2>
            
            {/* Tambahkan pengecekan sebelum map */}
            {displayTopStories && displayTopStories.length > 0 ? (
              <>
                {displayTopStories.map(story => (
                  <Link href={`/news/${story.id}`} key={story.id}>
                    <div className="cursor-pointer hover:opacity-90 transition-opacity">
                      <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {story.content.substring(0, 100)}...
                      </p>
                      {story.image ? (
                        <img 
                          src={`/storage/${story.image}`} 
                          alt={story.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="bg-gray-300 w-full h-48" />
                      )}
                    </div>
                  </Link>
                ))}
              </>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tidak ada berita</h3>
                <div className="bg-gray-300 w-full h-48" />
              </div>
            )}
          </div>

          <div className="border-l pl-4">
            <h2 className="text-xl font-bold mb-4">Berita Terkini</h2>
            
            {/* Tambahkan pengecekan sebelum map */}
            {displayRecentNews && displayRecentNews.length > 0 ? (
              displayRecentNews.map(item => (
                <Link href={`/news/${item.id}`} key={item.id} className="flex gap-2 items-start pb-2 hover:bg-gray-50 p-1 rounded">
                  {item.image ? (
                    <img 
                      src={`/storage/${item.image}`} 
                      alt={item.title}
                      className="w-20 h-14 object-cover"
                    />
                  ) : (
                    <div className="bg-gray-300 w-20 h-14" />
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {new Date(item.published_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <h4 className="text-sm font-medium leading-tight">{item.title}</h4>
                  </div>
                </Link>
              ))
            ) : (
              <p>Tidak ada berita terkini</p>
            )}
          </div>
        </section>

        <section className="mb-10">
          <div className="text-center border py-10 mb-8 text-gray-500">Ads</div>
          <h2 className="text-xl font-bold mb-4">You Must Know</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Tambahkan pengecekan sebelum map */}
            {popularNews && popularNews.length > 0 ? (
              popularNews.map(item => (
                <div key={item.id}>
                  <Link href={`/news/${item.id}`} className="hover:opacity-90 transition-opacity">
                    {item.image ? (
                      <img 
                        src={`/storage/${item.image}`} 
                        alt={item.title}
                        className="w-full h-32 object-cover mb-2"
                      />
                    ) : (
                      <div className="bg-gray-300 w-full h-32 mb-2" />
                    )}
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {item.content.substring(0, 50)}...
                    </p>
                  </Link>
                </div>
              ))
            ) : (
              <p>Tidak ada berita populer</p>
            )}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Nasional</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* Tambahkan pengecekan sebelum map */}
            {nasionalNews && nasionalNews.length > 0 ? (
              nasionalNews.map(item => (
                <div key={item.id}>
                  <Link href={`/news/${item.id}`} className="hover:opacity-90 transition-opacity">
                    {item.image ? (
                      <img 
                        src={`/storage/${item.image}`} 
                        alt={item.title}
                        className="w-40 h-20 object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="bg-gray-300 w-40 h-20 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium leading-tight">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        {item.content.substring(0, 30)}...
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>Tidak ada berita Nasional</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}