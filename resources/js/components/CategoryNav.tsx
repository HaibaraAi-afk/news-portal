// src/components/CategoryNav.tsx
import React from 'react';
import { usePage } from '@inertiajs/react';

interface CategoryNavProps {
  onSelectCategory: (category: string) => void;
  activeCategory?: string; // Tambahkan prop untuk kategori aktif
}

const categories = ["Olahraga", "Politik", "Kesehatan", "Nasional", "Ekonomi", "Sains", "Hukum"];

const CategoryNav: React.FC<CategoryNavProps> = ({ 
  onSelectCategory,
  activeCategory 
}) => {
  return (
    <nav className="flex justify-center border-b pb-3 gap-5 mb-8 text-sm text-gray-700 font-medium">
      {categories.map(cat => {
        const isActive = activeCategory?.toLowerCase() === cat.toLowerCase();
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`hover:text-black transition-colors ${
              isActive 
                ? 'text-black font-bold border-b-2 border-black' 
                : ''
            }`}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
};

export default CategoryNav;