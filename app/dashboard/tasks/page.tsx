/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './tasks.module.css';

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // nom de l'enfant
  assignedBy: string; // nom du parent
  family: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  points: number;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  icon: string;
  time: string;
  read: boolean;
}


// Composant Statistiques des tâches
function TasksStats({ tasks }: { tasks: Task[] }) {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    totalPoints: tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.points, 0)
  };

  return (
    <div className={`${styles.statsGrid} ${styles.tasksStats}`}>
      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={`${styles.statIcon} bg-blue-50 text-blue-600`}>📋</div>
          <div className={`${styles.statChange} ${styles.positive}`}>
            <span>↗</span> +15%
          </div>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statValue}>{stats.total}</h3>
          <p className={styles.statTitle}>Tâches Total</p>
        </div>
        <div className={`${styles.statGradient} bg-gradient-to-r from-blue-500 to-blue-600`}></div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={`${styles.statIcon} bg-green-50 text-green-600`}>✅</div>
          <div className={`${styles.statChange} ${styles.positive}`}>
            <span>↗</span> +22%
          </div>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statValue}>{stats.completed}</h3>
          <p className={styles.statTitle}>Complétées</p>
        </div>
        <div className={`${styles.statGradient} bg-gradient-to-r from-green-500 to-green-600`}></div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={`${styles.statIcon} bg-orange-50 text-orange-600`}>⏳</div>
          <div className={`${styles.statChange} ${styles.positive}`}>
            <span>↗</span> +8%
          </div>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statValue}>{stats.pending}</h3>
          <p className={styles.statTitle}>En Attente</p>
        </div>
        <div className={`${styles.statGradient} bg-gradient-to-r from-orange-500 to-orange-600`}></div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statCardHeader}>
          <div className={`${styles.statIcon} bg-red-50 text-red-600`}>⚠️</div>
          <div className={`${styles.statChange} ${styles.negative}`}>
            <span>↘</span> -5%
          </div>
        </div>
        <div className={styles.statContent}>
          <h3 className={styles.statValue}>{stats.overdue}</h3>
          <p className={styles.statTitle}>En Retard</p>
        </div>
        <div className={`${styles.statGradient} bg-gradient-to-r from-red-500 to-red-600`}></div>
      </div>
    </div>
  );
}

