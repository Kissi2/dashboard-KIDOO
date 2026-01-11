'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Parent } from '@/lib/types';
import { api } from '@/lib/api';

interface ParentListProps {
  searchQuery?: string;
}

export default function ParentList({ searchQuery = '' }: ParentListProps) {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParents = async () => {
      try {
        setLoading(true);
        const data = searchQuery 
          ? await api.searchParents(searchQuery)
          : await api.getParents();
        setParents(data);
      } catch (error) {
        console.error('Error loading parents:', error);
      } finally {
        setLoading(false);
      }
    };

    loadParents();
  }, [searchQuery]);

  const handleDeleteParent = async (parentId: string) => {
    const parent = parents.find(p => p.id === parentId);
    if (!parent) return;

    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer ${parent.name} et tous ses enfants ?`
    );

    if (confirmed) {
      try {
        await api.deleteParent(parentId);
        setParents(prev => prev.filter(p => p.id !== parentId));
        alert(`${parent.name} a été supprimé avec succès!`);
      } catch (error) {
        console.error('Error deleting parent:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status: Parent['status']) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      pending: 'status-pending'
    };

    const statusLabels = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">Liste des Parents Inscrits</h3>
          <Link href="/dashboard/parents/new" className="btn btn-primary">
            + Ajouter Parent
          </Link>
        </div>
        <div className="loading">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-2">Chargement...</span>
        </div>
      </div>
    );
  }

  if (parents.length === 0) {
    return (
      <div className="section-card">
        <div className="section-header">
          <h3 className="section-title">Liste des Parents Inscrits</h3>
          <Link href="/dashboard/parents/new" className="btn btn-primary">
            + Ajouter Parent
          </Link>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>Aucun parent trouvé</h3>
          <p>
            {searchQuery 
              ? `Aucun parent ne correspond à "${searchQuery}"`
              : 'Commencez par ajouter votre premier parent'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-header">
        <h3 className="section-title">
          Liste des Parents Inscrits ({parents.length})
        </h3>
        <Link href="/dashboard/parents/new" className="btn btn-primary">
          + Ajouter Parent
        </Link>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Parent</th>
              <th>Email</th>
              <th>Enfants</th>
              <th>Tâches</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parents.map((parent) => (
              <tr key={parent.id} className="fade-in">
                <td>
                  <div className="table-user">
                    <div className="avatar">
                      {getInitials(parent.name)}
                    </div>
                    <div className="table-user-info">
                      <div className="table-user-name">{parent.name}</div>
                      <div className="table-user-id">ID: #{parent.id}</div>
                    </div>
                  </div>
                </td>
                <td>{parent.email}</td>
                <td>{parent.children.length} enfant{parent.children.length > 1 ? 's' : ''}</td>
                <td>{parent.tasksCompleted} complétées</td>
                <td>{getStatusBadge(parent.status)}</td>
                <td>
                  <div className="action-buttons">
                    <Link
                      href={`/dashboard/parents/${parent.id}`}
                      className="btn btn-sm btn-view"
                      title="Voir le profil"
                    >
                      👁️
                    </Link>
                    <Link
                      href={`/dashboard/parents/${parent.id}/edit`}
                      className="btn btn-sm btn-edit"
                      title="Modifier"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => handleDeleteParent(parent.id)}
                      className="btn btn-sm btn-delete"
                      title="Supprimer"
                    >
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