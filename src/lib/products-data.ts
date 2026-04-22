export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "tricycle" | "moto" | "piece";
  subcategory?: string;
  price: number;
  oldPrice?: number;
  description: string;
  shortDescription: string;
  specifications: { label: string; value: string }[];
  features: string[];
  images: string[];
  inStock: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  // TRICYCLES
  {
    id: "tric-001",
    slug: "tricycle-cargo-200cc",
    name: "Tricycle Cargo 200cc",
    category: "tricycle",
    subcategory: "Cargo",
    price: 1850000,
    oldPrice: 2100000,
    description:
      "Le Tricycle Cargo 200cc est notre modèle phare pour le transport de marchandises. Conçu pour les professionnels du commerce et de la livraison au Sénégal, ce tricycle robuste peut transporter jusqu'à 800kg de charge utile. Son moteur 200cc offre un excellent équilibre entre puissance et économie de carburant. La benne arrière galvanisée résiste à la corrosion et aux chocs, idéale pour un usage intensif quotidien.",
    shortDescription: "Tricycle cargo robuste avec moteur 200cc et capacité de charge 800kg",
    specifications: [
      { label: "Moteur", value: "200cc, 4 temps, refroidi par air" },
      { label: "Puissance", value: "12 CV / 7500 tr/min" },
      { label: "Capacité réservoir", value: "15 litres" },
      { label: "Charge utile", value: "800 kg" },
      { label: "Dimensions benne", value: "150 x 100 x 40 cm" },
      { label: "Transmission", value: "5 vitesses + marche arrière" },
      { label: "Freins", value: "Tambour avant et arrière" },
      { label: "Poids à vide", value: "320 kg" },
      { label: "Vitesse max", value: "55 km/h" },
      { label: "Consommation", value: "4L/100km" },
    ],
    features: [
      "Moteur japonais haute performance",
      "Benne galvanisée anti-corrosion",
      "Suspension renforcée pour charges lourdes",
      "Démarrage électrique + kick",
      "Phares LED longue durée",
      "Garantie 2 ans / 20 000 km",
      "Service après-vente inclus",
    ],
    images: ["/images/tricycle-200cc.jpg"],
    inStock: true,
    isBestSeller: true,
    rating: 4.8,
    reviews: 127,
  },
  {
    id: "tric-002",
    slug: "tricycle-cargo-250cc-xl",
    name: "Tricycle Cargo 250cc XL",
    category: "tricycle",
    subcategory: "Cargo XL",
    price: 2350000,
    oldPrice: 2600000,
    description:
      "Le Tricycle Cargo 250cc XL est notre modèle le plus puissant pour les charges lourdes et les longues distances. Équipé d'un moteur 250cc performant, il peut transporter jusqu'à 1200kg de marchandises. Idéal pour les entreprises de BTP, les grossistes et les transporteurs professionnels qui ont besoin d'une capacité de charge maximale.",
    shortDescription: "Tricycle cargo haute capacité 250cc pour charges jusqu'à 1200kg",
    specifications: [
      { label: "Moteur", value: "250cc, 4 temps, refroidi par eau" },
      { label: "Puissance", value: "16 CV / 7000 tr/min" },
      { label: "Capacité réservoir", value: "20 litres" },
      { label: "Charge utile", value: "1200 kg" },
      { label: "Dimensions benne", value: "180 x 120 x 50 cm" },
      { label: "Transmission", value: "5 vitesses + marche arrière" },
      { label: "Freins", value: "Disque avant, tambour arrière" },
      { label: "Poids à vide", value: "380 kg" },
      { label: "Vitesse max", value: "60 km/h" },
      { label: "Consommation", value: "5L/100km" },
    ],
    features: [
      "Moteur refroidi par eau pour usage intensif",
      "Benne XL renforcée double paroi",
      "Suspension pneumatique arrière",
      "Cabine semi-fermée optionnelle",
      "Système de freinage ABS",
      "Garantie 3 ans / 30 000 km",
      "Assistance dépannage 24h/24",
    ],
    images: ["/images/tricycle-250cc.jpg"],
    inStock: true,
    isNew: true,
    rating: 4.9,
    reviews: 84,
  },
  {
    id: "tric-003",
    slug: "tricycle-passager-150cc",
    name: "Tricycle Passager 150cc",
    category: "tricycle",
    subcategory: "Passager",
    price: 1650000,
    description:
      "Le Tricycle Passager 150cc est conçu pour le transport de personnes en toute sécurité et confort. Pouvant accueillir jusqu'à 4 passagers, il est idéal pour les taxis urbains, les navettes et le transport familial. Sa cabine fermée protège les passagers des intempéries et de la poussière.",
    shortDescription: "Tricycle passager 4 places avec cabine fermée et confort optimal",
    specifications: [
      { label: "Moteur", value: "150cc, 4 temps, refroidi par air" },
      { label: "Puissance", value: "10 CV / 7500 tr/min" },
      { label: "Capacité réservoir", value: "12 litres" },
      { label: "Passagers", value: "4 personnes + conducteur" },
      { label: "Type cabine", value: "Fermée avec portes" },
      { label: "Transmission", value: "4 vitesses + marche arrière" },
      { label: "Freins", value: "Tambour avant et arrière" },
      { label: "Poids à vide", value: "290 kg" },
      { label: "Vitesse max", value: "50 km/h" },
      { label: "Consommation", value: "3.5L/100km" },
    ],
    features: [
      "Cabine fermée climatisable",
      "Sièges rembourrés confortables",
      "Vitres teintées anti-UV",
      "Système audio intégré",
      "Éclairage intérieur LED",
      "Garantie 2 ans / 20 000 km",
    ],
    images: ["/images/tricycle-200cc.jpg"],
    inStock: true,
    rating: 4.6,
    reviews: 63,
  },
  // MOTOS
  {
    id: "moto-001",
    slug: "moto-sport-150cc",
    name: "Moto Sport 150cc",
    category: "moto",
    subcategory: "Sport",
    price: 750000,
    oldPrice: 850000,
    description:
      "La Moto Sport 150cc allie style et performance pour les amateurs de sensations. Son design agressif et aérodynamique cache un moteur nerveux de 150cc capable de vous emmener partout. Idéale pour la ville comme pour les escapades du week-end.",
    shortDescription: "Moto sportive 150cc au design agressif et performant",
    specifications: [
      { label: "Moteur", value: "150cc, 4 temps, SOHC" },
      { label: "Puissance", value: "14 CV / 8500 tr/min" },
      { label: "Capacité réservoir", value: "12 litres" },
      { label: "Transmission", value: "5 vitesses" },
      { label: "Freins", value: "Disque avant, tambour arrière" },
      { label: "Poids à vide", value: "125 kg" },
      { label: "Hauteur selle", value: "780 mm" },
      { label: "Vitesse max", value: "110 km/h" },
      { label: "Consommation", value: "2.5L/100km" },
    ],
    features: [
      "Carénage sport intégral",
      "Compteur digital multifonction",
      "Phares LED avec feux de jour",
      "Pneus tubeless haute adhérence",
      "Repose-pieds passager",
      "Garantie 1 an / 12 000 km",
    ],
    images: ["/images/motorcycle-product.jpg"],
    inStock: true,
    isBestSeller: true,
    rating: 4.7,
    reviews: 215,
  },
  {
    id: "moto-002",
    slug: "moto-city-125cc",
    name: "Moto City 125cc",
    category: "moto",
    subcategory: "Urbaine",
    price: 550000,
    description:
      "La Moto City 125cc est votre compagne idéale pour naviguer dans le trafic urbain. Légère, maniable et économique, elle se faufile partout et consomme très peu. Son entretien simple et ses pièces disponibles en font un choix pratique et durable.",
    shortDescription: "Moto urbaine 125cc économique et maniable pour la ville",
    specifications: [
      { label: "Moteur", value: "125cc, 4 temps" },
      { label: "Puissance", value: "10 CV / 8000 tr/min" },
      { label: "Capacité réservoir", value: "10 litres" },
      { label: "Transmission", value: "4 vitesses" },
      { label: "Freins", value: "Tambour avant et arrière" },
      { label: "Poids à vide", value: "105 kg" },
      { label: "Hauteur selle", value: "760 mm" },
      { label: "Vitesse max", value: "95 km/h" },
      { label: "Consommation", value: "2L/100km" },
    ],
    features: [
      "Design classique intemporel",
      "Consommation ultra basse",
      "Démarrage électrique + kick",
      "Porte-bagages arrière",
      "Pièces détachées disponibles",
      "Garantie 1 an / 10 000 km",
    ],
    images: ["/images/motorcycle-product.jpg"],
    inStock: true,
    rating: 4.5,
    reviews: 342,
  },
  {
    id: "moto-003",
    slug: "moto-trail-200cc",
    name: "Moto Trail 200cc",
    category: "moto",
    subcategory: "Trail",
    price: 950000,
    description:
      "La Moto Trail 200cc est conçue pour ceux qui aiment sortir des sentiers battus. Avec sa suspension longue débattement, ses pneus crampons et sa garde au sol élevée, elle affronte tous les terrains. Parfaite pour l'aventure et les zones rurales.",
    shortDescription: "Moto trail 200cc tout-terrain pour l'aventure",
    specifications: [
      { label: "Moteur", value: "200cc, 4 temps, refroidi par air" },
      { label: "Puissance", value: "16 CV / 7500 tr/min" },
      { label: "Capacité réservoir", value: "14 litres" },
      { label: "Transmission", value: "5 vitesses" },
      { label: "Freins", value: "Disque avant et arrière" },
      { label: "Poids à vide", value: "135 kg" },
      { label: "Hauteur selle", value: "850 mm" },
      { label: "Garde au sol", value: "250 mm" },
      { label: "Vitesse max", value: "120 km/h" },
      { label: "Consommation", value: "3L/100km" },
    ],
    features: [
      "Suspension long débattement",
      "Pneus tout-terrain",
      "Protection moteur incluse",
      "Guidon haut enduro",
      "Phares haute puissance",
      "Garantie 1 an / 12 000 km",
    ],
    images: ["/images/motorcycle-product.jpg"],
    inStock: true,
    isNew: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "moto-004",
    slug: "scooter-125cc",
    name: "Scooter 125cc",
    category: "moto",
    subcategory: "Scooter",
    price: 650000,
    description:
      "Le Scooter 125cc offre le summum du confort urbain. Avec sa transmission automatique, son coffre spacieux et sa protection contre les intempéries, il rend vos trajets quotidiens agréables et sans effort.",
    shortDescription: "Scooter automatique 125cc confortable avec grand coffre",
    specifications: [
      { label: "Moteur", value: "125cc, 4 temps" },
      { label: "Puissance", value: "9 CV / 7500 tr/min" },
      { label: "Capacité réservoir", value: "8 litres" },
      { label: "Transmission", value: "CVT automatique" },
      { label: "Freins", value: "Disque avant, tambour arrière" },
      { label: "Poids à vide", value: "115 kg" },
      { label: "Coffre", value: "35 litres (2 casques)" },
      { label: "Vitesse max", value: "90 km/h" },
      { label: "Consommation", value: "2.2L/100km" },
    ],
    features: [
      "Transmission automatique CVT",
      "Grand coffre sous selle",
      "Tablier de protection",
      "Crochets pour sacs",
      "Prise USB intégrée",
      "Garantie 1 an / 10 000 km",
    ],
    images: ["/images/motorcycle-product.jpg"],
    inStock: true,
    rating: 4.6,
    reviews: 178,
  },
  // PIECES DETACHEES
  {
    id: "piece-001",
    slug: "kit-chaine-renforcee",
    name: "Kit Chaîne Renforcée 428H",
    category: "piece",
    subcategory: "Transmission",
    price: 35000,
    description:
      "Kit chaîne complet renforcé comprenant chaîne 428H de qualité supérieure, pignon et couronne. Conçu pour résister aux conditions difficiles et offrir une durée de vie prolongée. Compatible avec la plupart des motos 125-150cc.",
    shortDescription: "Kit chaîne complet renforcé pour motos 125-150cc",
    specifications: [
      { label: "Type chaîne", value: "428H renforcée" },
      { label: "Nombre maillons", value: "130" },
      { label: "Pignon", value: "14 dents" },
      { label: "Couronne", value: "42 dents" },
      { label: "Matériau", value: "Acier traité" },
      { label: "Compatibilité", value: "125-150cc universelle" },
    ],
    features: [
      "Chaîne renforcée haute résistance",
      "Traitement anti-corrosion",
      "Joints toriques étanches",
      "Installation facile",
      "Durée de vie prolongée",
    ],
    images: ["/images/spare-parts.jpg"],
    inStock: true,
    isBestSeller: true,
    rating: 4.7,
    reviews: 456,
  },
  {
    id: "piece-002",
    slug: "plaquettes-frein-avant",
    name: "Plaquettes de Frein Avant",
    category: "piece",
    subcategory: "Freinage",
    price: 12000,
    description:
      "Plaquettes de frein avant haute performance pour un freinage optimal et sécurisé. Composé de matériaux de friction de qualité pour une durée de vie prolongée et un freinage constant même à haute température.",
    shortDescription: "Plaquettes de frein avant haute performance",
    specifications: [
      { label: "Type", value: "Semi-métallique" },
      { label: "Compatibilité", value: "Universelle moto/tricycle" },
      { label: "Dimensions", value: "Standard" },
      { label: "Durée de vie", value: "15 000 - 20 000 km" },
    ],
    features: [
      "Freinage progressif et puissant",
      "Résistance haute température",
      "Usure uniforme",
      "Faible bruit de freinage",
    ],
    images: ["/images/spare-parts.jpg"],
    inStock: true,
    rating: 4.5,
    reviews: 289,
  },
  {
    id: "piece-003",
    slug: "filtre-huile-moteur",
    name: "Filtre à Huile Moteur",
    category: "piece",
    subcategory: "Moteur",
    price: 5000,
    description:
      "Filtre à huile de qualité OEM pour une filtration optimale des impuretés et une protection maximale du moteur. Changement recommandé tous les 3000 km pour maintenir les performances du moteur.",
    shortDescription: "Filtre à huile qualité OEM",
    specifications: [
      { label: "Type", value: "Cartouche" },
      { label: "Compatibilité", value: "125-250cc" },
      { label: "Intervalle", value: "3000 km" },
      { label: "Filtration", value: "99.9%" },
    ],
    features: [
      "Filtration haute efficacité",
      "Joint d'étanchéité inclus",
      "Qualité équipement d'origine",
      "Installation facile",
    ],
    images: ["/images/spare-parts.jpg"],
    inStock: true,
    rating: 4.8,
    reviews: 567,
  },
  {
    id: "piece-004",
    slug: "bougie-allumage-ngk",
    name: "Bougie d'Allumage NGK",
    category: "piece",
    subcategory: "Allumage",
    price: 3500,
    description:
      "Bougie d'allumage NGK originale pour un démarrage fiable et des performances optimales. L'électrode en nickel assure une étincelle puissante et constante pour une combustion efficace.",
    shortDescription: "Bougie NGK originale pour démarrage fiable",
    specifications: [
      { label: "Marque", value: "NGK" },
      { label: "Type", value: "Standard" },
      { label: "Écartement", value: "0.7-0.8mm" },
      { label: "Culot", value: "10mm" },
    ],
    features: ["Marque de confiance NGK", "Étincelle puissante", "Durée de vie 10 000 km", "Résistance aux dépôts"],
    images: ["/images/spare-parts.jpg"],
    inStock: true,
    rating: 4.9,
    reviews: 892,
  },
  {
    id: "piece-005",
    slug: "pneu-arriere-300-18",
    name: "Pneu Arrière 3.00-18",
    category: "piece",
    subcategory: "Pneumatiques",
    price: 28000,
    description:
      "Pneu arrière haute qualité dimension 3.00-18 pour motos. Composé de gomme durable offrant une excellente adhérence sur route sèche et mouillée. Profil optimisé pour un kilométrage élevé.",
    shortDescription: "Pneu arrière 3.00-18 haute adhérence",
    specifications: [
      { label: "Dimension", value: "3.00-18" },
      { label: "Type", value: "Route/Mixte" },
      { label: "Indice charge", value: "52P" },
      { label: "Chambre", value: "Avec chambre à air" },
    ],
    features: ["Gomme haute durabilité", "Adhérence optimale", "Évacuation d'eau efficace", "Kilométrage élevé"],
    images: ["/images/spare-parts.jpg"],
    inStock: true,
    rating: 4.6,
    reviews: 234,
  },
  {
    id: "piece-006",
    slug: "batterie-12v-7ah",
    name: "Batterie 12V 7Ah",
    category: "piece",
    subcategory: "Électrique",
    price: 25000,
    description:
      "Batterie 12V 7Ah sans entretien pour moto et tricycle. Technologie gel pour une durée de vie prolongée et une résistance aux vibrations. Idéale pour le démarrage électrique.",
    shortDescription: "Batterie 12V 7Ah sans entretien",
    specifications: [
      { label: "Tension", value: "12V" },
      { label: "Capacité", value: "7Ah" },
      { label: "Type", value: "Gel sans entretien" },
      { label: "Dimensions", value: "150x65x95mm" },
    ],
    features: ["Sans entretien", "Technologie gel", "Résistante aux vibrations", "Démarrage puissant"],
    images: ["/images/spare-parts.jpg"],
    inStock: true,
    rating: 4.4,
    reviews: 156,
  },
  {
    id: "piece-007",
    slug: "amortisseur-arriere",
    name: "Amortisseur Arrière Renforcé",
    category: "piece",
    subcategory: "Suspension",
    price: 45000,
    description:
      "Amortisseur arrière renforcé pour moto et tricycle. Réglable en précharge pour s'adapter à votre charge et votre style de conduite. Offre un confort optimal et une tenue de route améliorée.",
    shortDescription: "Amortisseur arrière réglable renforcé",
    specifications: [
      { label: "Type", value: "Hydraulique" },
      { label: "Réglage", value: "Précharge 5 positions" },
      { label: "Longueur", value: "320mm (standard)" },
      { label: "Ressort", value: "Renforcé" },
    ],
    features: ["Réglage précharge", "Huile hydraulique haute qualité", "Ressort renforcé", "Installation directe"],
    images: ["/images/spare-parts.jpg"],
    inStock: true,
    isNew: true,
    rating: 4.7,
    reviews: 78,
  },
  {
    id: "piece-008",
    slug: "kit-carburateur-complet",
    name: "Kit Carburateur Complet",
    category: "piece",
    subcategory: "Alimentation",
    price: 55000,
    description:
      "Kit carburateur complet avec tous les joints et gicleurs. Remplace le carburateur d'origine pour retrouver les performances optimales de votre moteur. Inclut les instructions de montage.",
    shortDescription: "Kit carburateur complet avec joints et gicleurs",
    specifications: [
      { label: "Diamètre", value: "26mm (standard)" },
      { label: "Type", value: "À dépression" },
      { label: "Contenu", value: "Carbu + joints + gicleurs" },
      { label: "Compatibilité", value: "125-150cc" },
    ],
    features: ["Carburateur complet", "Tous joints inclus", "Jeu de gicleurs", "Instructions incluses"],
    images: ["/images/spare-parts.jpg"],
    inStock: true,
    rating: 4.5,
    reviews: 112,
  },
];

export const categories = [
  { id: "all", name: "Tous les produits", count: products.length },
  { id: "tricycle", name: "Tricycles", count: products.filter((p) => p.category === "tricycle").length },
  { id: "moto", name: "Motos", count: products.filter((p) => p.category === "moto").length },
  { id: "piece", name: "Pièces détachées", count: products.filter((p) => p.category === "piece").length },
];

export const subcategoriesMap = {
  tricycle: ["Cargo", "Cargo XL", "Passager"],
  moto: ["Sport", "Urbaine", "Trail", "Scooter"],
  piece: ["Transmission", "Freinage", "Moteur", "Allumage", "Pneumatiques", "Électrique", "Suspension", "Alimentation"],
};

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew);
}

export function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + " FCFA"
  );
}
