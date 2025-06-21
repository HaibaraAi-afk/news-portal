import Layout from '@/components/layout';
import { useState, useEffect } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import Tabs from '@/components/tabs';
import axios from 'axios';
import { SharedData } from '@inertiajs/react';

interface Draft {
  id: number;
  title: string;
  category: string;
  created_at: string;
  status: 'draft' | 'pending' | 'approved'| 'rejected';
  content: string;
}

export default function Drafts() {
  const { drafts: initialDrafts } = usePage<{ drafts: Draft[] }>().props;
  const { auth } = usePage<SharedData>().props;
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = () => {
    axios.get('/dashboard/author/posts/drafts')
      .then(res => {
        const data = res.data.drafts;
        if (Array.isArray(data)) {
          setDrafts(data);
        }
      })
      .catch(err => console.error('Gagal mengambil draft:', err));
  };

  const handleRowClick = (draft: Draft) => {
    if (draft.status === 'approved') {
      router.visit(`/news/${draft.id}`);
    } else {
      setSelectedDraft(draft);
    }
  };

  const sendForApproval = (id: number) => {
    axios.post(`/dashboard/author/posts/send-to-approval/${id}`)
      .then(() => {
        alert('Draft berhasil dikirim!');
        fetchDrafts();
      })
      .catch(err => {
        console.error(err);
        alert('Gagal mengirim draft!');
      });
  };

  const deleteDraft = (id: number, title: string) => {
    if (confirm(`Yakin ingin menghapus draft "${title}"?`)) {
      axios.delete(`/dashboard/author/posts/${id}`)
        .then(() => {
          alert('Draft berhasil dihapus');
          setDrafts(prev => prev.filter(d => d.id !== id));
          setSelectedDraft(null);
        })
        .catch(err => console.error(err));
    }
  };

  // Filter draft berdasarkan status
  const filteredDrafts = showApprovedOnly 
    ? drafts.filter(draft => draft.status === 'approved')
    : drafts;

  // Hitung jumlah approved
  const approvedCount = drafts.filter(draft => draft.status === 'approved').length;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Daftar Draft */}
        <div className="lg:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden">
          <Tabs />
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Draft {auth.user.name}</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowApprovedOnly(!showApprovedOnly)}
                    className={`px-2.5 py-1 text-sm rounded-full transition-colors ${
                      showApprovedOnly
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {approvedCount} Disetujui
                  </button>
                  <span className="text-gray-500 text-sm">
                    ({filteredDrafts.length} ditampilkan)
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Judul</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">Kategori</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredDrafts.map((draft) => (
                    <tr
                      key={draft.id}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedDraft?.id === draft.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleRowClick(draft)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-[200px] truncate">
                        {draft.title}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                        {draft.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(draft.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            draft.status === 'draft'
                              ? 'bg-yellow-100 capitalize text-yellow-800'
                              : draft.status === 'pending'
                              ? 'bg-blue-100 capitalize text-blue-800'
                              : draft.status === 'approved'
                              ? 'bg-green-100 capitalize text-green-800'
                              : draft.status === 'rejected'
                              ? 'bg-red-100 capitalize text-red-800'
                              : ''
                          }`}
                        >
                          {draft.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <div className="flex items-center space-x-3">
                          <Link
                            href={`/dashboard/author/posts?id=${draft.id}`}
                            className="text-gray-400 hover:text-blue-600"
                            onClick={(e) => e.stopPropagation()}
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </Link>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDraft(draft.id, draft.title);
                            }}
                            className="text-gray-400 hover:text-red-600"
                            title="Hapus"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          {['draft', 'rejected'].includes(draft.status) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sendForApproval(draft.id);
                              }}
                              className="text-gray-400 hover:text-green-600"
                              title="Kirim untuk Approval"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel Pratinjau */}
        <div className="lg:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden h-fit lg:sticky lg:top-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pratinjau Artikel</h2>
            
            {selectedDraft ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Judul</h3>
                  <p className="mt-1 text-gray-900 font-medium">{selectedDraft.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Kategori</h3>
                    <p className="mt-1 text-gray-900">{selectedDraft.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tanggal Dibuat</h3>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedDraft.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <span
                    className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedDraft.status === 'draft'
                      ? 'bg-yellow-100 capitalize text-yellow-800'
                      : selectedDraft.status === 'pending'
                      ? 'bg-blue-100 capitalize text-blue-800'
                      : selectedDraft.status === 'approved'
                      ? 'bg-green-100 capitalize text-green-800'
                      : selectedDraft.status === 'rejected'
                      ? 'bg-red-100 capitalize text-red-800'
                      : ''
                    }`}
                    >
                    {selectedDraft.status}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  {selectedDraft.status === 'approved' ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Artikel ini telah dipublikasikan
                      </p>
                      <Link 
                        href={`/news/${selectedDraft.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Lihat Artikel Publikasi →
                      </Link>
                    </div>
                  ) : selectedDraft.status === 'rejected' ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-red-600 mb-2">
                          Artikel ini ditolak. Silakan edit dan kirim ulang
                        </p>
                      </div>
                    ) : (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Pratinjau Konten</h3>
                      <div className="prose max-h-[400px] overflow-y-auto text-black text-sm">
                        {selectedDraft.content.length > 500 
                          ? `${selectedDraft.content.substring(0, 500)}...`
                          : selectedDraft.content}
                        {selectedDraft.content.length > 500 && (
                          <p className="text-gray-500 text-sm mt-2">[Pratinjau dipotong]</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Pilih draft untuk melihat pratinjau</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}