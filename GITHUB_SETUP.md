# Commands à exécuter après création du dépôt GitHub

# Ajouter le dépôt distant (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/racontemoiunmouton.git

# Pousser vers GitHub
git branch -M main  # Renommer la branche en 'main' (standard moderne)
git push -u origin main

# Ou si vous préférez garder 'master' :
git push -u origin master