# 📦 Tunisia Impact Spark - Guide d'utilisation du Seed

Ce guide explique comment utiliser les scripts de seed pour injecter des données de test dans votre base Supabase.

---

## 🎯 Objectif

Peupler rapidement votre base de données avec un jeu de données **cohérent et réaliste** pour tester toutes les fonctionnalités de l'application sans saisie manuelle.

---

## 📁 Fichiers disponibles

### 1. `supabase/seed.sql` ✅ Recommandé
Script SQL pur avec `INSERT` statements, à exécuter directement dans l'éditeur SQL Supabase.

**Avantages**:
- ✅ Plus simple et rapide
- ✅ Pas besoin de Deno
- ✅ Exécution directe dans le dashboard

### 2. `supabase/seed.ts`
Script TypeScript utilisant l'API Supabase via Deno Runtime.

**Avantages**:
- ✅ Approche programmatique
- ✅ Gestion d'erreurs intégrée
- ✅ Logs détaillés
- ✅ Possibilité de nettoyage automatique

---

## 🚀 Méthode 1 : SQL (Recommandé)

### Prérequis
- Accès au dashboard Supabase

### Étapes

1. **Ouvrir l'éditeur SQL Supabase**
   ```
   https://supabase.com/dashboard/project/hmxraezyquqslkolaqmk/sql/new
   ```

2. **Copier-coller le contenu** de `supabase/seed.sql`

3. **Exécuter le script** (bouton "Run")

4. **Vérifier les résultats** en bas de l'éditeur :
   ```
   Profiles créés: 12
   Challenges actifs: 3
   Projets total: 8
   Évaluations: 15
   Produits marketplace: 6
   Transactions: 17
   ```

### ⚠️ Note importante sur les UUIDs

Les UUIDs dans le script sont **fictifs**. Pour une utilisation en production :

#### Option A : Créer les users auth manuellement
1. Créer 12 utilisateurs via l'interface auth Supabase
2. Récupérer leurs vrais UUIDs
3. Remplacer les UUIDs dans `seed.sql`

#### Option B : Utiliser en dev/test (RLS désactivée)
Si vous testez localement avec RLS désactivée temporairement, les UUIDs fictifs fonctionneront.

---

## 🚀 Méthode 2 : TypeScript (Deno)

