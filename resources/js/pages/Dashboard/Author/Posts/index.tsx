import Layout from '@/components/layout';
import { useState, useEffect } from 'react';
import {router} from '@inertiajs/react';
import Tabs from '@/components/tabs';
import axios from 'axios';

export default function PostEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [publishedAt, setPublishedAt] = useState('');


  // Ambil draft ID dari query string dan data draft
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const draftIdParam = params.get('id');

    if (draftIdParam) {
      setDraftId(draftIdParam);
      axios.get(`/dashboard/author/posts/drafts/${draftIdParam}`)
        .then(res => {
          const draft = res.data;
          setTitle(draft.title);
          setContent(draft.content);
          setCaption(draft.caption);
          setCategory(draft.category);
          setPublishedAt(draft.published_at || '');
        })
        .catch(() => alert('Draft tidak ditemukan atau tidak punya akses.'));
    }
  }, []);

  // Restore draft dari localStorage
  useEffect(() => {
    const savedTitle = localStorage.getItem('draft_title');
    const savedContent = localStorage.getItem('draft_content');
    const savedCaption = localStorage.getItem('draft_caption');
    const savedCategory = localStorage.getItem('draft_category');
    const savedPublishedAt = localStorage.getItem('draft_published_at');
    if (savedPublishedAt) setPublishedAt(savedPublishedAt);

    if (savedTitle) setTitle(savedTitle);
    if (savedContent) setContent(savedContent);
    if (savedCaption) setCaption(savedCaption);
    if (savedCategory) setCategory(savedCategory);
  }, []);

  // Simpan ke localStorage setiap perubahan
  useEffect(() => {
    localStorage.setItem('draft_title', title);
    localStorage.setItem('draft_content', content);
    localStorage.setItem('draft_caption', caption);
    localStorage.setItem('draft_published_at', publishedAt);
    localStorage.setItem('draft_category', category);
  }, [title, content, caption, category]);

  // Ambil kategori dari API
  useEffect(() => {
    axios.get('/api/news/categories')
      .then((res) => {
        setCategories(res.data);
        if (!category && res.data.length > 0) {
          setCategory(res.data[0]); // hanya set default jika belum ada kategori
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil kategori", err);
      });
  }, []);

  
  const handleSave = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('caption', caption);
    formData.append('category', category);
    formData.append('published_at', publishedAt);
    if (image) formData.append('image', image);
    formData.append('status', 'draft');

    const route = draftId
      ? `/dashboard/author/posts/${draftId}`
      : '/dashboard/author/posts';

    if (draftId) {
      formData.append('_method', 'PUT');
      router.post(route, formData, {
        forceFormData:true,
        onSuccess: () => {
        alert('Draft saved!');
        localStorage.clear();
      },
      onError: (errors) => {
        console.error(errors);
        alert('Failed to save draft.');
      },} )
    } else {
      router.post(route, formData, {
        forceFormData:true,
        onSuccess: () => {
        alert('Draft saved!');
        localStorage.clear();
      },
      onError: (errors) => {
        console.error(errors);
        alert('Failed to save draft.');
      },})
    }

    // method(route, formData, {
    //   forceFormData: true,
      
    // });
  };

 return (
    <Layout>
      <Tabs />
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Judul Post</label>
          <input
            type="text"
            placeholder="Masukkan judul post..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Konten</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            placeholder="Tulis konten Anda di sini..."
          />
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-900">Gambar Utama</h3>
            <p className="mt-1 text-sm text-gray-500">Upload gambar utama untuk post ini</p>
          </div>
          
          <div className="mt-4 space-y-4">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <input
              type="text"
              placeholder="Caption gambar"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Publikasi</label>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleSave}
          >
            Simpan Draft
          </button>
        </div>
      </div>
    </Layout>
  );

}
