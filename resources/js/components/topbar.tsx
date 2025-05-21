import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
export default function Topbar() {
  const { auth } = usePage<SharedData>().props;
  return (
    <header className="bg-gray-200 shadow p-4 text-right pr-10">
      <p className="text-sm text-gray-600">Welcome,</p>
      <p className="font-semibold text-black">{auth.user.name}</p>
    </header>
  );
}
