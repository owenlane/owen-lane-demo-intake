import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-zinc-900 text-steel-50">
      {children}
    </div>
  );
}