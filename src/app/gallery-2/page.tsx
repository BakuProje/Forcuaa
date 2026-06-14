'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GalleryTwoPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/gallery');
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center text-white/50 text-sm">
      Redirecting to Gallery...
    </div>
  );
}
