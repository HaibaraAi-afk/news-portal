import { useEffect, useState } from 'react';
import { NewsItem } from '@/types';
import Header from '@/components/header';
import ShareUpvote from '@/components/share-and-vote';
import FormLogin from '@/formLogin';
import { usePage } from '@inertiajs/react';

export default function NewsDetail() {
  const { auth } = usePage().props;
  const [showLogin, setShowLogin] = useState(false);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const id = window.location.pathname.match(/\/news\/(\d+)/)?.[1];

  // Handle view tracking
  useEffect(() => {
    if (!id) return;

    const trackView = async () => {
      try {
        await fetch(`/api/news/${id}/view`, { method: 'POST' });
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    trackView();
  }, [id]);

  // Fetch news data
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/news/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
      })
      .then(data => {
        if (data.status === 'success') {
          setNews(data.data);
        }
      })
      .catch(err => {
        console.error('Error:', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Scroll handler for header
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (header) {
        header.classList.toggle('opacity-0', window.scrollY > 50);
        header.classList.toggle('pointer-events-none', window.scrollY > 50);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!id) return <div className="text-center mt-10">Invalid news ID</div>;
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!news) return <div className="text-center mt-10">News not found</div>;

  return (
    <>
      <Header date={new Date(news.published_at).toLocaleDateString('id-ID')} />
      {showLogin && <FormLogin onClose={() => setShowLogin(false)} />}
      
      <div className="pt-20 px-4 md:px-0 flex justify-center bg-white text-black min-h-screen">
        <div className="w-full max-w-4xl px-4">
          <div className="mb-8">
            <button 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
            >
              ← Kembali
            </button>
            <h1 className="text-4xl font-bold mb-4 leading-tight">{news.title}</h1>
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <span className="font-medium">{news.author.name}</span>
              <span>•</span>
              <span>{news.category}</span>
              <span>•</span>
              <span>{new Date(news.published_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>

          {news.image && (
            <img
              src={`/storage/${news.image}`}
              alt={news.title}
              className="w-full h-96 object-cover rounded-xl mb-8 shadow-lg"
            />
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: news.content }} />
          </div>

          <div className="border-t pt-8">
            <ShareUpvote 
              newsId={parseInt(id)} 
              onLoginRequest={() => setShowLogin(true)}
              isAuthenticated={!!auth && !!auth.user}
              userId={auth?.user?.id || null}
            />
          </div>
        </div>
      </div>
    </>
  );
}