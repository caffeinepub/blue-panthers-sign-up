import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock, LogIn, LogOut, RefreshCw, Users } from "lucide-react";
import { ExperienceLevel, Position, type SignUp } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllSignUps } from "../hooks/useQueries";

function positionLabel(p: Position): string {
  switch (p) {
    case Position.pointGuard:
      return "Point Guard";
    case Position.shootingGuard:
      return "Shooting Guard";
    case Position.smallForward:
      return "Small Forward";
    case Position.powerForward:
      return "Power Forward";
    case Position.center:
      return "Center";
    default:
      return String(p);
  }
}

function experienceLabel(e: ExperienceLevel): string {
  switch (e) {
    case ExperienceLevel.beginner:
      return "Beginner";
    case ExperienceLevel.intermediate:
      return "Intermediate";
    case ExperienceLevel.advanced:
      return "Advanced";
    default:
      return String(e);
  }
}

function experienceBadgeClass(e: ExperienceLevel): string {
  switch (e) {
    case ExperienceLevel.beginner:
      return "bg-navy-700 text-foreground border-navy-600";
    case ExperienceLevel.intermediate:
      return "bg-gold-700/30 text-gold-300 border-gold-600/40";
    case ExperienceLevel.advanced:
      return "bg-gold-500/20 text-gold-400 border-gold-500/50";
    default:
      return "";
  }
}

function positionBadgeClass(p: Position): string {
  switch (p) {
    case Position.pointGuard:
      return "bg-navy-700/80 text-gold-300 border-navy-600";
    case Position.shootingGuard:
      return "bg-navy-700/60 text-gold-300 border-navy-600";
    case Position.smallForward:
      return "bg-navy-800/80 text-gold-400 border-navy-700";
    case Position.powerForward:
      return "bg-navy-800/60 text-gold-400 border-navy-700";
    case Position.center:
      return "bg-navy-900/80 text-gold-500 border-navy-800";
    default:
      return "";
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
            <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400 w-8">
              #
            </TableHead>
            <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">
              Name
            </TableHead>
            <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">
              Email
            </TableHead>
            <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">
              Phone
            </TableHead>
            <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400 text-center">
              Age
            </TableHead>
            <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">
              Position
            </TableHead>
            <TableHead className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">
              Experience
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signUps.map((s, idx) => (
            <TableRow
              key={String(s.id)}
              className="border-b border-gold-700/10 hover:bg-navy-800/60 transition-colors"
            >
              <TableCell className="font-body text-muted-foreground text-sm">
                {idx + 1}
              </TableCell>
              <TableCell className="font-body font-semibold text-foreground">
                {s.name}
              </TableCell>
              <TableCell className="font-body text-foreground/80 text-sm">
                {s.email}
              </TableCell>
              <TableCell className="font-body text-foreground/80 text-sm">
                {s.phone}
              </TableCell>
              <TableCell className="font-body text-foreground/80 text-sm text-center">
                {String(s.age)}
              </TableCell>
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

const SKELETON_KEYS = ["a", "b", "c", "d", "e"];

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {SKELETON_KEYS.map((k) => (
        <Skeleton key={k} className="h-12 w-full bg-navy-800/60 rounded-sm" />
      ))}
    </div>
  );
}

export default function SignUpsPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const {
    data: signUps,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAllSignUps();

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: unknown) {
      const e = err as Error;
      if (e?.message === "User is already authenticated") {
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
                SIGN-UPS
              </span>
              <span className="font-body text-xs text-foreground/50 tracking-widest uppercase">
                Blue Panthers · Player Registry
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
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-gold-700/40 text-foreground/70 hover:text-foreground hover:border-gold-500/60 font-display text-xs tracking-widest uppercase"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-display text-xs font-black tracking-widest uppercase"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-3.5 w-3.5 mr-1.5" />
                    Sign In
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {!isAuthenticated ? (
          /* Login prompt */
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-navy-800 border-2 border-gold-500/30">
              <Lock className="h-10 w-10 text-gold-400/60" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-black text-foreground tracking-widest mb-2">
                SIGN IN TO VIEW
              </h2>
              <p className="font-body text-muted-foreground text-sm max-w-xs">
                You must be signed in to view the player sign-up list.
              </p>
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-display font-black tracking-widest uppercase px-8"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Authenticated content */
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-black text-foreground tracking-widest">
                  PLAYER <span className="text-gold-400">SIGN-UPS</span>
                </h1>
                {!isLoading && !isError && (
                  <p className="font-body text-muted-foreground text-sm mt-1">
                    {signUps?.length ?? 0} registration
                    {(signUps?.length ?? 0) !== 1 ? "s" : ""} received
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="border-gold-700/40 text-foreground/70 hover:text-foreground hover:border-gold-500/60 font-display text-xs tracking-widest uppercase"
              >
                {isFetching ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                <span className="ml-1.5">Refresh</span>
              </Button>
            </div>

            {/* Error state */}
            {isError && (
              <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-sm p-4 mb-6">
                <Lock className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                <p className="font-body text-sm text-destructive">
                  {error instanceof Error
                    ? error.message
                    : "Failed to load sign-ups. Please try refreshing."}
                </p>
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
            © {new Date().getFullYear()} Blue Panthers Basketball Club ·{" "}
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
