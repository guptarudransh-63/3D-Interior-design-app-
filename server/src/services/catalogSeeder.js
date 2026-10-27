import bcrypt from 'bcryptjs';
import { MaterialOption } from '../models/MaterialOption.js';
import { RoomConcept } from '../models/RoomConcept.js';
import { User } from '../models/User.js';
import { SavedDesign } from '../models/SavedDesign.js';
import { Project } from '../models/Project.js';
import { Proposal } from '../models/Proposal.js';
import { ProposalVersion } from '../models/ProposalVersion.js';
import { RevisionRequest } from '../models/RevisionRequest.js';
import { ProjectActivity } from '../models/ProjectActivity.js';

export const SEED_MATERIALS = [
  // Flooring
  {
    name: 'Bleached French White Oak',
    category: 'flooring',
    description: 'Wide-plank European oak with subtle wire-brushed grain and a matte Scandinavian oil finish.',
    hexCode: '#D8C7B0',
    textureType: 'wood',
    roughness: 0.45,
    metalness: 0.05,
    costModifier: 24,
    thumbnail: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Smoked Belgian Walnut',
    category: 'flooring',
    description: 'Deep espresso tones with warm undertones and rich hand-scraped character.',
    hexCode: '#5B4033',
    textureType: 'wood',
    roughness: 0.5,
    metalness: 0.05,
    costModifier: 22,
    thumbnail: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Venetian Cast Terrazzo',
    category: 'flooring',
    description: 'Warm ivory matrix embedded with soft river stones and marble fragments.',
    hexCode: '#D9D3C7',
    textureType: 'terrazzo',
    roughness: 0.35,
    metalness: 0.1,
    costModifier: 28,
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Polished Architectural Micro-Cement',
    category: 'flooring',
    description: 'Continuous troweled mineral finish delivering seamless monolithic elegance.',
    hexCode: '#B4B0A8',
    textureType: 'stone',
    roughness: 0.3,
    metalness: 0.1,
    costModifier: 18,
    thumbnail: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=300&q=80',
  },

  // Walls
  {
    name: 'Warm Alabaster Mineral Paint',
    category: 'walls',
    description: 'Soft luminous off-white with delicate clay pigments that reflect natural daylight.',
    hexCode: '#F5F2EB',
    textureType: 'paint',
    roughness: 0.85,
    metalness: 0.0,
    costModifier: 6,
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Calming Mineral Sage',
    category: 'walls',
    description: 'Earthy desaturated botanical green bringing restorative organic tranquility.',
    hexCode: '#8E9A8B',
    textureType: 'paint',
    roughness: 0.85,
    metalness: 0.0,
    costModifier: 8,
    thumbnail: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'French Architectural Greige',
    category: 'walls',
    description: 'Subtle balance between warm beige and modern stone grey.',
    hexCode: '#D4CBBF',
    textureType: 'paint',
    roughness: 0.8,
    metalness: 0.0,
    costModifier: 7,
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Limewashed Charcoal Slate',
    category: 'walls',
    description: 'Deep textured charcoal with hand-troweled mineral highlights for dramatic depth.',
    hexCode: '#3D3B38',
    textureType: 'paint',
    roughness: 0.9,
    metalness: 0.05,
    costModifier: 14,
    thumbnail: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=300&q=80',
  },

  // Cabinetry / Joinery
  {
    name: 'Nordic Bleached Ash Joinery',
    category: 'cabinetry',
    description: 'Straight-grain pale Scandinavian timber with flush reveal detailing.',
    hexCode: '#DFD5BE',
    textureType: 'wood',
    roughness: 0.5,
    metalness: 0.05,
    costModifier: 20,
    thumbnail: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Fluted American Walnut',
    category: 'cabinetry',
    description: 'Architectural vertical fluting with rich chocolate grain and soft hand-oiled sheen.',
    hexCode: '#4A3425',
    textureType: 'wood',
    roughness: 0.45,
    metalness: 0.05,
    costModifier: 32,
    thumbnail: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Matte Studio Bone Lacquer',
    category: 'cabinetry',
    description: 'Ultra-matte velvety soft-touch lacquer engineered to resist fingerprints.',
    hexCode: '#ECE6DC',
    textureType: 'paint',
    roughness: 0.3,
    metalness: 0.0,
    costModifier: 16,
    thumbnail: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Brushed Bronze Anodized Accent',
    category: 'cabinetry',
    description: 'Custom metal extrusions with linear satin grain and deep bronze patina.',
    hexCode: '#7A6245',
    textureType: 'metal',
    roughness: 0.35,
    metalness: 0.7,
    costModifier: 38,
    thumbnail: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=300&q=80',
  },

  // Accents / Textiles
  {
    name: 'Textured Oatmeal Bouclé',
    category: 'accent',
    description: 'Heavy tactile looped yarn fabric with cozy, sculpture-like warmth.',
    hexCode: '#EDE9E1',
    textureType: 'fabric',
    roughness: 0.9,
    metalness: 0.0,
    costModifier: 18,
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Terracotta Clay Washed Linen',
    category: 'accent',
    description: 'Pure European flax linen pre-washed with Mediterranean earthen pigments.',
    hexCode: '#B8654D',
    textureType: 'fabric',
    roughness: 0.85,
    metalness: 0.0,
    costModifier: 14,
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Deep Forest Velvet',
    category: 'accent',
    description: 'Dense architectural cotton velvet with deep low-luster pile.',
    hexCode: '#263B2E',
    textureType: 'fabric',
    roughness: 0.8,
    metalness: 0.1,
    costModifier: 26,
    thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Cognac Full-Grain Saddle Leather',
    category: 'accent',
    description: 'Vegetable-tanned artisanal leather that develops rich authentic patina over decades.',
    hexCode: '#9E5B32',
    textureType: 'fabric',
    roughness: 0.6,
    metalness: 0.15,
    costModifier: 36,
    thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80',
  },
];