### Prérequis
- [Deno](https://deno.land/) installé (`curl -fsSL https://deno.land/install.sh | sh`)
- `SUPABASE_SERVICE_ROLE_KEY` (disponible dans Settings > API)

### Étapes

1. **Récupérer la Service Role Key**
   ```
   Dashboard Supabase > Project Settings > API > service_role key
   ```

2. **Exécuter le script**
   ```bash
   cd supabase/
   
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... deno run \
     --allow-net \
     --allow-env \
     seed.ts
   ```

3. **Logs attendus**
   ```
   🚀 Démarrage seed Tunisia Impact Spark
   
   📝 Insertion profils utilisateurs...
   ✅ 12 profils utilisateurs insérés
   
   📝 Insertion challenges...
   ✅ 3 challenges insérés
   
   ...
   
   ✨ Seed complété avec succès !
   ```

### Option : Nettoyage avant seed

Pour vider les tables avant insertion, décommenter dans `seed.ts` :

```typescript
// Ligne ~377
await clearTable('token_transactions');
await clearTable('evaluations');
await clearTable('marketplace_products');
await clearTable('projects');
await clearTable('challenges');
await clearTable('user_roles');
await clearTable('profiles');
```

---

## 📊 Dataset généré

### Utilisateurs (12 profils)

#### 👔 Investisseurs (3)
- **Mehdi Ben Salah** - Tunisie Telecom Foundation
- **Salma Trabelsi** - AMEN Bank RSE
- **Karim Laabidi** - Orange Tunisia Impact

#### 🚀 Porteurs de projet (5)
- **Youssef Khemiri** - EcoBrick Tunisia
- **Amira Jlassi** - AgriSmart TN
- **Riadh Mansouri** - École Verte
- **Nadia Hamdi** - CleanEnergy Now
- **Farah Bouazizi** - WaterPure Tunisia

#### 🎓 Évaluateurs (4)
- **Dr. Lassaad Sfaxi** - ENIT
- **Rim Bouzid** - FST
- **Hichem Agrebi** - Consultant Impact
- **Sarra Cherif** - Experte Environnement

### Challenges (3)
1. **Green Tunisia 2025** 🌱 - 50k TND - Innovation écologique urbaine
2. **Tech for Inclusion** 💻 - 75k TND - Startups numériques inclusives
3. **Youth Impact Lab** 🎓 - 40k TND - Projets éducatifs durables

### Projets (8)
- **EcoBrick Tunisia** - Recyclage plastique → briques construction
- **CompostCity Tunis** - Compostage urbain collectif
- **AgriSmart TN** - Plateforme digitale agriculteurs
- **E-Saha Platform** - Télémédecine zones rurales
- **École Verte** - Écoles durables (jardins, solaire)
- **CodeCamp Bled** - Bootcamps codage zones rurales
- **CleanEnergy Now** - Micro-grids solaires villages
- **WaterPure Tunisia** - Purification eau low-cost

### Évaluations (15)
Évaluations réalistes avec scores, feedback détaillés, tokens attribués.

### Marketplace (6 produits)
- Pack Visibilité Projet (150 TND / 300 tokens)
- Coaching Startup 1:1 (500 tokens)
- Certification B-Corp audit (800 TND / 1500 tokens)
- Formation Impact Social (200 TND / 400 tokens)
- Accès Coworking Impact Hub (300 TND / 600 tokens)
- Kit Communication Impact (200 tokens)

### Transactions (17)
Historique récompenses évaluations, achats marketplace, bonus, frais challenges.

---

## 🔧 Dépannage

### Erreur : "duplicate key value violates unique constraint"
➡️ Les données existent déjà. Options :
- Nettoyez les tables manuellement via SQL Editor
- Utilisez l'option `clearTable()` dans `seed.ts`

### Erreur : "new row violates row-level security policy"
➡️ Vous utilisez l'anon key au lieu de la service_role key
- Vérifiez que vous utilisez bien `SUPABASE_SERVICE_ROLE_KEY`

### Erreur : "foreign key constraint violation"
➡️ Ordre d'insertion incorrect
- Les scripts respectent déjà l'ordre : profiles → user_roles → challenges → projects → evaluations → marketplace → transactions

---

## 📝 Personnalisation

Pour adapter le dataset à vos besoins :

1. **SQL** : Éditer directement `seed.sql`
2. **TypeScript** : Modifier les constantes dans `seed.ts` (lignes 40-400)

Exemples de modifications :
- Ajouter des utilisateurs
- Créer de nouveaux challenges
- Modifier montants/descriptions
- Ajouter projets dans différents secteurs

---

## 🎯 Workflow recommandé

### Développement
```bash
# 1. Reset database
npm run supabase:reset  # Si configuré

# 2. Run migrations
npm run supabase:migrate

# 3. Seed data
deno run --allow-net --allow-env supabase/seed.ts
```

### Production
⚠️ **Ne jamais** utiliser le seed en production !
Les données sont fictives et les UUIDs non valides.

---

## ✅ Validation post-seed

Après exécution, vérifiez via SQL Editor :

```sql
-- Compter les entrées
SELECT 'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'challenges', COUNT(*) FROM challenges
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'evaluations', COUNT(*) FROM evaluations
UNION ALL
SELECT 'marketplace_products', COUNT(*) FROM marketplace_products
UNION ALL
SELECT 'token_transactions', COUNT(*) FROM token_transactions;
```

Résultats attendus :
```
profiles: 12
challenges: 3
projects: 8
evaluations: 15
marketplace_products: 6
token_transactions: 17
```

---

## 🔗 Ressources

- [Supabase SQL Editor](https://supabase.com/dashboard/project/hmxraezyquqslkolaqmk/sql/new)
- [Deno Installation](https://deno.land/#installation)
- [Documentation Supabase Seeding](https://supabase.com/docs/guides/database/seed-data)

---

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs d'erreur Supabase (dashboard > Logs)
2. Consultez la section Dépannage ci-dessus
3. Vérifiez que les migrations sont à jour
4. Testez avec une base vide

---

**Dernière mise à jour** : 2025-01-20
