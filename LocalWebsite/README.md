# Local Website Project

## Overview
Ce projet est un site web local qui prend en charge trois rôles utilisateurs : Pilot, Staff et Customer.  
Il inclut :
- Une API REST et un serveur Socket.IO (pour les annonces vocales en temps réel).
- Un front-end spécifique pour chaque rôle.
- Un serveur Nginx servant les fichiers statiques.
- Une orchestration avec Docker Compose.

## Structure du projet
- **backend/**: Serveur Node.js (API et Socket.IO).
- **pilot/**: Interface pilote.
- **staff/**: Interface staff.
- **customer/**: Interface client.
- **web/**: Serveur Nginx pour les fichiers statiques.
- **docker-compose.yml**: Orchestration des conteneurs.

## Démarrage

1. Assurez-vous d'avoir Docker et Docker Compose installés.
2. Dans le dossier racine `LocalWebsite/`, lancez :
   ```bash
   docker-compose up --build
