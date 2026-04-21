

## Plan

### Étape 1 — Mettre à jour les prénoms des comptes de test (data update)

Exécuter un UPDATE SQL via l'outil insert pour remplir `first_name` et `last_name` dans la table `profiles` pour les 3 comptes de test :

| Email | first_name | last_name |
|---|---|---|
| evaluateur@test.com | Ahmed | Ben Ali |
| investisseur@test.com | Sarra | Trabelsi |
| porteur@test.com | Mohamed | Jaziri |

Cela corrige immédiatement l'affichage "Bienvenue, null!" dans le header du dashboard.

### Étape 2 — Vérifier les onglets pour `investisseur@test.com`

Se connecter via le navigateur de preview avec `investisseur@test.com` / `Test1234!` et vérifier visuellement la BottomNavigation. Onglets attendus selon les règles RBAC documentées :

- ✅ Accueil, Projets, Challenges, **Analytics**, Marketplace, Profil
- ❌ Pas d'onglet "Évaluations" (réservé aux évaluateurs)
- Bouton **"Créer Challenge"** visible (rôle investisseur)

### Étape 3 — Vérifier les onglets pour `porteur@test.com`

Se déconnecter, puis se reconnecter avec `porteur@test.com` / `Test1234!`. Onglets attendus :

- ✅ Accueil, Projets, Challenges, Marketplace, Profil
- ❌ Pas d'onglet "Évaluations" ni "Analytics"
- Bouton **"Créer Projet"** visible (rôle porteur)

### Étape 4 — Rapport final

Capturer les observations (header avec prénom correct, onglets conformes, boutons d'action filtrés) et lister tout écart constaté entre le comportement réel et les règles RBAC documentées dans `BottomNavigation.tsx` / `Index.tsx`.

## Détails techniques

**SQL à exécuter (étape 1)** :
```sql
UPDATE profiles SET first_name = 'Ahmed',   last_name = 'Ben Ali'    WHERE email = 'evaluateur@test.com';
UPDATE profiles SET first_name = 'Sarra',   last_name = 'Trabelsi'   WHERE email = 'investisseur@test.com';
UPDATE profiles SET first_name = 'Mohamed', last_name = 'Jaziri'     WHERE email = 'porteur@test.com';
```

**Outils utilisés** :
- `supabase` insert tool pour le UPDATE des profils (étape 1)
- `browser--navigate_to_sandbox` + `browser--act` (saisie identifiants) + `browser--screenshot` / `browser--observe` pour les vérifications visuelles (étapes 2 et 3)

**Aucun changement de code** n'est nécessaire — le composant `Index.tsx` lit déjà `profile.first_name` correctement ; seules les données manquaient.

