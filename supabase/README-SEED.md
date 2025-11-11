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

## 🗑️ Reset de la base de données

### ⚠️ Utilisation de reset.sql

Le script `supabase/reset.sql` permet de **vider toutes les tables** avant de réinjecter le seed.

**ATTENTION** : Ce script supprime TOUTES les données ! ❌ Ne jamais exécuter en production.

### Prérequis
- Accès au dashboard Supabase
- Confirmation que vous êtes sur le bon environnement (dev/test uniquement)

### Étapes d'exécution

1. **Ouvrir l'éditeur SQL Supabase**
   ```
   https://supabase.com/dashboard/project/hmxraezyquqslkolaqmk/sql/new
   ```

2. **Copier-coller le contenu** de `supabase/reset.sql`

3. **Lire attentivement les avertissements** dans le script

4. **Exécuter le script** (bouton "Run")

5. **Vérifier les résultats** - Toutes les tables doivent afficher `0 rows`

### Ce que fait reset.sql

✅ **Supprime les données dans l'ordre suivant** :
1. `token_transactions` (transactions)
2. `evaluations` (évaluations)
3. `marketplace_products` (produits)
4. `projects` (projets)
5. `challenges` (défis)
6. `user_roles` (rôles utilisateurs)
7. `profiles` (profils)

❌ **Ne touche PAS** :
- La table `auth.users` (gérée par Supabase Auth)
- Le schéma de la base (tables, colonnes, types restent en place)
- Les migrations appliquées

### ⚠️ Notes de sécurité

- ⛔ **Jamais en production** : Les données réelles seraient perdues
- ✅ **Seulement en dev/test** : Environnements de développement uniquement
- 💾 **Backup recommandé** : Faites un export avant si nécessaire
- 🔍 **Vérification projet** : Confirmez que vous êtes sur le bon projet Supabase

---

## 🤖 Script automatisé : reset-and-seed.sh

### Présentation

Le script `supabase/scripts/reset-and-seed.sh` automatise la séquence complète **reset → seed** avec :
- ✅ Confirmation interactive de sécurité
- ✅ Vérifications préliminaires (CLI, Deno, fichiers)
- ✅ Support SQL et TypeScript
- ✅ Gestion d'erreurs et fallback manuel
- ✅ Logs colorés et instructions claires

### Prérequis

