// lib/api.ts

import { Parent, DashboardStats } from '../../../lib/types';

// Exemple de données locales simulées
let fakeParents: Parent[] = [
  {
    id: "1",
    name: "Jean Dupont",
    email: "jean@email.com",
    status: "active",
    children: [
      { id: "a", name: "Léa", age: 10 },
      { id: "b", name: "Tom", age: 7 },
    ],
    tasksCompleted: 5,
  },
  {
    id: "2",
    name: "Amina Koné",
    email: "amina@email.com",
    status: "pending",
    children: [{ id: "c", name: "Fatou", age: 8 }],
    tasksCompleted: 3,
  },
];

// Fonctions simulées (futures connexions API réelles ici)
export const api = {
  getParents: async (): Promise<Parent[]> => {
    return new Promise(resolve => setTimeout(() => resolve(fakeParents), 500));
  },

  searchParents: async (query: string): Promise<Parent[]> => {
    return new Promise(resolve =>
      setTimeout(() => {
        const filtered = fakeParents.filter(p =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300)
    );
  },

  deleteParent: async (id: string): Promise<void> => {
    return new Promise(resolve => {
      fakeParents = fakeParents.filter(p => p.id !== id);
      setTimeout(resolve, 300);
    });
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const totalFamilies = fakeParents.length;
        const activeParents = fakeParents.filter(p => p.status === 'active').length;
        const totalChildren = fakeParents.reduce((acc, p) => acc + p.children.length, 0);
        const completedTasks = fakeParents.reduce((acc, p) => acc + p.tasksCompleted, 0);

        resolve({
          totalFamilies,
          activeParents,
          totalChildren,
          completedTasks,
        });
      }, 500);
    });
  },

  getParent: async (id: string): Promise<Parent | null> => {
    return new Promise(resolve => {
      const parent = fakeParents.find(p => p.id === id);
      setTimeout(() => resolve(parent || null), 300);
    });
  },

  deleteChild: async (childId: string): Promise<void> => {
    return new Promise(resolve => {
      fakeParents = fakeParents.map(p => ({
        ...p,
        children: p.children.filter(c => c.id !== childId)
      }));
      setTimeout(() => resolve(), 300);
    });
  },

  addChild: async (parentId: string, child: { id: string; name: string; age: number }): Promise<void> => {
    return new Promise(resolve => {
      fakeParents = fakeParents.map(p => {
        if (p.id === parentId) {
          return {
            ...p,
            children: [...p.children, child]
          };
        }
        return p;
      });
      setTimeout(() => resolve(), 300);
    });
  }
};