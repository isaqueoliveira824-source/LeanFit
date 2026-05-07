import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', name: 'Primeiro Passo', description: 'Seu primeiro login no 𝗟𝗲𝗮𝗻 𝗙𝗶𝘁 🚀', icon: '🚀', category: 'Início', current: 1, total: 1, status: 'completed' },
  { id: 'a2', name: 'Hidratação', description: 'Registre seu primeiro copo de água 💧', icon: '💧', category: 'Início', current: 0, total: 1, status: 'progress' },
  { id: 'a3', name: 'Explorador Nutritivo', description: 'Explore a biblioteca de receitas 🥗', icon: '🥗', category: 'Início', current: 0, total: 1, status: 'progress' },
  { id: 'a16', name: 'Crítico Construtivo', description: 'Ajude-nos a melhorar avaliando o app ⭐', icon: '⭐', category: 'Início', current: 0, total: 1, status: 'progress' },
  
  { id: 'a4', name: 'Foco Total', description: 'Complete 7 dias seguidos mantendo sua rotina 🔥', icon: '🔥', category: 'Consistência', current: 0, total: 7, status: 'progress' },
  { id: 'a5', name: 'Ritmo Constante', description: 'Meta batida por 3 dias seguidos ⚡', icon: '⚡', category: 'Consistência', current: 0, total: 3, status: 'locked' },
  { id: 'a6', name: 'Mestre da Disciplina', description: '30 dias de foco ininterrupto 🏆', icon: '🏆', category: 'Consistência', current: 0, total: 30, status: 'locked' },
  
  { id: 'a7', name: 'Verde é Vida', description: 'Registre 5 refeições saudáveis 🥦', icon: '🥦', category: 'Alimentação', current: 0, total: 5, status: 'locked' },
  { id: 'a8', name: 'Diário de Bordo', description: 'Registre sua primeira refeição 🍎', icon: '🍎', category: 'Alimentação', current: 0, total: 1, status: 'progress' },
  { id: 'a9', name: 'Chef Saudável', description: 'Use o scanner de comida 10 vezes 🍳', icon: '🍳', category: 'Alimentação', current: 0, total: 10, status: 'locked' },
  
  { id: 'a10', name: 'Primeiro Suor', description: 'Conclua seu primeiro treino 💪', icon: '💪', category: 'Treinos', current: 0, total: 1, status: 'progress' },
  { id: 'a11', name: 'Atleta em Construção', description: 'Conclua 10 treinos no total 🏋️', icon: '🏋️', category: 'Treinos', current: 0, total: 10, status: 'locked' },
  { id: 'a12', name: 'Flexibilidade', description: 'Conclua 5 sessões de alongamento 🤸', icon: '🤸', category: 'Treinos', current: 0, total: 5, status: 'locked' },
  
  { id: 'a13', name: 'Pé na Balança', description: 'Registre seu peso pela primeira vez ⚖️', icon: '⚖️', category: 'Evolução', current: 0, total: 1, status: 'progress' },
  { id: 'a14', name: 'Rumo ao Objetivo', description: 'Perca os primeiros 3kg 📉', icon: '📉', category: 'Evolução', current: 0, total: 3, status: 'locked' },
  { id: 'a15', name: 'Transformação', description: 'Mantenha-se ativo por 90 dias ✨', icon: '✨', category: 'Evolução', current: 0, total: 90, status: 'locked' },
];
