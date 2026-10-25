import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { MaterialOption } from '../models/MaterialOption.js';
import { RoomConcept } from '../models/RoomConcept.js';
import { SavedDesign } from '../models/SavedDesign.js';
import { Project } from '../models/Project.js';
import { Proposal } from '../models/Proposal.js';
import { ProposalVersion } from '../models/ProposalVersion.js';
import { RevisionRequest } from '../models/RevisionRequest.js';
import { ProjectActivity } from '../models/ProjectActivity.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/spacecraft';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB');

    // Clean existing collections
    await Promise.all([
      User.deleteMany(),
      MaterialOption.deleteMany(),
      RoomConcept.deleteMany(),
      SavedDesign.deleteMany(),
      Project.deleteMany(),
      Proposal.deleteMany(),
      ProposalVersion.deleteMany(),
      RevisionRequest.deleteMany(),
      ProjectActivity.deleteMany(),
    ]);
    console.log('[Seed]: Cleared existing collections');

    // 1. Create Demo Users
    const adminUser = await User.create({
      name: 'Elena Rostova',
      email: 'admin@spacecraft.com',
      password: 'Admin@12345',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });

    const designerUser = await User.create({
      name: 'Julian Vance',
      email: 'designer@spacecraft.com',
      password: 'Designer@12345',
      role: 'designer',
      phone: '+1 (555) 438-9201',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    const clientUser = await User.create({
      name: 'Marcus Sterling',
      email: 'client@spacecraft.com',
      password: 'Client@12345',
      role: 'client',
      phone: '+1 (555) 872-1094',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    const secondClientUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@spacecraft.com',
      password: 'Client@12345',
      role: 'client',
      phone: '+1 (555) 349-8812',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    console.log('[Seed]: Created demo accounts (admin, designer, client, sarah)');

    // 2. Create Material Options
    const materials = await MaterialOption.create([
      // Flooring
      {
        name: 'Natural White Oak Planks',
        category: 'flooring',
        description: 'Wire-brushed French white oak with a matte polyurethane protective coat.',
        hexCode: '#D6C3A5',
        textureType: 'wood',
        roughness: 0.6,
        metalness: 0.05,
        costModifier: 12,
        thumbnail: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Smoked Walnut Herringbone',
        category: 'flooring',
        description: 'Deep smoked American walnut arranged in classic precision herringbone geometry.',
        hexCode: '#5A4231',
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
        costModifier: 24,
        thumbnail: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=300&q=80',
      },
      {
        name: 'Cognac Saddle Leather',
        category: 'accent',
        description: 'Full-grain vegetable-tanned Italian leather that develops a timeless patina.',
        hexCode: '#8B542F',
        textureType: 'fabric',
        roughness: 0.5,
        metalness: 0.15,
        costModifier: 35,
        thumbnail: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80',
      },
    ]);

    console.log(`[Seed]: Created ${materials.length} architectural material options`);

    // Group materials for easy assignment
    const oakFloor = materials.find((m) => m.name.includes('White Oak'));
    const walnutFloor = materials.find((m) => m.name.includes('Smoked Walnut'));
    const terrazzoFloor = materials.find((m) => m.name.includes('Terrazzo'));
    const microCementFloor = materials.find((m) => m.name.includes('Micro-Cement'));

    const alabasterWall = materials.find((m) => m.name.includes('Alabaster'));
    const sageWall = materials.find((m) => m.name.includes('Sage'));
    const greigeWall = materials.find((m) => m.name.includes('Greige'));
    const charcoalWall = materials.find((m) => m.name.includes('Charcoal'));

    const ashCabinet = materials.find((m) => m.name.includes('Ash Joinery'));
    const walnutCabinet = materials.find((m) => m.name.includes('Fluted American Walnut'));
    const boneCabinet = materials.find((m) => m.name.includes('Bone Lacquer'));
    const bronzeCabinet = materials.find((m) => m.name.includes('Bronze'));

    const boucleAccent = materials.find((m) => m.name.includes('Bouclé'));
    const terracottaAccent = materials.find((m) => m.name.includes('Terracotta'));
    const forestAccent = materials.find((m) => m.name.includes('Forest Velvet'));
    const cognacAccent = materials.find((m) => m.name.includes('Cognac'));

    const allMaterialIds = materials.map((m) => m._id);

    // 3. Create Rich Room Concepts
    const roomConcepts = await RoomConcept.create([
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
          flooring: oakFloor._id,
          walls: alabasterWall._id,
          cabinetry: ashCabinet._id,
          accent: boucleAccent._id,
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
          flooring: walnutFloor._id,
          walls: greigeWall._id,
          cabinetry: walnutCabinet._id,
          accent: terracottaAccent._id,
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
          flooring: terrazzoFloor._id,
          walls: alabasterWall._id,
          cabinetry: boneCabinet._id,
          accent: bronzeCabinet._id,
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
          flooring: oakFloor._id,
          walls: sageWall._id,
          cabinetry: ashCabinet._id,
          accent: forestAccent._id,
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
        ],
        defaultDimensions: { lengthFt: 19, widthFt: 15, heightFt: 10, areaSqFt: 285 },
        budgetRange: { min: 12000, max: 28000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: terrazzoFloor._id,
          walls: greigeWall._id,
          cabinetry: walnutCabinet._id,
          accent: cognacAccent._id,
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
      {
        name: 'Tribeca Urban Loft Studio',
        slug: 'tribeca-urban-loft-studio',
        description:
          'Open-concept studio living optimized with multifunctional acoustic zoning, exposed brickwork accents, blackened steel glass partitions, and warm timber joinery.',
        roomType: 'Studio Apartment',
        designStyle: 'Industrial Loft',
        coverImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
        galleryImages: [
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
        ],
        defaultDimensions: { lengthFt: 24, widthFt: 18, heightFt: 11, areaSqFt: 432 },
        budgetRange: { min: 18000, max: 42000 },
        availableMaterials: allMaterialIds,
        defaultSelections: {
          flooring: microCementFloor._id,
          walls: charcoalWall._id,
          cabinetry: walnutCabinet._id,
          accent: cognacAccent._id,
        },
        sceneConfig: {
          cameraPosition: [7.0, 4.5, 8.5],
          targetPosition: [0, 1.2, 0],
          lightingWarmth: '#FFE8D6',
        },
        isPublished: true,
        featured: false,
        createdBy: adminUser._id,
      },
    ]);

    console.log(`[Seed]: Created ${roomConcepts.length} room concepts`);

    // 4. Create Saved Design for Demo Client
    const livingConcept = roomConcepts[0];
    const clientSavedDesign = await SavedDesign.create({
      name: 'Marcus — Penthouse Salon Concept',
      owner: clientUser._id,
      roomConcept: livingConcept._id,
      selectedMaterials: {
        flooring: terrazzoFloor._id,
        walls: sageWall._id,
        cabinetry: ashCabinet._id,
        accent: boucleAccent._id,
      },
      notes: 'Prefer light terrazzo flooring with contrasting sage mineral walls. Need acoustic dampening for high ceilings.',
      customDimensions: { lengthFt: 22, widthFt: 16, areaSqFt: 352 },
      estimatedBudget: 22880,
    });

    console.log('[Seed]: Created saved design for client');

    // 5. Create Sample Project Brief
    const sampleProject = await Project.create({
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
        'We want to transform our open-plan penthouse salon into a calm, architectural sanctuary with curated lighting and organic materials. Must accommodate 6-8 guests comfortably while preserving floor space.',
      referenceImages: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      ],
      savedDesign: clientSavedDesign._id,
      status: 'Proposal Ready',
      statusNotes: 'Proposal Version 2 published and awaiting client decision.',
    });

    await ProjectActivity.create({
      project: sampleProject._id,
      actor: clientUser._id,
      actionType: 'PROJECT_CREATED',
      title: 'Project Brief Submitted',
      details: 'Client submitted project brief with saved design attachment and $20,000 - $35,000 budget.',
    });

    await ProjectActivity.create({
      project: sampleProject._id,
      actor: designerUser._id,
      actionType: 'DESIGNER_ASSIGNED',
      title: 'Designer Assigned',
      details: 'Julian Vance accepted assignment and initiated concept analysis.',
    });

    // 6. Create Multi-version Proposal History
    const proposalMaster = await Proposal.create({
      project: sampleProject._id,
      client: clientUser._id,
      designer: designerUser._id,
      title: 'Architectural Salon Renovation Proposal',
      currentVersionNumber: 2,
      status: 'Published',
    });

    // Proposal Version 1 (Immutable record)
    const version1 = await ProposalVersion.create({
      proposal: proposalMaster._id,
      project: sampleProject._id,
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

    // Record v1 publication activity
    await ProjectActivity.create({
      project: sampleProject._id,
      actor: designerUser._id,
      actionType: 'PROPOSAL_CREATED',
      title: 'Proposal Version 1 Published',
      details: 'Designer published initial proposal for $27,856.',
      metadata: { versionNumber: 1, totalEstimatedCost: 27856 },
    });

    // Client Revision Request against Version 1
    const revisionReq = await RevisionRequest.create({
      project: sampleProject._id,
      proposal: proposalMaster._id,
      proposalVersion: version1._id,
      targetVersionNumber: 1,
      requestedChanges:
        'We love the layout and curved bouclé sectional! However, could we explore using Natural White Oak planks instead of Terrazzo to bring down total cost slightly and increase barefoot warmth?',
      focusAreas: ['Materials & Finishes', 'Cost & Budget'],
      submittedBy: clientUser._id,
      status: 'Addressed',
      addressedInVersionNumber: 2,
    });

    await ProjectActivity.create({
      project: sampleProject._id,
      actor: clientUser._id,
      actionType: 'REVISION_REQUESTED',
      title: 'Revision Requested for Version 1',
      details: revisionReq.requestedChanges,
      metadata: { targetVersionNumber: 1 },
    });

    // Proposal Version 2 (Revised based on client feedback)
    const version2 = await ProposalVersion.create({
      proposal: proposalMaster._id,
      project: sampleProject._id,
      versionNumber: 2,
      title: 'Architectural Salon Renovation Proposal (Oak & Acoustic Refinement)',
      designConceptDescription:
        'Updated configuration integrating Natural White Oak engineered planks in place of terrazzo, preserving the curved bouclé aesthetic while trimming $4,200 from the budget.',
      selectedFinishes: [
        { category: 'Flooring', name: 'Natural White Oak Planks', specDetails: 'Select grade 220mm wide boards, ultra-matte UV oil' },
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
        'Refined according to your revision request. Swapping to wide-plank white oak reduced material costs and labor duration while achieving an exceptionally warm acoustic ambiance.',
      revisionSummary: 'Substituted terrazzo with Natural White Oak; adjusted total from $27,856 down to $22,636.',
      status: 'Published',
      createdBy: designerUser._id,
    });

    proposalMaster.currentVersion = version2._id;
    await proposalMaster.save();

    await ProjectActivity.create({
      project: sampleProject._id,
      actor: designerUser._id,
      actionType: 'PROPOSAL_REVISED',
      title: 'Proposal Version 2 Published',
      details: 'Designer published revised Version 2 ($22,636) addressing flooring material and budget requests.',
      metadata: { versionNumber: 2, totalEstimatedCost: 22636 },
    });

    console.log('[Seed]: Created multi-version proposal history (v1 -> revision request -> v2)');
    console.log('[Seed]: Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
