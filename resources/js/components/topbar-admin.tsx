import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';

export default function TopbarAdmin() {
  const { auth } = usePage<SharedData>().props;

  return (
    <header className="bg-gray-700 shadow p-4 text-right pr-10">
      <p className="text-sm text-gray-400">Welcome,</p>
      <p className="font-semibold text-white">{auth.user.name}</p>
    </header>
  );
}
