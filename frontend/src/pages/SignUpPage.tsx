import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Loader2, AlertCircle, User, Mail, Phone, Calendar, Trophy, Star } from 'lucide-react';
import { Position, ExperienceLevel } from '../backend';
import { useSubmitSignUp, type SignUpFormData } from '../hooks/useQueries';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import HeroSection from '../components/HeroSection';

const POSITIONS = [
    { value: Position.guard, label: 'Guard' },
    { value: Position.forward, label: 'Forward' },
    { value: Position.center, label: 'Center' },
];

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

export default function SignUpPage() {
    const submitSignUp = useSubmitSignUp();
    const [isSuccess, setIsSuccess] = useState(false);
    const [submittedName, setSubmittedName] = useState('');

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

    const onSubmit = async (data: FormValues) => {
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
        } catch {
            // error handled via submitSignUp.error
        }
    };

    const handleSignUpAnother = () => {
        setIsSuccess(false);
        setSubmittedName('');
        submitSignUp.reset();
    };

    return (
        <>
            <HeroSection />

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
                                    Fill out the form below to register your interest in joining the Blue Panthers for the 2026 season.
                                </p>
                            </div>

                            <Card className="bg-card border-border shadow-gold">
                                <CardHeader className="border-b border-border pb-6">
                                    <CardTitle className="font-display text-2xl font-black text-foreground tracking-wide">
                                        PLAYER REGISTRATION
                                    </CardTitle>
                                    <CardDescription className="font-body text-muted-foreground">
                                        All fields are required. We'll be in touch shortly after reviewing your application.
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
                                                placeholder="e.g. +1 555 000 1234"
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
                                                min={10}
                                                max={60}
                                                placeholder="e.g. 22"
                                                className="bg-secondary border-border focus:border-gold-500 focus:ring-gold-500/30 text-foreground placeholder:text-muted-foreground/50"
                                                disabled={submitSignUp.isPending}
                                                {...register('age', {
                                                    required: 'Age is required',
                                                    min: { value: 10, message: 'Must be at least 10 years old' },
                                                    max: { value: 60, message: 'Must be 60 or younger' },
                                                    validate: (v) => !isNaN(parseInt(v, 10)) || 'Please enter a valid age',
                                                })}
                                            />
                                            {errors.age && <FieldError message={errors.age.message!} />}
                                        </div>

                                        {/* Position */}
                                        <div className="space-y-1.5">
                                            <Label className="font-display text-sm font-bold tracking-widest uppercase text-foreground/80 flex items-center gap-1.5">
                                                <Trophy className="h-3.5 w-3.5 text-gold-500" />
                                                Preferred Position
                                            </Label>
                                            <Select
                                                value={watchPosition}
                                                onValueChange={(val) => setValue('position', val as Position, { shouldValidate: true })}
                                                disabled={submitSignUp.isPending}
                                            >
                                                <SelectTrigger className="bg-secondary border-border text-foreground data-[placeholder]:text-muted-foreground/50 focus:ring-gold-500/30 focus:border-gold-500">
                                                    <SelectValue placeholder="Select your position" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    {POSITIONS.map((p) => (
                                                        <SelectItem
                                                            key={p.value}
                                                            value={p.value}
                                                            className="text-foreground focus:bg-gold-500/20 focus:text-foreground"
                                                        >
                                                            {p.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <input
                                                type="hidden"
                                                {...register('position', { required: 'Please select a position' })}
                                            />
                                            {errors.position && <FieldError message={errors.position.message!} />}
                                        </div>

                                        {/* Experience Level */}
                                        <div className="space-y-1.5">
                                            <Label className="font-display text-sm font-bold tracking-widest uppercase text-foreground/80 flex items-center gap-1.5">
                                                <Star className="h-3.5 w-3.5 text-gold-500" />
                                                Experience Level
                                            </Label>
                                            <Select
                                                value={watchExperience}
                                                onValueChange={(val) => setValue('experienceLevel', val as ExperienceLevel, { shouldValidate: true })}
                                                disabled={submitSignUp.isPending}
                                            >
                                                <SelectTrigger className="bg-secondary border-border text-foreground data-[placeholder]:text-muted-foreground/50 focus:ring-gold-500/30 focus:border-gold-500">
                                                    <SelectValue placeholder="Select your experience level" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-card border-border">
                                                    {EXPERIENCE_LEVELS.map((e) => (
                                                        <SelectItem
                                                            key={e.value}
                                                            value={e.value}
                                                            className="text-foreground focus:bg-gold-500/20 focus:text-foreground"
                                                        >
                                                            {e.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <input
                                                type="hidden"
                                                {...register('experienceLevel', { required: 'Please select your experience level' })}
                                            />
                                            {errors.experienceLevel && <FieldError message={errors.experienceLevel.message!} />}
                                        </div>

                                        {/* Submission Error */}
                                        {submitSignUp.isError && (
                                            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-md p-3">
                                                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                                                <p className="text-sm text-destructive font-body">
                                                    {submitSignUp.error instanceof Error
                                                        ? submitSignUp.error.message
                                                        : 'Something went wrong. Please try again.'}
                                                </p>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={submitSignUp.isPending}
                                            className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-display text-base font-black tracking-widest uppercase py-6 rounded-sm shadow-gold hover:shadow-gold-lg transition-all duration-200 disabled:opacity-60"
                                        >
                                            {submitSignUp.isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Sign Me Up!'
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </section>

            {/* Why Join Section */}
            {!isSuccess && (
                <section className="py-16 px-4 bg-navy-900/50 border-t border-border">
                    <div className="container mx-auto max-w-4xl">
                        <h2 className="font-display text-3xl md:text-4xl font-black text-center text-foreground mb-10">
                            WHY JOIN THE <span className="text-gold-400">PANTHERS?</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: '🏆',
                                    title: 'Winning Culture',
                                    desc: 'Train with a team that competes to win every single game. Our coaches push you to be your best.',
                                },
                                {
                                    icon: '🤝',
                                    title: 'Brotherhood',
                                    desc: 'More than a team — a family. Build lifelong bonds on and off the court.',
                                },
                                {
                                    icon: '📈',
                                    title: 'Player Development',
                                    desc: 'Structured training programs designed to elevate your game regardless of your current level.',
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="bg-card border border-border rounded-lg p-6 text-center hover:border-gold-500/40 hover:shadow-gold transition-all duration-200"
                                >
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="font-display text-xl font-black text-gold-400 mb-2 tracking-wide">
                                        {item.title}
                                    </h3>
                                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
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
        <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-500/50 mb-6 shadow-gold">
                <CheckCircle className="h-10 w-10 text-gold-400" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3">
                WELCOME TO THE <span className="text-gold-400">PACK!</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-2">
                Thanks for signing up, <span className="text-foreground font-semibold">{name}</span>!
            </p>
            <p className="font-body text-base text-muted-foreground max-w-md mx-auto mb-8">
                Your application has been received. Our coaching staff will review it and reach out to you soon. Get ready to dominate the court!
            </p>
            <div className="bg-card border border-gold-500/30 rounded-lg p-6 max-w-sm mx-auto mb-8 shadow-gold">
                <p className="font-display text-sm font-bold tracking-widest uppercase text-gold-400 mb-1">
                    What's Next?
                </p>
                <p className="font-body text-sm text-muted-foreground">
                    Keep an eye on your inbox. We'll send you details about tryouts, training schedules, and next steps.
                </p>
            </div>
            <Button
                onClick={onReset}
                variant="outline"
                className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10 font-display font-bold tracking-widest uppercase"
            >
                Register Another Player
            </Button>
        </div>
    );
}
