import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

// IMPORT YOUR LOGO IMAGE
import logo from '../assets/images/flashpointlogo.png';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white py-24 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            {/* LOGO SECTION */}
            <div className="flex items-center mb-8">
              <img
                src={logo}
                alt="Flashpoint Logo"
                className="h-12 w-auto object-contain"
              />
            </div>

            <p className="text-slate-500 leading-relaxed mb-8 font-medium">
              Uganda's premier security carrier. We specialize in the safe, secure, and rapid delivery of high-value items and elite packages nationwide.
            </p>

            <div className="flex gap-4">
              {[Twitter, Linkedin, Instagram, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-brand-yellow hover:text-brand-black transition-all group">
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-brand-yellow">Elite Services</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Security Escort Delivery</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Express Intra-City</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nationwide Logistics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cash-in-Transit</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-brand-yellow">Contact HQ</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-brand-yellow" />
                Plot 45, Kampala Road, Uganda
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-yellow" />
                +256 414 123 456
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-yellow" />
                info@flashpoint.ug
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-8 text-brand-yellow">Quick Access</h4>
            <ul className="space-y-4 text-slate-500 font-medium">
              <li><Link to="/pricing" className="hover:text-white transition-colors">Rate Card</Link></li>
              <li><Link to="/track/FP-UG-100200" className="hover:text-white transition-colors">Track Package</Link></li>
              <li><Link to="/portal" className="hover:text-white transition-colors">Client Portal</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Support Center</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-wrap justify-between items-center gap-4 text-slate-600 text-[10px] font-black uppercase tracking-widest">
          <p>© 2024 Flashpoint Delivery Uganda. Elite Security Protocols Active.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
