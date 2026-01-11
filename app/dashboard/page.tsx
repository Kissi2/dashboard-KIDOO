/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '../styles/dashboard.css'; 

// Types
interface Child {
  id: string;
  name: string;
  age: number;
}

interface Parent {
  id: string;
  name: string;
  email: string;
  children: Child[];
  tasksCompleted: number;
  status: 'active' | 'inactive' | 'pending';
}

interface DashboardStats {
  totalFamilies: number;
  activeParents: number;
  totalChildren: number;
  completedTasks: number;
}

// Composant Modal pour ajouter une famille
interface AddFamilyForm {
  nom: string;
  prenom: string;
  email: string;
  enfants: string[];
  motDePasse: string;
  confirmerMotDePasse: string;
}

type AddFamilyFormErrors = Partial<Record<keyof AddFamilyForm | `enfant${number}`, string>>;

function AddFamilyModal({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: AddFamilyForm & { nombreEnfants: number }) => void; 
}) {
  const [formData, setFormData] = useState<AddFamilyForm>({
    nom: '',
    prenom: '',
    email: '',
    enfants: [''], // Commence avec un enfant
    motDePasse: '',
    confirmerMotDePasse: ''
  });

  const [errors, setErrors] = useState<AddFamilyFormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name as keyof AddFamilyForm]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEnfantChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      enfants: prev.enfants.map((enfant, i) => i === index ? value : enfant)
    }));
    // Effacer l'erreur pour cet enfant
    if (errors[`enfant${index}`]) {
      setErrors((prev) => ({ ...prev, [`enfant${index}`]: '' }));
    }
  };

  const ajouterEnfant = () => {
    if (formData.enfants.length < 6) {
      setFormData(prev => ({
        ...prev,
        enfants: [...prev.enfants, '']
      }));
    }
  };

  const supprimerEnfant = (index: number) => {
    if (formData.enfants.length > 1) {
      setFormData(prev => ({
        ...prev,
        enfants: prev.enfants.filter((_, i) => i !== index)
      }));
      // Supprimer l'erreur associée
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`enfant${index}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: AddFamilyFormErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    // Validation des enfants
    formData.enfants.forEach((enfant, index) => {
      if (!enfant.trim()) {
        newErrors[`enfant${index}`] = 'Le nom de l\'enfant est requis';
      }
    });
    if (!formData.motDePasse) newErrors.motDePasse = 'Le mot de passe est requis';
    else if (formData.motDePasse.length < 6) newErrors.motDePasse = 'Minimum 6 caractères';
    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      newErrors.confirmerMotDePasse = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Filtrer les enfants vides et créer la structure finale
      const enfantsValides = formData.enfants.filter(enfant => enfant.trim());
      const dataToSubmit = {
        ...formData,
        enfants: enfantsValides,
        nombreEnfants: enfantsValides.length
      };
      onSubmit(dataToSubmit);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        enfants: [''],
        motDePasse: '',
        confirmerMotDePasse: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      enfants: [''],
      motDePasse: '',
      confirmerMotDePasse: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ajouter une nouvelle famille</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom du parent *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={errors.nom ? 'error' : ''}
                placeholder="Dupont"
              />
              {errors.nom && <span className="error-message">{errors.nom}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="prenom">Prénom du parent *</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={errors.prenom ? 'error' : ''}
                placeholder="Jean"
              />
              {errors.prenom && <span className="error-message">{errors.prenom}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="jean.dupont@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="enfants-header">
              <label>Enfants *</label>
              <button 
                type="button" 
                onClick={ajouterEnfant}
                className="btn-add-enfant"
                disabled={formData.enfants.length >= 6}
              >
                + Ajouter un enfant
              </button>
            </div>
            
            <div className="enfants-list">
              {formData.enfants.map((enfant, index) => (
                <div key={index} className="enfant-input-group">
                  <input
                    type="text"
                    value={enfant}
                    onChange={(e) => handleEnfantChange(index, e.target.value)}
                    className={errors[`enfant${index}`] ? 'error' : ''}
                    placeholder={`Nom de l'enfant ${index + 1}`}
                  />
                  {formData.enfants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => supprimerEnfant(index)}
                      className="btn-remove-enfant"
                      title="Supprimer cet enfant"
                    >
                      ✕
                    </button>
                  )}
                  {errors[`enfant${index}`] && (
                    <span className="error-message">{errors[`enfant${index}`]}</span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="enfants-info">
              {formData.enfants.length} enfant{formData.enfants.length > 1 ? 's' : ''} • Maximum 6 enfants
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="motDePasse">Mot de passe *</label>
              <input
                type="password"
                id="motDePasse"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                className={errors.motDePasse ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.motDePasse && <span className="error-message">{errors.motDePasse}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmerMotDePasse">Confirmer le mot de passe *</label>
              <input
                type="password"
                id="confirmerMotDePasse"
                name="confirmerMotDePasse"
                value={formData.confirmerMotDePasse}
                onChange={handleChange}
                className={errors.confirmerMotDePasse ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.confirmerMotDePasse && <span className="error-message">{errors.confirmerMotDePasse}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-cancel">
              Annuler
            </button>
            <button type="submit" className="btn-submit">
              Créer la famille
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



// Composant Stats Cards
function StatsCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalFamilies: 245,
    activeParents: 186,
    totalChildren: 432,
    completedTasks: 1247
  });

  const statCards = [
    {
      title: 'Familles Inscrites',
      value: stats.totalFamilies,
      change: '+12%',
      icon: '👨‍👩‍👧‍👦',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Parents Actifs',
      value: stats.activeParents,
      change: '+8%',
      icon: '👥',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Enfants Total',
      value: stats.totalChildren,
      change: '+23%',
      icon: '🧒',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Tâches Complétées',
      value: stats.completedTasks,
      change: '+18%',
      icon: '✅',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="stats-grid">
      {statCards.map((card, index) => (
        <div key={index} className="stat-card">
          <div className="stat-card-header">
            <div className={`stat-icon ${card.bgColor} ${card.textColor}`}>
              {card.icon}
            </div>
            <div className="stat-change positive">
              <span>↗</span> {card.change}
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{card.value.toLocaleString()}</h3>
            <p className="stat-title">{card.title}</p>
          </div>
          <div className={`stat-gradient bg-gradient-to-r ${card.color}`}></div>
        </div>
      ))}
    </div>
  );
}

// Composant Activity Chart
function ActivityChart() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Activité des Familles</h3>
        <select className="time-filter">
          <option>7 derniers jours</option>
          <option>30 derniers jours</option>
          <option>3 derniers mois</option>
        </select>
      </div>
      <div className="chart-content">
        <svg className="activity-chart" viewBox="0 0 400 160">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <g stroke="#f1f5f9" strokeWidth="1">
            <line x1="0" y1="40" x2="400" y2="40"/>
            <line x1="0" y1="80" x2="400" y2="80"/>
            <line x1="0" y1="120" x2="400" y2="120"/>
          </g>
          
          {/* Area chart */}
          <path
            d="M0,120 L50,100 L100,80 L150,60 L200,70 L250,50 L300,40 L350,45 L400,35 L400,160 L0,160 Z"
            fill="url(#gradient)"
          />
          
          {/* Line */}
          <path
            d="M0,120 L50,100 L100,80 L150,60 L200,70 L250,50 L300,40 L350,45 L400,35"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
          />
          
          {/* Data points */}
          <circle cx="150" cy="60" r="4" fill="#3b82f6"/>
          <circle cx="250" cy="50" r="4" fill="#3b82f6"/>
          <circle cx="300" cy="40" r="4" fill="#3b82f6"/>
        </svg>
        
        <div className="chart-footer">
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color bg-blue-500"></div>
              <span>Connexions quotidiennes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Recent Activity
function RecentActivity() {
  const activities = [
    { user: 'Marie Dubois', action: 'a complété la tâche "Ranger sa chambre"', time: 'Il y a 2 min', avatar: 'MD', color: 'bg-pink-500' },
    { user: 'Pierre Martin', action: 'a ajouté un nouvel enfant', time: 'Il y a 5 min', avatar: 'PM', color: 'bg-blue-500' },
    { user: 'Sophie Laurent', action: 'a mis à jour son profil', time: 'Il y a 12 min', avatar: 'SL', color: 'bg-green-500' },
    { user: 'Jean Dupont', action: 'a créé une nouvelle tâche', time: 'Il y a 18 min', avatar: 'JD', color: 'bg-purple-500' },
    { user: 'Alice Bernard', action: 'a validé 3 tâches', time: 'Il y a 25 min', avatar: 'AB', color: 'bg-orange-500' }
  ];

  return (
    <div className="activity-card">
      <div className="card-header">
        <h3>Activité Récente</h3>
        <Link href="/dashboard/activity" className="view-all-btn">
          Voir tout
        </Link>
      </div>
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className={`activity-avatar ${activity.color}`}>
              {activity.avatar}
            </div>
            <div className="activity-content">
              <p className="activity-text">
                <strong>{activity.user}</strong> {activity.action}
              </p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant Parents Table
function ParentsTable({ searchQuery }: { searchQuery: string }) {
  const [parents, setParents] = useState<Parent[]>([
    { id: '1', name: 'Marie Dubois', email: 'marie.dubois@email.com', children: [
      { id: 'c1', name: 'Paul', age: 8 },
      { id: 'c2', name: 'Emma', age: 5 }
    ], tasksCompleted: 15, status: 'active' },
    { id: '2', name: 'Pierre Martin', email: 'pierre.martin@email.com', children: [
      { id: 'c3', name: 'Lucas', age: 6 }
    ], tasksCompleted: 8, status: 'active' },
    { id: '3', name: 'Sophie Laurent', email: 'sophie.laurent@email.com', children: [
      { id: 'c4', name: 'Lina', age: 10 },
      { id: 'c5', name: 'Nina', age: 7 },
      { id: 'c6', name: 'Max', age: 4 }
    ], tasksCompleted: 22, status: 'pending' },
    { id: '4', name: 'Jean Dupont', email: 'jean.dupont@email.com', children: [
      { id: 'c7', name: 'Tom', age: 9 }
    ], tasksCompleted: 12, status: 'inactive' },
    { id: '5', name: 'Alice Bernard', email: 'alice.bernard@email.com', children: [
      { id: 'c8', name: 'Léa', age: 11 },
      { id: 'c9', name: 'Noé', age: 6 }
    ], tasksCompleted: 18, status: 'active' }
  ]);

  const filteredParents = parents.filter(parent =>
    parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Parent['status']) => {
    const statusConfig = {
      active: { label: 'Actif', class: 'status-active' },
      inactive: { label: 'Inactif', class: 'status-inactive' },
      pending: { label: 'En attente', class: 'status-pending' }
    };
    const config = statusConfig[status];
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Gestion des Familles</h3>
      </div>
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Parent</th>
              <th>Email</th>
              <th>Enfants</th>
              <th>Tâches</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParents.map((parent) => (
              <tr key={parent.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small">
                      {getInitials(parent.name)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{parent.name}</div>
                      <div className="user-id">ID: #{parent.id}</div>
                    </div>
                  </div>
                </td>
                <td className="email-cell">{parent.email}</td>
                <td>
                  <span className="children-count">
                    {parent.children.length} enfant{parent.children.length > 1 ? 's' : ''}
                  </span>
                </td>
                <td>
                  <span className="tasks-completed">{parent.tasksCompleted} complétées</span>
                </td>
                <td>{getStatusBadge(parent.status)}</td>
                <td>
                  <div className="action-buttons">
                    <Link href={`/dashboard/parents/${parent.id}`} className="action-btn view-btn" title="Voir">
                      👁️
                    </Link>
                    <Link href={`/dashboard/parents/${parent.id}/edit`} className="action-btn edit-btn" title="Modifier">
                      ✏️
                    </Link>
                    <button className="action-btn delete-btn" title="Supprimer">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Composant Quick Actions mis à jour
function QuickActions({ onAddFamily }: { onAddFamily: () => void }) {
  const actions = [
    { title: 'Ajouter une famille', desc: 'Ajouter une nouvelle famille', icon: '👨‍👩‍👧‍👦', action: onAddFamily, color: 'bg-blue-500' },
    { title: 'Voir Rapports', desc: 'Consulter les statistiques', icon: '📊', href: '/dashboard/reports', color: 'bg-purple-500' },
    { title: 'Paramètres', desc: 'Gérer les comptes', icon: '⚙️', href: '/dashboard/settings', color: 'bg-orange-500' }
  ];

  return (
    <div className="quick-actions-card">
      <div className="card-header">
        <h3>Actions Rapides</h3>
      </div>
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          action.href ? (
            <Link key={index} href={action.href} className="quick-action-item">
              <div className={`quick-action-icon ${action.color}`}>
                {action.icon}
              </div>
              <div className="quick-action-content">
                <h4>{action.title}</h4>
                <p>{action.desc}</p>
              </div>
            </Link>
          ) : (
            <button key={index} onClick={action.action} className="quick-action-item quick-action-button">
              <div className={`quick-action-icon ${action.color}`}>
                {action.icon}
              </div>
              <div className="quick-action-content">
                <h4>{action.title}</h4>
                <p>{action.desc}</p>
              </div>
            </button>
          )
        ))}
      </div>
    </div>
  );
}

// Composant principal Dashboard
export default function ModernDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddFamily = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitFamily = (familyData: AddFamilyForm & { nombreEnfants: number }) => {
    // Ici vous pouvez traiter les données de la famille
    console.log('Nouvelle famille créée:', familyData);
    // Exemple : appel API pour créer la famille
    // await api.createFamily(familyData);
    // Afficher un message de succès
    alert(`Famille ${familyData.prenom} ${familyData.nom} créée avec succès !`);
    // Optionnel : recharger la liste des familles
    // loadFamilies();
  };

  return (
    <div className="dashboard-layout">
    
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Bienvenue dans votre espace de gestion familiale</p>
          </div>
          <div className="header-right">
            <div className="search-container">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Rechercher une famille..."
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
          {/* Stats Cards */}
          <StatsCards />
          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Charts Row */}
            <div className="charts-row">
              <ActivityChart />
              <RecentActivity />
            </div>
            {/* Data Row */}
            <div className="data-row">
              <ParentsTable searchQuery={searchQuery} />
              <QuickActions onAddFamily={handleAddFamily} />
            </div>
          </div>
        </div>
      </main>
      {/* Modal pour ajouter une famille */}
      <AddFamilyModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitFamily}
      />
    </div>
  );
}