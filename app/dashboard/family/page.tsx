/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../../styles/dashboard.css';

// Types
interface Child {
  id: string;
  name: string;
  age: number;
}

interface Family {
  id: string;
  parentName: string;
  email: string;
  children: Child[];
  tasksCompleted: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastActive: string;
  phone: string;
  address: string;
}

// Composant Sidebar moderne
function ModernSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/dashboard', icon: '🏠', label: 'Dashboard', active: pathname === '/dashboard' },
    { href: '/dashboard/family', icon: '👨‍👩‍👧‍👦', label: 'Familles', active: pathname.startsWith('/dashboard/family') },
    { href: '/dashboard/parents', icon: '👥', label: 'Parents', active: pathname.startsWith('/dashboard/parents') },
    { href: '/dashboard/tasks', icon: '✅', label: 'Tâches', active: pathname.startsWith('/dashboard/tasks') },
    { href: '/dashboard/reports', icon: '📊', label: 'Rapports', active: pathname.startsWith('/dashboard/reports') },
    { href: '/dashboard/settings', icon: '⚙️', label: 'Paramètres', active: pathname.startsWith('/dashboard/settings') }
  ];

  return (
    <div className={`modern-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">FK</div>
          {!isCollapsed && <span className="logo-text">FamilyKidoo</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">AD</div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">Admin</div>
              <div className="user-role">Gestionnaire</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant Statistiques des familles
/*function FamiliesStats({ families }: { families: Family[] }) {
  const stats = {
    total: families.length,
    active: families.filter(f => f.status === 'active').length,
    pending: families.filter(f => f.status === 'pending').length,
    inactive: families.filter(f => f.status === 'inactive').length,
    totalChildren: families.reduce((sum, f) => sum + f.children.length, 0),
    averageChildren: families.length > 0 ? (families.reduce((sum, f) => sum + f.children.length, 0) / families.length).toFixed(1) : 0
  };

  return (
    <div className="stats-grid families-stats">
      <div className="stat-card">
        <div className="stat-card-header">
          <div className="stat-icon bg-blue-50 text-blue-600">👨‍👩‍👧‍👦</div>
          <div className="stat-change positive">
            <span>↗</span> +5%
          </div>
        </div>
        <div className="stat-content">
          <h3 className="stat-value">{stats.total}</h3>
          <p className="stat-title">Familles Total</p>
        </div>
        <div className="stat-gradient bg-gradient-to-r from-blue-500 to-blue-600"></div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <div className="stat-icon bg-green-50 text-green-600">✅</div>
          <div className="stat-change positive">
            <span>↗</span> +8%
          </div>
        </div>
        <div className="stat-content">
          <h3 className="stat-value">{stats.active}</h3>
          <p className="stat-title">Familles Actives</p>
        </div>
        <div className="stat-gradient bg-gradient-to-r from-green-500 to-green-600"></div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <div className="stat-icon bg-orange-50 text-orange-600">⏳</div>
          <div className="stat-change">
            <span>→</span> {stats.pending}
          </div>
        </div>
        <div className="stat-content">
          <h3 className="stat-value">{stats.pending}</h3>
          <p className="stat-title">En Attente</p>
        </div>
        <div className="stat-gradient bg-gradient-to-r from-orange-500 to-orange-600"></div>
      </div>

      <div className="stat-card">
        <div className="stat-card-header">
          <div className="stat-icon bg-purple-50 text-purple-600">🧒</div>
          <div className="stat-change positive">
            <span>↗</span> +12%
          </div>
        </div>
        <div className="stat-content">
          <h3 className="stat-value">{stats.totalChildren}</h3>
          <p className="stat-title">Enfants Total</p>
        </div>
        <div className="stat-gradient bg-gradient-to-r from-purple-500 to-purple-600"></div>
      </div>
    </div>
  );
}*/

// Composant Liste des familles avec cartes modernes
function FamiliesList({ families, searchQuery }: { families: Family[]; searchQuery: string }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const filteredFamilies = families.filter(family => {
    const matchesSearch = family.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         family.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         family.children.some(child => child.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || family.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.parentName.localeCompare(b.parentName);
      case 'children':
        return b.children.length - a.children.length;
      case 'tasks':
        return b.tasksCompleted - a.tasksCompleted;
      case 'date':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: Family['status']) => {
    const statusConfig = {
      active: { label: 'Actif', class: 'status-active', icon: '🟢' },
      inactive: { label: 'Inactif', class: 'status-inactive', icon: '🔴' },
      pending: { label: 'En attente', class: 'status-pending', icon: '🟡' }
    };
    const config = statusConfig[status];
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTimeSince = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  const handleDeleteFamily = (familyId: string, familyName: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer la famille ${familyName} ?`);
    if (confirmed) {
      alert(`Famille ${familyName} supprimée !`);
      // Ici vous pouvez ajouter la logique de suppression
    }
  };

  return (
    <div className="families-list-card">
      <div className="families-list-header">
        <div className="header-title">
          <h2>Liste des Familles</h2>
          <span className="families-count">{filteredFamilies.length} famille{filteredFamilies.length > 1 ? 's' : ''}</span>
        </div>
        
        <div className="families-controls">
          <div className="filters-group">
            <select 
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">📋 Tous les statuts</option>
              <option value="active">🟢 Familles actives</option>
              <option value="pending">🟡 En attente</option>
              <option value="inactive">🔴 Inactives</option>
            </select>
            
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">🔤 Trier par nom</option>
              <option value="children">👶 Par nombre enfants</option>
              <option value="tasks">✅ Par tâches complétées</option>
              <option value="date">📅 Par date inscription</option>
            </select>
          </div>
          
          <Link href="/dashboard/family/new" className="btn-add-family">
            <span>➕</span> Nouvelle Famille
          </Link>
        </div>
      </div>

      <div className="families-grid">
        {filteredFamilies.map((family) => (
          <div key={family.id} className="family-card">
            <div className="family-card-header">
              <div className="family-main-info">
                <div className="family-avatar">
                  {getInitials(family.parentName)}
                </div>
                <div className="family-identity">
                  <h3 className="family-name">{family.parentName}</h3>
                  <p className="family-email">📧 {family.email}</p>
                  <p className="family-phone">📱 {family.phone}</p>
                </div>
              </div>
              <div className="family-status">
                {getStatusBadge(family.status)}
              </div>
            </div>

            <div className="family-children-section">
              <div className="section-header">
                <h4>👨‍👩‍👧‍👦 Enfants ({family.children.length})</h4>
              </div>
              <div className="children-grid">
                {family.children.map((child) => (
                  <div key={child.id} className="child-card">
                    <div className="child-avatar">
                      {child.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="child-info">
                      <span className="child-name">{child.name}</span>
                      <span className="child-age">{child.age} ans</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="family-metrics">
              <div className="metric-item">
                <div className="metric-icon">✅</div>
                <div className="metric-content">
                  <span className="metric-value">{family.tasksCompleted}</span>
                  <span className="metric-label">Tâches complétées</span>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-icon">📅</div>
                <div className="metric-content">
                  <span className="metric-value">{formatDate(family.createdAt)}</span>
                  <span className="metric-label">Date inscription</span>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-icon">🕒</div>
                <div className="metric-content">
                  <span className="metric-value">{getTimeSince(family.lastActive)}</span>
                  <span className="metric-label">Dernière activité</span>
                </div>
              </div>
            </div>

            <div className="family-address">
              <span className="address-icon">🏠</span>
              <span className="address-text">{family.address}</span>
            </div>

            <div className="family-actions">
              <Link href={`/dashboard/family/${family.id}`} className="action-btn primary">
                <span>👁️</span> Voir Détails
              </Link>
              <Link href={`/dashboard/family/${family.id}/edit`} className="action-btn secondary">
                <span>✏️</span> Modifier
              </Link>
              <button 
                className="action-btn danger"
                onClick={() => handleDeleteFamily(family.id, family.parentName)}
              >
                <span>🗑️</span> Supprimer
              </button>
            </div>

            <div className="family-card-overlay"></div>
          </div>
        ))}
      </div>

      {filteredFamilies.length === 0 && (
        <div className="empty-state">
          <div className="empty-illustration">
            <div className="empty-icon">👨‍👩‍👧‍👦</div>
            <div className="empty-pattern"></div>
          </div>
          <h3>Aucune famille trouvée</h3>
          <p>
            {searchQuery 
              ? `Aucune famille ne correspond à "${searchQuery}"`
              : filterStatus !== 'all'
              ? `Aucune famille avec le statut "${filterStatus}"`
              : 'Commencez par ajouter votre première famille'
            }
          </p>
          <Link href="/dashboard/family/new" className="btn-add-first">
            <span>➕</span> Ajouter votre première famille
          </Link>
        </div>
      )}
    </div>
  );
}

// Page principale des familles
export default function FamilyPage() {
  const [families, setFamilies] = useState<Family[]>([
    {
      id: '1',
      parentName: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '06 12 34 56 78',
      address: '15 rue des Lilas, 75001 Paris',
      children: [
        { id: 'c1', name: 'Paul', age: 8 },
        { id: 'c2', name: 'Emma', age: 5 }
      ],
      tasksCompleted: 15,
      status: 'active',
      createdAt: '2024-01-15',
      lastActive: '2024-03-01'
    },
    {
      id: '2',
      parentName: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      phone: '06 98 76 54 32',
      address: '42 avenue Mozart, 69000 Lyon',
      children: [
        { id: 'c3', name: 'Lucas', age: 6 }
      ],
      tasksCompleted: 8,
      status: 'active',
      createdAt: '2024-02-10',
      lastActive: '2024-02-28'
    },
    {
      id: '3',
      parentName: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      phone: '06 11 22 33 44',
      address: '8 place du Marché, 31000 Toulouse',
      children: [
        { id: 'c4', name: 'Lina', age: 10 },
        { id: 'c5', name: 'Nina', age: 7 },
        { id: 'c6', name: 'Max', age: 4 }
      ],
      tasksCompleted: 22,
      status: 'pending',
      createdAt: '2024-01-05',
      lastActive: '2024-02-25'
    },
    {
      id: '4',
      parentName: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '06 55 44 33 22',
      address: '23 boulevard Victor Hugo, 13000 Marseille',
      children: [
        { id: 'c7', name: 'Tom', age: 9 }
      ],
      tasksCompleted: 12,
      status: 'inactive',
      createdAt: '2023-12-20',
      lastActive: '2024-01-15'
    },
    {
      id: '5',
      parentName: 'Alice Bernard',
      email: 'alice.bernard@email.com',
      phone: '06 77 88 99 00',
      address: '56 rue de la Paix, 44000 Nantes',
      children: [
        { id: 'c8', name: 'Léa', age: 11 },
        { id: 'c9', name: 'Noé', age: 6 }
      ],
      tasksCompleted: 18,
      status: 'active',
      createdAt: '2024-01-30',
      lastActive: '2024-03-02'
    },
    {
      id: '6',
      parentName: 'Thomas Petit',
      email: 'thomas.petit@email.com',
      phone: '06 33 22 11 00',
      address: '12 impasse des Roses, 67000 Strasbourg',
      children: [
        { id: 'c10', name: 'Julie', age: 7 },
        { id: 'c11', name: 'Marc', age: 5 },
        { id: 'c12', name: 'Lisa', age: 3 }
      ],
      tasksCompleted: 25,
      status: 'active',
      createdAt: '2024-02-05',
      lastActive: '2024-03-01'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="dashboard-layout">
      <ModernSidebar />
      
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">📋 Gestion des Familles</h1>
            <p className="page-subtitle">Découvrez et gérez toutes les familles inscrites sur votre plateforme</p>
          </div>
          
          <div className="header-right">
            <div className="search-container">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher une famille, parent ou enfant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="header-actions">
              <button className="notification-btn">
                <span>🔔</span>
                <span className="notification-badge">3</span>
              </button>
              
              <div className="user-menu">
                <div className="user-avatar-header">AD</div>
                <div className="user-info-header">
                  <span className="user-name-header">Admin</span>
                  <span className="user-role-header">Gestionnaire</span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="dashboard-content">
          {/* Families List */}
          <FamiliesList families={families} searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
}