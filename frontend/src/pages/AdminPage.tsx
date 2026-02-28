import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllSignUps, useIsCallerAdmin } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { ExperienceLevel, Position, type SignUp } from '../backend';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { LogIn, LogOut, Users, Loader2, ShieldAlert, RefreshCw, ShieldCheck } from 'lucide-react';

function positionLabel(p: Position): string {
    switch (p) {
        case Position.guard: return 'Guard';
        case Position.forward: return 'Forward';
        case Position.center: return 'Center';
        default: return String(p);
    }
}

function experienceLabel(e: ExperienceLevel): string {
    switch (e) {
        case ExperienceLevel.beginner: return 'Beginner';
        case ExperienceLevel.intermediate: return 'Intermediate';
        case ExperienceLevel.advanced: return 'Advanced';
        default: return String(e);
    }
}

function experienceBadgeClass(e: ExperienceLevel): string {
    switch (e) {
        case ExperienceLevel.beginner: return 'bg-navy-700 text-foreground border-navy-600';
        case ExperienceLevel.intermediate: return 'bg-gold-700/30 text-gold-300 border-gold-600/40';
        case ExperienceLevel.advanced: return 'bg-gold-500/20 text-gold-400 border-gold-500/50';
        default: return '';
    }
}

function positionBadgeClass(p: Position): string {
    switch (p) {
        case Position.guard: return 'bg-navy-700/80 text-gold-300 border-navy-600';
        case Position.forward: return 'bg-navy-800/80 text-gold-400 border-navy-700';
        case Position.center: return 'bg-navy-900/80 text-gold-500 border-navy-800';
        default: return '';
    }
}

function SignUpsTable({ signUps }: { signUps: SignUp[] }) {
    if (signUps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="h-16 w-16 text-gold-500/30 mb-4" />
                <h3 className="font-display text-2xl font-black text-foreground/50 tracking-widest mb-2">
                    NO SIGN-UPS YET
                </h3>
                <p className="font-body text-muted-foreground text-sm max-w-xs">
                    When players register their interest, they'll appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-sm border border-gold-700/20">
            <Table>
                <TableHeader>
                    <TableRow className="bg-navy-800 border-b border-gold-700/20 hover:bg-navy-800">
                        <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400 w-8">#</TableHead>
                        <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">Name</TableHead>
                        <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">Email</TableHead>
                        <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">Phone</TableHead>
                        <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400 text-center">Age</TableHead>
                        <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">Position</TableHead>
                        <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">Experience</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {signUps.map((s, idx) => (
                        <TableRow
                            key={String(s.id)}
                            className="border-b border-gold-700/10 hover:bg-navy-800/60 transition-colors"
                        >
                            <TableCell className="font-body text-muted-foreground text-sm">{idx + 1}</TableCell>
                            <TableCell className="font-body font-semibold text-foreground">{s.name}</TableCell>
                            <TableCell className="font-body text-foreground/80 text-sm">{s.email}</TableCell>
                            <TableCell className="font-body text-foreground/80 text-sm">{s.phone}</TableCell>
                            <TableCell className="font-body text-foreground/80 text-sm text-center">{String(s.age)}</TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={`font-display text-xs font-bold tracking-wider uppercase ${positionBadgeClass(s.position)}`}
                                >
                                    {positionLabel(s.position)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={`font-display text-xs font-bold tracking-wider uppercase ${experienceBadgeClass(s.experienceLevel)}`}
                                >
                                    {experienceLabel(s.experienceLevel)}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-navy-800/60 rounded-sm" />
            ))}
        </div>
    );
}

