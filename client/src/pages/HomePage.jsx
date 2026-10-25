import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { RoomCanvas } from '../components/3d/RoomCanvas';
import {
  ArrowRight,
  Compass,
  Layers,
  Sparkles,
  CheckCircle2,
  Sliders,
  FileCheck,
  History,
  Shield,
  Box,
} from 'lucide-react';

export const HomePage = () => {
  const [featuredConcepts, setFeaturedConcepts] = useState([]);
  const [heroMaterials, setHeroMaterials] = useState({});
  const [materialsList, setMaterialsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conceptsRes, materialsRes] = await Promise.all([
          api.getRoomConcepts({ limit: 6, featured: 'true' }),
          api.getMaterialOptions(),
        ]);

        if (conceptsRes.success) {
          setFeaturedConcepts(conceptsRes.data);
          // Set initial materials for hero preview from first concept
          if (conceptsRes.data[0]?.defaultSelections) {
            setHeroMaterials(conceptsRes.data[0].defaultSelections);
          }
        }

        if (materialsRes.success) {
          setMaterialsList(materialsRes.data);
        }
      } catch (err) {
        console.error('Home page load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroMaterialSelect = (category, material) => {
    setHeroMaterials((prev) => ({
      ...prev,
      [category]: material,
    }));
  };

  const roomCategories = [
    { title: 'Living Room', desc: 'Sculptural seating & light-filled salons', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80' },
    { title: 'Bedroom', desc: 'Quiet acoustic sanctuaries & ryokan suites', img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80' },
    { title: 'Kitchen', desc: 'Monolithic stone islands & hidden joinery', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
    { title: 'Dining Room', desc: 'Travertine tables & convivial atmospheres', img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80' },
    { title: 'Home Office', desc: 'Focused executive spaces & library walls', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80' },
    { title: 'Studio Apartment', desc: 'Multifunctional open-plan zoning', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 lg:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-pale border border-stone-accent/40 text-xs text-charcoal-800">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span className="tracking-wide uppercase text-[10px] font-semibold">
                3D Interior Concept Platform
              </span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-charcoal-950">
              Your Space. <br />
              <span className="italic font-light text-terracotta">Your Vision.</span> <br />
              Thoughtfully Designed.
            </h1>

            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-light">
              Explore room concepts in an interactive 3D showcase, customize real physical materials, save your preferences to MongoDB, and collaborate with verified interior designers through versioned, immutable proposals.
            </p>

            {/* Quick Material Swatch Taster for the Hero 3D Scene */}
            <div className="p-4 rounded-md bg-ivory-50 border border-stone-accent/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-charcoal-800 text-[11px] uppercase tracking-wider">
                  Live Material Customization:
                </span>
                <span className="text-[10px] text-terracotta font-medium">Click to update 3D scene</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-charcoal-700 block mb-1">Flooring</span>
                  <div className="flex space-x-1.5">
                    {materialsList
                      .filter((m) => m.category === 'flooring')
                      .slice(0, 3)
                      .map((m) => (
                        <button
                          key={m._id}
                          onClick={() => handleHeroMaterialSelect('flooring', m)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            heroMaterials.flooring?._id === m._id
                              ? 'border-charcoal-900 scale-110'
                              : 'border-stone-accent hover:scale-105'
                          }`}
                          style={{ backgroundColor: m.hexCode }}
                          title={m.name}
                        />
                      ))}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-charcoal-700 block mb-1">Walls</span>
                  <div className="flex space-x-1.5">
                    {materialsList
                      .filter((m) => m.category === 'walls')
                      .slice(0, 3)
                      .map((m) => (
                        <button
                          key={m._id}
                          onClick={() => handleHeroMaterialSelect('walls', m)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            heroMaterials.walls?._id === m._id
                              ? 'border-charcoal-900 scale-110'
                              : 'border-stone-accent hover:scale-105'
                          }`}
                          style={{ backgroundColor: m.hexCode }}
                          title={m.name}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-charcoal-900 text-ivory-100 hover:bg-charcoal-800 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
              >
                <span>Explore 3D Concepts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/project-brief"
                className="inline-flex items-center space-x-2 px-6 py-3.5 border border-charcoal-900 text-charcoal-900 hover:bg-stone-warm/50 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <span>Submit Project Brief</span>
              </Link>
            </div>
          </div>

          {/* Right 3D Showcase Preview */}
          <div className="lg:col-span-7">
            <div className="relative">
              <RoomCanvas
                selectedMaterials={heroMaterials}
                roomConcept={featuredConcepts[0]}
                fallbackImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-charcoal-700 px-1">
                <span>Interactive Concept: Aura Minimalist Salon</span>
                <Link
                  to={featuredConcepts[0] ? `/concept/${featuredConcepts[0].slug}` : '/catalog'}
                  className="text-terracotta hover:underline font-medium inline-flex items-center space-x-1"
                >
                  <span>Open Full Customizer Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW SPACECRAFT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
            The SpaceCraft Journey
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-charcoal-950 mt-2">
            From Spatial Vision to Executable Proposal
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-3 font-light leading-relaxed">
            Eliminating guesswork with a structured workflow connecting customer inspiration to versioned interior design contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 space-y-3 relative group hover:border-terracotta/40 transition-colors">
            <div className="w-10 h-10 rounded-sm bg-stone-pale flex items-center justify-center text-terracotta">
              <Box className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-semibold text-terracotta uppercase tracking-wider">Step 01</div>
            <h3 className="font-editorial text-lg font-semibold text-charcoal-900">
              Explore 3D Concepts
            </h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Navigate fully articulated interior rooms with real-time multi-angle cameras and architectural lighting.
            </p>
          </div>

          <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 space-y-3 relative group hover:border-terracotta/40 transition-colors">
            <div className="w-10 h-10 rounded-sm bg-stone-pale flex items-center justify-center text-terracotta">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-semibold text-terracotta uppercase tracking-wider">Step 02</div>
            <h3 className="font-editorial text-lg font-semibold text-charcoal-900">
              Customize & Persist
            </h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Swap flooring, walls, joinery, and accents live in Three.js and save your personalized design configuration to MongoDB.
            </p>
          </div>

          <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 space-y-3 relative group hover:border-terracotta/40 transition-colors">
            <div className="w-10 h-10 rounded-sm bg-stone-pale flex items-center justify-center text-terracotta">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-semibold text-terracotta uppercase tracking-wider">Step 03</div>
            <h3 className="font-editorial text-lg font-semibold text-charcoal-900">
              Submit Project Brief
            </h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Attach your saved design, specify room dimensions, timeline, and budget parameters to initiate designer review.
            </p>
          </div>

          <div className="p-6 rounded-md bg-ivory-50 border border-stone-accent/30 space-y-3 relative group hover:border-terracotta/40 transition-colors">
            <div className="w-10 h-10 rounded-sm bg-stone-pale flex items-center justify-center text-terracotta">
              <History className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-semibold text-terracotta uppercase tracking-wider">Step 04</div>
            <h3 className="font-editorial text-lg font-semibold text-charcoal-900">
              Versioned Proposals
            </h3>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Review sequential immutable proposals (v1, v2...), request structured revisions, and approve specific versions.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROOM CONCEPTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-warm">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
              Curated Showcase
            </span>
            <h2 className="font-editorial text-3xl font-normal text-charcoal-950 mt-1">
              Architectural Room Concepts
            </h2>
          </div>
          <Link
            to="/catalog"
            className="mt-3 sm:mt-0 text-xs font-semibold text-charcoal-900 hover:text-terracotta tracking-wider uppercase inline-flex items-center space-x-1"
          >
            <span>View All Concepts ({featuredConcepts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredConcepts.slice(0, 3).map((concept) => (
            <div
              key={concept._id}
              className="group rounded-md overflow-hidden bg-ivory-50 border border-stone-accent/30 shadow-2xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-64 overflow-hidden bg-charcoal-900">
                <img
                  src={concept.coverImage}
                  alt={concept.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-xs bg-ivory-50/95 backdrop-blur-md text-[10px] font-semibold tracking-wider uppercase text-charcoal-900 shadow-xs">
                    {concept.roomType}
                  </span>
                  <span className="px-2 py-1 rounded-xs bg-charcoal-900/80 backdrop-blur-md text-[10px] font-medium text-ivory-100 shadow-xs">
                    {concept.designStyle}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-editorial text-xl font-semibold text-charcoal-900 group-hover:text-terracotta transition-colors">
                    {concept.name}
                  </h3>
                  <p className="text-xs text-charcoal-700 mt-2 line-clamp-2 leading-relaxed">
                    {concept.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-warm flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-700 block uppercase">Est. Budget</span>
                    <span className="font-semibold text-charcoal-900">
                      ${concept.budgetRange?.min?.toLocaleString()} – ${concept.budgetRange?.max?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/concept/${concept.slug}`}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-charcoal-900 text-ivory-100 hover:bg-terracotta rounded-xs text-xs font-medium transition-colors"
                  >
                    <span>Customize 3D</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXPLORE BY ROOM TYPE */}
      <section className="bg-stone-pale py-16 border-y border-stone-warm/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
              Spatial Typologies
            </span>
            <h2 className="font-editorial text-3xl font-normal text-charcoal-950 mt-1">
              Explore by Room Type
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {roomCategories.map((cat) => (
              <Link
                key={cat.title}
                to={`/catalog?roomType=${encodeURIComponent(cat.title)}`}
                className="group relative rounded-md overflow-hidden aspect-4/5 bg-charcoal-900 shadow-2xs hover:shadow-md transition-shadow"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-ivory-100">
                  <h4 className="font-editorial text-sm font-semibold tracking-wide">
                    {cat.title}
                  </h4>
                  <p className="text-[10px] text-stone-warm/70 truncate">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-charcoal-900 text-ivory-100 p-8 sm:p-14 relative overflow-hidden shadow-xl border border-charcoal-800">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-terracotta">
              Start Your Spatial Transformation
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight">
              Ready to bring architectural clarity to your space?
            </h2>
            <p className="text-xs sm:text-sm text-stone-warm/80 font-light leading-relaxed">
              Explore our 3D room showcase, customize your preferred materials, and submit your project requirements to receive a structured proposal.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-terracotta text-ivory-100 hover:bg-terracotta-dark rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <span>Browse Concepts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/project-brief"
                className="inline-flex items-center space-x-2 px-6 py-3.5 border border-stone-warm/40 text-ivory-100 hover:bg-charcoal-800 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                <span>Submit Requirements</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
