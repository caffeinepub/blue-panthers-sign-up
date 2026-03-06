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
import {
  Loader2,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { ExperienceLevel, Position, type SignUp } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetAllSignUps, useIsCallerAdmin } from "../hooks/useQueries";

const POSITION_CAPACITY = 3;

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

const ALL_POSITIONS: Position[] = [
  Position.pointGuard,
  Position.shootingGuard,
  Position.smallForward,
  Position.powerForward,
  Position.center,
];

function PositionSummaryCards({ signUps }: { signUps: SignUp[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      {ALL_POSITIONS.map((pos) => {
        const count = signUps.filter((s) => s.position === pos).length;
        const isFull = count >= POSITION_CAPACITY;
        return (
          <div
            key={pos}
            className="bg-navy-800 border border-gold-700/20 rounded-sm p-3 flex flex-col gap-1"
          >
            <span className="font-display text-xs font-bold tracking-widest uppercase text-gold-400 leading-tight">
              {positionLabel(pos)}
            </span>
            <div className="flex items-end gap-1 mt-1">
              <span className="font-display text-2xl font-black text-foreground leading-none">
                {count}
              </span>
              <span className="font-body text-xs text-muted-foreground mb-0.5">
                / {POSITION_CAPACITY}
              </span>
            </div>
            <span
              className={`font-body text-xs font-bold uppercase tracking-wider mt-0.5 ${
                isFull ? "text-gold-500" : "text-foreground/40"
              }`}
            >
              {isFull ? "Full" : "Open"}
            </span>
          </div>
        );
      })}
    </div>
  );
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

export default function AdminPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
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
                className="border-gold-700/40 text-foreground/70 hover:text-foreground hover:border-gold-500/60 font-display text-xs tracking-widest uppercase"
              >
                <LogOut className="h-3.5 w-3.5 mr-1.5" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Not authenticated */}
        {!isAuthenticated && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-navy-800 border-2 border-gold-500/30">
              <ShieldAlert className="h-10 w-10 text-gold-400/60" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-black text-foreground tracking-widest mb-2">
                ADMIN ACCESS REQUIRED
              </h2>
              <p className="font-body text-muted-foreground text-sm max-w-xs">
                Please log in to access the admin dashboard.
              </p>
            </div>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="bg-gold-500 hover:bg-gold-400 text-navy-900 font-display font-black tracking-widest uppercase px-8"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Logging
                  in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </>
              )}
            </Button>
          </div>
        )}

        {/* Authenticated but not admin */}
        {isAuthenticated && !isAdminLoading && isAdmin === false && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-navy-800 border-2 border-gold-500/30">
              <ShieldAlert className="h-10 w-10 text-gold-400/60" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-black text-foreground tracking-widest mb-2">
                ACCESS DENIED
              </h2>
              <p className="font-body text-muted-foreground text-sm max-w-xs">
                You do not have admin privileges to view this page.
              </p>
            </div>
          </div>
        )}

        {/* Admin content */}
        {isAuthenticated && (isAdminLoading || isAdmin) && (
          <>
            {/* Admin verified badge */}
            {isAdmin && (
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="h-4 w-4 text-gold-400" />
                <span className="font-display text-xs font-bold tracking-widest uppercase text-gold-400">
                  Admin Verified
                </span>
              </div>
            )}

            {/* Position Summary Cards */}
            {signUps && <PositionSummaryCards signUps={signUps} />}

            {/* Table header row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-2xl font-black text-foreground tracking-widest uppercase leading-none">
                  All Sign-Ups
                </h2>
                {signUps && (
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    {signUps.length} player{signUps.length !== 1 ? "s" : ""}{" "}
                    registered · {POSITION_CAPACITY} slots per position
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
              <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-sm px-4 py-3 mb-4">
                <ShieldAlert className="h-4 w-4 text-destructive flex-shrink-0" />
                <p className="font-body text-sm text-destructive">
                  {(error as Error)?.message?.includes("Unauthorized")
                    ? "You are not authorized to view sign-ups."
                    : "Failed to load sign-ups. Please try refreshing."}
                </p>
              </div>
            )}

            {/* Loading / Table */}
            {isLoading ? (
              <TableSkeleton />
            ) : signUps ? (
              <SignUpsTable signUps={signUps} />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
