import React, { useState } from 'react';
import { ShoppingCart, Star, Book, Disc, Shirt } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  category: 'Books' | 'Media' | 'Apparel';
  price: number;
  image: string;
  rating: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    title: "The Power of Prophecy",
    category: "Books",
    price: 19.99,
    image: "https://picsum.photos/id/24/400/500",
    rating: 5
  },
  {
    id: 2,
    title: "Worship Anthem Vol. 1",
    category: "Media",
    price: 14.99,
    image: "https://picsum.photos/id/39/400/500",
    rating: 4
  },
  {
    id: 3,
    title: "Betel Fan T-Shirt",
    category: "Apparel",
    price: 24.99,
    image: "https://picsum.photos/id/100/400/500",
    rating: 5
  },
  {
    id: 4,
    title: "Understanding Grace DVD",
    category: "Media",
    price: 29.99,
    image: "https://picsum.photos/id/42/400/500",
    rating: 5
  },
  {
    id: 5,
    title: "Daily Devotional 2024",
    category: "Books",
    price: 12.99,
    image: "https://picsum.photos/id/20/400/500",
    rating: 4
  },
  {
    id: 6,
    title: "Youth Camp Hoodie",
    category: "Apparel",
    price: 39.99,
    image: "https://picsum.photos/id/1/400/500",
    rating: 5
  }
];

export const Store = () => {
  const [filter, setFilter] = useState('All');

  const filteredProducts = filter === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="bg-zinc-950 min-h-screen pt-20 pb-20">
      <div className="bg-zinc-900 border-b border-zinc-800 py-12 mb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Betel Ministry Store</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Support the ministry and grow in your faith with our curated collection of books, 
            sermon series, and apparel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filter Tabs */}
        <div className="flex justify-center mb-12 gap-4">
          {['All', 'Books', 'Media', 'Apparel'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full border transition ${
                filter === cat 
                  ? 'bg-red-600 border-red-600 text-white' 
                  : 'border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 group hover:border-red-900/50 transition duration-300">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-bold">
                  {product.category}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg text-gray-100 line-clamp-1">{product.title}</h3>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < product.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-700"} 
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">(24)</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                  <span className="text-xl font-bold text-white">${product.price}</span>
                  <button className="bg-white text-black hover:bg-gray-200 px-3 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition">
                    <ShoppingCart size={16} /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