// Composant Liste des tâches
function TasksList({ tasks, searchQuery }: { tasks: Task[]; searchQuery: string }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.family.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: Task['status']) => {
    const statusConfig = {
      pending: { label: 'En attente', class: styles.statusPending, icon: '⏳' },
      in_progress: { label: 'En cours', class: styles.statusInProgress, icon: '🔄' },
      completed: { label: 'Terminée', class: styles.statusCompleted, icon: '✅' },
      overdue: { label: 'En retard', class: styles.statusOverdue, icon: '⚠️' }
    };
    const config = statusConfig[status];
    return (
      <span className={`${styles.statusBadge} ${config.class}`}>
        <span className={styles.statusIcon}>{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const priorityConfig = {
      low: { label: 'Faible', class: styles.priorityLow },
      medium: { label: 'Moyenne', class: styles.priorityMedium },
      high: { label: 'Élevée', class: styles.priorityHigh }
    };
    const config = priorityConfig[priority];
    return (
      <span className={`${styles.priorityBadge} ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'completed';
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer la tâche "${taskTitle}" ?`);
    if (confirmed) {
      // Ici vous pouvez ajouter la logique de suppression
      alert(`Tâche "${taskTitle}" supprimée !`);
    }
  };

  return (
    <div className={styles.tasksListCard}>
      <div className={styles.tasksListHeader}>
        <h2>Liste des Tâches ({filteredTasks.length})</h2>
        <div className={styles.tasksActions}>
          <select 
            className={styles.filterSelect}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminées</option>
            <option value="overdue">En retard</option>
          </select>
          
          <select 
            className={styles.filterSelect}
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">Toutes priorités</option>
            <option value="high">Priorité élevée</option>
            <option value="medium">Priorité moyenne</option>
            <option value="low">Priorité faible</option>
          </select>
        </div>
      </div>

      <div className={styles.tasksGrid}>
        {filteredTasks.map((task) => (
          <div key={task.id} className={`${styles.taskCard} ${isOverdue(task.dueDate, task.status) ? styles.overdue : ''}`}>
            <div className={styles.taskCardHeader}>
              <div className={styles.taskPriority}>
                {getPriorityBadge(task.priority)}
              </div>
              <div className={styles.taskPoints}>
                {task.points} pts
              </div>
            </div>

            <div className={styles.taskContent}>
              <h3 className={styles.taskTitle}>{task.title}</h3>
              <p className={styles.taskDescription}>{task.description}</p>
            </div>

            <div className={styles.taskAssignment}>
              <div className={styles.taskAssignee}>
                <span className={styles.assigneeLabel}>Assigné à :</span>
                <span className={styles.assigneeName}>{task.assignedTo}</span>
              </div>
              <div className={styles.taskFamily}>
                <span className={styles.familyLabel}>Famille :</span>
                <span className={styles.familyName}>{task.family}</span>
              </div>
            </div>

            <div className={styles.taskDates}>
              <div className={styles.taskDueDate}>
                <span className={styles.dateLabel}>Échéance :</span>
                <span className={`${styles.dateValue} ${isOverdue(task.dueDate, task.status) ? styles.overdue : ''}`}>
                  {formatDate(task.dueDate)}
                </span>
              </div>
              <div className={styles.taskCreated}>
                <span className={styles.dateLabel}>Créée le :</span>
                <span className={styles.dateValue}>{formatDate(task.createdAt)}</span>
              </div>
            </div>

            <div className={styles.taskStatus}>
              {getStatusBadge(task.status)}
            </div>

            <div className={styles.taskActions}>
              <Link href={`/dashboard/tasks/${task.id}`} className={styles.btnView}>
                Voir Détails
              </Link>
              <Link href={`/dashboard/tasks/${task.id}/edit`} className={styles.btnEdit}>
                Modifier
              </Link>
              <button 
                className={styles.btnDelete}
                onClick={() => handleDeleteTask(task.id, task.title)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>Aucune tâche trouvée</h3>
          <p>
            {searchQuery 
              ? `Aucune tâche ne correspond à "${searchQuery}"`
              : 'Commencez par créer votre première tâche'
            }
          </p>
          <Link href="/dashboard/tasks/new" className={styles.btnAddFirst}>
            + Créer une tâche
          </Link>
        </div>
      )}
    </div>
  );
}

// Page principale Tâches
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Ranger sa chambre',
      description: 'Ranger tous les jouets et faire le lit',
      assignedTo: 'Kemouelle',
      assignedBy: 'Yvette KISSI',
      family: 'Famille KISSI',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-03-01',
      createdAt: '2024-02-25',
      completedAt: '2024-02-28',
      points: 10
    },
    {
      id: '2',
      title: 'Faire ses devoirs de mathématiques',
      description: 'Exercices pages 45-47 du manuel',
      assignedTo: 'Lucas',
      assignedBy: 'Pierre Coulibaly',
      family: 'Famille Coulibaly',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-03-02',
      createdAt: '2024-02-28',
      points: 15
    },
    {
      id: '3',
      title: 'Sortir les poubelles',
      description: 'Mettre les poubelles sur le trottoir avant 8h',
      assignedTo: 'Aaron',
      assignedBy: 'Sophie zeze',
      family: 'Famille zeze',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-03-03',
      createdAt: '2024-03-01',
      points: 5
    },
    {
      id: '4',
      title: 'Faire sa prière de nuit',
      description: 'chapelet et medidation',
      assignedTo: 'Fabiola',
      assignedBy: 'Jean Kouassi',
      family: 'Famille Kouassi',
      status: 'overdue',
      priority: 'medium',
      dueDate: '2024-02-20',
      createdAt: '2024-02-15',
      points: 8
    },
    {
      id: '5',
      title: 'Apprendre les tables de multiplication',
      description: 'Réviser les tables de 6, 7 et 8',
      assignedTo: 'Eden',
      assignedBy: 'Carole Tiemoko',
      family: 'Famille Tiemoko',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-03-05',
      createdAt: '2024-03-01',
      points: 20
    },
    {
      id: '6',
      title: 'Aider à préparer le dîner',
      description: 'Éplucher les légumes et mettre la table',
      assignedTo: 'Malika',
      assignedBy: 'Mariam Soro',
      family: 'Famille Soro',
      status: 'completed',
      priority: 'low',
      dueDate: '2024-02-29',
      createdAt: '2024-02-28',
      completedAt: '2024-02-29',
      points: 12
    },
    {
      id: '7',
      title: 'Lire un livre de 50 pages',
      description: 'Choisir un livre et le lire en entier',
      assignedTo: 'Noura',
      assignedBy: 'Sophie Daly',
      family: 'Famille Daly',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2024-03-10',
      createdAt: '2024-02-28',
      points: 25
    },
    {
      id: '8',
      title: 'Organiser son bureau',
      description: 'Trier les papiers et ranger les fournitures scolaires',
      assignedTo: 'Didier',
      assignedBy: 'Sophie Klimbié',
      family: 'Famille Klimbié',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-03-08',
      createdAt: '2024-03-01',
      points: 8
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: 1, 
      title: 'Nouvelle tâche assignée', 
      message: 'Une nouvelle tâche a été assignée à Eden.', 
      icon: '✅', 
      time: '2 min', 
      read: false 
    },
    { 
      id: 2, 
      title: 'Tâche terminée', 
      message: 'Didier a terminé la tâche "Organiser son bureau".', 
      icon: '🎉', 
      time: '10 min', 
      read: false 
    },
    { 
      id: 3, 
      title: 'Nouveau parent inscrit', 
      message: 'Un nouveau parent a rejoint la plateforme.', 
      icon: '👨‍👩‍👧‍👦', 
      time: '1 h', 
      read: true 
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fonction pour fermer les notifications quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.notificationContainer}`)) {
        setShowNotifications(false);
      }
      if (!target.closest(`.${styles.userMenu}`)) {
        setShowUserMenu(false);
      }
    };

    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    console.log('Toutes les notifications marquées comme lues');
  };

  const handleViewAllNotifications = () => {
    console.log('Voir toutes les notifications');
    setShowNotifications(false);
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
    if (confirmed) {
      // Ici vous pouvez ajouter la logique de déconnexion
      console.log('Déconnexion en cours...');
      // Exemple: router.push('/login') ou appel API de déconnexion
      alert('Déconnexion réussie !');
    }
  };

  const handleProfileSettings = () => {
    console.log('Paramètres du profil');
    setShowUserMenu(false);
    // Ici vous pouvez ajouter la navigation vers les paramètres
  };

  return (
    <div className={styles.dashboardLayout}>
      
      <main className={styles.dashboardMain}>
       
        {/* Content */}
        <div className={styles.dashboardContent}>
          {/* Stats Cards */}
          <TasksStats tasks={tasks} />

          {/* Tasks List */}
          <TasksList tasks={tasks} searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
}