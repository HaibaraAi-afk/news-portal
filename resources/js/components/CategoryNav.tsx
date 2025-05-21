// src/components/CategoryNav.tsx
import React from 'react';

interface CategoryNavProps {
  onSelectCategory: (category: string) => void;
}

const categories = ["Olahraga", "Politik", "Kesehatan", "Nasional", "Ekonomi", "Sains", "Hukum"];

const CategoryNav: React.FC<CategoryNavProps> = ({ onSelectCategory }) => {
  return (
    <nav className="flex justify-center border-b pb-3 gap-5 mb-8 text-sm text-gray-700 font-medium">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className="hover:text-black"
        >
          {cat}
        </button>
      ))}
    </nav>
  );
};

export default CategoryNav;
