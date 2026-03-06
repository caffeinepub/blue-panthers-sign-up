import { useState } from 'react';
import { CheckCircle2, Users, AlertCircle, Loader2, ShieldOff } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Position, ExperienceLevel } from '../backend';
import { useSubmitSignUp, useGetRemainingSlots, TOTAL_TEAM_SLOTS } from '../hooks/useQueries';
import type { SignUpFormData } from '../hooks/useQueries';

const POSITION_OPTIONS: { value: Position; label: string }[] = [
    { value: Position.pointGuard, label: 'Point Guard' },
    { value: Position.shootingGuard, label: 'Shooting Guard' },
    { value: Position.smallForward, label: 'Small Forward' },
    { value: Position.powerForward, label: 'Power Forward' },
    { value: Position.center, label: 'Center' },
];

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string }[] = [
    { value: ExperienceLevel.beginner, label: 'Beginner' },
    { value: ExperienceLevel.intermediate, label: 'Intermediate' },
    { value: ExperienceLevel.advanced, label: 'Advanced' },
];

const EMPTY_FORM: SignUpFormData = {
    name: '',
    email: '',
    phone: '',
    age: '',
    position: '' as Position,
    experienceLevel: '' as ExperienceLevel,
};

export default function SignUpPage() {
    const [form, setForm] = useState<SignUpFormData>(EMPTY_FORM);
    const [submitted, setSubmitted] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { data: remainingSlots, isLoading: slotsLoading } = useGetRemainingSlots();
    const submitSignUp = useSubmitSignUp();

    // remainingSlots === -1 means we couldn't fetch (anonymous), treat as open
    const slotsKnown = remainingSlots !== undefined && remainingSlots !== -1;
    const isFull = slotsKnown && remainingSlots === 0;
    const displaySlots = slotsKnown ? remainingSlots : null;

    const handleChange = (field: keyof SignUpFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrorMsg(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!form.name.trim()) return setErrorMsg('Please enter your name.');
        if (!form.email.trim()) return setErrorMsg('Please enter your email.');
        if (!form.phone.trim()) return setErrorMsg('Please enter your phone number.');
        const age = parseInt(form.age, 10);
        if (isNaN(age) || age < 10 || age > 99) return setErrorMsg('Please enter a valid age (10–99).');
        if (!form.position) return setErrorMsg('Please select a position.');
        if (!form.experienceLevel) return setErrorMsg('Please select your experience level.');

        try {
            await submitSignUp.mutateAsync(form);
            setSubmitted(true);
            setForm(EMPTY_FORM);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (msg.includes('maximum capacity') || msg.includes('No slots remaining')) {
                setErrorMsg('Sorry, all 3 team slots have been filled. Registration is now closed.');
            } else {
                setErrorMsg(msg || 'Something went wrong. Please try again.');
            }
        }
    };

    return (
        <>
            <HeroSection />

            <section id="signup" className="py-16 px-4">
                <div className="container mx-auto max-w-2xl">

                    {/* Success State */}
                    {submitted ? (
                        <div className="flex flex-col items-center text-center gap-6 animate-fade-in-up">
                            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-navy-800 border-2 border-gold-500/40 shadow-gold">
                                <CheckCircle2 className="h-12 w-12 text-gold-400" />
                            </div>
                            <div>
                                <h2 className="font-display text-5xl md:text-6xl font-black text-foreground mb-3 leading-none">
                                    YOU'RE <span className="text-gold-400">IN!</span>
                                </h2>
                                <p className="font-display text-xl font-bold text-foreground/60 uppercase tracking-widest">
                                    Sign-up received
                                </p>
                            </div>
                            <div className="w-16 h-1 bg-gold-500 rounded-full" />
                            <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-gold text-left">
                                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                    Welcome to the Blue Panthers family! Your tryout registration has been received. We'll be in touch with details about practice schedules and next steps. See you on the court! 🏀
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                className="border-gold-500/40 text-gold-400 hover:bg-gold-500/10 font-display font-black uppercase tracking-widest"
                                onClick={() => setSubmitted(false)}
                            >
                                Submit Another
                            </Button>
                        </div>
                    ) : isFull ? (
                        /* Team Full State */
                        <div className="flex flex-col items-center text-center gap-8 animate-fade-in-up">
                            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-navy-800 border-2 border-gold-500/40 shadow-gold">
                                <ShieldOff className="h-12 w-12 text-gold-400" />
                            </div>
                            <div>
                                <h2 className="font-display text-5xl md:text-6xl font-black text-foreground mb-3 leading-none">
                                    TEAM <span className="text-gold-400">FULL</span>
                                </h2>
                                <p className="font-display text-xl font-bold text-foreground/60 uppercase tracking-widest">
                                    All 3 slots have been filled
                                </p>
                            </div>
                            <div className="w-16 h-1 bg-gold-500 rounded-full" />
                            <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-gold text-left">
                                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                    All available tryout slots for the Blue Panthers have been claimed. Thank you to everyone who signed up — we'll see you on the court! Check back next season for new openings.
                                </p>
                            </div>
                            <p className="font-body text-xs text-muted-foreground/50 uppercase tracking-widest">
                                Check back next season for new openings
                            </p>
                        </div>
                    ) : (
                        /* Sign-Up Form */
                        <div className="animate-fade-in-up">
                            {/* Header */}
                            <div className="flex flex-col items-center text-center gap-4 mb-10">
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-navy-800 border-2 border-gold-500/40 shadow-gold">
                                    <Users className="h-10 w-10 text-gold-400" />
                                </div>
                                <div>
                                    <h2 className="font-display text-5xl md:text-6xl font-black text-foreground mb-2 leading-none">
                                        JOIN THE <span className="text-gold-400">TEAM</span>
                                    </h2>
                                    <p className="font-display text-lg font-bold text-foreground/60 uppercase tracking-widest">
                                        Blue Panthers Tryout Registration
                                    </p>
                                </div>
                                <div className="w-16 h-1 bg-gold-500 rounded-full" />

                                {/* Slot counter */}
                                <div className="flex items-center gap-2 mt-1">
                                    {slotsLoading ? (
                                        <div className="flex items-center gap-2 bg-navy-800 border border-gold-500/30 rounded-full px-4 py-1.5">
                                            <Loader2 className="h-3.5 w-3.5 text-gold-400 animate-spin" />
                                            <span className="font-body text-xs font-semibold text-foreground/50 uppercase tracking-widest">
                                                Checking slots…
                                            </span>
                                        </div>
                                    ) : displaySlots !== null ? (
                                        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 border ${
                                            displaySlots <= 1
                                                ? 'bg-red-950/40 border-red-500/40'
                                                : 'bg-navy-800 border-gold-500/30'
                                        }`}>
                                            <span className={`font-display text-sm font-black uppercase tracking-widest ${
                                                displaySlots <= 1 ? 'text-red-400' : 'text-gold-400'
                                            }`}>
                                                {displaySlots} of {TOTAL_TEAM_SLOTS} slot{displaySlots !== 1 ? 's' : ''} remaining
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-navy-800 border border-gold-500/30 rounded-full px-4 py-1.5">
                                            <span className="font-display text-sm font-black text-gold-400 uppercase tracking-widest">
                                                {TOTAL_TEAM_SLOTS} slots open
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form Card */}
                            <div className="bg-card border border-border rounded-lg p-6 md:p-8 shadow-gold">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name" className="font-display font-black uppercase tracking-widest text-xs text-foreground/70">
                                            Full Name <span className="text-gold-400">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g. Jordan Smith"
                                            value={form.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className="bg-background border-border focus:border-gold-500 font-body"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="font-display font-black uppercase tracking-widest text-xs text-foreground/70">
                                            Email Address <span className="text-gold-400">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className="bg-background border-border focus:border-gold-500 font-body"
                                        />
                                    </div>

                                    {/* Phone + Age row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone" className="font-display font-black uppercase tracking-widest text-xs text-foreground/70">
                                                Phone <span className="text-gold-400">*</span>
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="(555) 000-0000"
                                                value={form.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                className="bg-background border-border focus:border-gold-500 font-body"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="age" className="font-display font-black uppercase tracking-widest text-xs text-foreground/70">
                                                Age <span className="text-gold-400">*</span>
                                            </Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                placeholder="e.g. 22"
                                                min={10}
                                                max={99}
                                                value={form.age}
                                                onChange={(e) => handleChange('age', e.target.value)}
                                                className="bg-background border-border focus:border-gold-500 font-body"
                                            />
                                        </div>
                                    </div>

                                    {/* Position */}
                                    <div className="space-y-1.5">
                                        <Label className="font-display font-black uppercase tracking-widest text-xs text-foreground/70">
                                            Position <span className="text-gold-400">*</span>
                                        </Label>
                                        <Select
                                            value={form.position}
                                            onValueChange={(val) => handleChange('position', val)}
                                        >
                                            <SelectTrigger className="bg-background border-border focus:border-gold-500 font-body w-full">
                                                <SelectValue placeholder="Select a position…" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {POSITION_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value} className="font-body">
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Experience Level */}
                                    <div className="space-y-1.5">
                                        <Label className="font-display font-black uppercase tracking-widest text-xs text-foreground/70">
                                            Experience Level <span className="text-gold-400">*</span>
                                        </Label>
                                        <Select
                                            value={form.experienceLevel}
                                            onValueChange={(val) => handleChange('experienceLevel', val)}
                                        >
                                            <SelectTrigger className="bg-background border-border focus:border-gold-500 font-body w-full">
                                                <SelectValue placeholder="Select experience level…" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EXPERIENCE_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value} className="font-body">
                                                        {opt.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Error message */}
                                    {errorMsg && (
                                        <div className="flex items-start gap-2 bg-red-950/40 border border-red-500/40 rounded-md px-4 py-3">
                                            <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                            <p className="font-body text-sm text-red-300">{errorMsg}</p>
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        disabled={submitSignUp.isPending}
                                        className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-display font-black uppercase tracking-widest text-base py-6 shadow-gold disabled:opacity-60"
                                    >
                                        {submitSignUp.isPending ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Submitting…
                                            </span>
                                        ) : (
                                            'Sign Me Up!'
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