**Obligatoires :**
- [Supabase CLI](https://supabase.com/docs/guides/cli) installé
- Script exécutable : `chmod +x supabase/scripts/reset-and-seed.sh`

**Optionnels (selon méthode) :**
- [Deno](https://deno.land/) pour option `--ts`
- Variable `SUPABASE_SERVICE_ROLE_KEY` pour option `--ts`
- Variable `SUPABASE_DB_URL` pour exécution automatique

### Usage

```bash
./supabase/scripts/reset-and-seed.sh [OPTIONS]
```

### Options disponibles

| Option | Description | Défaut |
|--------|-------------|--------|
| `--sql` | Utilise seed.sql pour le seeding | ✅ Par défaut |
| `--ts` | Utilise seed.ts (nécessite Deno + SERVICE_ROLE_KEY) | ❌ |
| `--skip-confirm` | Skip la confirmation (⚠️ dangereux, non recommandé) | ❌ |

### Exemples de commandes

#### Exemple 1 : Reset + Seed SQL (recommandé)

```bash
# Méthode la plus simple - utilise seed.sql
./supabase/scripts/reset-and-seed.sh

# OU explicitement avec --sql
./supabase/scripts/reset-and-seed.sh --sql
```

**Processus :**
1. ✅ Vérifie que Supabase CLI est installé
2. ✅ Vérifie que reset.sql et seed.sql existent
3. ⚠️ Demande confirmation ("YES" requis)
4. 🗑️ Exécute reset.sql
5. 📦 Exécute seed.sql
6. ✨ Affiche résumé et prochaines étapes

#### Exemple 2 : Reset + Seed TypeScript

```bash
# Export de la service role key
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Exécution avec seed.ts
./supabase/scripts/reset-and-seed.sh --ts
```

**Avantages seed.ts :**
- ✅ Gestion d'erreurs programmatique
- ✅ Logs détaillés par table
- ✅ Option de cleanup avant insertion

#### Exemple 3 : Skip confirmation (⚠️ usage avancé)

```bash
# Pour scripts automatisés uniquement - DANGEREUX !
./supabase/scripts/reset-and-seed.sh --sql --skip-confirm
```

⚠️ **ATTENTION** : Cette option skip la confirmation interactive. À utiliser UNIQUEMENT dans des scripts CI/CD ou environnements contrôlés.

### Déroulement typique

```
═══════════════════════════════════════════════════════════
🔄 Tunisia Impact Spark - Reset & Seed Automation
═══════════════════════════════════════════════════════════

✅ Vérifications préliminaires OK

⚠️  ═══════════════════════════════════════════════════════════
⚠️   ATTENTION : Cette action va SUPPRIMER TOUTES LES DONNÉES
⚠️  ═══════════════════════════════════════════════════════════

Ce script va :
  1. 🗑️  Vider toutes les tables (reset.sql)
  2. 📦 Réinjecter les données de test (seed.sql)

Tables affectées :
  • token_transactions
  • evaluations
  • marketplace_products
  • projects
  • challenges
  • user_roles
  • profiles

⚠️  NE JAMAIS EXÉCUTER EN PRODUCTION !

Êtes-vous ABSOLUMENT SÛR de vouloir continuer? (tapez 'YES' pour confirmer) : YES

✅ Confirmation reçue. Démarrage...

───────────────────────────────────────────────────────────
📝 Étape 1/2 : Exécution de reset.sql
───────────────────────────────────────────────────────────

✅ Reset exécuté avec succès

───────────────────────────────────────────────────────────
📝 Étape 2/2 : Exécution de seed.sql
───────────────────────────────────────────────────────────

✅ Seed SQL exécuté avec succès

═══════════════════════════════════════════════════════════
✨ Reset & Seed complété avec succès !
═══════════════════════════════════════════════════════════
```

### Fallback manuel

Si le script ne peut pas exécuter automatiquement via CLI/psql :

**Le script affichera des instructions manuelles :**
```
⚠️  Impossible d'exécuter automatiquement via CLI
   Veuillez exécuter manuellement :

1. Ouvrir : https://supabase.com/dashboard/project/hmxraezyquqslkolaqmk/sql/new
2. Copier-coller le contenu de supabase/reset.sql
3. Cliquer sur 'Run'

Appuyez sur ENTER après avoir exécuté reset.sql...
```

Vous suivez alors les étapes manuellement, le script attend votre confirmation avant de continuer.

### Dépannage

#### Erreur : "Supabase CLI n'est pas installé"
```bash
# macOS
brew install supabase/tap/supabase

# Linux/WSL
curl -fsSL https://supabase.com/install.sh | sh

# Vérification
supabase --version
```

#### Erreur : "Deno n'est pas installé" (avec --ts)
```bash
# Installation Deno
curl -fsSL https://deno.land/install.sh | sh

# Ajouter à PATH (ajouter à ~/.bashrc ou ~/.zshrc)
export PATH="$HOME/.deno/bin:$PATH"

# Vérification
deno --version
```

#### Erreur : "SUPABASE_SERVICE_ROLE_KEY non définie" (avec --ts)
```bash
# Récupérer la key depuis Supabase Dashboard
# Settings > API > service_role key

# Export temporaire
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# OU export permanent dans ~/.bashrc ou ~/.zshrc
echo 'export SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."' >> ~/.bashrc
source ~/.bashrc
```

#### Erreur : "Permission denied"
```bash
# Rendre le script exécutable
chmod +x supabase/scripts/reset-and-seed.sh

# Vérifier les permissions
ls -l supabase/scripts/reset-and-seed.sh
```

### Variantes d'utilisation

#### En combinaison avec d'autres commandes

```bash
# Backup avant reset
pg_dump "$SUPABASE_DB_URL" > backup_$(date +%Y%m%d_%H%M%S).sql
./supabase/scripts/reset-and-seed.sh

# Reset + seed + tests
./supabase/scripts/reset-and-seed.sh --sql
npm run test

# Dans un script CI/CD
./supabase/scripts/reset-and-seed.sh --sql --skip-confirm
npm run test:e2e
```

#### Avec environnements multiples

```bash
# Dev environment
export SUPABASE_DB_URL="postgresql://postgres:dev@localhost:54322/postgres"
./supabase/scripts/reset-and-seed.sh

# Staging environment
export SUPABASE_DB_URL="postgresql://postgres:staging@..."
./supabase/scripts/reset-and-seed.sh
```

---

## 🎯 Workflows recommandés

### Workflow 1 : Reset + Seed (développement rapide)

Utile pour réinitialiser rapidement votre environnement de test.

```bash
# 1. Reset database (vider les données)
# Via SQL Editor : exécuter supabase/reset.sql

# 2. Seed data (réinjecter les données de test)
# Option A - SQL
# Via SQL Editor : exécuter supabase/seed.sql

# Option B - TypeScript
cd supabase/
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... deno run \
  --allow-net \
  --allow-env \
  seed.ts
```

### Workflow 2 : Reset + Migrate + Seed (après changements schéma)

Utile après avoir modifié le schéma de la base (nouvelles tables, colonnes, etc.).

```bash
# 1. Reset database complet (schéma + données)
supabase db reset  # Via Supabase CLI - reset complet

# 2. Apply migrations (recréer le schéma)
supabase db push  # Applique toutes les migrations

# 3. Seed data
# Via SQL Editor : exécuter supabase/seed.sql
# OU via seed.ts comme ci-dessus
```

### Workflow 3 : Seed uniquement (première installation)

Si la base est vide mais le schéma est à jour.

```bash
# Seed data directement
# Via SQL Editor : exécuter supabase/seed.sql
# OU via seed.ts
```

### Workflow 4 : Cleanup partiel (via seed.ts)

Pour vider les tables de manière programmatique.

```typescript
// Dans supabase/seed.ts, décommenter les lignes ~15-21
await clearTable('token_transactions');
await clearTable('evaluations');
await clearTable('marketplace_products');
await clearTable('projects');
await clearTable('challenges');
await clearTable('user_roles');
await clearTable('profiles');
```

### Production
⚠️ **Ne jamais** utiliser reset.sql ou seed en production !
Les données sont fictives et les UUIDs non valides.

---

## 🔄 Commandes CLI Supabase (référence)

Si vous utilisez la [Supabase CLI](https://supabase.com/docs/guides/cli) :

```bash
# Reset complet (schéma + données) - ⚠️ Destructif !
supabase db reset

# Appliquer les migrations
supabase db push

# Générer les types TypeScript
supabase gen types typescript --local > src/integrations/supabase/types.ts

# Démarrer Supabase local
supabase start

# Arrêter Supabase local
supabase stop
```

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
