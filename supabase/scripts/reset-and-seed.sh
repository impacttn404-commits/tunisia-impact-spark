#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🔄 RESET + SEED AUTOMATION SCRIPT - Tunisia Impact Spark
# ═══════════════════════════════════════════════════════════════════════════
# 
# Ce script automatise la séquence : reset.sql → seed.sql/seed.ts
# avec confirmation interactive de sécurité
#
# Usage:
#   ./supabase/scripts/reset-and-seed.sh [--sql|--ts] [--skip-confirm]
#
# Options:
#   --sql           Utiliser seed.sql (par défaut)
#   --ts            Utiliser seed.ts (nécessite Deno)
#   --skip-confirm  Skip la confirmation (⚠️ dangereux!)
#
# ═══════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
SEED_METHOD="sql"
SKIP_CONFIRM=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    --ts)
      SEED_METHOD="ts"
      shift
      ;;
    --sql)
      SEED_METHOD="sql"
      shift
      ;;
    --skip-confirm)
      SKIP_CONFIRM=true
      shift
      ;;
    *)
      ;;
  esac
done

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 1 : Vérifications préliminaires
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}🔄 Tunisia Impact Spark - Reset & Seed Automation${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Erreur : Supabase CLI n'est pas installé${NC}"
    echo -e "${YELLOW}Installation : https://supabase.com/docs/guides/cli${NC}"
    exit 1
fi

# Check if project is linked
if [ ! -f "supabase/.temp/project-ref" ] && [ ! -f ".git/config" ]; then
    echo -e "${YELLOW}⚠️  Warning : Projet Supabase non détecté${NC}"
    echo -e "${YELLOW}   Assurez-vous d'être dans le bon répertoire${NC}"
fi

# Check seed method requirements
if [ "$SEED_METHOD" = "ts" ]; then
    if ! command -v deno &> /dev/null; then
        echo -e "${RED}❌ Erreur : Deno n'est pas installé (requis pour --ts)${NC}"
        echo -e "${YELLOW}Installation : curl -fsSL https://deno.land/install.sh | sh${NC}"
        exit 1
    fi
    
    # Check for SERVICE_ROLE_KEY
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        echo -e "${RED}❌ Erreur : SUPABASE_SERVICE_ROLE_KEY non définie${NC}"
        echo -e "${YELLOW}Export : export SUPABASE_SERVICE_ROLE_KEY=your_key${NC}"
        exit 1
    fi
fi

# Check if files exist
if [ ! -f "supabase/reset.sql" ]; then
    echo -e "${RED}❌ Erreur : supabase/reset.sql introuvable${NC}"
    exit 1
fi

if [ "$SEED_METHOD" = "sql" ] && [ ! -f "supabase/seed.sql" ]; then
    echo -e "${RED}❌ Erreur : supabase/seed.sql introuvable${NC}"
    exit 1
fi

if [ "$SEED_METHOD" = "ts" ] && [ ! -f "supabase/seed.ts" ]; then
    echo -e "${RED}❌ Erreur : supabase/seed.ts introuvable${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vérifications préliminaires OK${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 2 : Confirmation de sécurité
# ═══════════════════════════════════════════════════════════════════════════

if [ "$SKIP_CONFIRM" = false ]; then
    echo -e "${RED}⚠️  ═══════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}⚠️   ATTENTION : Cette action va SUPPRIMER TOUTES LES DONNÉES${NC}"
    echo -e "${RED}⚠️  ═══════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}Ce script va :${NC}"
    echo -e "  1. 🗑️  Vider toutes les tables (reset.sql)"
    echo -e "  2. 📦 Réinjecter les données de test (seed.$SEED_METHOD)"
    echo ""
    echo -e "${YELLOW}Tables affectées :${NC}"
    echo -e "  • token_transactions"
    echo -e "  • evaluations"
    echo -e "  • marketplace_products"
    echo -e "  • projects"
    echo -e "  • challenges"
    echo -e "  • user_roles"
    echo -e "  • profiles"
    echo ""
    echo -e "${RED}⚠️  NE JAMAIS EXÉCUTER EN PRODUCTION !${NC}"
    echo ""
    
    read -p "$(echo -e ${YELLOW}"Êtes-vous ABSOLUMENT SÛR de vouloir continuer? (tapez 'YES' pour confirmer) : "${NC})" confirmation
    
    if [ "$confirmation" != "YES" ]; then
        echo -e "${BLUE}❌ Opération annulée par l'utilisateur${NC}"
        exit 0
    fi
    
    echo ""
    echo -e "${GREEN}✅ Confirmation reçue. Démarrage...${NC}"
    echo ""
fi

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 3 : Exécution RESET
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"
echo -e "${BLUE}📝 Étape 1/2 : Exécution de reset.sql${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"
echo ""

# Execute reset.sql via Supabase CLI
if supabase db reset --db-url "$SUPABASE_DB_URL" 2>/dev/null || \
   psql "$SUPABASE_DB_URL" -f supabase/reset.sql 2>/dev/null; then
    echo -e "${GREEN}✅ Reset exécuté avec succès${NC}"
else
    # Fallback: Instructions manuelles si CLI échoue
    echo -e "${YELLOW}⚠️  Impossible d'exécuter automatiquement via CLI${NC}"
    echo -e "${YELLOW}   Veuillez exécuter manuellement :${NC}"
    echo ""
    echo -e "${BLUE}1. Ouvrir : https://supabase.com/dashboard/project/hmxraezyquqslkolaqmk/sql/new${NC}"
    echo -e "${BLUE}2. Copier-coller le contenu de supabase/reset.sql${NC}"
    echo -e "${BLUE}3. Cliquer sur 'Run'${NC}"
    echo ""
    read -p "$(echo -e ${YELLOW}"Appuyez sur ENTER après avoir exécuté reset.sql...${NC})"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 4 : Exécution SEED
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"
echo -e "${BLUE}📝 Étape 2/2 : Exécution de seed.$SEED_METHOD${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"
echo ""

