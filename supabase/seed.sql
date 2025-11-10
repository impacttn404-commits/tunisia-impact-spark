-- ============================================
-- Tunisia Impact Spark - Dataset de test
-- ============================================
-- Ce script génère un jeu de données cohérent pour tester l'application
-- Exécuter via : Supabase Dashboard > SQL Editor

-- Nettoyage préalable (optionnel, décommenter si besoin)
-- TRUNCATE TABLE token_transactions CASCADE;
-- TRUNCATE TABLE evaluations CASCADE;
-- TRUNCATE TABLE projects CASCADE;
-- TRUNCATE TABLE marketplace_products CASCADE;
-- TRUNCATE TABLE challenges CASCADE;
-- TRUNCATE TABLE user_roles CASCADE;
-- TRUNCATE TABLE profiles CASCADE;

-- ============================================
-- 1. PROFILES (Utilisateurs)
-- ============================================
-- Note: Les IDs doivent correspondre à des users auth.users existants
-- Pour ce seed, on utilise des UUIDs fictifs qu'il faudra créer via l'interface auth

-- 3 Investisseurs
INSERT INTO profiles (user_id, email, first_name, last_name, role, tokens_balance, badge_level, company_name, phone, total_evaluations) VALUES
('11111111-1111-1111-1111-111111111111', 'investor1@tunisietelecom.tn', 'Mehdi', 'Ben Salah', 'investor', 500, 'gold', 'Tunisie Telecom Foundation', '+216 70 123 456', 0),
('22222222-2222-2222-2222-222222222222', 'impact@amen.bank', 'Salma', 'Trabelsi', 'investor', 800, 'platinum', 'AMEN Bank RSE', '+216 71 234 567', 0),
('33333333-3333-3333-3333-333333333333', 'rse@orangetn.com', 'Karim', 'Laabidi', 'investor', 300, 'silver', 'Orange Tunisia Impact', '+216 98 345 678', 0);

-- 5 Porteurs de projet
INSERT INTO profiles (user_id, email, first_name, last_name, role, tokens_balance, badge_level, phone, total_evaluations) VALUES
('44444444-4444-4444-4444-444444444444', 'youssef.ecobrick@gmail.com', 'Youssef', 'Khemiri', 'projectHolder', 150, 'bronze', '+216 50 111 222', 0),
('55555555-5555-5555-5555-555555555555', 'amira.agrismart@gmail.com', 'Amira', 'Jlassi', 'projectHolder', 200, 'silver', '+216 54 222 333', 0),
('66666666-6666-6666-6666-666666666666', 'riadh.ecoleverte@gmail.com', 'Riadh', 'Mansouri', 'projectHolder', 100, 'bronze', '+216 52 333 444', 0),
('77777777-7777-7777-7777-777777777777', 'nadia.cleanenergy@gmail.com', 'Nadia', 'Hamdi', 'projectHolder', 250, 'silver', '+216 55 444 555', 0),
('88888888-8888-8888-8888-888888888888', 'farah.waterpure@gmail.com', 'Farah', 'Bouazizi', 'projectHolder', 80, 'bronze', '+216 51 555 666', 0);

-- 4 Évaluateurs
INSERT INTO profiles (user_id, email, first_name, last_name, role, tokens_balance, badge_level, company_name, phone, total_evaluations) VALUES
('99999999-9999-9999-9999-999999999999', 'dr.sfaxi@enit.utm.tn', 'Lassaad', 'Sfaxi', 'evaluator', 320, 'gold', 'ENIT - École Nationale d''Ingénieurs', '+216 71 111 111', 12),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'rim.bouzid@fst.utm.tn', 'Rim', 'Bouzid', 'evaluator', 280, 'silver', 'FST - Faculté des Sciences', '+216 71 222 222', 10),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'hichem.impact@gmail.com', 'Hichem', 'Agrebi', 'evaluator', 450, 'platinum', 'Consultant Impact Social', '+216 98 333 333', 18),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'sarra.env@gmail.com', 'Sarra', 'Cherif', 'evaluator', 190, 'bronze', 'Experte Environnement', '+216 22 444 444', 7);