/**
 * Safely ensures demo user accounts exist (with properly hashed passwords)
 */
export const ensureDemoUsers = async () => {
  const usersConfig = [
    {
      name: 'Elena Rostova',
      email: 'admin@spacecraft.com',
      password: 'Admin@12345',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Julian Vance',
      email: 'designer@spacecraft.com',
      password: 'Designer@12345',
      role: 'designer',
      phone: '+1 (555) 438-9201',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Marcus Sterling',
      email: 'client@spacecraft.com',
      password: 'Client@12345',
      role: 'client',
      phone: '+1 (555) 872-1094',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Sarah Jenkins',
      email: 'sarah@spacecraft.com',
      password: 'Client@12345',
      role: 'client',
      phone: '+1 (555) 349-8812',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const userMap = {};
  for (const u of usersConfig) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      existing = await User.create(u);
      console.log(`[Demo Users]: Created persona ${u.email} (${u.role})`);
    }
    userMap[u.role] = existing;
    userMap[u.email] = existing;
  }
  return userMap;
};

/**
 * Safely and idempotently populates all room concepts and materials.
 */
export const safeSeedCatalog = async () => {
  try {
    // 1. Upsert materials (idempotent)
    const materialMap = {};
    for (const mat of SEED_MATERIALS) {
      const doc = await MaterialOption.findOneAndUpdate(
        { name: mat.name },
        { $set: mat },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      materialMap[mat.name] = doc._id;
    }

    // 2. Ensure demo users
    const users = await ensureDemoUsers();
    const adminUser = users['admin@spacecraft.com'];

    // Material helpers
    const getMatId = (partialName) => {
      const key = Object.keys(materialMap).find((k) => k.includes(partialName));
      return key ? materialMap[key] : Object.values(materialMap)[0];
    };
    const allMaterialIds = Object.values(materialMap);

    // 3. Define 12 high-end 3D room concepts across all supported typologies
    const CONCEPTS = [
      // 1. Living Room - Warm Minimalist
      {
        name: 'Aura Minimalist Living Salon',
        slug: 'aura-minimalist-living-salon',
        description:
          'A serene, architectural living space curated around natural light, low-slung seating, and sculptural monolithic elements. Designed for contemplation and relaxed hosting with soft acoustic absorption.',
        roomType: 'Living Room',
        designStyle: 'Warm Minimalist',
        coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 22, widthFt: 16, heightFt: 10, areaSqFt: 352 },
        budgetRange: { min: 14000, max: 32000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('White Oak'),
          walls: getMatId('Alabaster'),
          cabinetry: getMatId('Ash Joinery'),
          accent: getMatId('Bouclé'),
        },
        sceneConfig: {
          cameraPosition: [6.5, 4.2, 7.8],
          targetPosition: [0, 1.1, 0],
          lightingWarmth: '#FFF7ED',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },

      // 2. Living Room - Scandinavian
      {
        name: 'Copenhagen Solarium Living Pavilion',
        slug: 'copenhagen-solarium-living-pavilion',
        description:
          'A luminous Scandinavian lounge defined by light-reflective mineral sage planes, expansive daylight apertures, bleached French oak, and tactile bouclé upholstery.',
        roomType: 'Living Room',
        designStyle: 'Scandinavian',
        coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 24, widthFt: 17, heightFt: 10.5, areaSqFt: 408 },
        budgetRange: { min: 22000, max: 46000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('White Oak'),
          walls: getMatId('Sage'),
          cabinetry: getMatId('Ash Joinery'),
          accent: getMatId('Bouclé'),
        },
        sceneConfig: {
          cameraPosition: [6.8, 4.4, 7.6],
          targetPosition: [0, 1.1, 0],
          lightingWarmth: '#FFFDF6',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },

      // 3. Bedroom - Japandi
      {
        name: 'Kyoto Sanctuary Suite',
        slug: 'kyoto-sanctuary-suite',
        description:
          'Inspired by traditional ryokan architecture blended with modern European restraint. Features low-profile joinery, concealed perimeter illumination, and tactile natural surfaces.',
        roomType: 'Bedroom',
        designStyle: 'Japandi',
        coverImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 18, widthFt: 14, heightFt: 9.5, areaSqFt: 252 },
        budgetRange: { min: 11000, max: 24000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('Smoked Belgian Walnut'),
          walls: getMatId('Greige'),
          cabinetry: getMatId('Fluted American Walnut'),
          accent: getMatId('Terracotta'),
        },
        sceneConfig: {
          cameraPosition: [5.8, 3.8, 6.8],
          targetPosition: [0, 1.0, 0],
          lightingWarmth: '#FFF4E5',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },

      // 4. Bedroom - Warm Minimalist
      {
        name: 'Wabi-Sabi Zen Chamber',
        slug: 'wabi-sabi-zen-chamber',
        description:
          'A quiet restorative suite prioritizing organic textures: natural Roman clay plaster, floating low-profile smoked walnut platforms, and gentle diffuse bedside lighting.',
        roomType: 'Bedroom',
        designStyle: 'Warm Minimalist',
        coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 20, widthFt: 15, heightFt: 10, areaSqFt: 300 },
        budgetRange: { min: 16000, max: 34000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('White Oak'),
          walls: getMatId('Alabaster'),
          cabinetry: getMatId('Fluted American Walnut'),
          accent: getMatId('Terracotta'),
        },
        sceneConfig: {
          cameraPosition: [5.6, 3.8, 6.5],
          targetPosition: [0, 1.0, 0],
          lightingWarmth: '#FFF3E0',
        },
        isPublished: true,
        featured: false,
        createdBy: adminUser._id,
      },

      // 5. Kitchen - Modern Architectural
      {
        name: 'Brutalist Atelier Kitchen',
        slug: 'brutalist-atelier-kitchen',
        description:
          'A sculptural kitchen defined by clean continuous stone planes, handleless joinery, and professional-grade flush induction. Balancing raw architectural rigor with ergonomic warmth.',
        roomType: 'Kitchen',
        designStyle: 'Modern Architectural',
        coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 20, widthFt: 14, heightFt: 10, areaSqFt: 280 },
        budgetRange: { min: 25000, max: 55000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('Terrazzo'),
          walls: getMatId('Alabaster'),
          cabinetry: getMatId('Bone Lacquer'),
          accent: getMatId('Bronze'),
        },
        sceneConfig: {
          cameraPosition: [6.0, 4.5, 7.5],
          targetPosition: [0, 1.2, 0],
          lightingWarmth: '#FFFDF7',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },

      // 6. Kitchen - Mediterranean Contemporary
      {
        name: 'Tuscan Travertine Monolith Kitchen',
        slug: 'tuscan-travertine-monolith-kitchen',
        description:
          'An expansive culinary galley featuring seamless micro-cement, fluted American walnut cabinetry, terrazzo prep surfaces, and brushed bronze architectural hardware.',
        roomType: 'Kitchen',
        designStyle: 'Mediterranean Contemporary',
        coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 22, widthFt: 16, heightFt: 10.5, areaSqFt: 352 },
        budgetRange: { min: 32000, max: 68000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('Micro-Cement'),
          walls: getMatId('Greige'),
          cabinetry: getMatId('Fluted American Walnut'),
          accent: getMatId('Bronze'),
        },
        sceneConfig: {
          cameraPosition: [6.4, 4.6, 7.8],
          targetPosition: [0, 1.2, 0],
          lightingWarmth: '#FFF8EA',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },

      // 7. Home Office - Scandinavian
      {
        name: 'Highline Executive Study',
        slug: 'highline-executive-study',
        description:
          'An executive home workspace engineered for deep focus. Custom floor-to-ceiling acoustic paneling, integrated library shelving, ergonomic seating, and glare-free directional lighting.',
        roomType: 'Home Office',
        designStyle: 'Scandinavian',
        coverImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 16, widthFt: 13, heightFt: 9.5, areaSqFt: 208 },
        budgetRange: { min: 9000, max: 21000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('White Oak'),
          walls: getMatId('Sage'),
          cabinetry: getMatId('Ash Joinery'),
          accent: getMatId('Forest Velvet'),
        },
        sceneConfig: {
          cameraPosition: [5.2, 3.6, 6.2],
          targetPosition: [0, 1.0, 0],
          lightingWarmth: '#FFF9EE',
        },
        isPublished: true,
        featured: false,
        createdBy: adminUser._id,
      },

      // 8. Home Office - Modern Architectural
      {
        name: 'Milano Modernist Executive Suite',
        slug: 'milano-modernist-executive-suite',
        description:
          'A distinguished executive study characterized by smoked walnut acoustic paneling, micro-cement flooring, brushed bronze metal trim, and cognac saddle leather armchairs.',
        roomType: 'Home Office',
        designStyle: 'Modern Architectural',
        coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 18, widthFt: 14, heightFt: 10, areaSqFt: 252 },
        budgetRange: { min: 18000, max: 38000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('Smoked Belgian Walnut'),
          walls: getMatId('Alabaster'),
          cabinetry: getMatId('Bronze'),
          accent: getMatId('Cognac'),
        },
        sceneConfig: {
          cameraPosition: [5.4, 3.6, 6.4],
          targetPosition: [0, 1.0, 0],
          lightingWarmth: '#FFF9F0',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },

      // 9. Dining Room - Mediterranean Contemporary
      {
        name: 'Palermo Terrace Dining Suite',
        slug: 'palermo-terrace-dining-suite',
        description:
          'Warm coastal textures meet clean modern geometry. A generous travertine dining surface surrounded by woven seating, lime-wash textures, and expansive window frames overlooking gardens.',
        roomType: 'Dining Room',
        designStyle: 'Mediterranean Contemporary',
        coverImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 19, widthFt: 15, heightFt: 10, areaSqFt: 285 },
        budgetRange: { min: 12000, max: 28000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('Terrazzo'),
          walls: getMatId('Greige'),
          cabinetry: getMatId('Fluted American Walnut'),
          accent: getMatId('Cognac'),
        },
        sceneConfig: {
          cameraPosition: [6.2, 4.0, 7.2],
          targetPosition: [0, 1.1, 0],
          lightingWarmth: '#FFF6E3',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },

      // 10. Dining Room - Scandinavian
      {
        name: 'Stockholm Waterfront Dining Salon',
        slug: 'stockholm-waterfront-dining-salon',
        description:
          'An airy Nordic dining hall centered around a solid white oak trestle table, limewashed alabaster plaster, and Scandinavian bone lacquer credenzas paired with deep forest velvet upholstery.',
        roomType: 'Dining Room',
        designStyle: 'Scandinavian',
        coverImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 21, widthFt: 15, heightFt: 10, areaSqFt: 315 },
        budgetRange: { min: 15000, max: 35000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('White Oak'),
          walls: getMatId('Alabaster'),
          cabinetry: getMatId('Bone Lacquer'),
          accent: getMatId('Forest Velvet'),
        },
        sceneConfig: {
          cameraPosition: [6.0, 4.2, 7.0],
          targetPosition: [0, 1.1, 0],
          lightingWarmth: '#FFF9EE',
        },
        isPublished: true,
        featured: false,
        createdBy: adminUser._id,
      },

      // 11. Studio Apartment - Industrial Loft
      {
        name: 'Tribeca Industrial Studio',
        slug: 'tribeca-industrial-studio',
        description:
          'A loft apartment prioritizing raw authenticity: exposed structural brick, black steel factory mullions, and polished architectural micro-cement paired with rich saddle leather.',
        roomType: 'Studio Apartment',
        designStyle: 'Industrial Loft',
        coverImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 26, widthFt: 18, heightFt: 11, areaSqFt: 468 },
        budgetRange: { min: 18000, max: 42000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('Micro-Cement'),
          walls: getMatId('Charcoal'),
          cabinetry: getMatId('Bronze'),
          accent: getMatId('Cognac'),
        },
        sceneConfig: {
          cameraPosition: [7.2, 4.8, 8.5],
          targetPosition: [0, 1.3, 0],
          lightingWarmth: '#FFFAF0',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },

      // 12. Studio Apartment - Japandi / Industrial
      {
        name: 'SoHo Cast-Iron Artist Studio',
        slug: 'soho-cast-iron-artist-studio',
        description:
          'A light-filled open-plan loft studio featuring cast Venetian terrazzo floors, open timber partition screens, an elevated sleeping alcove, and bespoke bronze architectural detailing.',
        roomType: 'Studio Apartment',
        designStyle: 'Japandi',
        coverImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 28, widthFt: 19, heightFt: 11.5, areaSqFt: 532 },
        budgetRange: { min: 24000, max: 54000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('Terrazzo'),
          walls: getMatId('Greige'),
          cabinetry: getMatId('Ash Joinery'),
          accent: getMatId('Terracotta'),
        },
        sceneConfig: {
          cameraPosition: [7.4, 4.8, 8.8],
          targetPosition: [0, 1.3, 0],
          lightingWarmth: '#FFF5E6',
        },
        isPublished: true,
        featured: true,
        createdBy: adminUser._id,
      },
    ];

    // Upsert RoomConcepts by slug
    for (const concept of CONCEPTS) {
      await RoomConcept.findOneAndUpdate(
        { slug: concept.slug },
        { $set: concept },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`[Safe Seeder]: Successfully ensured all ${CONCEPTS.length} room concepts in database.`);

    // 4. Populate Dummy Projects & Proposals if none exist
    await ensureDummyProjectsAndProposals(users, materialMap);

    return { success: true, count: CONCEPTS.length };
  } catch (err) {
    console.error('[Safe Seeder Error]:', err.message);
    throw err;
  }
};

