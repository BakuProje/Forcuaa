'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/gallery?transition=true');
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center text-white/50 text-sm">
      Loading...
    </div>
  );
}
