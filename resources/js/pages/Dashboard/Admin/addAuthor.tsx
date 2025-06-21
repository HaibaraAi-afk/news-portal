import { useForm, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { useState } from 'react';
import { router } from '@inertiajs/react'; 
import Layout from '@/components/layout-admin';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type Flash = {
  success?: string;
  error?: string;
};

type AddAuthorPageProps = {
  users: User[];
  flash: Flash;
};

export default function AddAuthor() {
  const { users = [], flash = {} } = usePage<PageProps<AddAuthorPageProps>>().props;

  const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>(
    Object.fromEntries(users.map((user: User) => [user.id, user.role]))
  );
  

  const { processing } = useForm({
    user_id: '',
    role: '',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleChange = (userId: number, newRole: string) => {
    setSelectedRoles((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleSubmit = (userId: number) => {
    router.post('/dashboard/admin/change-role', {
      user_id: userId,
      role: selectedRoles[userId],
    }, {
      preserveScroll: true,
    });
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleBadge = (role: string) => {
    const styles = {
      normal: 'bg-gray-100 text-gray-800 border border-gray-300',
      author: 'bg-blue-100 text-blue-800 border border-blue-300',
      admin: 'bg-purple-100 text-purple-800 border border-purple-300',
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${styles[role]}`}>
        {role}
      </span>
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kelola Role Pengguna</h1>
          <p className="text-gray-600">
            Kelola dan ubah peran pengguna (Normal, Author, atau Admin)
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

        {/* Search Box */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-96 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-white text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-6 py-4 text-white text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-4 text-white text-left text-sm font-semibold text-gray-700">Role Saat Ini</th>
                  <th className="px-6 py-4 text-white text-left text-sm font-semibold text-gray-700">Ubah Role</th>
                  <th className="px-6 py-4 text-white text-left text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 capitalize">{roleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <select
                        value={selectedRoles[user.id]}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="normal">Normal</option>
                        <option value="author">Author</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSubmit(user.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm ${
                          processing 
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        } transition-colors`}
                        disabled={processing}
                      >
                        Simpan Perubahan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada user yang ditemukan
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}