-- ============================================
-- 2. USER_ROLES (Rôles utilisateurs)
-- ============================================
INSERT INTO user_roles (user_id, role) VALUES
-- Investisseurs
('11111111-1111-1111-1111-111111111111', 'investor'),
('22222222-2222-2222-2222-222222222222', 'investor'),
('33333333-3333-3333-3333-333333333333', 'investor'),
-- Porteurs de projet
('44444444-4444-4444-4444-444444444444', 'projectHolder'),
('55555555-5555-5555-5555-555555555555', 'projectHolder'),
('66666666-6666-6666-6666-666666666666', 'projectHolder'),
('77777777-7777-7777-7777-777777777777', 'projectHolder'),
('88888888-8888-8888-8888-888888888888', 'projectHolder'),
-- Évaluateurs
('99999999-9999-9999-9999-999999999999', 'evaluator'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'evaluator'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'evaluator'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'evaluator');

-- ============================================
-- 3. CHALLENGES
-- ============================================
INSERT INTO challenges (
  id, title, description, created_by, prize_amount, participation_fee, 
  criteria_impact, criteria_innovation, criteria_viability, criteria_sustainability,
  status, start_date, end_date, max_participants, current_participants, currency
) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Green Tunisia 2025 🌱',
  'Challenge pour promouvoir l''innovation écologique urbaine en Tunisie. Nous recherchons des projets qui proposent des solutions concrètes pour réduire l''empreinte carbone des villes tunisiennes, améliorer la gestion des déchets, et favoriser l''économie circulaire. Les lauréats bénéficieront d''un accompagnement technique et financier.',
  '11111111-1111-1111-1111-111111111111',
  50000,
  50,
  10, 8, 7, 10,
  'active',
  '2025-01-15 09:00:00+01',
  '2025-06-30 23:59:59+01',
  20,
  5,
  'TND'
),
(
  'c2222222-2222-2222-2222-222222222222',
  'Tech for Inclusion 💻',
  'Initiative pour soutenir les startups numériques inclusives qui utilisent la technologie pour réduire les inégalités sociales et favoriser l''accès aux services essentiels (santé, éducation, emploi). Focus sur les solutions adaptées au contexte tunisien et aux besoins des populations vulnérables.',
  '22222222-2222-2222-2222-222222222222',
  75000,
  50,
  9, 10, 8, 7,
  'active',
  '2025-02-01 09:00:00+01',
  '2025-07-31 23:59:59+01',
  15,
  3,
  'TND'
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Youth Impact Lab 🎓',
  'Programme dédié aux jeunes entrepreneurs tunisiens portant des projets éducatifs durables. Objectif : favoriser l''innovation pédagogique, l''accès à l''éducation de qualité dans les zones rurales, et développer les compétences du 21ème siècle chez les jeunes. Formation et mentorat inclus.',
  '33333333-3333-3333-3333-333333333333',
  40000,
  50,
  8, 7, 9, 8,
  'active',
  '2025-03-01 09:00:00+01',
  '2025-08-31 23:59:59+01',
  25,
  4,
  'TND'
);

