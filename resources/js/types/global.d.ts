import type { route as routeFn } from 'ziggy-js';
i// types/inertia.d.ts
import { PageProps as InertiaPageProps } from '@inertiajs/react'; // <-- ini penting!

declare module '@inertiajs/react' {
  export interface SharedData {
    auth?: {
      user?: {
        id: number;
        name: string;
        email: string;
        // Tambah field lainnya jika diperlukan
      };
    };
  }
declare global {
    const route: typeof routeFn;
}
}

