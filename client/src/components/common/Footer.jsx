import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-charcoal-900 text-stone-warm/80 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-sm bg-terracotta text-ivory-100 flex items-center justify-center transition-transform group-hover:scale-95 shadow-xs">
                <span className="font-editorial text-lg font-bold">SC</span>
              </div>
              <span className="font-editorial text-2xl font-semibold tracking-tight text-ivory-100 group-hover:text-stone-warm transition-colors">
                SpaceCraft
              </span>
            </Link>
            <p className="text-xs text-stone-warm/60 leading-relaxed">
              An architectural interior design platform uniting 3D spatial exploration, physical material customization, and versioned designer proposals.
            </p>
            <div className="text-[11px] text-stone-warm/40 tracking-widest uppercase">
              End-Term Software Engineering Submission
            </div>
          </div>

          {/* Concepts */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-ivory-100 mb-4">
              Explore Rooms
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/catalog?roomType=Living%20Room" className="hover:text-ivory-100 transition-colors">Living Salons</Link></li>
              <li><Link to="/catalog?roomType=Bedroom" className="hover:text-ivory-100 transition-colors">Bedrooms & Suites</Link></li>
              <li><Link to="/catalog?roomType=Kitchen" className="hover:text-ivory-100 transition-colors">Architectural Kitchens</Link></li>
              <li><Link to="/catalog?roomType=Home%20Office" className="hover:text-ivory-100 transition-colors">Executive Studies</Link></li>
              <li><Link to="/catalog?roomType=Dining%20Room" className="hover:text-ivory-100 transition-colors">Dining Terraces</Link></li>
              <li><Link to="/catalog?roomType=Studio%20Apartment" className="hover:text-ivory-100 transition-colors">Lofts & Studios</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-ivory-100 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/catalog" className="hover:text-ivory-100 transition-colors">3D Room Showcase</Link></li>
              <li><Link to="/saved-designs" className="hover:text-ivory-100 transition-colors">Persistent Designs</Link></li>
              <li><Link to="/project-brief" className="hover:text-ivory-100 transition-colors">Submit Project Brief</Link></li>
              <li><Link to="/client/dashboard" className="hover:text-ivory-100 transition-colors">Proposal Versioning</Link></li>
            </ul>
          </div>

          {/* Architecture Studio */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-ivory-100 mb-4">
              Studio Principles
            </h4>
            <p className="text-xs text-stone-warm/60 leading-relaxed mb-4">
              Every design is grounded in authentic materials: tactile French oak, cast terrazzo, Roman clay mineral pigments, and artisan joinery.
            </p>
            <div className="p-3 rounded-xs bg-charcoal-800/80 border border-charcoal-700/60 text-[11px] text-stone-warm/80">
              <span className="font-semibold text-terracotta block mb-0.5">Built with Real MongoDB Persistence</span>
              Immutable sequential proposal records & ownership isolation.
            </div>
          </div>
        </div>

        <div className="border-t border-charcoal-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-warm/40">
          <p>© {new Date().getFullYear()} SpaceCraft Studio. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for Client & Designer Architectural Collaboration.</p>
        </div>
      </div>
    </footer>
  );
};