-- ============================================
-- 4. PROJECTS
-- ============================================
INSERT INTO projects (
  id, title, description, sector, objectives, budget, status, 
  created_by, challenge_id, average_rating, total_evaluations, is_winner
) VALUES
-- Projets pour Green Tunisia 2025
(
  'p1111111-1111-1111-1111-111111111111',
  'EcoBrick Tunisia 🧱',
  'Projet de recyclage innovant transformant les déchets plastiques en briques de construction écologiques. Nous collectons les plastiques non recyclables auprès des ménages et écoles, les compactons dans des bouteilles PET pour créer des briques modulaires utilisées dans la construction de structures communautaires (bancs publics, jardins urbains, salles de classe). Impact : réduction des déchets, création d''emplois verts, sensibilisation environnementale.',
  'Environnement - Économie Circulaire',
  'Réduire 50 tonnes de plastique en 2 ans, créer 15 emplois verts, construire 10 structures communautaires, former 500 citoyens au recyclage créatif',
  45000,
  'in_review',
  '44444444-4444-4444-4444-444444444444',
  'c1111111-1111-1111-1111-111111111111',
  8.5,
  3,
  false
),
(
  'p2222222-2222-2222-2222-222222222222',
  'CompostCity Tunis 🌿',
  'Réseau de compostage urbain collectif dans les quartiers de Tunis. Installation de bacs de compostage partagés, collecte des biodéchets ménagers, production de compost de qualité redistribué aux jardins urbains et agriculteurs locaux. Application mobile pour suivre sa contribution environnementale et gagner des récompenses.',
  'Environnement - Gestion des Déchets',
  'Composter 30 tonnes de biodéchets/an, équiper 20 quartiers, sensibiliser 2000 familles, créer une filière locale de compost',
  32000,
  'in_review',
  '44444444-4444-4444-4444-444444444444',
  'c1111111-1111-1111-1111-111111111111',
  7.8,
  2,
  false
),
-- Projets pour Tech for Inclusion
(
  'p3333333-3333-3333-3333-333333333333',
  'AgriSmart TN 🚜',
  'Plateforme digitale connectant petits agriculteurs tunisiens aux marchés locaux, avec système de conseil agronomique par SMS et application mobile. Inclut : prévisions météo localisées, alertes phytosanitaires, prix de marché en temps réel, mise en relation directe producteurs-acheteurs. Objectif : augmenter revenus agricoles de 30% et réduire gaspillage.',
  'Agriculture - Technologie',
  'Connecter 500 agriculteurs, augmenter revenus de 30%, réduire intermédiaires, digitaliser la chaîne de valeur agricole',
  65000,
  'in_review',
  '55555555-5555-5555-5555-555555555555',
  'c2222222-2222-2222-2222-222222222222',
  9.2,
  4,
  false
),
(
  'p4444444-4444-4444-4444-444444444444',
  'E-Saha Platform 🏥',
  'Application de télémédecine connectant populations rurales aux médecins spécialistes. Consultations vidéo, dossier médical numérique, rappels médicaments, géolocalisation pharmacies/cliniques proches. Tarifs sociaux pour populations vulnérables. Partenariat avec CNAM pour remboursement.',
  'Santé - Numérique',
  'Servir 10 000 patients ruraux, réduire déplacements de 60%, améliorer suivi médical, former 50 médecins à la téléconsultation',
  58000,
  'pending',
  '55555555-5555-5555-5555-555555555555',
  'c2222222-2222-2222-2222-222222222222',
  0,
  0,
  false
),
-- Projets pour Youth Impact Lab
(
  'p5555555-5555-5555-5555-555555555555',
  'École Verte 🌳',
  'Programme transformant écoles publiques en modèles de durabilité : jardins pédagogiques, panneaux solaires, récupération eau de pluie, compostage, ateliers éco-citoyenneté. Curriculum intégré développant conscience environnementale dès le primaire. Kits pédagogiques pour enseignants, implication parents et communauté locale.',
  'Éducation - Environnement',
  'Transformer 15 écoles en écoles vertes, former 200 enseignants, sensibiliser 5000 élèves, créer curriculum éco-citoyen',
  38000,
  'in_review',
  '66666666-6666-6666-6666-666666666666',
  'c3333333-3333-3333-3333-333333333333',
  8.1,
  3,
  false
),
(
  'p6666666-6666-6666-6666-666666666666',
  'CodeCamp Bled 💻',
  'Bootcamps gratuits de codage dans zones rurales pour jeunes 15-25 ans. Formation intensive développement web/mobile, soft skills, mentorat entrepreneurs tech. Équipement informatique fourni, partenariats entreprises pour stages et recrutement. Objectif : réduire fracture numérique et créer opportunités locales.',
  'Éducation - Numérique',
  'Former 300 jeunes ruraux au code, taux emploi 70%, créer 5 antennes régionales, partenariat avec 20 entreprises tech',
  42000,
  'in_review',
  '66666666-6666-6666-6666-666666666666',
  'c3333333-3333-3333-3333-333333333333',
  7.5,
  2,
  false
),
-- Projets hors challenge
(
  'p7777777-7777-7777-7777-777777777777',
  'CleanEnergy Now ⚡',
  'Installation micro-grids solaires dans villages isolés non connectés au réseau électrique. Système communautaire avec batteries de stockage, gestion intelligente, maintenance locale. Formation électriciens locaux, modèle économique coopératif avec paiement progressif par mobile money. Autonomie énergétique villages.',
  'Énergie Renouvelable',
  'Électrifier 8 villages (2000 habitants), installer 150 kW solaire, créer 12 emplois maintenance, autonomie énergétique 90%',
  95000,
  'draft',
  '77777777-7777-7777-7777-777777777777',
  NULL,
  0,
  0,
  false
),
(
  'p8888888-8888-8888-8888-888888888888',
  'WaterPure Tunisia 💧',
  'Solutions low-cost de purification d''eau potable pour zones rurales avec eau contaminée. Filtres céramiques produits localement, formation hygiène, suivi qualité eau. Installation points d''eau communautaires avec système abonnement solidaire. Impact direct santé publique, réduction maladies hydriques.',
  'Eau - Santé Publique',
  'Fournir eau potable à 15 villages (5000 personnes), réduire maladies hydriques de 80%, créer 10 emplois, autonomie locale',
  52000,
  'draft',
  '88888888-8888-8888-8888-888888888888',
  NULL,
  0,
  0,
  false
);

