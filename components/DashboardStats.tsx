'use client';

import { useState, useEffect } from 'react';
import { DashboardStats } from '../lib/types';
import { api } from '../lib/api';

export default function DashboardStatsComponent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-red-500">
        Erreur lors du chargement des statistiques
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Sales',
      value: '$62,425',
      change: '+55% increase from last month',
      trend: '+55%',
      icon: '💰',
      iconBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)'
    },
    {
      title: 'Total Purchases',
      value: '$25,187',
      change: '+32% Decrease from last month',
      trend: '+32%',
      icon: '🛒',
      iconBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
    },
    {
      title: 'Net Profit',
      value: '$10,600',
      change: '+18% recipients from last month',
      trend: '+18%',
      icon: '💵',
      iconBg: 'linear-gradient(135deg, #ec4899, #be185d)'
    },
    {
      title: 'Profits',
      value: '$30,860',
      change: '+8% Increase from last month',
      trend: '+8%',
      icon: '📊',
      iconBg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
    }
  ];

  return (
    <div className="stats-grid">
      {statCards.map((card, i) => (
        <div key={i} className="stat-card fade-in">
          <div className="stat-header">
            <div className="stat-icon-container">
              <div 
                className="stat-icon-bg"
                style={{ background: card.iconBg }}
              >
                {card.icon}
              </div>
              <div className="stat-title">{card.title}</div>
            </div>
            <div className="stat-trend">↗</div>
          </div>
          
          <div className="stat-value">{card.value}</div>
          
          <div className="stat-change positive">
            <span className="stat-change-arrow">↗</span>
            {card.change}
          </div>
        </div>
      ))}
    </div>
  );
}