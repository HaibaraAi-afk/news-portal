import { usePage, router } from '@inertiajs/react';
import Layout from '@/components/layout-admin';
import { useState } from 'react';

type News = {
  id: number;
  title: string;
  content: string;
  image?: string;
  author: {
    name: string;
  };
  category: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  created_at: string;
};

type Flash = {
  success?: string;
  error?: string;
};

type NewsManagementProps = {
  allNews: News[];
  pendingNews: News[];
  flash: Flash;
};

export default function NewsManagement() {
  const { allNews = [], pendingNews = [], flash = {} } = usePage<PageProps<NewsManagementProps>>().props;
  const [viewMode, setViewMode] = useState<'all' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const currentNews = viewMode === 'all' ? allNews : pendingNews;

  const filteredNews = currentNews.filter(news =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (newsId: number) => {
    router.post(`/dashboard/admin/news/${newsId}/approve`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['allNews', 'pendingNews'] });
        setSelectedNews(null);
      }
    });
  };

  const handleReject = (newsId: number) => {
    router.post(`/dashboard/admin/news/${newsId}/reject`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['allNews', 'pendingNews'] });
        setSelectedNews(null);
      }
    });
  };

  const statusBadge = (status: string) => {
    const baseStyle = "px-3 py-1 rounded-full text-sm";
    const styles = {
      draft: `${baseStyle} bg-gray-100 text-gray-800 border border-gray-300`,
      pending: `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-300`,
      approved: `${baseStyle} bg-green-100 text-green-800 border border-green-300`,
      rejected: `${baseStyle} bg-red-100 text-red-800 border border-red-300`,
    };
    
    return (
      <span className={styles[status]}>
        {status}
      </span>
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Manajemen Berita</h1>
          <p className="text-gray-600">
            Kelola dan tinjau semua berita yang dibuat oleh penulis
          </p>
        </div>

        {/* Notifikasi */}
        {flash.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
            {flash.success}
          </div>
        )}
        {flash.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {flash.error}
          </div>
        )}

        {/* Filter dan Pencarian */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setViewMode('all');
                setSelectedNews(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'all' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Semua Berita ({allNews.length})
            </button>
            <button
              onClick={() => setViewMode('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'pending'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Perlu Persetujuan ({pendingNews.length})
            </button>
          </div>
          <input
            type="text"
            placeholder="Cari berdasarkan judul, penulis, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-96 px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabel */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-white text-left text-sm font-semibold">Judul</th>
                    <th className="px-6 py-4 text-white text-left text-sm font-semibold">Penulis</th>
                    <th className="px-6 py-4 text-white text-left text-sm font-semibold">Kategori</th>
                    <th className="px-6 py-4 text-white text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-white text-left text-sm font-semibold">Tanggal</th>
                    <th className="px-6 py-4 text-white text-left text-sm font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredNews.map((news) => (
                    <tr 
                      key={news.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        viewMode === 'pending' ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => viewMode === 'pending' && setSelectedNews(news)}
                    >
                      <td className="px-6 py-4 max-w-xs text-sm font-medium text-gray-900">
                        <div className="line-clamp-2">{news.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{news.author.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{news.category}</td>
                      <td className="px-6 py-4 capitalize">{statusBadge(news.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(news.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        {news.status === 'pending' ? (
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(news.id);
                              }}
                              className="text-green-600 hover:text-green-800 font-medium text-sm"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(news.id);
                              }}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Tidak ada aksi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredNews.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada berita yang ditemukan
              </div>
            )}
          </div>

          {/* Panel Pratinjau */}
          {selectedNews && (
            <div className="lg:w-1/3 bg-white rounded-xl shadow-lg p-6 h-fit lg:sticky lg:top-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Pratinjau Berita</h2>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {selectedNews.image && (
                <img
                  src={`/storage/${selectedNews.image}`}
                  alt={selectedNews.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Judul</h3>
                  <p className="mt-1 text-lg text-black font-semibold">{selectedNews.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Penulis</h3>
                    <p className="mt-1 text-black">{selectedNews.author.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Kategori</h3>
                    <p className="mt-1 text-black">{selectedNews.category}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  {statusBadge(selectedNews.status)}
                </div>

                <div className="prose max-h-96 overflow-y-auto text-black border-t pt-4">
                  <div dangerouslySetInnerHTML={{ __html: selectedNews.content }} />
                </div>

                {selectedNews.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleApprove(selectedNews.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full"
                    >
                      Setujui
                    </button>
                    <button
                      onClick={() => handleReject(selectedNews.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full"
                    >
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}