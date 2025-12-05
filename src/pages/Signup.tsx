import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, User, Phone, ArrowLeft, Sparkles, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type Account = {
    name: string;
    email: string;
    phone: string;
    password: string;
};

const Signup = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: '❌ Password Mismatch',
                description: 'Passwords do not match',
                variant: 'destructive',
            });
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            toast({
                title: '❌ Weak Password',
                description: 'Password must be at least 6 characters',
                variant: 'destructive',
            });
            setLoading(false);
            return;
        }

        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]') as Account[];
        const exists = accounts.some((acc) => acc.email === formData.email);

        setTimeout(() => {
            if (exists) {
                toast({
                    title: '❌ Account Exists',
                    description: 'This email is already registered',
                    variant: 'destructive',
                });
            } else {
                const newAccount: Account = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                };
                accounts.push(newAccount);
                localStorage.setItem('accounts', JSON.stringify(accounts));

                toast({
                    title: '✅ Account Created',
                    description: 'You can now log in with your credentials',
                });

                navigate('/login');
            }
            setLoading(false);
        }, 600);
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Back to Home */}
            <Link to="/" className="absolute top-6 left-6 z-50">
                <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </Link>

            <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom">
                {/* Logo */}
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 shadow-[0_0_30px_rgba(188,19,254,0.3)]">
                        <Sparkles className="h-12 w-12 text-secondary animate-pulse" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white neon-text mb-2">Join Mumbai Pulse</h1>
                        <p className="text-muted-foreground">Create your account to get started</p>
                    </div>
                </div>

                {/* Signup Card */}
                <div className="glass-card p-8 rounded-3xl border-white/10 shadow-[0_0_40px_rgba(188,19,254,0.15)]">
                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-secondary/50 focus:ring-secondary/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-secondary/50 focus:ring-secondary/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-white font-medium">Phone Number</Label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-secondary/50 focus:ring-secondary/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-white font-medium">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-secondary/50 focus:ring-secondary/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                            <div className="relative group">
                                <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                    className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-secondary/50 focus:ring-secondary/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[0_0_30px_rgba(188,19,254,0.4)] hover:shadow-[0_0_40px_rgba(188,19,254,0.6)] transition-all duration-300 text-lg font-semibold mt-6"
                        >
                            {loading ? (
                                <Activity className="h-5 w-5 animate-spin" />
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-secondary hover:text-secondary/80 font-semibold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
