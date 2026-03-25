'use client';

export default function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-stone-900 text-stone-50 text-[10px] tracking-widest uppercase px-8 py-4 rounded-lg animate-fadeIn">
      {message}
    </div>
  );
}
