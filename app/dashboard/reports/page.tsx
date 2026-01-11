// app/reports/page.tsx
"use client";
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './reports.module.css';

// ---------------------------
// Données mock (à remplacer par vos vraies données API)
// ---------------------------
const children = [
  { id: "c1", name: "Aïcha", avatar: "A", level: 5, points: 820 },
  { id: "c2", name: "Youssef", avatar: "Y", level: 4, points: 710 },
  { id: "c3", name: "Mariam", avatar: "M", level: 3, points: 520 },
];

const summary = {
  totalAssigned: 168,
  totalDone: 132,
  avgTimeMin: 18,
  onTime: 102,
  late: 30,
};

const typeDistribution = [
  { name: "Rangement", value: 38, color: "#0f172a" },
  { name: "Vaisselle", value: 24, color: "#334155" },
  { name: "Devoirs", value: 32, color: "#64748b" },
  { name: "Autres", value: 6, color: "#9ca3af" },
];

const dailyCompletion = [
  { day: "Lun", done: 18 },
  { day: "Mar", done: 21 },
  { day: "Mer", done: 17 },
  { day: "Jeu", done: 22 },
  { day: "Ven", done: 20 },
  { day: "Sam", done: 19 },
  { day: "Dim", done: 15 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('weekly');
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* En-tête */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Rapports de Performance</h1>
            <p className={styles.subtitle}>Vue sur les  activités de vos enfants</p>
          </div>
          <div className={styles.segmented}>
            <button 
              className={`${styles.segment} ${activeTab === 'weekly' ? styles.segmentActive : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              Hebdomadaire
            </button>
            <button 
              className={`${styles.segment} ${activeTab === 'monthly' ? styles.segmentActive : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Mensuel
            </button>
            <button 
              className={`${styles.segment} ${activeTab === 'yearly' ? styles.segmentActive : ''}`}
              onClick={() => setActiveTab('yearly')}
            >
              Annuel
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className={styles.kpisGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📋</div>
            <div className={styles.statContent}>
              <h3 className={styles.statTitle}>Tâches assignées</h3>
              <div className={styles.statValue}>{summary.totalAssigned}</div>
              <div className={styles.statSubtitle}>Cette semaine</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <h3 className={styles.statTitle}>Tâches terminées</h3>
              <div className={styles.statValue}>{summary.totalDone}</div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${(summary.totalDone / summary.totalAssigned) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏱️</div>
            <div className={styles.statContent}>
              <h3 className={styles.statTitle}>Temps moyen</h3>
              <div className={styles.statValue}>{summary.avgTimeMin} min</div>
              <div className={styles.statSubtitle}>Par tâche</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🎯</div>
            <div className={styles.statContent}>
              <h3 className={styles.statTitle}>À l&apos;heure</h3>
              <div className={styles.statValue}>{summary.onTime}</div>
              <div className={styles.statSubtitle}>{summary.late} en retard</div>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className={styles.chartsGrid}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Répartition par type</h3>
            </div>
            <div className={styles.chartTall}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardTitle}>Complétion quotidienne</h3>
            </div>
            <div className={styles.chartTall}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyCompletion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="done" fill="#0f172a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div> {/* <-- fermeture ajoutée ici */}

        {/* Section Enfants */}
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>👨‍👩‍👧‍👦 Performance par enfant</h2>
        </div>
        
        <div className={styles.childrenGrid}>
          {children.map(child => (
            <div key={child.id} className={styles.card}>
              <div className={styles.kidHead}>
                <div className={styles.kidAvatar}>{child.avatar}</div>
                <div>
                  <div className={styles.kidName}>{child.name}</div>
                  <div className={styles.kidMeta}>Niveau {child.level} • {child.points} points</div>
                </div>
              </div>
              
              <div className={styles.kidBlock}>
                <div className={styles.kidBlockTitle}>🏆 Performances</div>
                <div className={styles.kidBlockRow}>
                  <span>Tâches terminées</span>
                  <strong>{Math.floor(Math.random() * 30) + 15}</strong>
                </div>
                <div className={styles.kidBlockRow}>
                  <span>Taux de réussite</span>
                  <strong>{Math.floor(Math.random() * 20) + 75}%</strong>
                </div>
                <div className={styles.kidBlockRow}>
                  <span>Points gagnés</span>
                  <strong>{Math.floor(Math.random() * 100) + 50}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}