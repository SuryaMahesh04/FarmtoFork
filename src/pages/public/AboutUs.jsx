import React from 'react';
import { motion } from 'framer-motion';
import { Users, Code, PenTool, Database, CheckSquare, Shield, Globe, Award, Github, Linkedin, Mail } from 'lucide-react';
import LightPageLayout from '../../components/layout/LightPageLayout';
import SpotlightCard from '../../components/ui/core/SpotlightCard';
import RollingNumber from '../../components/ui/core/RollingNumber';

const AboutUs = () => {
    const team = [
        {
            name: "Surya Mahesh",
            role: "Lead Developer & Project Architect",
            icon: <Code size={20} />,
            color: "emerald",
            bio: "Driving the technical vision and full-stack development of Farm2Fork. Specializes in MERN architecture, cryptographic security, and end-to-end system integration.",
            contributions: [
                "Full-stack architecture design",
                "Cryptographic integrity engine",
                "Role-based dashboard development",
                "QR Code traceability system"
            ]
        },
        {
            name: "Sharmitha",
            role: "UI/UX Designer & Frontend Developer",
            icon: <PenTool size={20} />,
            color: "violet",
            bio: "Crafting the visual identity and user experience of the platform. Focused on creating intuitive, responsive interfaces for farmers and consumers alike.",
            contributions: [
                "Mobile-responsive UI/UX design",
                "Consumer traceability interface",
                "Core component library development"
            ]
        },
        {
            name: "Adithya",
            role: "Database Designer & Backend Support",
            icon: <Database size={20} />,
            color: "sky",
            bio: "Ensuring data integrity and efficient storage. Managed the complex MongoDB schema design required for tracking agricultural batches across multiple stakeholders.",
            contributions: [
                "MongoDB schema design",
                "Data modeling for supply chains",
                "Backend API integration"
            ]
        },
        {
            name: "Praneep",
            role: "QA Engineer & Documentation Lead",
            icon: <CheckSquare size={20} />,
            color: "emerald",
            bio: "Focused on system reliability and clear communication. Led the rigorous testing phase and produced the comprehensive project documentation.",
            contributions: [
                "System integration testing & QA",
                "Technical project report",
                "Evaluation and demo preparation"
            ]
        },
        {
            name: "Laharika",
            role: "Research & QA Specialist",
            icon: <Award size={20} />,
            color: "violet",
            bio: "Conducting critical domain research on agricultural standards and collaborating on system-wide validation to ensure the platform meets real-world needs.",
            contributions: [
                "Domain and regulatory research",
                "System validation",
                "Technical documentation support"
            ]
        }
    ];

    const accentClasses = {
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        violet: 'text-violet-600 bg-violet-50 border-violet-100',
        sky: 'text-sky-600 bg-sky-50 border-sky-100',
        rose: 'text-rose-600 bg-rose-50 border-rose-100'
    };

    return (
        <LightPageLayout 
            title="The Minds Behind Farm2Fork"
            subtitle="Meet the team of developers and researchers building the future of transparent agricultural supply chains in India."
            icon={<Users />}
            accentColor="emerald"
        >
            {/* Quick Stats with Rolling Numbers */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                {[
                    { label: 'Core Developers', value: '5' },
                    { label: 'System Roles', value: '6' },
                    { label: 'Security Protocols', value: '12' },
                    { label: 'Tests Passed', value: '117', suffix: '+' }
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center">
                        <div className="text-4xl font-black text-slate-900 mb-2 flex items-center justify-center">
                            <RollingNumber value={stat.value} />
                            {stat.suffix && <span>{stat.suffix}</span>}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Founders Grid */}
            <div className="space-y-24">
                <section>
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px bg-slate-200 flex-1" />
                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Project Leadership</h2>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member, idx) => (
                            <SpotlightCard 
                                key={idx} 
                                className={`group ${idx === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                                spotlightColor={member.color === 'emerald' ? 'rgba(16, 185, 129, 0.1)' : member.color === 'violet' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(14, 165, 233, 0.1)'}
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`p-4 rounded-2xl border ${accentClasses[member.color]}`}>
                                            {member.icon}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Github size={18}/></button>
                                            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Linkedin size={18}/></button>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{member.name}</h3>
                                    <p className={`text-xs font-black uppercase tracking-widest mb-6 ${member.color === 'emerald' ? 'text-emerald-600' : member.color === 'violet' ? 'text-violet-600' : 'text-sky-600'}`}>
                                        {member.role}
                                    </p>
                                    
                                    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                                        {member.bio}
                                    </p>

                                    <div className="pt-6 border-t border-slate-100 space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Focus Areas</p>
                                        <div className="flex flex-wrap gap-2">
                                            {member.contributions.map((tag, i) => (
                                                <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </section>

                {/* Mission Callout */}
                <section className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/40 blur-[100px] -ml-32 -mb-32" />
                    
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest mb-8">
                            The Vision
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight tracking-tight">
                            "Bridging the trust gap between India's <span className="text-emerald-200 underline decoration-emerald-400/50 underline-offset-8">farmers and consumers</span> through cryptographic sovereignty."
                        </h2>
                        <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-emerald-100/80">
                            <span className="flex items-center gap-2">Verifiable Origin <Shield size={16}/></span>
                            <span className="h-4 w-px bg-white/20 hidden md:block" />
                            <span className="flex items-center gap-2">Fair Value <Award size={16}/></span>
                            <span className="h-4 w-px bg-white/20 hidden md:block" />
                            <span className="flex items-center gap-2">Radical Transparency <Globe size={16}/></span>
                        </div>
                    </div>
                </section>
            </div>
        </LightPageLayout>
    );
};

export default AboutUs;