if [ "$SEED_METHOD" = "ts" ]; then
    # Execute seed.ts with Deno
    echo -e "${YELLOW}Exécution de seed.ts avec Deno...${NC}"
    cd supabase
    deno run --allow-net --allow-env seed.ts
    cd ..
    echo -e "${GREEN}✅ Seed TypeScript exécuté avec succès${NC}"
else
    # Execute seed.sql
    if psql "$SUPABASE_DB_URL" -f supabase/seed.sql 2>/dev/null; then
        echo -e "${GREEN}✅ Seed SQL exécuté avec succès${NC}"
    else
        # Fallback: Instructions manuelles
        echo -e "${YELLOW}⚠️  Impossible d'exécuter automatiquement via CLI${NC}"
        echo -e "${YELLOW}   Veuillez exécuter manuellement :${NC}"
        echo ""
        echo -e "${BLUE}1. Ouvrir : https://supabase.com/dashboard/project/hmxraezyquqslkolaqmk/sql/new${NC}"
        echo -e "${BLUE}2. Copier-coller le contenu de supabase/seed.sql${NC}"
        echo -e "${BLUE}3. Cliquer sur 'Run'${NC}"
        echo ""
        read -p "$(echo -e ${YELLOW}"Appuyez sur ENTER après avoir exécuté seed.sql...${NC})"
    fi
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════
# ÉTAPE 5 : Vérification finale
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"
echo -e "${BLUE}✅ Vérification des données${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"
echo ""

echo -e "${YELLOW}Comptes attendus :${NC}"
echo -e "  • profiles: 12"
echo -e "  • challenges: 3"
echo -e "  • projects: 8"
echo -e "  • evaluations: 15"
echo -e "  • marketplace_products: 6"
echo -e "  • token_transactions: 17"
echo ""

echo -e "${GREEN}Pour vérifier dans Supabase :${NC}"
echo -e "${BLUE}https://supabase.com/dashboard/project/hmxraezyquqslkolaqmk/editor${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# FIN
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Reset & Seed complété avec succès !${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Prochaines étapes :${NC}"
echo -e "  1. Vérifier les données dans le dashboard Supabase"
echo -e "  2. Tester l'application avec les données de test"
echo -e "  3. Créer les users auth si nécessaire (UUIDs fictifs)"
echo ""
echo -e "${YELLOW}📚 Documentation : supabase/README-SEED.md${NC}"
echo ""
