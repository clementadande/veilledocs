
import React from 'react';
import { MonitoringStep, Tool } from './types';

export const STEPS: MonitoringStep[] = [
  {
    id: 'cadrage',
    title: '1. Cadrage et Définition',
    description: 'Définir précisément vos objectifs et vos besoins en information.',
    icon: '🎯',
    tips: [
      'Identifiez vos thématiques prioritaires',
      'Définissez vos mots-clés (français et anglais)',
      'Déterminez la fréquence de votre veille (quotidienne, hebdo)',
      'Ciblez le public destinataire'
    ]
  },
  {
    id: 'collecte',
    title: '2. Collecte et Sourcing',
    description: 'Mettre en place les outils pour capturer l\'information pertinente.',
    icon: '📥',
    tips: [
      'Diversifiez vos sources (médias, blogs, réseaux sociaux, revues académiques)',
      'Utilisez des outils "Push" (alertes, newsletters, flux RSS)',
      'Pratiquez la recherche "Pull" (requêtes manuelles régulières)',
      'Organisez vos favoris'
    ]
  },
  {
    id: 'analyse',
    title: '3. Analyse et Traitement',
    description: 'Trier, vérifier et synthétiser la masse de données reçue.',
    icon: '⚖️',
    tips: [
      'Vérifiez la fiabilité des sources (Fact-checking)',
      'Écartez le bruit documentaire (informations hors-sujet)',
      'Ajoutez de la valeur ajoutée (résumés, commentaires)',
      'Croisez les sources pour confirmer une info'
    ]
  },
  {
    id: 'diffusion',
    title: '4. Diffusion et Partage',
    description: 'Transmettre l\'information utile aux bonnes personnes.',
    icon: '📢',
    tips: [
      'Adaptez le format au destinataire (newsletter, dashboard, mémo)',
      'Soyez concis et visuel',
      'Prévoyez un canal de retour (feedback)',
      'Stockez pour le long terme (archivage)'
    ]
  }
];

export const TOOLS: Tool[] = [
  {
    name: 'Feedly',
    category: 'Flux RSS',
    description: 'L\'outil référence pour centraliser tous vos flux RSS et suivre vos sites favoris.',
    url: 'https://feedly.com',
    icon: '🗞️'
  },
  {
    name: 'Google Alerts',
    category: 'Alertes',
    description: 'Recevez des notifications dès qu\'un nouveau contenu indexé correspond à vos mots-clés.',
    url: 'https://google.com/alerts',
    icon: '🔔'
  },
  {
    name: 'Pocket',
    category: 'Stockage',
    description: 'Sauvegardez des articles pour une lecture ultérieure, même hors ligne.',
    url: 'https://getpocket.com',
    icon: '📦'
  },
  {
    name: 'Inoreader',
    category: 'Flux RSS',
    description: 'Un agrégateur puissant avec des fonctions de filtrage avancées.',
    url: 'https://inoreader.com',
    icon: '👓'
  },
  {
    name: 'Zotero',
    category: 'Gestion Bibliographique',
    description: 'Essentiel pour la veille académique et scientifique.',
    url: 'https://zotero.org',
    icon: '📚'
  }
];
