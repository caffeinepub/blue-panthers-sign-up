import { MapPin } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            {/* Hero Banner Image */}
            <div className="relative w-full" style={{ minHeight: '340px' }}>
                <img
                    src="/assets/generated/hero-banner.dim_1200x400.png"
                    alt="Blue Panthers Hero Banner"
                    className="w-full object-cover object-center"
                    style={{ maxHeight: '400px', minHeight: '280px' }}
                />
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24">
                    <div className="max-w-2xl animate-fade-in-up">
                        <div className="inline-block bg-gold-500/20 border border-gold-500/40 rounded px-3 py-1 mb-4">
                            <span className="font-display text-xs font-bold tracking-[0.3em] text-gold-400 uppercase">
                                Now Recruiting
                            </span>
                        </div>
                        <h1 className="font-display text-5xl md:text-7xl font-black text-foreground leading-none mb-3">
                            BLUE{' '}
                            <span className="text-gold-400">PANTHERS</span>
                        </h1>
                        <p className="font-display text-xl md:text-2xl font-bold text-foreground/80 tracking-wide uppercase mb-3">
                            Join the Pack. Dominate the Court.
                        </p>
                        {/* Location */}
                        <div className="flex items-center gap-1.5 mb-4">
                            <MapPin className="h-4 w-4 text-gold-400 flex-shrink-0" />
                            <span className="font-body text-sm font-semibold text-gold-300 tracking-wide uppercase">
                                Jackman, Maine 04945
                            </span>
                        </div>
                        <p className="font-body text-base text-foreground/60 max-w-md leading-relaxed">
                            We're looking for passionate players ready to compete at the highest level.
                            Sign up below and become part of our championship-driven family.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats / Positions bar */}
            <div className="bg-gold-500 py-3">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                        <div className="flex items-center gap-2">
                            <span className="font-display text-xl font-black text-navy-900 leading-none">2026</span>
                            <span className="font-body text-xs font-semibold text-navy-800/70 uppercase tracking-widest">Season</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-display text-xl font-black text-navy-900 leading-none">Premier</span>
                            <span className="font-body text-xs font-semibold text-navy-800/70 uppercase tracking-widest">League</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-6 bg-navy-900/20" />

                        {/* Open positions */}
                        <div className="flex items-center gap-2">
                            <span className="font-display text-xl font-black text-navy-900 leading-none">Forward</span>
                            <span className="font-body text-xs font-semibold text-navy-800/70 uppercase tracking-widest">Open</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-display text-xl font-black text-navy-900 leading-none">Center</span>
                            <span className="font-body text-xs font-semibold text-navy-800/70 uppercase tracking-widest">Open</span>
                        </div>

                        {/* Guard — unavailable */}
                        <div className="flex items-center gap-2 opacity-60">
                            <span className="font-display text-xl font-black text-navy-900 leading-none line-through decoration-navy-900/60">
                                Guard
                            </span>
                            <span className="font-body text-xs font-bold text-navy-900 uppercase tracking-widest bg-navy-900/20 px-1.5 py-0.5 rounded">
                                Unavailable
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
