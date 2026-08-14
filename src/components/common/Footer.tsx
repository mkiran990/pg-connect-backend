import React from 'react';
import { Building2, MapPin, Phone, MessageSquare, Mail, Heart } from 'lucide-react';
import { PGInformation } from '../../types';

interface FooterProps {
  pgInfo?: PGInformation;
}

export const Footer: React.FC<FooterProps> = ({ pgInfo }) => {
  const whatsappUrl = `https://wa.me/${pgInfo?.whatsapp_number || '919876543210'}?text=${encodeURIComponent('Hello! I would like to inquire about room availability at PG Connect.')}`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-tealAccent-400 flex items-center justify-center text-white font-bold shadow-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                PG <span className="text-brand-400">Connect</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {pgInfo?.tagline || 'Comfortable Living, Connected Digitally'}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              {pgInfo?.description || 'Premium accommodation equipped with modern amenities, organic food, and digital convenience for effortless PG living.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-brand-400 transition-colors">About Our PG</a></li>
              <li><a href="#rooms" className="hover:text-brand-400 transition-colors">Room Details & Availability</a></li>
              <li><a href="#menu" className="hover:text-brand-400 transition-colors">Weekly Food Menu</a></li>
              <li><a href="#facilities" className="hover:text-brand-400 transition-colors">PG Amenities & Facilities</a></li>
              <li><a href="/login" className="hover:text-brand-400 transition-colors">Resident & Owner Login</a></li>
            </ul>
          </div>

          {/* Address & Location */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Location & Address</h4>
            <div className="flex items-start space-x-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <span>{pgInfo?.address || '124, Sunrise Avenue, Koramangala, Bengaluru'}</span>
            </div>
            {pgInfo?.google_maps_link && (
              <a
                href={pgInfo.google_maps_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-tealAccent-400 hover:text-tealAccent-300 underline font-medium"
              >
                <span>View on Google Maps</span>
              </a>
            )}
          </div>

          {/* Owner & Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-base">Contact Owner</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="text-white font-medium">{pgInfo?.owner_name || 'Mr. Rajesh Verma'}</p>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>{pgInfo?.mobile_number || '+91 98765 43210'}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PG Connect. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Built for seamless PG management with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