-- ============================================
-- 5. EVALUATIONS
-- ============================================
INSERT INTO evaluations (
  id, project_id, evaluator_id, 
  impact_score, innovation_score, viability_score, sustainability_score, 
  overall_score, tokens_earned, feedback
) VALUES
-- Évaluations EcoBrick Tunisia
(
  'e1111111-1111-1111-1111-111111111111',
  'p1111111-1111-1111-1111-111111111111',
  '99999999-9999-9999-9999-999999999999',
  9, 8, 8, 9,
  8.5,
  50,
  'Excellent projet d''économie circulaire avec impact environnemental mesurable. La technologie EcoBrick est éprouvée. Point d''attention : sécuriser approvisionnement plastique et certification qualité construction. Budget réaliste, équipe motivée.'
),
(
  'e2222222-2222-2222-2222-222222222222',
  'p1111111-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  9, 7, 8, 9,
  8.3,
  50,
  'Fort potentiel d''impact social (emplois verts) et environnemental. Modèle réplicable. Recommandations : développer partenariats municipalités pour collecte déchets, prévoir certifications matériaux construction. Volet sensibilisation très pertinent.'
),
(
  'e3333333-3333-3333-3333-333333333333',
  'p1111111-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  10, 8, 8, 9,
  8.8,
  50,
  'Projet exemplaire d''upcycling avec bénéfices environnementaux clairs : réduction déchets plastique + alternative matériaux construction. Innovation sociale via implication communautaire. Excellente initiative, très alignée priorités durabilité.'
),
-- Évaluations CompostCity
(
  'e4444444-4444-4444-4444-444444444444',
  'p2222222-2222-2222-2222-222222222222',
  '99999999-9999-9999-9999-999999999999',
  8, 7, 7, 9,
  7.8,
  45,
  'Projet de compostage urbain bien conçu, répond à besoin réel gestion déchets organiques. App mobile = bon levier engagement citoyen. Défis : logistique collecte, gestion nuisances (odeurs), pérennité modèle économique. Prévoir partenariat collectivités locales.'
),
(
  'e5555555-5555-5555-5555-555555555555',
  'p2222222-2222-2222-2222-222222222222',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  8, 7, 8, 8,
  7.8,
  45,
  'Initiative pertinente valorisation biodéchets en milieu urbain. Points forts : sensibilisation résidents, production compost local. À renforcer : plan formation ambassadeurs quartiers, certification qualité compost, étude marché débouchés agriculteurs.'
),
-- Évaluations AgriSmart
(
  'e6666666-6666-6666-6666-666666666666',
  'p3333333-3333-3333-3333-333333333333',
  '99999999-9999-9999-9999-999999999999',
  10, 9, 9, 8,
  9.0,
  60,
  'Solution digitale très pertinente pour agriculture tunisienne. Triple impact : augmentation revenus agriculteurs, réduction gaspillage, traçabilité. Architecture technique solide (SMS + app mobile = accessibilité maximale). Excellent potentiel scaling national.'
),
(
  'e7777777-7777-7777-7777-777777777777',
  'p3333333-3333-3333-3333-333333333333',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  9, 9, 9, 8,
  8.8,
  60,
  'Projet AgriTech d''excellence répondant à enjeux structurels agriculture. Approche inclusive (SMS pour zones faible connectivité). Modèle économique viable (commissions transactions). Recommandation : partenariats CRDA et UTAP pour déploiement.'
),
(
  'eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'p3333333-3333-3333-3333-333333333333',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  9, 10, 9, 8,
  9.0,
  60,
  'Innovation remarquable combinant tech et connaissance agricole locale. Interface simple, fonctionnalités clés bien identifiées. Impact potentiel très élevé. Points d''attention : formation utilisateurs, infrastructure mobile zones reculées. Scaling vers autres pays Maghreb envisageable.'
),
(
  'ebbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'p3333333-3333-3333-3333-333333333333',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  10, 9, 9, 9,
  9.3,
  60,
  'AgriSmart est exactement le type de solution dont agriculture tunisienne a besoin. Digitalisation intelligente respectant réalités terrain. Fort potentiel réduction empreinte carbone via optimisation logistique. Modèle réplicable. Projet coup de cœur !'
),
-- Évaluations École Verte
(
  'e8888888-8888-8888-8888-888888888888',
  'p5555555-5555-5555-5555-555555555555',
  '99999999-9999-9999-9999-999999999999',
  8, 7, 8, 9,
  8.0,
  50,
  'Programme éducatif complet intégrant durabilité dans ADN scolaire. Approche holistique (infrastructure + pédagogie). Impact long terme via changement comportements jeune génération. Budget réaliste, méthodologie claire. Prévoir indicateurs mesure impact.'
),
(
  'e9999999-9999-9999-9999-999999999999',
  'p5555555-5555-5555-5555-555555555555',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  8, 7, 9, 9,
  8.3,
  50,
  'Excellente initiative transformation écoles en espaces durables et éducatifs. Jardins pédagogiques = apprentissage concret. Implication communauté = pérennité. Recommandation : partenariat Ministère Éducation pour scaling, kit pédagogique open source.'
),
(
  'ecccccccc-cccc-cccc-cccc-cccccccccccc',
  'p5555555-5555-5555-5555-555555555555',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  9, 7, 8, 9,
  8.3,
  50,
  'Projet éducation environnementale d''impact majeur. Former jeunes = investissement futur durable. Approche systémique (bâtiments + curriculum) pertinente. Points forts : réplicabilité, mesurabilité, ancrage local. Très aligné ODD Education et Climat.'
),
-- Évaluations CodeCamp Bled
(
  'edddddddd-dddd-dddd-dddd-dddddddddddd',
  'p6666666-6666-6666-6666-666666666666',
  '99999999-9999-9999-9999-999999999999',
  7, 8, 7, 7,
  7.3,
  40,
  'Initiative louable réduction fracture numérique rurale. Bootcamp intensif = méthodologie efficace. Défi majeur : garantir taux employabilité 70% annoncé, surtout zones rurales. Prévoir accompagnement post-formation, incubation projets entrepreneuriaux locaux.'
),
(
  'eeeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'p6666666-6666-6666-6666-666666666666',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  8, 7, 7, 7,
  7.3,
  40,
  'CodeCamp répond à besoin réel compétences numériques zones rurales. Modèle bootcamp adapté, partenariats entreprises = clé succès employabilité. Points d''attention : infrastructure internet zones reculées, suivi alumni, durabilité financement. Potentiel fort si bien exécuté.'
),
-- Évaluations E-Saha (projet sans évaluation dans données initiales, ajoutons-en)
(
  'effffffff-ffff-ffff-ffff-ffffffffffff',
  'p4444444-4444-4444-4444-444444444444',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  9, 8, 7, 7,
  7.8,
  45,
  'Télémédecine = solution prometteuse accès santé zones rurales. Partenariat CNAM renforce viabilité. Défis : connexion internet stable, adoption médecins et patients, aspects réglementaires téléconsultation. Pilote recommandé avant scaling.'
);

