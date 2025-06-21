import Sidebar from './sidebar-admin';
import Topbar from './topbar-admin';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <Topbar />
        <main className="p-6 mt-1">{children}</main>
      </div>
    </div>
  );
}
