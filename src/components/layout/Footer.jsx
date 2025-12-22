import React from 'react';
import { Leaf, Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-sage-600 p-2 rounded-lg group-hover:bg-sage-500 transition-colors">
                                <Leaf className="text-white h-6 w-6" />
                            </div>
                            <span className="text-2xl font-display font-bold text-white">Farm2Fork</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Empowering agriculture with blockchain transparency. Connecting farmers directly to consumers for a sustainable future.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Platform</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="hover:text-sage-400 transition-colors">About Us</Link></li>
                            <li><Link to="/features" className="hover:text-sage-400 transition-colors">Features</Link></li>
                            <li><Link to="/traceability" className="hover:text-sage-400 transition-colors">Traceability Network</Link></li>
                            <li><Link to="/pricing" className="hover:text-sage-400 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/help" className="hover:text-sage-400 transition-colors">Help Center</Link></li>
                            <li><Link to="/docs" className="hover:text-sage-400 transition-colors">Documentation</Link></li>
                            <li><Link to="/contact" className="hover:text-sage-400 transition-colors">Contact Us</Link></li>
                            <li><Link to="/legal" className="hover:text-sage-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-sage-500 shrink-0 mt-0.5" />
                                <span>123 AgriTech Park, Innovation Valley, AP 522503</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-sage-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-sage-500 shrink-0" />
                                <span>support@farm2fork.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Farm2Fork Technologies. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sage-600 hover:text-white transition-all">
                            <Twitter size={18} />
                        </a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sage-600 hover:text-white transition-all">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sage-600 hover:text-white transition-all">
                            <Instagram size={18} />
                        </a>
                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sage-600 hover:text-white transition-all">
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
