import { router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Props {
  newsId: number;
  onLoginRequest: () => void;
  isAuthenticated: boolean;
}

export default function ShareUpvote({ newsId, onLoginRequest, isAuthenticated, userId }: Props) {
  const [upvoted, setUpvoted] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetch(`/api/news/${newsId}/like-status?user_id=${userId}`, {
      headers: {
        'Content-Type': 'application/json',}
      }
    )
      .then(res => res.json())
      .then(data => {
        setUpvoted(data.liked);
        setLikesCount(data.likes_count);
      });
  }, [newsId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      });
    } else {
      alert("Share menggunakan: \n" + window.location.href);
    }
  };

  const handleUpvote = () => {
    if (!isAuthenticated) {
      onLoginRequest();
      return;
    }

    if (upvoted) return;

    // router.post(`/news/${newsId}/like`)

    fetch(`/api/news/${newsId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
    }).then(res => {
      if (res.ok) {
        setUpvoted(true);
        setLikesCount(prev => prev + 1);
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="flex items-center gap-4">
        <button
          onClick={handleUpvote}
          disabled={upvoted}
          className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            upvoted
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          <span className="text-xl">👍</span>
          <span>{upvoted ? 'Telah Disukai' : 'Sukai'}</span>
        </button>

        <button
          onClick={handleShare}
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <span className="text-xl">📤</span>
          Bagikan
        </button>
      </div>
      
      {!isAuthenticated && (
        <p className="text-sm text-gray-600">
          Login untuk menyukai berita ini
        </p>
      )}
    </div>
  );
}