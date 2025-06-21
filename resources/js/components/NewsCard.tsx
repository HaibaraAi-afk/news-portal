// src/components/NewsCard.tsx
import React from 'react';
import { Link } from '@inertiajs/react';

interface NewsCardProps {
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

const NewsCard: React.FC<NewsCardProps> = ({ 
  id, 
  title, 
  caption, 
  category, 
  image, 
  author, 
  published_at 
}) => {
  // Format tanggal
  const formattedDate = new Date(published_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Link href={`/news/${id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {image && (
          <div className="w-full h-48 overflow-hidden">
            <img 
              src={`/storage/${image}`} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
            {category}
          </span>
          <h3 className="font-bold text-lg mt-2 mb-1 line-clamp-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-3">{caption}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{author.name}</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;