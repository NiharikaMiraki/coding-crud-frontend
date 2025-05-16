import { ReduxProvider } from '@/components/providers/ReduxProvider';
import './globals.css';

export const metadata = {
  title: 'Lead Management',
  description: 'A modern CRM for managing leads',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-[#EEEEEE]">
        <ReduxProvider>
          {/* Sidebar */}
          <aside className="w-60 min-h-screen bg-[#2A4759] text-white flex flex-col py-6 px-4 shadow-lg">
            <div className="mb-8 flex items-center gap-2 px-2">
              <span className="font-bold text-xl tracking-tight">Gamyam CRM</span>
            </div>
            <nav className="flex-1">
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="block px-3 py-2 rounded hover:bg-[#1e3442] transition">Dashboard</a></li>
                <li><a href="/" className="block px-3 py-2 rounded hover:bg-[#1e3442] transition">Leads</a></li>
                <li><a href="#" className="block px-3 py-2 rounded hover:bg-[#1e3442] transition">Companies</a></li>
                <li><a href="#" className="block px-3 py-2 rounded hover:bg-[#1e3442] transition">Opportunities</a></li>
                <li><a href="#" className="block px-3 py-2 rounded hover:bg-[#1e3442] transition">Contacts</a></li>
                <li><a href="#" className="block px-3 py-2 rounded hover:bg-[#1e3442] transition">Tasks</a></li>
                <li><a href="#" className="block px-3 py-2 rounded hover:bg-[#1e3442] transition">Calendar</a></li>
                <li><a href="#" className="block px-3 py-2 rounded hover:bg-[#1e3442] transition">Settings</a></li>
              </ul>
            </nav>
            <div className="mt-8 text-xs text-[#b0c4d4] px-2">&copy; 2024 Gamyam CRM</div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 min-h-screen p-0">{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
