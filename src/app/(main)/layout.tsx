import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { SessionProvider } from '@/components/providers/SessionProvider';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen pb-24 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          <div className="lg:hidden mb-6">
            <Header />
          </div>
          
          <div className="lg:flex lg:gap-6">
            <div className="hidden lg:block">
              <Sidebar />
            </div>
            
            <main className="flex-1 max-w-2xl mx-auto lg:mx-0">
              {children}
            </main>
          </div>
        </div>
        
        <BottomNav />
      </div>
    </SessionProvider>
  );
}
