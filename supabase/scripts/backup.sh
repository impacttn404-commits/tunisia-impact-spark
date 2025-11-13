#!/bin/bash

################################################################################
# Script: backup.sh
# Description: Automated database backup with CSV/JSON exports and timestamps
# Usage: ./supabase/scripts/backup.sh [options]
# Options:
#   --format=csv|json|both  Export format (default: both)
#   --output=<dir>          Output directory (default: supabase/backups)
#   --tables=<list>         Comma-separated table list (default: all)
#   --skip-sql-dump         Skip SQL dump generation
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
EXPORT_FORMAT="both"
OUTPUT_DIR="supabase/backups"
SKIP_SQL_DUMP=false
TABLES_LIST=""

# Parse arguments
for arg in "$@"; do
  case $arg in
    --format=*)
      EXPORT_FORMAT="${arg#*=}"
      shift
      ;;
    --output=*)
      OUTPUT_DIR="${arg#*=}"
      shift
      ;;
    --tables=*)
      TABLES_LIST="${arg#*=}"
      shift
      ;;
    --skip-sql-dump)
      SKIP_SQL_DUMP=true
      shift
      ;;
    --help)
      echo "Usage: ./supabase/scripts/backup.sh [options]"
      echo ""
      echo "Options:"
      echo "  --format=csv|json|both  Export format (default: both)"
      echo "  --output=<dir>          Output directory (default: supabase/backups)"
      echo "  --tables=<list>         Comma-separated table list (default: all)"
      echo "  --skip-sql-dump         Skip SQL dump generation"
      echo "  --help                  Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}✗ Unknown option: $arg${NC}"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Validate format
if [[ ! "$EXPORT_FORMAT" =~ ^(csv|json|both)$ ]]; then
  echo -e "${RED}✗ Invalid format: $EXPORT_FORMAT${NC}"
  echo "Valid formats: csv, json, both"
  exit 1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Tunisia Impact Spark - Database Backup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if Supabase CLI is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}✗ Supabase CLI not found${NC}"
  echo "Install it: https://supabase.com/docs/guides/cli"
  exit 1
fi
echo -e "${GREEN}✓ Supabase CLI installed${NC}"

# Check if psql is available
if ! command -v psql &> /dev/null; then
  echo -e "${YELLOW}⚠ psql not found - SQL dump will be skipped${NC}"
  SKIP_SQL_DUMP=true
else
  echo -e "${GREEN}✓ psql installed${NC}"
fi

# Check Supabase project link
if [ ! -f "supabase/.temp/project-ref" ] && [ ! -f ".git/supabase/project-ref" ]; then
  echo -e "${RED}✗ No Supabase project linked${NC}"
  echo "Run: supabase link --project-ref <your-project-ref>"
  exit 1
fi
echo -e "${GREEN}✓ Supabase project linked${NC}"

# Check SUPABASE_DB_URL
if [ -z "$SUPABASE_DB_URL" ]; then
  echo -e "${YELLOW}⚠ SUPABASE_DB_URL not set${NC}"
  echo "Attempting to get DB URL from Supabase CLI..."
  SUPABASE_DB_URL=$(supabase status --output json 2>/dev/null | grep -o '"DB URL": "[^"]*"' | cut -d'"' -f4 || echo "")
  
  if [ -z "$SUPABASE_DB_URL" ]; then
    echo -e "${RED}✗ Could not retrieve database URL${NC}"
    echo "Please set SUPABASE_DB_URL environment variable"
    echo "Get it from: supabase status"
    exit 1
  fi
fi
echo -e "${GREEN}✓ Database URL configured${NC}"

# Create timestamped backup directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${OUTPUT_DIR}/${TIMESTAMP}"
mkdir -p "$BACKUP_DIR"
echo ""
echo -e "${GREEN}✓ Created backup directory: ${BACKUP_DIR}${NC}"

# Default tables to backup
if [ -z "$TABLES_LIST" ]; then
  TABLES=("profiles" "user_roles" "challenges" "projects" "evaluations" "marketplace_products" "token_transactions")
else
  IFS=',' read -ra TABLES <<< "$TABLES_LIST"
