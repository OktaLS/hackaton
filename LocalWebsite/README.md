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

Accéder aux interfaces
Ouvrez votre navigateur et rendez-vous sur :

    http://localhost:3000/pilot/ pour le pilote.
    http://localhost:3000/staff/ pour le staff.
    http://localhost:3000/customer/ pour le client.

Tester les fonctionnalités

    Pour le pilote : Connectez-vous (mot de passe 42), sélectionnez la langue et testez le bouton push-to-talk.
    Pour le staff : Connectez-vous (mot de passe 41), sélectionnez la langue et envoyez/récupérez des messages.
    Pour le client : Entrez un numéro de siège, choisissez la langue, recevez les annonces vocales et utilisez le chat.