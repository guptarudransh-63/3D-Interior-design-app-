import { MaterialOption } from '../models/MaterialOption.js';
import { RoomConcept } from '../models/RoomConcept.js';
import { User } from '../models/User.js';

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

  // Accent / Upholstery
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
 * Safely and idempotently populates the room concepts and materials catalog.
 * Does NOT delete any existing users, projects, proposals, or client data.
 */
export const safeSeedCatalog = async () => {
  try {
    // 1. Upsert materials (idempotent, preserves IDs if existing)
    const materialMap = {};
    for (const mat of SEED_MATERIALS) {
      const doc = await MaterialOption.findOneAndUpdate(
        { name: mat.name },
        { $set: mat },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      materialMap[mat.name] = doc._id;
    }
    console.log(`[Safe Seeder]: Ensured ${Object.keys(materialMap).length} materials.`);

    // 2. Ensure a default admin creator exists
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Elena Rostova',
        email: 'admin@spacecraft.com',
        password: 'Admin@12345',
        role: 'admin',
        phone: '+1 (555) 019-2831',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      });
      console.log('[Safe Seeder]: Created initial admin account.');
    }

    // Material helpers
    const getMatId = (partialName) => {
      const key = Object.keys(materialMap).find((k) => k.includes(partialName));
      return key ? materialMap[key] : Object.values(materialMap)[0];
    };

    const allMaterialIds = Object.values(materialMap);

    const CONCEPTS = [
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
          'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 19, widthFt: 15, heightFt: 10, areaSqFt: 285 },
        budgetRange: { min: 12000, max: 28000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: getMatId('Terrazzo'),
          walls: getMatId('Alabaster'),
          cabinetry: getMatId('Fluted American Walnut'),
          accent: getMatId('Terracotta'),
        },
        sceneConfig: {
          cameraPosition: [5.8, 4.0, 7.0],
          targetPosition: [0, 1.0, 0],
          lightingWarmth: '#FFF5E6',
        },
        isPublished: true,
        featured: false,
        createdBy: adminUser._id,
      },
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
    ];

    // 3. Upsert RoomConcepts by slug
    for (const concept of CONCEPTS) {
      await RoomConcept.findOneAndUpdate(
        { slug: concept.slug },
        { $set: concept },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`[Safe Seeder]: Successfully ensured all ${CONCEPTS.length} room concepts in database.`);
    return { success: true, count: CONCEPTS.length };
  } catch (err) {
    console.error('[Safe Seeder Error]:', err.message);
    throw err;
  }
};