-- ============================================
-- 6. MARKETPLACE_PRODUCTS
-- ============================================
INSERT INTO marketplace_products (
  id, title, description, category, price_tnd, price_tokens, 
  stock_quantity, seller_id, is_active, image_url
) VALUES
(
  'm1111111-1111-1111-1111-111111111111',
  'Pack Visibilité Projet 📢',
  'Boostez la visibilité de votre projet pendant 30 jours : mise en avant page d''accueil, post réseaux sociaux Tunisia Impact Spark, inclusion newsletter mensuelle (5000 abonnés), badge "Projet du Mois". Idéal pour attirer investisseurs et partenaires.',
  'Marketing & Communication',
  150,
  300,
  10,
  '11111111-1111-1111-1111-111111111111',
  true,
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'
),
(
  'm2222222-2222-2222-2222-222222222222',
  'Coaching Startup 1:1 (3 sessions) 💼',
  'Accompagnement personnalisé par mentor expert impact social : 3 sessions 1h30 (stratégie, business model, pitch, levée fonds). Profils mentors : entrepreneurs sociaux expérimentés, investisseurs impact, experts RSE. Suivi WhatsApp entre sessions.',
  'Formation & Mentorat',
  NULL,
  500,
  5,
  '22222222-2222-2222-2222-222222222222',
  true,
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400'
),
(
  'm3333333-3333-3333-3333-333333333333',
  'Certification Impact B-Corp (audit préliminaire) ✅',
  'Audit préliminaire éligibilité certification B-Corp réalisé par consultant certifié : évaluation 5 domaines (gouvernance, collaborateurs, communauté, environnement, clients), rapport détaillé recommandations, roadmap certification. Reconnaissance internationale impact.',
  'Certification & Audit',
  800,
  1500,
  3,
  '22222222-2222-2222-2222-222222222222',
  true,
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'
),
(
  'm4444444-4444-4444-4444-444444444444',
  'Formation "Mesurer son Impact Social" 📊',
  'Workshop 1 journée : méthodologies mesure impact (théorie changement, KPIs impact, SROI), outils collecte données, reporting ESG, exemples cas pratiques Tunisia. Certificat de participation. Présentiel Tunis ou format virtuel. Max 15 participants.',
  'Formation & Mentorat',
  200,
  400,
  20,
  '33333333-3333-3333-3333-333333333333',
  true,
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400'
),
(
  'm5555555-5555-5555-5555-555555555555',
  'Accès Espace Coworking Impact Hub (1 mois) 🏢',
  'Accès illimité pendant 1 mois à Impact Hub Tunis : bureau flexible, salles réunion, wifi haut débit, café/thé, événements networking, communauté entrepreneurs impact. Idéal phase développement projet. Accès 24/7.',
  'Services & Infrastructures',
  300,
  600,
  8,
  '11111111-1111-1111-1111-111111111111',
  true,
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
),
(
  'm6666666-6666-6666-6666-666666666666',
  'Kit Communication Impact (templates) 🎨',
  'Kit complet templates professionnels : pitch deck (PPT), dossier projet (PDF), visuels réseaux sociaux (Canva), communiqué presse, email investisseurs. Personnalisables charte graphique. Format digital, livraison immédiate.',
  'Marketing & Communication',
  NULL,
  200,
  50,
  '33333333-3333-3333-3333-333333333333',
  true,
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400'
);

