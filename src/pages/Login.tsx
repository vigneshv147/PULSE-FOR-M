import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Lock, Mail, ArrowLeft, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type Account = {
  email: string;
  password: string;
};

const DEFAULT_ACCOUNTS: Account[] = [
  { email: 'admin@mpulse.gov.in', password: 'demo123' },
];

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ensure default accounts exist
  if (!localStorage.getItem('accounts')) {
    localStorage.setItem('accounts', JSON.stringify(DEFAULT_ACCOUNTS));
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]') as Account[];
    const accountExists = accounts.find((acc) => acc.email === email && acc.password === password);

    setTimeout(() => {
      if (accountExists) {
        localStorage.setItem('loggedInUser', JSON.stringify(accountExists));
        toast({
          title: '✅ Login Successful',
          description: `Welcome back, ${accountExists.email}`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: '❌ Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }, 600);
  };

  const handleForgotPassword = () => {
    toast({
      title: '📧 Password Reset',
      description: 'Check your email for reset instructions (demo).',
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
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
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.3)]">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white neon-text mb-2">Mumbai Pulse</h1>
            <p className="text-muted-foreground">Smart City Health Command</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 rounded-3xl border-white/10 shadow-[0_0_40px_rgba(0,243,255,0.15)]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@mpulse.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:shadow-[0_0_40px_rgba(0,243,255,0.6)] transition-all duration-300 text-lg font-semibold"
            >
              {loading ? (
                <Activity className="h-5 w-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <p className="text-center text-sm text-muted-foreground">
          🔒 Secured by Government of Maharashtra
        </p>
      </div>
    </div>
  );
};

export default Login;
