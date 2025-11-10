/**
 * Tunisia Impact Spark - Seed Script TypeScript
 * 
 * Script pour injecter des données de test via l'API Supabase
 * Usage: deno run --allow-net --allow-env supabase/seed.ts
 * 
 * ⚠️ IMPORTANT: Ce script utilise la SERVICE_ROLE_KEY pour bypasser RLS
 * Ne jamais exposer cette clé côté client !
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://hmxraezyquqslkolaqmk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY manquante');
  console.error('Usage: SUPABASE_SERVICE_ROLE_KEY=your_key deno run --allow-net --allow-env supabase/seed.ts');
  Deno.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ============================================
// DONNÉES DE TEST
// ============================================

const profiles = [
  // Investisseurs
  {
    user_id: '11111111-1111-1111-1111-111111111111',
    email: 'investor1@tunisietelecom.tn',
    first_name: 'Mehdi',
    last_name: 'Ben Salah',
    role: 'investor',
    tokens_balance: 500,
    badge_level: 'gold',
    company_name: 'Tunisie Telecom Foundation',
    phone: '+216 70 123 456',
  },
  {
    user_id: '22222222-2222-2222-2222-222222222222',
    email: 'impact@amen.bank',
    first_name: 'Salma',
    last_name: 'Trabelsi',
    role: 'investor',
    tokens_balance: 800,
    badge_level: 'platinum',
    company_name: 'AMEN Bank RSE',
    phone: '+216 71 234 567',
  },
  {
    user_id: '33333333-3333-3333-3333-333333333333',
    email: 'rse@orangetn.com',
    first_name: 'Karim',
    last_name: 'Laabidi',
    role: 'investor',
    tokens_balance: 300,
    badge_level: 'silver',
    company_name: 'Orange Tunisia Impact',
    phone: '+216 98 345 678',
  },
  // Porteurs de projet
  {
    user_id: '44444444-4444-4444-4444-444444444444',
    email: 'youssef.ecobrick@gmail.com',
    first_name: 'Youssef',
    last_name: 'Khemiri',
    role: 'projectHolder',
    tokens_balance: 150,
    badge_level: 'bronze',
    phone: '+216 50 111 222',
  },
  {
    user_id: '55555555-5555-5555-5555-555555555555',
    email: 'amira.agrismart@gmail.com',
    first_name: 'Amira',
    last_name: 'Jlassi',
    role: 'projectHolder',
    tokens_balance: 200,
    badge_level: 'silver',
    phone: '+216 54 222 333',
  },
  {
    user_id: '66666666-6666-6666-6666-666666666666',
    email: 'riadh.ecoleverte@gmail.com',
    first_name: 'Riadh',
    last_name: 'Mansouri',
    role: 'projectHolder',
    tokens_balance: 100,
    badge_level: 'bronze',
    phone: '+216 52 333 444',
  },
  {
    user_id: '77777777-7777-7777-7777-777777777777',
    email: 'nadia.cleanenergy@gmail.com',
    first_name: 'Nadia',
    last_name: 'Hamdi',
    role: 'projectHolder',
    tokens_balance: 250,
    badge_level: 'silver',
    phone: '+216 55 444 555',
  },
  {
    user_id: '88888888-8888-8888-8888-888888888888',
    email: 'farah.waterpure@gmail.com',
    first_name: 'Farah',
    last_name: 'Bouazizi',
    role: 'projectHolder',
    tokens_balance: 80,
    badge_level: 'bronze',
    phone: '+216 51 555 666',
  },
  // Évaluateurs
  {
    user_id: '99999999-9999-9999-9999-999999999999',
    email: 'dr.sfaxi@enit.utm.tn',
    first_name: 'Lassaad',
    last_name: 'Sfaxi',
    role: 'evaluator',
    tokens_balance: 320,
    badge_level: 'gold',
    company_name: "ENIT - École Nationale d'Ingénieurs",
    phone: '+216 71 111 111',
    total_evaluations: 12,
  },
  {
    user_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    email: 'rim.bouzid@fst.utm.tn',
    first_name: 'Rim',
    last_name: 'Bouzid',
    role: 'evaluator',
    tokens_balance: 280,
    badge_level: 'silver',
    company_name: 'FST - Faculté des Sciences',
    phone: '+216 71 222 222',
    total_evaluations: 10,
  },
  {
    user_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    email: 'hichem.impact@gmail.com',
    first_name: 'Hichem',
    last_name: 'Agrebi',
    role: 'evaluator',
    tokens_balance: 450,
    badge_level: 'platinum',
    company_name: 'Consultant Impact Social',
    phone: '+216 98 333 333',
    total_evaluations: 18,
  },
  {
    user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    email: 'sarra.env@gmail.com',
    first_name: 'Sarra',
    last_name: 'Cherif',
    role: 'evaluator',
    tokens_balance: 190,
    badge_level: 'bronze',
    company_name: 'Experte Environnement',
    phone: '+216 22 444 444',
    total_evaluations: 7,
  },
];

const userRoles = [
  { user_id: '11111111-1111-1111-1111-111111111111', role: 'investor' },
  { user_id: '22222222-2222-2222-2222-222222222222', role: 'investor' },
  { user_id: '33333333-3333-3333-3333-333333333333', role: 'investor' },
  { user_id: '44444444-4444-4444-4444-444444444444', role: 'projectHolder' },
  { user_id: '55555555-5555-5555-5555-555555555555', role: 'projectHolder' },
  { user_id: '66666666-6666-6666-6666-666666666666', role: 'projectHolder' },
  { user_id: '77777777-7777-7777-7777-777777777777', role: 'projectHolder' },
  { user_id: '88888888-8888-8888-8888-888888888888', role: 'projectHolder' },
  { user_id: '99999999-9999-9999-9999-999999999999', role: 'evaluator' },
  { user_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', role: 'evaluator' },
  { user_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', role: 'evaluator' },
  { user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', role: 'evaluator' },
];

const challenges = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    title: 'Green Tunisia 2025 🌱',
    description: "Challenge pour promouvoir l'innovation écologique urbaine en Tunisie. Nous recherchons des projets qui proposent des solutions concrètes pour réduire l'empreinte carbone des villes tunisiennes, améliorer la gestion des déchets, et favoriser l'économie circulaire.",
    created_by: '11111111-1111-1111-1111-111111111111',
    prize_amount: 50000,
    participation_fee: 50,
    criteria_impact: 10,
    criteria_innovation: 8,
    criteria_viability: 7,
    criteria_sustainability: 10,
    status: 'active',
    start_date: '2025-01-15T09:00:00+01:00',
    end_date: '2025-06-30T23:59:59+01:00',
    max_participants: 20,
    current_participants: 5,
    currency: 'TND',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    title: 'Tech for Inclusion 💻',
    description: "Initiative pour soutenir les startups numériques inclusives qui utilisent la technologie pour réduire les inégalités sociales. Focus sur les solutions adaptées au contexte tunisien.",
    created_by: '22222222-2222-2222-2222-222222222222',
    prize_amount: 75000,
    participation_fee: 50,
    criteria_impact: 9,
    criteria_innovation: 10,
    criteria_viability: 8,
    criteria_sustainability: 7,
    status: 'active',
    start_date: '2025-02-01T09:00:00+01:00',
    end_date: '2025-07-31T23:59:59+01:00',
    max_participants: 15,
    current_participants: 3,
    currency: 'TND',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    title: 'Youth Impact Lab 🎓',
    description: "Programme dédié aux jeunes entrepreneurs tunisiens portant des projets éducatifs durables. Formation et mentorat inclus.",
    created_by: '33333333-3333-3333-3333-333333333333',
    prize_amount: 40000,
    participation_fee: 50,
    criteria_impact: 8,
    criteria_innovation: 7,
    criteria_viability: 9,
    criteria_sustainability: 8,
    status: 'active',
    start_date: '2025-03-01T09:00:00+01:00',
    end_date: '2025-08-31T23:59:59+01:00',
    max_participants: 25,
    current_participants: 4,
    currency: 'TND',
  },
];

const projects = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    title: 'EcoBrick Tunisia 🧱',
    description: "Projet de recyclage innovant transformant les déchets plastiques en briques de construction écologiques. Impact : réduction des déchets, création d'emplois verts, sensibilisation environnementale.",
    sector: 'Environnement - Économie Circulaire',
    objectives: 'Réduire 50 tonnes de plastique en 2 ans, créer 15 emplois verts, construire 10 structures communautaires',
    budget: 45000,
    status: 'in_review',
    created_by: '44444444-4444-4444-4444-444444444444',
    challenge_id: 'c1111111-1111-1111-1111-111111111111',
    average_rating: 8.5,
    total_evaluations: 3,
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    title: 'CompostCity Tunis 🌿',
    description: "Réseau de compostage urbain collectif dans les quartiers de Tunis. Application mobile pour suivre sa contribution environnementale.",
    sector: 'Environnement - Gestion des Déchets',
    objectives: 'Composter 30 tonnes de biodéchets/an, équiper 20 quartiers, sensibiliser 2000 familles',
    budget: 32000,
    status: 'in_review',
    created_by: '44444444-4444-4444-4444-444444444444',
    challenge_id: 'c1111111-1111-1111-1111-111111111111',
    average_rating: 7.8,
    total_evaluations: 2,
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    title: 'AgriSmart TN 🚜',
    description: "Plateforme digitale connectant petits agriculteurs tunisiens aux marchés locaux, avec conseil agronomique par SMS et app mobile.",
    sector: 'Agriculture - Technologie',
    objectives: 'Connecter 500 agriculteurs, augmenter revenus de 30%, digitaliser la chaîne de valeur',
    budget: 65000,
    status: 'in_review',
    created_by: '55555555-5555-5555-5555-555555555555',
    challenge_id: 'c2222222-2222-2222-2222-222222222222',
    average_rating: 9.2,
    total_evaluations: 4,
  },
  {
    id: 'p4444444-4444-4444-4444-444444444444',
    title: 'E-Saha Platform 🏥',
    description: "Application de télémédecine connectant populations rurales aux médecins spécialistes. Partenariat CNAM.",
    sector: 'Santé - Numérique',
    objectives: 'Servir 10 000 patients ruraux, réduire déplacements de 60%, former 50 médecins',
    budget: 58000,
    status: 'pending',
    created_by: '55555555-5555-5555-5555-555555555555',
    challenge_id: 'c2222222-2222-2222-2222-222222222222',
  },
  {
    id: 'p5555555-5555-5555-5555-555555555555',
    title: 'École Verte 🌳',
    description: "Programme transformant écoles publiques en modèles de durabilité : jardins pédagogiques, panneaux solaires, compostage.",
    sector: 'Éducation - Environnement',
    objectives: "Transformer 15 écoles en écoles vertes, former 200 enseignants, sensibiliser 5000 élèves",
    budget: 38000,
    status: 'in_review',
    created_by: '66666666-6666-6666-6666-666666666666',
    challenge_id: 'c3333333-3333-3333-3333-333333333333',
    average_rating: 8.1,
    total_evaluations: 3,
  },
  {
    id: 'p6666666-6666-6666-6666-666666666666',
    title: 'CodeCamp Bled 💻',
    description: "Bootcamps gratuits de codage dans zones rurales pour jeunes 15-25 ans. Partenariats entreprises pour stages.",
    sector: 'Éducation - Numérique',
    objectives: "Former 300 jeunes ruraux au code, taux emploi 70%, créer 5 antennes régionales",
    budget: 42000,
    status: 'in_review',
    created_by: '66666666-6666-6666-6666-666666666666',
    challenge_id: 'c3333333-3333-3333-3333-333333333333',
    average_rating: 7.5,
    total_evaluations: 2,
  },
  {
    id: 'p7777777-7777-7777-7777-777777777777',
    title: 'CleanEnergy Now ⚡',
    description: "Installation micro-grids solaires dans villages isolés. Modèle économique coopératif avec paiement mobile money.",
    sector: 'Énergie Renouvelable',
    objectives: 'Électrifier 8 villages (2000 habitants), installer 150 kW solaire, créer 12 emplois',
    budget: 95000,
    status: 'draft',
    created_by: '77777777-7777-7777-7777-777777777777',
  },
  {
    id: 'p8888888-8888-8888-8888-888888888888',
    title: 'WaterPure Tunisia 💧',
    description: "Solutions low-cost de purification d'eau potable pour zones rurales. Filtres céramiques produits localement.",
    sector: 'Eau - Santé Publique',
    objectives: "Fournir eau potable à 15 villages (5000 personnes), réduire maladies hydriques de 80%",
    budget: 52000,
    status: 'draft',
    created_by: '88888888-8888-8888-8888-888888888888',
  },
];

const evaluations = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    evaluator_id: '99999999-9999-9999-9999-999999999999',
    impact_score: 9,
    innovation_score: 8,
    viability_score: 8,
    sustainability_score: 9,
    overall_score: 8.5,
    tokens_earned: 50,
    feedback: "Excellent projet d'économie circulaire avec impact mesurable. Budget réaliste, équipe motivée.",
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    evaluator_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    impact_score: 9,
    innovation_score: 7,
    viability_score: 8,
    sustainability_score: 9,
    overall_score: 8.3,
    tokens_earned: 50,
    feedback: "Fort potentiel impact social et environnemental. Modèle réplicable.",
  },
  {
    id: 'e3333333-3333-3333-3333-333333333333',
    project_id: 'p1111111-1111-1111-1111-111111111111',
    evaluator_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    impact_score: 10,
    innovation_score: 8,
    viability_score: 8,
    sustainability_score: 9,
    overall_score: 8.8,
    tokens_earned: 50,
    feedback: "Projet exemplaire d'upcycling. Excellente initiative durabilité.",
  },
  {
    id: 'e4444444-4444-4444-4444-444444444444',
    project_id: 'p2222222-2222-2222-2222-222222222222',
    evaluator_id: '99999999-9999-9999-9999-999999999999',
    impact_score: 8,
    innovation_score: 7,
    viability_score: 7,
    sustainability_score: 9,
    overall_score: 7.8,
    tokens_earned: 45,
    feedback: "Compostage urbain bien conçu. App mobile = bon levier engagement.",
  },
  {
    id: 'e5555555-5555-5555-5555-555555555555',
    project_id: 'p2222222-2222-2222-2222-222222222222',
    evaluator_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    impact_score: 8,
    innovation_score: 7,
    viability_score: 8,
    sustainability_score: 8,
    overall_score: 7.8,
    tokens_earned: 45,
    feedback: "Initiative pertinente valorisation biodéchets urbains.",
  },
  {
    id: 'e6666666-6666-6666-6666-666666666666',
    project_id: 'p3333333-3333-3333-3333-333333333333',
    evaluator_id: '99999999-9999-9999-9999-999999999999',
    impact_score: 10,
    innovation_score: 9,
    viability_score: 9,
    sustainability_score: 8,
    overall_score: 9.0,
    tokens_earned: 60,
    feedback: "Solution digitale très pertinente agriculture tunisienne. Excellent potentiel scaling.",
  },
  {
    id: 'e7777777-7777-7777-7777-777777777777',
    project_id: 'p3333333-3333-3333-3333-333333333333',
    evaluator_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    impact_score: 9,
    innovation_score: 9,
    viability_score: 9,
    sustainability_score: 8,
    overall_score: 8.8,
    tokens_earned: 60,
    feedback: "Projet AgriTech d'excellence. Approche inclusive remarquable.",
  },
  {
    id: 'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    project_id: 'p3333333-3333-3333-3333-333333333333',
    evaluator_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    impact_score: 9,
    innovation_score: 10,
    viability_score: 9,
    sustainability_score: 8,
    overall_score: 9.0,
    tokens_earned: 60,
    feedback: "Innovation remarquable combinant tech et connaissance agricole locale.",
  },
  {
    id: 'ebbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    project_id: 'p3333333-3333-3333-3333-333333333333',
    evaluator_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    impact_score: 10,
    innovation_score: 9,
    viability_score: 9,
    sustainability_score: 9,
    overall_score: 9.3,
    tokens_earned: 60,
    feedback: "AgriSmart est exactement ce dont agriculture tunisienne a besoin. Projet coup de cœur !",
  },
  {
    id: 'e8888888-8888-8888-8888-888888888888',
    project_id: 'p5555555-5555-5555-5555-555555555555',
    evaluator_id: '99999999-9999-9999-9999-999999999999',
    impact_score: 8,
    innovation_score: 7,
    viability_score: 8,
    sustainability_score: 9,
    overall_score: 8.0,
    tokens_earned: 50,
    feedback: "Programme éducatif complet intégrant durabilité. Impact long terme positif.",
  },
  {
    id: 'e9999999-9999-9999-9999-999999999999',
    project_id: 'p5555555-5555-5555-5555-555555555555',
    evaluator_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    impact_score: 8,
    innovation_score: 7,
    viability_score: 9,
    sustainability_score: 9,
    overall_score: 8.3,
    tokens_earned: 50,
    feedback: "Excellente initiative transformation écoles en espaces durables.",
  },
  {
    id: 'ecccccccc-cccc-cccc-cccc-cccccccccccc',
    project_id: 'p5555555-5555-5555-5555-555555555555',
    evaluator_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    impact_score: 9,
    innovation_score: 7,
    viability_score: 8,
    sustainability_score: 9,
    overall_score: 8.3,
    tokens_earned: 50,
    feedback: "Projet éducation environnementale d'impact majeur. Très aligné ODD.",
  },
  {
    id: 'edddddddd-dddd-dddd-dddd-dddddddddddd',
    project_id: 'p6666666-6666-6666-6666-666666666666',
    evaluator_id: '99999999-9999-9999-9999-999999999999',
    impact_score: 7,
    innovation_score: 8,
    viability_score: 7,
    sustainability_score: 7,
    overall_score: 7.3,
    tokens_earned: 40,
    feedback: "Initiative réduction fracture numérique rurale. Bootcamp intensif efficace.",
  },
  {
    id: 'eeeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    project_id: 'p6666666-6666-6666-6666-666666666666',
    evaluator_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    impact_score: 8,
    innovation_score: 7,
    viability_score: 7,
    sustainability_score: 7,
    overall_score: 7.3,
    tokens_earned: 40,
    feedback: "CodeCamp répond à besoin réel compétences numériques zones rurales.",
  },
];

const marketplaceProducts = [
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    title: 'Pack Visibilité Projet 📢',
    description: "Boostez la visibilité de votre projet pendant 30 jours : mise en avant page d'accueil, réseaux sociaux, newsletter.",
    category: 'Marketing & Communication',
    price_tnd: 150,
    price_tokens: 300,
    stock_quantity: 10,
    seller_id: '11111111-1111-1111-1111-111111111111',
    image_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
  },
  {
    id: 'm2222222-2222-2222-2222-222222222222',
    title: 'Coaching Startup 1:1 (3 sessions) 💼',
    description: "Accompagnement personnalisé par mentor expert impact social : stratégie, business model, pitch, levée fonds.",
    category: 'Formation & Mentorat',
    price_tokens: 500,
    stock_quantity: 5,
    seller_id: '22222222-2222-2222-2222-222222222222',
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400',
  },
  {
    id: 'm3333333-3333-3333-3333-333333333333',
    title: 'Certification Impact B-Corp (audit préliminaire) ✅',
    description: "Audit préliminaire éligibilité certification B-Corp par consultant certifié.",
    category: 'Certification & Audit',
    price_tnd: 800,
    price_tokens: 1500,
    stock_quantity: 3,
    seller_id: '22222222-2222-2222-2222-222222222222',
    image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400',
  },
  {
    id: 'm4444444-4444-4444-4444-444444444444',
    title: 'Formation "Mesurer son Impact Social" 📊',
    description: "Workshop 1 journée : méthodologies mesure impact, KPIs, SROI, reporting ESG.",
    category: 'Formation & Mentorat',
    price_tnd: 200,
    price_tokens: 400,
    stock_quantity: 20,
    seller_id: '33333333-3333-3333-3333-333333333333',
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400',
  },
  {
    id: 'm5555555-5555-5555-5555-555555555555',
    title: 'Accès Espace Coworking Impact Hub (1 mois) 🏢',
    description: "Accès illimité pendant 1 mois à Impact Hub Tunis : bureau flexible, salles réunion, événements networking.",
    category: 'Services & Infrastructures',
    price_tnd: 300,
    price_tokens: 600,
    stock_quantity: 8,
    seller_id: '11111111-1111-1111-1111-111111111111',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
  },
  {
    id: 'm6666666-6666-6666-6666-666666666666',
    title: 'Kit Communication Impact (templates) 🎨',
    description: "Kit templates professionnels : pitch deck, dossier projet, visuels réseaux sociaux, email investisseurs.",
    category: 'Marketing & Communication',
    price_tokens: 200,
    stock_quantity: 50,
    seller_id: '33333333-3333-3333-3333-333333333333',
    image_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400',
  },
];

const tokenTransactions = [
  // Récompenses évaluations
  {
    id: 't1111111-1111-1111-1111-111111111111',
    user_id: '99999999-9999-9999-9999-999999999999',
    amount: 50,
    type: 'evaluation_reward',
    description: 'Évaluation projet EcoBrick Tunisia',
    reference_id: 'e1111111-1111-1111-1111-111111111111',
  },
  {
    id: 't2222222-2222-2222-2222-222222222222',
    user_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    amount: 50,
    type: 'evaluation_reward',
    description: 'Évaluation projet EcoBrick Tunisia',
    reference_id: 'e2222222-2222-2222-2222-222222222222',
  },
  // Achats marketplace
  {
    id: 't6666666-6666-6666-6666-666666666666',
    user_id: '44444444-4444-4444-4444-444444444444',
    amount: -300,
    type: 'marketplace_purchase',
    description: 'Achat: Pack Visibilité Projet',
    reference_id: 'm1111111-1111-1111-1111-111111111111',
  },
  {
    id: 't7777777-7777-7777-7777-777777777777',
    user_id: '55555555-5555-5555-5555-555555555555',
    amount: -400,
    type: 'marketplace_purchase',
    description: 'Achat: Formation Mesurer Impact',
    reference_id: 'm4444444-4444-4444-4444-444444444444',
  },
  // Bonus promotionnels
  {
    id: 't9999999-9999-9999-9999-999999999999',
    user_id: '44444444-4444-4444-4444-444444444444',
    amount: 100,
    type: 'bonus',
    description: 'Bonus bienvenue nouveau porteur projet',
  },
  {
    id: 'taaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    user_id: '55555555-5555-5555-5555-555555555555',
    amount: 100,
    type: 'bonus',
    description: 'Bonus bienvenue nouveau porteur projet',
  },
  // Frais participation challenges
  {
    id: 'teeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    user_id: '44444444-4444-4444-4444-444444444444',
    amount: -50,
    type: 'challenge_participation',
    description: 'Frais participation Green Tunisia 2025',
    reference_id: 'c1111111-1111-1111-1111-111111111111',
  },
];

// ============================================
// FONCTIONS D'INSERTION
// ============================================

async function seedTable<T>(
  tableName: string,
  data: T[],
  description: string
): Promise<void> {
  console.log(`\n📝 Insertion ${description}...`);
  
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select();

  if (error) {
    console.error(`❌ Erreur ${tableName}:`, error.message);
    throw error;
  }

  console.log(`✅ ${result?.length || 0} ${description} insérés`);
}

async function clearTable(tableName: string): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error(`⚠️  Erreur nettoyage ${tableName}:`, error.message);
  } else {
    console.log(`🧹 Table ${tableName} nettoyée`);
  }
}

// ============================================
// SCRIPT PRINCIPAL
// ============================================

async function main() {
  console.log('🚀 Démarrage seed Tunisia Impact Spark\n');
  console.log('⚠️  Ce script va insérer des données de test dans Supabase');
  console.log('URL:', SUPABASE_URL);
  
  try {
    // Option: nettoyer les tables (décommenter si besoin)
    console.log('\n🧹 Nettoyage des tables (optionnel)...');
    // await clearTable('token_transactions');
    // await clearTable('evaluations');
    // await clearTable('marketplace_products');
    // await clearTable('projects');
    // await clearTable('challenges');
    // await clearTable('user_roles');
    // await clearTable('profiles');

    // Insertion dans l'ordre des dépendances
    await seedTable('profiles', profiles, 'profils utilisateurs');
    await seedTable('user_roles', userRoles, 'rôles utilisateurs');
    await seedTable('challenges', challenges, 'challenges');
    await seedTable('projects', projects, 'projets');
    await seedTable('evaluations', evaluations, 'évaluations');
    await seedTable('marketplace_products', marketplaceProducts, 'produits marketplace');
    await seedTable('token_transactions', tokenTransactions, 'transactions tokens');

    console.log('\n✨ Seed complété avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`   - ${profiles.length} profils`);
    console.log(`   - ${challenges.length} challenges`);
    console.log(`   - ${projects.length} projets`);
    console.log(`   - ${evaluations.length} évaluations`);
    console.log(`   - ${marketplaceProducts.length} produits marketplace`);
    console.log(`   - ${tokenTransactions.length} transactions`);
    
  } catch (error) {
    console.error('\n💥 Erreur lors du seed:', error);
    Deno.exit(1);
  }
}

// Exécution
if (import.meta.main) {
  main();
}
