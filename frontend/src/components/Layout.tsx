import React from 'react';
import { MapPin } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="bg-navy-900 border-b border-gold-700/30 sticky top-0 z-50 shadow-lg">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/generated/team-logo.dim_256x256.png"
                            alt="Blue Panthers Logo"
                            className="h-12 w-12 object-contain rounded-full border-2 border-gold-500/60"
                        />
                        <div>
                            <span className="font-display text-2xl font-black text-gold-400 tracking-widest leading-none block">
                                BLUE PANTHERS
                            </span>
                            <span className="font-body text-xs text-foreground/50 tracking-widest uppercase">
                                Basketball Club
                            </span>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a
                            href="#signup"
                            className="font-display text-sm font-bold tracking-widest uppercase text-foreground/70 hover:text-gold-400 transition-colors"
                        >
                            Join the Team
                        </a>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="bg-navy-900 border-t border-gold-700/20 py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <img
                            src="/assets/generated/team-logo.dim_256x256.png"
                            alt="Blue Panthers"
                            className="h-8 w-8 object-contain opacity-70"
                        />
                        <span className="font-display text-lg font-black text-gold-500/70 tracking-widest">
                            BLUE PANTHERS
                        </span>
                    </div>
                    {/* Location */}
                    <div className="flex items-center justify-center gap-1.5 mb-3">
                        <MapPin className="h-3.5 w-3.5 text-gold-500/70 flex-shrink-0" />
                        <span className="font-body text-sm text-gold-500/70 tracking-wide uppercase font-semibold">
                            Jackman, Maine 04945
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                        © {new Date().getFullYear()} Blue Panthers Basketball Club. All rights reserved.
                    </p>
                    <p className="text-muted-foreground/60 text-xs mb-3">
                        Built with{' '}
                        <span className="text-gold-500">♥</span>
                        {' '}using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'blue-panthers-signup')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold-400 hover:text-gold-300 transition-colors underline underline-offset-2"
                        >
                            caffeine.ai
                        </a>
                    </p>
                    {/* Subtle owner link */}
                    <a
                        href="/owner"
                        className="text-foreground/20 hover:text-foreground/40 transition-colors text-xs font-body"
                        aria-label="Owner dashboard"
                    >
                        ·
                    </a>
                </div>
            </footer>
        </div>
    );
}
