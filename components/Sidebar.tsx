'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  // Utilisation de isOpen pour afficher/masquer la sidebar

  const navItems = [
    {
      href: '/dashboard',
      icon: '📊',
      label: 'Dashboard',
      active: pathname === '/dashboard'
    },
    {
      href: '/dashboard/parents',
      icon: '👥',
      label: 'Parents',
      active: pathname.startsWith('/dashboard/parents')
    },
    {
      href: '/dashboard/families',
      icon: '👨‍👩‍👧‍👦',
      label: 'Familles',
      active: pathname.startsWith('/dashboard/families')
    },
    {
      href: '/dashboard/tasks',
      icon: '📋',
      label: 'Tâches',
      active: pathname.startsWith('/dashboard/tasks')
    },
    {
      href: '/dashboard/reports',
      icon: '📈',
      label: 'Rapports',
      active: pathname.startsWith('/dashboard/reports')
    },
    {
      href: '/dashboard/settings',
      icon: '⚙️',
      label: 'Paramètres',
      active: pathname.startsWith('/dashboard/settings')
    }
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`sidebar
        fixed left-0 top-0 h-full bg-gradient-to-b from-slate-800 to-slate-900 
        text-white transition-all duration-300 z-50
        ${isOpen ? 'w-64' : 'w-16'}
      `}>
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-xl font-bold">
              FM
            </div>
            {isOpen && (
              <span className="ml-3 text-xl font-bold">FamilyManager</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center px-3 py-3 rounded-lg transition-colors
                  ${item.active 
                    ? 'bg-teal-600 text-white' 
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                {isOpen && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Toggle Button */}
        <button
          onClick={onClose}
          className="absolute -right-3 top-6 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-gray-50"
        >
          <span className={`text-sm transform transition-transform ${!isOpen ? 'rotate-180' : ''}`}>
            ←
          </span>
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={onClose}
        className={`
          md:hidden fixed top-4 left-4 z-30 p-2 bg-slate-800 text-white rounded-lg
          ${isOpen ? 'hidden' : ''}
        `}
      >
        <span className="text-xl">☰</span>
      </button>
    </>
  );
}