/**
 * Safely populates rich dummy projects, proposals with revision histories,
 * and saved designs if the database does not already contain projects.
 */
export const ensureDummyProjectsAndProposals = async (userMap, materialMap) => {
  try {
    const existingProjectsCount = await Project.countDocuments();
    if (existingProjectsCount > 0) {
      console.log(`[Demo Data]: Projects already exist (${existingProjectsCount} found). Skipping dummy project seeding.`);
      return;
    }

    const clientUser = userMap['client@spacecraft.com'];
    const designerUser = userMap['designer@spacecraft.com'];
    const sarahUser = userMap['sarah@spacecraft.com'];

    if (!clientUser || !designerUser || !sarahUser) {
      console.warn('[Demo Data]: Required users not found. Skipping dummy projects.');
      return;
    }

    // Material getters
    const getMatId = (partialName) => {
      const key = Object.keys(materialMap).find((k) => k.includes(partialName));
      return key ? materialMap[key] : Object.values(materialMap)[0];
    };

    const livingConcept = await RoomConcept.findOne({ slug: 'aura-minimalist-living-salon' });
    const kitchenConcept = await RoomConcept.findOne({ slug: 'brutalist-atelier-kitchen' });
    const studioConcept = await RoomConcept.findOne({ slug: 'tribeca-industrial-studio' });
    const bedroomConcept = await RoomConcept.findOne({ slug: 'kyoto-sanctuary-suite' });

    // 1. Saved Designs for Marcus
    const marcusLivingDesign = await SavedDesign.create({
      name: 'Marcus — Penthouse Salon Concept',
      owner: clientUser._id,
      roomConcept: livingConcept?._id || null,
      selectedMaterials: {
        flooring: getMatId('Terrazzo'),
        walls: getMatId('Sage'),
        cabinetry: getMatId('Ash Joinery'),
        accent: getMatId('Bouclé'),
      },
      notes: 'Prefer light terrazzo flooring with contrasting sage mineral walls. Need acoustic dampening for high ceilings.',
      customDimensions: { lengthFt: 22, widthFt: 16, areaSqFt: 352 },
      estimatedBudget: 22880,
    });

    const marcusKitchenDesign = await SavedDesign.create({
      name: 'Marcus — Modern Atelier Kitchen',
      owner: clientUser._id,
      roomConcept: kitchenConcept?._id || null,
      selectedMaterials: {
        flooring: getMatId('Micro-Cement'),
        walls: getMatId('Alabaster'),
        cabinetry: getMatId('Bone Lacquer'),
        accent: getMatId('Bronze'),
      },
      notes: 'Clean lines with flush induction cooktop and concealed pantry doors.',
      customDimensions: { lengthFt: 20, widthFt: 14, areaSqFt: 280 },
      estimatedBudget: 38500,
    });

    // Saved Design for Sarah
    const sarahBedroomDesign = await SavedDesign.create({
      name: 'Sarah — Kyoto Sanctuary Suite',
      owner: sarahUser._id,
      roomConcept: bedroomConcept?._id || null,
      selectedMaterials: {
        flooring: getMatId('Smoked Belgian Walnut'),
        walls: getMatId('Greige'),
        cabinetry: getMatId('Fluted American Walnut'),
        accent: getMatId('Terracotta'),
      },
      notes: 'Calm restorative ryokan-inspired master bedroom with low platform bed.',
      customDimensions: { lengthFt: 18, widthFt: 14, areaSqFt: 252 },
      estimatedBudget: 19400,
    });

    console.log('[Demo Data]: Created sample saved designs for client personas.');

    // 2. Project 1: Marcus Sterling Penthouse Living Space
    const project1 = await Project.create({
      title: 'TriBeCa Penthouse Living Space Redesign',
      client: clientUser._id,
      assignedDesigner: designerUser._id,
      roomType: 'Living Room',
      propertyType: 'Penthouse',
      dimensions: { lengthFt: 22, widthFt: 16, heightFt: 10, areaSqFt: 352 },
      preferredStyle: 'Warm Minimalist',
      budgetRange: { min: 20000, max: 35000, currency: 'USD' },
      timeline: '2 - 4 Months',
      location: { city: 'New York', stateOrProvince: 'NY', country: 'United States' },
      requirementsDescription:
        'Transforming open-plan penthouse salon into a calm, architectural sanctuary with curated lighting and organic materials. Must accommodate 6-8 guests comfortably.',
      referenceImages: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      ],
      savedDesign: marcusLivingDesign._id,
      status: 'Proposal Ready',
      statusNotes: 'Proposal Version 2 published and awaiting client acceptance.',
    });

    await ProjectActivity.create({
      project: project1._id,
      actor: clientUser._id,
      actionType: 'PROJECT_CREATED',
      title: 'Project Brief Submitted',
      details: 'Marcus Sterling submitted project brief with saved design attachment and $20,000 - $35,000 budget.',
    });

    await ProjectActivity.create({
      project: project1._id,
      actor: designerUser._id,
      actionType: 'DESIGNER_ASSIGNED',
      title: 'Designer Assigned',
      details: 'Julian Vance accepted assignment and initiated concept analysis.',
    });

    // Create Multi-Version Proposal for Project 1
    const proposal1 = await Proposal.create({
      project: project1._id,
      client: clientUser._id,
      designer: designerUser._id,
      title: 'Architectural Salon Renovation Proposal',
      currentVersionNumber: 2,
      status: 'Published',
    });

    // Version 1 (Initial Concept)
    const v1 = await ProposalVersion.create({
      proposal: proposal1._id,
      project: project1._id,
      versionNumber: 1,
      title: 'Architectural Salon Renovation Proposal (Initial Concept)',
      designConceptDescription:
        'A refined spatial plan emphasizing light reflection through polished terrazzo, sculptural seating, and bespoke bleached ash joinery.',
      selectedFinishes: [
        { category: 'Flooring', name: 'Venetian Cast Terrazzo', specDetails: 'Pre-cast large format 80x80cm tiles' },
        { category: 'Walls', name: 'Calming Mineral Sage', specDetails: 'Roman clay plaster finish' },
        { category: 'Cabinetry', name: 'Nordic Bleached Ash Joinery', specDetails: 'Custom 4-meter media credenza' },
        { category: 'Accent', name: 'Textured Oatmeal Bouclé', specDetails: 'Italian curved modular sectional' },
      ],
      scopeOfWork: [
        'Demolition of existing non-structural partition wall',
        'Sub-floor leveling and Italian terrazzo installation',
        'Custom 4-meter floating ash joinery unit fabrication and electrical recessing',
        'Curved bouclé sectional delivery and white-glove placement',
        'Directional warm museum-grade LED track lighting installation',
      ],
      costBreakdown: [
        { category: 'Materials', item: 'Venetian Terrazzo & Roman Clay Plaster', quantity: 352, unitCost: 28, lineTotal: 9856 },
        { category: 'Furniture', item: 'Curved Bouclé Sectional & Travertine Coffee Table', quantity: 1, unitCost: 8200, lineTotal: 8200 },
        { category: 'Lighting', item: 'Architectural 2700K Low-Voltage Track System', quantity: 1, unitCost: 2600, lineTotal: 2600 },
        { category: 'Labour', item: 'Specialist Joiner & Plaster Artisan (120 hrs)', quantity: 120, unitCost: 45, lineTotal: 5400 },
        { category: 'Installation', item: 'Site Supervision, Delivery & Waste Clearance', quantity: 1, unitCost: 1800, lineTotal: 1800 },
      ],
      totalEstimatedCost: 27856,
      estimatedTimeline: '8 - 10 Weeks',
      designerNotes: 'Initial comprehensive package designed strictly around your penthouse floorplan.',
      status: 'Superseded',
      createdBy: designerUser._id,
    });

    await ProjectActivity.create({
      project: project1._id,
      actor: designerUser._id,
      actionType: 'PROPOSAL_CREATED',
      title: 'Proposal Version 1 Published',
      details: 'Designer published initial proposal for $27,856.',
      metadata: { versionNumber: 1, totalEstimatedCost: 27856 },
    });

    // Client Revision Request against Version 1
    const rev1 = await RevisionRequest.create({
      project: project1._id,
      proposal: proposal1._id,
      proposalVersion: v1._id,
      targetVersionNumber: 1,
      requestedChanges:
        'We love the layout and curved bouclé sectional! Could we explore using Natural White Oak planks instead of Terrazzo to bring down total cost slightly and increase barefoot warmth?',
      focusAreas: ['Materials & Finishes', 'Cost & Budget'],
      submittedBy: clientUser._id,
      status: 'Addressed',
      addressedInVersionNumber: 2,
    });

    await ProjectActivity.create({
      project: project1._id,
      actor: clientUser._id,
      actionType: 'REVISION_REQUESTED',
      title: 'Revision Requested for Version 1',
      details: rev1.requestedChanges,
      metadata: { targetVersionNumber: 1 },
    });

    // Version 2 (Revised Concept)
    const v2 = await ProposalVersion.create({
      proposal: proposal1._id,
      project: project1._id,
      versionNumber: 2,
      title: 'Architectural Salon Renovation Proposal (Oak & Acoustic Refinement)',
      designConceptDescription:
        'Updated configuration integrating Natural White Oak engineered planks in place of terrazzo, preserving the curved bouclé aesthetic while trimming $5,220 from the budget.',
      selectedFinishes: [
        { category: 'Flooring', name: 'Bleached French White Oak', specDetails: 'Select grade 220mm wide boards, ultra-matte UV oil' },
        { category: 'Walls', name: 'Calming Mineral Sage', specDetails: 'Roman clay plaster finish' },
        { category: 'Cabinetry', name: 'Nordic Bleached Ash Joinery', specDetails: 'Custom 4-meter media credenza' },
        { category: 'Accent', name: 'Textured Oatmeal Bouclé', specDetails: 'Italian curved modular sectional' },
      ],
      scopeOfWork: [
        'Demolition of existing non-structural partition wall',
        'Sub-floor acoustic underlayment and engineered French White Oak installation',
        'Custom 4-meter floating ash joinery unit fabrication and electrical recessing',
        'Curved bouclé sectional delivery and white-glove placement',
        'Directional warm museum-grade LED track lighting installation',
      ],
      costBreakdown: [
        { category: 'Materials', item: 'French White Oak Planks & Clay Plaster', quantity: 352, unitCost: 18, lineTotal: 6336 },
        { category: 'Furniture', item: 'Curved Bouclé Sectional & Travertine Coffee Table', quantity: 1, unitCost: 7800, lineTotal: 7800 },
        { category: 'Lighting', item: 'Architectural 2700K Low-Voltage Track System', quantity: 1, unitCost: 2400, lineTotal: 2400 },
        { category: 'Labour', item: 'Flooring & Joinery Specialist (100 hrs)', quantity: 100, unitCost: 45, lineTotal: 4500 },
        { category: 'Installation', item: 'Site Supervision, Delivery & Waste Clearance', quantity: 1, unitCost: 1600, lineTotal: 1600 },
      ],
      totalEstimatedCost: 22636,
      estimatedTimeline: '7 - 9 Weeks',
      designerNotes:
        'Refined according to your revision request. Swapping to wide-plank white oak reduced material costs and labor duration while achieving exceptional acoustic ambiance.',
      revisionSummary: 'Substituted terrazzo with Natural White Oak; adjusted total from $27,856 down to $22,636.',
      status: 'Published',
      createdBy: designerUser._id,
    });

    proposal1.currentVersion = v2._id;
    await proposal1.save();

    await ProjectActivity.create({
      project: project1._id,
      actor: designerUser._id,
      actionType: 'PROPOSAL_REVISED',
      title: 'Proposal Version 2 Published',
      details: 'Designer published revised Version 2 ($22,636) addressing flooring material and budget requests.',
      metadata: { versionNumber: 2, totalEstimatedCost: 22636 },
    });

    // 3. Project 2: Sarah Jenkins Kyoto Primary Suite (Accepted)
    const project2 = await Project.create({
      title: 'Kyoto-Inspired Primary Suite Transformation',
      client: sarahUser._id,
      assignedDesigner: designerUser._id,
      roomType: 'Bedroom',
      propertyType: 'Townhouse',
      dimensions: { lengthFt: 18, widthFt: 14, heightFt: 9.5, areaSqFt: 252 },
      preferredStyle: 'Japandi',
      budgetRange: { min: 15000, max: 28000, currency: 'USD' },
      timeline: '1 - 2 Months',
      location: { city: 'Brooklyn', stateOrProvince: 'NY', country: 'United States' },
      requirementsDescription:
        'A restful master bedroom incorporating Japanese low platform principles, custom fluted walnut cabinetry, and organic textures.',
      savedDesign: sarahBedroomDesign._id,
      status: 'Accepted',
      statusNotes: 'Proposal Version 1 accepted by Sarah Jenkins. Entering procurement phase.',
    });

    const proposal2 = await Proposal.create({
      project: project2._id,
      client: sarahUser._id,
      designer: designerUser._id,
      title: 'Kyoto Sanctuary Suite Master Package',
      currentVersionNumber: 1,
      status: 'Accepted',
    });

    const v2_1 = await ProposalVersion.create({
      proposal: proposal2._id,
      project: project2._id,
      versionNumber: 1,
      title: 'Kyoto Sanctuary Suite Master Package',
      designConceptDescription:
        'Restorative ryokan-inspired configuration featuring floating smoked walnut joinery, recessed shoji-inspired perimeter glow, and hand-loomed linen drapery.',
      selectedFinishes: [
        { category: 'Flooring', name: 'Smoked Belgian Walnut', specDetails: 'Wide plank oiled walnut' },
        { category: 'Walls', name: 'French Architectural Greige', specDetails: 'Hand-troweled mineral paint' },
        { category: 'Cabinetry', name: 'Fluted American Walnut', specDetails: 'Custom floating wardrobe and headboard' },
        { category: 'Accent', name: 'Terracotta Clay Washed Linen', specDetails: 'Custom upholstered bench and bedding' },
      ],
      scopeOfWork: [
        'Acoustic wall isolation and Roman clay skim coat',
        'Custom floating walnut platform bed and integrated bedside tables fabrication',
        'Shoji-inspired perimeter valence with warm 2400K LED wash',
        'Wide-plank Belgian walnut installation with acoustic underlay',
      ],
      costBreakdown: [
        { category: 'Materials', item: 'Belgian Walnut & Greige Mineral Finish', quantity: 252, unitCost: 24, lineTotal: 6048 },
        { category: 'Furniture', item: 'Platform Bed & Fluted Walnut Credenza', quantity: 1, unitCost: 6500, lineTotal: 6500 },
        { category: 'Lighting', item: 'Concealed Perimeter LED Cove & Brass Sconces', quantity: 1, unitCost: 1900, lineTotal: 1900 },
        { category: 'Labour', item: 'Artisanal Joinery & Electrical (80 hrs)', quantity: 80, unitCost: 50, lineTotal: 4000 },
      ],
      totalEstimatedCost: 18448,
      estimatedTimeline: '6 - 8 Weeks',
      designerNotes: 'Complete turnkey master suite package tailored for serene acoustic privacy.',
      status: 'Accepted',
      createdBy: designerUser._id,
    });

    proposal2.currentVersion = v2_1._id;
    proposal2.acceptedVersion = v2_1._id;
    proposal2.acceptedVersionNumber = 1;
    await proposal2.save();

    await ProjectActivity.create({
      project: project2._id,
      actor: sarahUser._id,
      actionType: 'PROPOSAL_ACCEPTED',
      title: 'Proposal Accepted',
      details: 'Sarah Jenkins accepted Proposal Version 1 ($18,448). Project initiated.',
      metadata: { totalEstimatedCost: 18448 },
    });

    // 4. Project 3: SoHo Industrial Loft (In Progress / Under Review)
    const project3 = await Project.create({
      title: 'SoHo Cast-Iron Studio Loft Renovation',
      client: clientUser._id,
      assignedDesigner: designerUser._id,
      roomType: 'Studio Apartment',
      propertyType: 'Studio',
      dimensions: { lengthFt: 26, widthFt: 18, heightFt: 11, areaSqFt: 468 },
      preferredStyle: 'Industrial Loft',
      budgetRange: { min: 25000, max: 48000, currency: 'USD' },
      timeline: '4 - 6 Months',
      location: { city: 'New York', stateOrProvince: 'NY', country: 'United States' },
      requirementsDescription:
        'Open-concept loft conversion featuring custom bronze partitions, polished micro-cement, and industrial factory mullions.',
      status: 'Under Review',
      statusNotes: 'Designer is drafting initial proposal with 3D renderings.',
    });

    await ProjectActivity.create({
      project: project3._id,
      actor: clientUser._id,
      actionType: 'PROJECT_CREATED',
      title: 'Project Brief Submitted',
      details: 'Marcus Sterling submitted industrial studio project brief.',
    });

    console.log('[Demo Data]: Successfully seeded realistic demo projects, multi-version proposals, and audit logs.');
  } catch (err) {
    console.error('[Demo Data Error]:', err.message);
  }
};