export default function AdminPage() {
    const { login, clear, loginStatus, identity } = useInternetIdentity();
    const queryClient = useQueryClient();
    const isAuthenticated = !!identity;
    const isLoggingIn = loginStatus === 'logging-in';

    const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
    const { data: signUps, isLoading, isError, error, refetch, isFetching } = useGetAllSignUps();

    const handleLogin = async () => {
        try {
            await login();
        } catch (err: unknown) {
            const e = err as Error;
            if (e?.message === 'User is already authenticated') {
                await clear();
                setTimeout(() => login(), 300);
            }
        }
    };

    const handleLogout = async () => {
        await clear();
        queryClient.clear();
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Page Header */}
            <div className="bg-navy-900 border-b border-gold-700/30">
                <div className="container mx-auto px-4 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/generated/team-logo.dim_256x256.png"
                            alt="Blue Panthers Logo"
                            className="h-10 w-10 object-contain rounded-full border-2 border-gold-500/60"
                        />
                        <div>
                            <span className="font-display text-xl font-black text-gold-400 tracking-widest leading-none block">
                                ADMIN DASHBOARD
                            </span>
                            <span className="font-body text-xs text-foreground/50 tracking-widest uppercase">
                                Blue Panthers · Sign-Up Registry
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href="/"
                            className="font-display text-xs font-bold tracking-widest uppercase text-foreground/50 hover:text-gold-400 transition-colors hidden sm:block"
                        >
                            ← Back to Site
                        </a>
                        {isAuthenticated && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="border-gold-700/40 text-foreground/70 hover:text-foreground hover:border-gold-500 font-display text-xs tracking-widest uppercase"
                            >
                                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                                Logout
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12 max-w-6xl">
                {!isAuthenticated ? (
                    /* Login Gate */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-navy-800/60 border border-gold-700/20 rounded-sm p-10 max-w-md w-full shadow-gold">
                            <ShieldCheck className="h-14 w-14 text-gold-500/60 mx-auto mb-5" />
                            <h2 className="font-display text-3xl font-black text-foreground tracking-widest mb-3">
                                ADMIN ACCESS
                            </h2>
                            <p className="font-body text-muted-foreground text-sm mb-8 leading-relaxed">
                                This page is restricted to Blue Panthers admins. Sign in with your identity to view all player sign-ups.
                            </p>
                            <Button
                                onClick={handleLogin}
                                disabled={isLoggingIn}
                                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-display text-sm font-black tracking-widest uppercase py-5 rounded-sm shadow-gold transition-all duration-200 disabled:opacity-60"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-4 w-4 mr-2" />
                                        Sign In
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : isAdminLoading ? (
                    /* Checking admin status */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <Loader2 className="h-10 w-10 text-gold-500/60 animate-spin mb-4" />
                        <p className="font-display text-sm font-bold tracking-widest uppercase text-foreground/50">
                            Verifying Access...
                        </p>
                    </div>
                ) : !isAdmin ? (
                    /* Access Denied */
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="bg-navy-800/60 border border-destructive/30 rounded-sm p-10 max-w-md w-full">
                            <ShieldAlert className="h-14 w-14 text-destructive/60 mx-auto mb-5" />
                            <h2 className="font-display text-3xl font-black text-foreground tracking-widest mb-3">
                                ACCESS DENIED
                            </h2>
                            <p className="font-body text-muted-foreground text-sm mb-8 leading-relaxed">
                                Your account does not have admin privileges. Contact the team owner to request access.
                            </p>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="border-gold-700/40 text-foreground/70 hover:text-foreground hover:border-gold-500 font-display text-xs tracking-widest uppercase"
                            >
                                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                                Sign Out
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Admin Dashboard Content */
                    <div>
                        {/* Stats bar */}
                        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                            <div>
                                <h1 className="font-display text-3xl md:text-4xl font-black text-foreground tracking-widest">
                                    PLAYER <span className="text-gold-400">SIGN-UPS</span>
                                </h1>
                                {!isLoading && !isError && (
                                    <p className="font-body text-muted-foreground text-sm mt-1">
                                        {signUps?.length ?? 0} registration{(signUps?.length ?? 0) !== 1 ? 's' : ''} received
                                    </p>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="border-gold-700/40 text-foreground/70 hover:text-foreground hover:border-gold-500 font-display text-xs tracking-widest uppercase"
                            >
                                {isFetching ? (
                                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                )}
                                Refresh
                            </Button>
                        </div>

                        {/* Position summary cards */}
                        {!isLoading && !isError && signUps && signUps.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[Position.guard, Position.forward, Position.center].map((pos) => {
                                    const count = signUps.filter(s => s.position === pos).length;
                                    return (
                                        <div
                                            key={pos}
                                            className="bg-navy-800/60 border border-gold-700/20 rounded-sm p-4 text-center"
                                        >
                                            <p className="font-display text-2xl font-black text-gold-400">{count}</p>
                                            <p className="font-display text-xs font-bold tracking-widest uppercase text-foreground/60 mt-1">
                                                {positionLabel(pos)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Error state */}
                        {isError && (
                            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-sm p-4 mb-6">
                                <ShieldAlert className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-display text-sm font-bold tracking-wide text-destructive uppercase mb-1">
                                        Error Loading Data
                                    </p>
                                    <p className="font-body text-sm text-destructive/80">
                                        {error instanceof Error
                                            ? error.message
                                            : 'Unable to load sign-ups. Please try refreshing.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Loading state */}
                        {isLoading && <TableSkeleton />}

                        {/* Data table */}
                        {!isLoading && !isError && signUps && (
                            <SignUpsTable signUps={signUps} />
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-navy-900 border-t border-gold-700/20 py-6 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted-foreground/60 text-xs">
                        © {new Date().getFullYear()} Blue Panthers Basketball Club ·{' '}
                        <a
                            href="/"
                            className="text-gold-500/60 hover:text-gold-400 transition-colors"
                        >
                            Back to Sign-Up Page
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
