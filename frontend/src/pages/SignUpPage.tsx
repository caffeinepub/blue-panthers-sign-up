import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Loader2, AlertCircle, User, Mail, Phone, Calendar, Trophy } from 'lucide-react';
import { Position, ExperienceLevel } from '../backend';
import { useSubmitSignUp, CENTER_MAX_CAPACITY, FORWARD_MAX_CAPACITY, GUARD_MAX_CAPACITY, type SignUpFormData } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HeroSection from '../components/HeroSection';

const EXPERIENCE_LEVELS = [
    { value: ExperienceLevel.beginner, label: 'Beginner' },
    { value: ExperienceLevel.intermediate, label: 'Intermediate' },
    { value: ExperienceLevel.advanced, label: 'Advanced' },
];

interface FormValues {
    name: string;
    email: string;
    phone: string;
    age: string;
    position: Position;
    experienceLevel: ExperienceLevel;
}

function FieldError({ message }: { message: string }) {
    return (
        <p className="text-xs text-destructive font-body flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3 shrink-0" />
            {message}
        </p>
    );
}

function SuccessCard({ name, onReset }: { name: string; onReset: () => void }) {
    return (
        <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-500/40 mb-6">
                <CheckCircle className="h-10 w-10 text-gold-400" />
            </div>
            <h2 className="font-display text-4xl font-black text-foreground mb-3">
                YOU'RE <span className="text-gold-400">IN!</span>
            </h2>
            <p className="font-body text-muted-foreground text-base max-w-sm mx-auto mb-8">
                Thanks, <strong className="text-foreground">{name}</strong>! Your application has been received. We'll be in touch soon.
            </p>
            <Button
                onClick={onReset}
                variant="outline"
                className="border-gold-500/40 text-gold-400 hover:bg-gold-500/10 font-display font-bold tracking-widest uppercase"
            >
                Sign Up Another Player
            </Button>
        </div>
    );
}