-- ============================================
-- 7. TOKEN_TRANSACTIONS
-- ============================================
-- Note: Les transactions sont générées automatiquement par triggers
-- Ajoutons manuellement quelques transactions historiques pour enrichir

INSERT INTO token_transactions (id, user_id, amount, type, description, reference_id) VALUES
-- Récompenses évaluations (normalement auto via trigger)
('t1111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999', 50, 'evaluation_reward', 'Évaluation projet EcoBrick Tunisia', 'e1111111-1111-1111-1111-111111111111'),
('t2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 50, 'evaluation_reward', 'Évaluation projet EcoBrick Tunisia', 'e2222222-2222-2222-2222-222222222222'),
('t3333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 50, 'evaluation_reward', 'Évaluation projet EcoBrick Tunisia', 'e3333333-3333-3333-3333-333333333333'),
('t4444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 45, 'evaluation_reward', 'Évaluation projet CompostCity', 'e4444444-4444-4444-4444-444444444444'),
('t5555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 45, 'evaluation_reward', 'Évaluation projet CompostCity', 'e5555555-5555-5555-5555-555555555555'),

-- Achats marketplace
('t6666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', -300, 'marketplace_purchase', 'Achat: Pack Visibilité Projet', 'm1111111-1111-1111-1111-111111111111'),
('t7777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', -400, 'marketplace_purchase', 'Achat: Formation Mesurer Impact', 'm4444444-4444-4444-4444-444444444444'),
('t8888888-8888-8888-8888-888888888888', '66666666-6666-6666-6666-666666666666', -200, 'marketplace_purchase', 'Achat: Kit Communication Impact', 'm6666666-6666-6666-6666-666666666666'),

-- Bonus promotionnels
('t9999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 100, 'bonus', 'Bonus bienvenue nouveau porteur projet', NULL),
('taaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 100, 'bonus', 'Bonus bienvenue nouveau porteur projet', NULL),
('tbbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666', 100, 'bonus', 'Bonus bienvenue nouveau porteur projet', NULL),
('tcccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 150, 'bonus', 'Bonus évaluateur top contributeur mois', NULL),
('tdddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 150, 'bonus', 'Bonus évaluateur expert', NULL),

-- Frais participation challenges (simulés)
('teeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', -50, 'challenge_participation', 'Frais participation Green Tunisia 2025', 'c1111111-1111-1111-1111-111111111111'),
('tffffffff-ffff-ffff-ffff-ffffffffffff', '55555555-5555-5555-5555-555555555555', -50, 'challenge_participation', 'Frais participation Tech for Inclusion', 'c2222222-2222-2222-2222-222222222222'),
('t10101010-1010-1010-1010-101010101010', '66666666-6666-6666-6666-666666666666', -50, 'challenge_participation', 'Frais participation Youth Impact Lab', 'c3333333-3333-3333-3333-333333333333');

-- ============================================
-- FIN DU SEED
-- ============================================

-- Vérifications rapides
SELECT 'Profiles créés:' as info, COUNT(*) as total FROM profiles;
SELECT 'Challenges actifs:' as info, COUNT(*) as total FROM challenges WHERE status = 'active';
SELECT 'Projets total:' as info, COUNT(*) as total FROM projects;
SELECT 'Évaluations:' as info, COUNT(*) as total FROM evaluations;
SELECT 'Produits marketplace:' as info, COUNT(*) as total FROM marketplace_products;
SELECT 'Transactions:' as info, COUNT(*) as total FROM token_transactions;

-- Note importante pour utilisation :
-- ======================================
-- Ces UUIDs sont fictifs et doivent correspondre à de vrais users dans auth.users
-- Pour utiliser ce seed en production :
-- 1. Créer d'abord les utilisateurs via l'interface auth Supabase
-- 2. Récupérer leurs vrais UUIDs
-- 3. Remplacer les UUIDs dans ce script
-- OU
-- Utiliser ce script en dev/test avec auth désactivée temporairement
