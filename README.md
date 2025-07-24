# ⚾ Les Comets d'Honfleur - Site Officiel

Bienvenue sur le site web des **Comets d'Honfleur**, club de baseball amateur normand avec du cœur, du sang-froid et des battes affûtées. Ce projet a été conçu pour rassembler, informer et faire rayonner l’équipe, ses membres et ses supporters, dans un esprit sportif et convivial.

## ✨ Présentation

Ce site propose :

- 🧢 Une page *Équipe* avec la présentation des joueurs et leur catégorie
- 📊 Le *Classement* officiel, mis à jour automatiquement depuis la FFBS
- 🗓️ Le *Calendrier* des matchs à venir et résultats passés
- 📰 Des *Actualités* à la une
- 🤝 Un formulaire pour *Rejoindre* l’équipe
- 📬 Une page *Contact*
- 🔐 Un *espace admin* complet avec gestion :
  - des membres
  - des horaires
  - des articles
  - des messages
  - des logs
- 📱 Une version mobile (React Native) en cours pour afficher les stats & messages en direct

## 🛠️ Stack technique

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Base de données** : [Supabase](https://supabase.com/) (PostgreSQL + Auth + API)
- **Déploiement** : [Vercel](https://vercel.com/)
- **Scraping** : Résultats et classements automatiquement récupérés depuis le site de la FFBS
- **Notifications** :
  - Email via **Brevo**
  - Alertes Discord
- **Sécurité** : Authentification admin avec cookies
- **Design** : Tailwind CSS + compos intégrés Shadcn UI

## 📁 Arborescence principale

```
app/
├── api/                  // Routes API (news, horaires, messages, logs, etc.)
├── admin/                // Espace admin (protégé par auth)
├── components/           // Composants globaux (Header, Footer, etc.)
├── layout.tsx           // Conteneur global (SEO, Header/Footer persistants)
├── page.tsx             // Accueil
├── actualites/          // Pages d'articles dynamiques
├── calendrier/          // Calendrier des matchs
├── classement/          // Affichage des standings
├── equipe/              // Présentation de l’équipe
├── rejoindre/           // Page d’inscription
├── contact/             // Formulaire de contact
├── login/, inscription/ // Auth utilisateur
```

## 🧪 Fonctionnalités techniques

- ✅ Génération automatique de la **catégorie d’un joueur** selon son âge (12U, 15U, Senior)
- ✅ Upload sécurisé d’images pour les articles
- ✅ Interface d’administration ergonomique avec logs d’actions
- ✅ Optimisation SEO (meta tags + JSON-LD)
- ✅ Protection anti-spam (sanitisation + captcha en cours)

## 🚀 Lancer le projet en local

1. Clone le repo :

   ```bash
   git clone https://github.com/heros20/Comets.git
   cd Comets
   ```

2. Installe les dépendances :

   ```bash
   pnpm install
   ```

3. Configure le `.env.local` :

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   BREVO_API_KEY=...
   DISCORD_WEBHOOK_URL=...
   ```

4. Lance le projet :

   ```bash
   pnpm dev
   ```

## 📦 Fonctionnalités admin

Tout est centralisé dans `/admin` :

- Ajout/modification/suppression d’articles
- Gestion des horaires d’entraînement selon les tranches d’âges
- Attribution automatique des catégories
- Consultation des messages
- Envoi de notifications
- Historique des actions admin

## 🤖 Mobile

Une app React Native est en cours, connectée à la même base Supabase. Elle permet :

- 📲 de voir les résultats de matchs
- 📲 de recevoir des notifications
- 📲 d’afficher les messages reçus via le site

## ✍️ Auteur

Ce projet est codé avec passion par **Kevin Bigoni**, joueur des Comets et dev en freelance.  
Il s'agit de mon **premier gros projet fullstack**, taillé sur mesure pour sa team ⚾

---

> “On vise les étoiles… mais on commence sur les terrains de Normandie.”

---
