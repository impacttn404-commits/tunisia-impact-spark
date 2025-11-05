# Guide des Tests - Tunisia Impact Spark

## 📋 Vue d'ensemble

Ce projet utilise **Vitest** pour les tests unitaires, d'intégration et E2E. Les tests de sécurité sont prioritaires pour garantir la protection contre les vulnérabilités critiques.

## 🚀 Scripts disponibles

```bash
# Lancer tous les tests
npm run test

# Mode interactif avec UI
npm run test:ui

# Lancer les tests une seule fois (CI)
npm run test:run

# Générer le rapport de couverture
npm run test:coverage

# Vérifier les types TypeScript
npm run typecheck

# Linter le code
npm run lint
```

## 📁 Structure des tests

```
src/
├── __tests__/
│   ├── e2e/                          # Tests end-to-end
│   │   └── auth-security.test.tsx    # Flux d'authentification & autorisation
│   └── integration/                  # Tests d'intégration
│       └── marketplace-security.test.ts  # Marketplace & transactions
├── components/
│   └── __tests__/                    # Tests des composants
│       ├── Footer.test.tsx
│       ├── PageHeader.test.tsx
│       ├── accessibility.test.tsx    # Tests d'accessibilité
│       └── seo.test.tsx              # Tests SEO
├── hooks/
│   └── __tests__/                    # Tests des hooks
│       └── useAdminAuth.test.tsx
└── lib/
    └── __tests__/                    # Tests utilitaires
        ├── utils.test.ts
        ├── security-role-protection.test.ts       # 🔒 CRITIQUE
        └── security-transactions.test.ts          # 🔒 CRITIQUE
```

## 🔒 Tests de sécurité critiques

### 1. Protection des rôles (`security-role-protection.test.ts`)

**Objectif**: Valider que les utilisateurs ne peuvent pas modifier leur propre rôle pour escalader leurs privilèges.

**Scénarios testés**:
- ❌ Empêcher modification du rôle dans `profiles`
- ❌ Empêcher auto-attribution du rôle `admin` dans `user_roles`
- ✅ Permettre modification des autres champs du profil
- 📖 Documenter que seuls les admins peuvent modifier les rôles

**Commande**:
```bash
npm run test -- security-role-protection
```

### 2. Sécurité des transactions (`security-transactions.test.ts`)

**Objectif**: Garantir que les transactions de tokens ne peuvent être créées que via des fonctions security definer.

**Scénarios testés**:
- ❌ Bloquer inserts directs dans `token_transactions`
- ❌ Empêcher création de fausses transactions
- ✅ Permettre consultation de l'historique personnel
- 📖 Documenter les méthodes légitimes (RPC functions)

**Commande**:
```bash
npm run test -- security-transactions
```

### 3. Flux d'authentification E2E (`auth-security.test.tsx`)

**Objectif**: Valider le comportement complet du système d'autorisation.

**Scénarios testés**:
- 🚫 Blocage des utilisateurs non authentifiés
- 🔐 Contrôle d'accès basé sur les rôles
- 📖 Documentation des vecteurs d'attaque
- ✅ Conformité OWASP Top 10

**Commande**:
```bash
npm run test -- auth-security
```

### 4. Sécurité Marketplace (`marketplace-security.test.ts`)

**Objectif**: Valider les transactions atomiques et prévenir les conditions de course.

**Scénarios testés**:
- 🔒 Prévention des achats simultanés (race conditions)
- ✅ Rollback automatique sur erreur
- 📖 Documentation du mécanisme de verrouillage (row-level locking)
- ❌ Prévention des manipulations de prix

**Commande**:
```bash
npm run test -- marketplace-security
```

## 📊 Objectifs de couverture

Configuration actuelle dans `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 70,        // 70% des lignes de code
    functions: 60,    // 60% des fonctions
    branches: 50,     // 50% des branches
    statements: 70,   // 70% des instructions
  }
}
```

## 🎯 Tests prioritaires (LOT 2)

### ✅ Complétés
1. Tests de sécurité pour protection des rôles
2. Tests de sécurité pour transactions de tokens
3. Tests E2E d'authentification
4. Tests d'intégration marketplace

### ⏳ À compléter (LOT 4)
1. Tests des hooks personnalisés:
   - `useChallenges`
   - `useEvaluations`
   - `useMarketplace`
   - `useProjects`
   - `useTokens`

2. Tests des composants modaux:
   - `CreateChallengeModal`
   - `CreateProductModal`
   - `CreateProjectModal`
   - `EvaluationModal`

3. Tests des validations Zod:
   - `src/lib/validations/auth.test.ts`
   - `src/lib/validations/marketplace.test.ts`
   - `src/lib/validations/project.test.ts`

## 🔍 Lancer des tests spécifiques

```bash
# Par nom de fichier
npm run test -- Footer.test

# Par describe/it
npm run test -- "Security: Role Protection"

# Avec watch mode
npm run test -- --watch

# Avec UI graphique
npm run test:ui
```

## 📝 Écrire de nouveaux tests

### Template de test de sécurité

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

describe('Security: [Feature Name]', () => {
  beforeEach(() => {
    // Setup avant chaque test
  });

  it('should prevent unauthorized action', async () => {
    const { error } = await supabase
      .from('table_name')
      .operation({ /* data */ });

    // Assertion: l'opération doit échouer
    expect(error).toBeTruthy();
  });
});
```

### Template de test de composant

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );
    
    expect(getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 🚨 Tests bloquants pour production

Avant de déployer en production, ces tests DOIVENT passer:

```bash
# 1. Tous les tests de sécurité
npm run test -- security

# 2. Vérification TypeScript
npm run typecheck

# 3. Linter
npm run lint

# 4. Build production
npm run build
```

## 📚 Ressources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

## 🆘 Problèmes courants

### Les tests Supabase échouent avec "mocked"
**Solution**: Les tests utilisent des mocks définis dans `src/setupTests.ts`. Les erreurs sont normales en environnement de test mocké.

### Erreur "Module not found"
**Solution**: Vérifier les alias TypeScript dans `tsconfig.json` et `vite.config.ts`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Tests de sécurité passent mais l'app est vulnérable
**Solution**: Les tests documentent le comportement attendu. La vraie sécurité est assurée par:
- RLS policies Supabase
- Fonctions security definer
- Migrations SQL (LOT 1)

Les tests valident que ces protections sont en place, mais ne les créent pas.

## ✅ Checklist de validation

Avant de considérer le LOT 2 complété:

- [x] Tests de protection des rôles créés
- [x] Tests de transactions de tokens créés
- [x] Tests E2E d'authentification créés
- [x] Tests d'intégration marketplace créés
- [x] Documentation des tests complète (README-TESTS.md)
- [ ] Tous les tests passent (`npm run test:run`)
- [ ] Couverture ≥70% sur les fichiers critiques
- [ ] TypeCheck sans erreurs (`npm run typecheck`)

---

**Dernière mise à jour**: LOT 2 - Tests Essentiels
**Version**: 1.0.0
**Statut**: ✅ Tests de sécurité ajoutés
