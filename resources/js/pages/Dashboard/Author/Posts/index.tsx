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
    if (image) formData.append('image', image);
    formData.append('status', 'draft');

    const route = draftId
      ? `/dashboard/author/posts/${draftId}`
      : '/dashboard/author/posts';

    if (draftId) {
      router.put(route, formData,{
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
      <div className="bg-gray-200 text-white p-6 rounded shadow-md">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-100 border border-gray-700 rounded text-black placeholder-gray-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-black font-medium">Text</label>
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 bg-gray-100 border border-gray-700 rounded text-black placeholder-gray-400"
            placeholder="Write your content here..."
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm text-black font-medium">Upload Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-black file:bg-gray-500 file:border-0 file:px-4 file:py-2 file:text-black"
          />
          <input
            type="text"
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-2 w-full p-2 bg-gray-100 border border-gray-700 rounded text-black placeholder-gray-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-sm text-black font-medium">Post Date</label>
            <input
              type="datetime-local"
              className="w-full p-2 bg-gray-100 border border-gray-700 rounded text-black"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm text-black font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-gray-100 border border-gray-700 rounded text-black"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="px-6 py-2 bg-gray-500 text-black font-semibold rounded hover:bg-gray-300"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </Layout>
  );
}