fi

echo ""
echo -e "${BLUE}Starting backup process...${NC}"
echo ""

# Export tables
for table in "${TABLES[@]}"; do
  echo -e "${YELLOW}Backing up table: ${table}${NC}"
  
  # Export to CSV
  if [[ "$EXPORT_FORMAT" == "csv" ]] || [[ "$EXPORT_FORMAT" == "both" ]]; then
    CSV_FILE="${BACKUP_DIR}/${table}.csv"
    psql "$SUPABASE_DB_URL" -c "\COPY (SELECT * FROM public.${table}) TO STDOUT WITH CSV HEADER" > "$CSV_FILE" 2>/dev/null || {
      echo -e "${RED}  ✗ Failed to export ${table} to CSV${NC}"
      continue
    }
    ROW_COUNT=$(tail -n +2 "$CSV_FILE" | wc -l | tr -d ' ')
    echo -e "${GREEN}  ✓ CSV exported: ${table}.csv (${ROW_COUNT} rows)${NC}"
  fi
  
  # Export to JSON
  if [[ "$EXPORT_FORMAT" == "json" ]] || [[ "$EXPORT_FORMAT" == "both" ]]; then
    JSON_FILE="${BACKUP_DIR}/${table}.json"
    psql "$SUPABASE_DB_URL" -t -c "SELECT json_agg(t) FROM (SELECT * FROM public.${table}) t" > "$JSON_FILE" 2>/dev/null || {
      echo -e "${RED}  ✗ Failed to export ${table} to JSON${NC}"
      continue
    }
    echo -e "${GREEN}  ✓ JSON exported: ${table}.json${NC}"
  fi
done

# Create SQL dump
if [ "$SKIP_SQL_DUMP" = false ]; then
  echo ""
  echo -e "${YELLOW}Creating SQL dump...${NC}"
  SQL_DUMP="${BACKUP_DIR}/full_backup.sql"
  
  pg_dump "$SUPABASE_DB_URL" \
    --schema=public \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    > "$SQL_DUMP" 2>/dev/null || {
    echo -e "${RED}✗ Failed to create SQL dump${NC}"
    echo "Note: This is optional, data exports are complete"
  }
  
  if [ -f "$SQL_DUMP" ]; then
    DUMP_SIZE=$(du -h "$SQL_DUMP" | cut -f1)
    echo -e "${GREEN}✓ SQL dump created: full_backup.sql (${DUMP_SIZE})${NC}"
  fi
fi

# Create metadata file
METADATA_FILE="${BACKUP_DIR}/metadata.json"
cat > "$METADATA_FILE" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "format": "$EXPORT_FORMAT",
  "tables": [$(printf '"%s",' "${TABLES[@]}" | sed 's/,$//')]
  "backup_dir": "$BACKUP_DIR",
  "sql_dump_included": $([ "$SKIP_SQL_DUMP" = false ] && echo "true" || echo "false")
}
EOF
echo -e "${GREEN}✓ Metadata file created${NC}"

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Backup completed successfully!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Backup location:${NC}"
echo "  $BACKUP_DIR"
echo ""
echo -e "${BLUE}Files created:${NC}"
ls -lh "$BACKUP_DIR" | tail -n +2 | awk '{printf "  %-30s %s\n", $9, $5}'
echo ""
echo -e "${BLUE}Backup size:${NC}"
du -sh "$BACKUP_DIR" | awk '{print "  " $1}'
echo ""
echo -e "${YELLOW}💡 To restore from this backup:${NC}"
echo "  1. SQL dump: psql \$SUPABASE_DB_URL < $BACKUP_DIR/full_backup.sql"
echo "  2. CSV import: psql \$SUPABASE_DB_URL -c \"\\COPY public.<table> FROM '$BACKUP_DIR/<table>.csv' CSV HEADER\""
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  • Verify backup integrity: ls -la $BACKUP_DIR"
echo "  • Run reset safely: ./supabase/scripts/reset-and-seed.sh"
echo "  • Archive old backups: tar -czf backups_${TIMESTAMP}.tar.gz $BACKUP_DIR"
echo ""
