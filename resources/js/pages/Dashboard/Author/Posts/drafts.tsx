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
  status: 'draft' | 'pending';
  content: string;
}

export default function Drafts() {
  const { drafts: initialDrafts } = usePage<{ drafts: Draft[] }>().props;
  const { auth } = usePage<SharedData>().props;
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);

  // OPTIONAL: Jika kamu mau selalu fetch ulang dari server (tidak hanya dari props)
  useEffect(() => {
    axios.get('/dashboard/author/posts/drafts')
      .then(res => {
        const data = res.data.drafts;
        if (Array.isArray(data)) {
          setDrafts(data);
        } else {
          console.warn('Expected drafts to be an array, got:', data);
        }
      })
      .catch(err => {
        console.error('Failed to fetch drafts:', err);
      });
  }, []);

  const sendForApproval = (id: number) => {
    axios.post(`/dashboard/author/posts/send-to-approval/${id}`)
      .then(() => {
        alert('Draft berhasil dikirim!');
        // Refresh atau update list drafts
      })
      .catch(err => {
        console.error(err);
        alert('Gagal mengirim draft!');
      });
  };

  const deleteDraft = (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete draft "${title}"?`)) {
      axios.delete(`/dashboard/author/posts/${id}`)
        .then(() => {
          alert('Draft berhasil dihapus');
          setDrafts(prev => prev.filter(d => d.id !== id));
        })
        .catch(err => {
          console.error(err);
          alert('Gagal menghapus draft');
        });
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-gray-200 p-6 rounded shadow-md text-black">
          <Tabs />
          <h1 className="text-xl font-bold mb-4">{auth.user.name} Drafts</h1>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b border-gray-600 pb-2">Title</th>
                <th className="border-b border-gray-600 pb-2">Category</th>
                <th className="border-b border-gray-600 pb-2">Date</th>
                <th className="border-b border-gray-600 pb-2">Status</th>
                <th className="border-b border-gray-600 pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {drafts.map((draft) => (
                <tr
                  key={draft.id}
                  className="hover:bg-gray-300 cursor-pointer"
                  onClick={() => setSelectedDraft(draft)}
                >
                  <td className="py-2">{draft.title}</td>
                  <td>{draft.category}</td>
                  <td>{draft.created_at}</td>
                  <td>{draft.status}</td>
                  <td className="flex space-x-2 py-2">
                    <Link
                      href={`/dashboard/author/posts?id=${draft.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      onClick={(e) => e.stopPropagation()}
                      title="Edit"
                    >
                      <i className="fi fi-rr-file-edit"></i>
                    </Link>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDraft(draft.id, draft.title);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <i className="fi fi-rr-trash"></i>
                    </button>

                    {draft.status === 'draft' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendForApproval(draft.id);
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Send to Approval"
                      >
                        <i className="fi fi-rr-paper-plane"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-100 p-6 rounded shadow-md text-black">
          <h2 className="text-lg font-bold mb-2">Article Details</h2>
          {selectedDraft ? (
            <>
              <p><strong>Title:</strong> {selectedDraft.title}</p>
              <p><strong>Category:</strong> {selectedDraft.category}</p>
              <p><strong>Date:</strong> {selectedDraft.created_at}</p>
              <p><strong>Status:</strong> {selectedDraft.status}</p>
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Preview:</h3>
                <p className="text-sm">{selectedDraft.content}</p>
              </div>
            </>
          ) : (
            <p>Select a draft to view details.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