export default function SignUpPage() {
    const submitSignUp = useSubmitSignUp();
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedName, setSubmittedName] = useState('');

    // Track position full states based on backend error responses
    const [centerFull, setCenterFull] = useState(false);
    const [forwardFull, setForwardFull] = useState(false);
    const [guardFull, setGuardFull] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            age: '',
            position: undefined,
            experienceLevel: undefined,
        },
    });

    const watchPosition = watch('position');
    const watchExperience = watch('experienceLevel');

    // Derive a user-friendly error message from backend errors
    const getSubmitErrorMessage = (): string | null => {
        if (!submitSignUp.isError) return null;
        const msg = submitSignUp.error instanceof Error ? submitSignUp.error.message : String(submitSignUp.error);
        if (msg.toLowerCase().includes('maximum capacity') || msg.toLowerCase().includes('maxcapacity')) {
            const pos = watchPosition;
            if (pos === Position.forward) {
                return `The Forward position is now full (${FORWARD_MAX_CAPACITY}/${FORWARD_MAX_CAPACITY} slots taken). Please check back later.`;
            }
            if (pos === Position.guard) {
                return `The Guard position is now full (${GUARD_MAX_CAPACITY}/${GUARD_MAX_CAPACITY} slot taken). Please check back later.`;
            }
            return `The Center position is now full (${CENTER_MAX_CAPACITY}/${CENTER_MAX_CAPACITY} slots taken). Please check back later.`;
        }
        if (msg.toLowerCase().includes('closed') || msg.toLowerCase().includes('maxcapacity(0)')) {
            return 'This position is currently closed for sign-ups.';
        }
        return msg;
    };

    const onSubmit = async (data: FormValues) => {
        // Block submission if selected position is full
        if (data.position === Position.center && centerFull) return;
        if (data.position === Position.forward && forwardFull) return;
        if (data.position === Position.guard && guardFull) return;

        try {
            const payload: SignUpFormData = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                age: data.age,
                position: data.position,
                experienceLevel: data.experienceLevel,
            };
            await submitSignUp.mutateAsync(payload);
            setSubmittedName(data.name);
            setIsSuccess(true);
            reset();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            // If backend says a position is at capacity, mark it full in UI
            if (msg.toLowerCase().includes('maximum capacity') || msg.toLowerCase().includes('maxcapacity')) {
                if (data.position === Position.forward) setForwardFull(true);
                else if (data.position === Position.guard) setGuardFull(true);
                else setCenterFull(true);
            }
        }
    };

    const handleSignUpAnother = () => {
        setIsSuccess(false);
        setSubmittedName('');
        submitSignUp.reset();
    };

    const submitErrorMessage = getSubmitErrorMessage();

    // Determine if the currently selected position is full
    const isSelectedPositionFull =
        (watchPosition === Position.center && centerFull) ||
        (watchPosition === Position.forward && forwardFull) ||
        (watchPosition === Position.guard && guardFull);

    return (
        <>
            <HeroSection centerFull={centerFull} forwardFull={forwardFull} guardFull={guardFull} />

            <section id="signup" className="py-16 px-4">
                <div className="container mx-auto max-w-2xl">

                    {isSuccess ? (
                        <SuccessCard name={submittedName} onReset={handleSignUpAnother} />
                    ) : (
                        <>
                            <div className="text-center mb-10">
                                <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3">
                                    JOIN THE <span className="text-gold-400">TEAM</span>
                                </h2>
                                <p className="font-body text-muted-foreground text-base max-w-md mx-auto">
                                    Fill out the form below to register your interest in joining the Blue Panthers NCAA program for the 2026 season.
                                </p>
                            </div>

                            <Card className="bg-card border-border shadow-gold">
                                <CardHeader className="border-b border-border pb-6">
                                    <CardTitle className="font-display text-2xl font-black text-foreground tracking-wide">
                                        PLAYER REGISTRATION
                                    </CardTitle>
                                    <CardDescription className="font-body text-muted-foreground">
                                        All fields are required. We'll be in touch shortly after reviewing your NCAA application.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-6">
                                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                                        {/* Full Name */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="name" className="font-display text-sm font-bold tracking-widest uppercase text-foreground/80 flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-gold-500" />
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="e.g. Jordan Williams"
                                                className="bg-secondary border-border focus:border-gold-500 focus:ring-gold-500/30 text-foreground placeholder:text-muted-foreground/50"
                                                disabled={submitSignUp.isPending}
                                                {...register('name', {
                                                    required: 'Full name is required',
                                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                                })}
                                            />
                                            {errors.name && <FieldError message={errors.name.message!} />}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="email" className="font-display text-sm font-bold tracking-widest uppercase text-foreground/80 flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 text-gold-500" />
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="e.g. jordan@example.com"
                                                className="bg-secondary border-border focus:border-gold-500 focus:ring-gold-500/30 text-foreground placeholder:text-muted-foreground/50"
                                                disabled={submitSignUp.isPending}
                                                {...register('email', {
                                                    required: 'Email address is required',
                                                    pattern: {
                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                        message: 'Please enter a valid email address',
                                                    },
                                                })}
                                            />
                                            {errors.email && <FieldError message={errors.email.message!} />}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="phone" className="font-display text-sm font-bold tracking-widest uppercase text-foreground/80 flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-gold-500" />
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="e.g. (555) 123-4567"
                                                className="bg-secondary border-border focus:border-gold-500 focus:ring-gold-500/30 text-foreground placeholder:text-muted-foreground/50"
                                                disabled={submitSignUp.isPending}
                                                {...register('phone', {
                                                    required: 'Phone number is required',
                                                    minLength: { value: 7, message: 'Please enter a valid phone number' },
                                                })}
                                            />
                                            {errors.phone && <FieldError message={errors.phone.message!} />}
                                        </div>

                                        {/* Age */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="age" className="font-display text-sm font-bold tracking-widest uppercase text-foreground/80 flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-gold-500" />
                                                Age
                                            </Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                placeholder="e.g. 22"
                                                min={14}
                                                max={40}
                                                className="bg-secondary border-border focus:border-gold-500 focus:ring-gold-500/30 text-foreground placeholder:text-muted-foreground/50"
                                                disabled={submitSignUp.isPending}
                                                {...register('age', {
                                                    required: 'Age is required',
                                                    min: { value: 14, message: 'Must be at least 14 years old' },
                                                    max: { value: 40, message: 'Must be 40 or younger' },
                                                })}
                                            />
                                            {errors.age && <FieldError message={errors.age.message!} />}
                                        </div>

                                        {/* Position */}
                                        <div className="space-y-1.5">
                                            <Label className="font-display text-sm font-bold tracking-widest uppercase text-foreground/80 flex items-center gap-1.5">
                                                <Trophy className="h-3.5 w-3.5 text-gold-500" />
                                                Position
                                            </Label>
                                            <Select
                                                value={watchPosition}
                                                onValueChange={(val) => {
                                                    // Prevent selecting a full position
                                                    if (val === Position.forward && forwardFull) return;
                                                    if (val === Position.center && centerFull) return;
                                                    if (val === Position.guard && guardFull) return;
                                                    setValue('position', val as Position, { shouldValidate: true });
                                                }}
                                                disabled={submitSignUp.isPending}
                                            >
                                                <SelectTrigger className="bg-secondary border-border focus:border-gold-500 text-foreground w-full">
                                                    <SelectValue placeholder="Select a position" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    {/* Guard */}
                                                    <SelectItem
                                                        value={Position.guard}
                                                        disabled={guardFull}
                                                        className={guardFull ? 'opacity-50 cursor-not-allowed' : ''}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            Guard
                                                            {guardFull ? (
                                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-destructive/40 text-destructive/70 ml-1">
                                                                    Full
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-gold-500/40 text-gold-500 ml-1">
                                                                    {GUARD_MAX_CAPACITY} slot
                                                                </Badge>
                                                            )}
                                                        </span>
                                                    </SelectItem>

                                                    {/* Forward */}
                                                    <SelectItem
                                                        value={Position.forward}
                                                        disabled={forwardFull}
                                                        className={forwardFull ? 'opacity-50 cursor-not-allowed' : ''}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            Forward
                                                            {forwardFull ? (
                                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-destructive/40 text-destructive/70 ml-1">
                                                                    Full
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-gold-500/40 text-gold-500 ml-1">
                                                                    {FORWARD_MAX_CAPACITY} slots
                                                                </Badge>
                                                            )}
                                                        </span>
                                                    </SelectItem>

                                                    {/* Center */}
                                                    <SelectItem
                                                        value={Position.center}
                                                        disabled={centerFull}
                                                        className={centerFull ? 'opacity-50 cursor-not-allowed' : ''}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            Center
                                                            {centerFull ? (
                                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-destructive/40 text-destructive/70 ml-1">
                                                                    Full
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="text-[10px] px-1 py-0 border-gold-500/40 text-gold-500 ml-1">
                                                                    {CENTER_MAX_CAPACITY} slots
                                                                </Badge>
                                                            )}
                                                        </span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.position && <FieldError message="Please select a position" />}
                                            {/* Inline warning if selected position is full */}
                                            {isSelectedPositionFull && (
                                                <p className="text-xs text-destructive font-body flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                                    This position is currently full. Please select another position.
                                                </p>
                                            )}
                                        </div>

                                        {/* Experience Level */}
                                        <div className="space-y-1.5">
                                            <Label className="font-display text-sm font-bold tracking-widest uppercase text-foreground/80 flex items-center gap-1.5">
                                                <Trophy className="h-3.5 w-3.5 text-gold-500" />
                                                Experience Level
                                            </Label>
                                            <Select
                                                value={watchExperience}
                                                onValueChange={(val) => setValue('experienceLevel', val as ExperienceLevel, { shouldValidate: true })}
                                                disabled={submitSignUp.isPending}
                                            >
                                                <SelectTrigger className="bg-secondary border-border focus:border-gold-500 text-foreground w-full">
                                                    <SelectValue placeholder="Select experience level" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    {EXPERIENCE_LEVELS.map((level) => (
                                                        <SelectItem key={level.value} value={level.value}>
                                                            {level.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.experienceLevel && <FieldError message="Please select your experience level" />}
                                        </div>

                                        {/* Submit Error */}
                                        {submitErrorMessage && (
                                            <div className="flex items-start gap-2 p-3 rounded bg-destructive/10 border border-destructive/30">
                                                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                                <p className="font-body text-sm text-destructive">{submitErrorMessage}</p>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={submitSignUp.isPending || isSelectedPositionFull}
                                            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-display font-black text-base tracking-widest uppercase py-6 disabled:opacity-50"
                                        >
                                            {submitSignUp.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Application'
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
