import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, LogIn, UserPlus, Info, Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Navigation */}
            <nav className="glass-panel border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(0,243,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all">
                                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                            </div>
                            <span className="text-2xl font-bold text-white neon-text">Mumbai Pulse</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/">
                                <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5 transition-all">
                                    <Home className="mr-2 h-4 w-4" />
                                    Home
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5 transition-all">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button variant="ghost" className="text-white hover:text-secondary hover:bg-white/5 transition-all">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Signup
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button variant="ghost" className="text-white hover:text-accent hover:bg-white/5 transition-all">
                                    <Info className="mr-2 h-4 w-4" />
                                    About
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 p-4 rounded-2xl glass-card border-white/10 animate-in slide-in-from-top">
                            <div className="flex flex-col gap-2">
                                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:text-primary hover:bg-white/5">
                                        <Home className="mr-2 h-4 w-4" />
                                        Home
                                    </Button>
                                </Link>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:text-primary hover:bg-white/5">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:text-secondary hover:bg-white/5">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Signup
                                    </Button>
                                </Link>
                                <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full justify-start text-white hover:text-accent hover:bg-white/5">
                                        <Info className="mr-2 h-4 w-4" />
                                        About
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 md:py-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-in fade-in slide-in-from-bottom">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">AI-Powered Civic Intelligence</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '0.1s' }}>
                        <span className="neon-text">Mumbai Pulse</span>
                        <br />
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Smart City Dashboard
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '0.2s' }}>
                        Real-time outbreak forecasting, hospital logistics, and civic data analytics powered by advanced AI agents.
                        Transform urban healthcare with predictive intelligence.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '0.3s' }}>
                        <Link to="/dashboard">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:shadow-[0_0_40px_rgba(0,243,255,0.6)] transition-all duration-300 px-8 py-6 text-lg group">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/about">
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-primary/50 px-8 py-6 text-lg transition-all">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-6xl mx-auto">
                    {[
                        {
                            icon: Zap,
                            title: 'AI Forecasting',
                            description: 'Predict disease outbreaks with 95% accuracy using advanced machine learning models.',
                            color: 'primary'
                        },
                        {
                            icon: Shield,
                            title: 'Hospital Logistics',
                            description: 'Real-time bed allocation, staff scheduling, and supply chain optimization.',
                            color: 'secondary'
                        },
                        {
                            icon: Globe,
                            title: 'Civic Analytics',
                            description: 'Live environmental data, event tracking, and ward-level health insights.',
                            color: 'accent'
                        }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="glass-card p-8 rounded-3xl border-white/10 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden animate-in fade-in slide-in-from-bottom"
                            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />

                            <div className={`p-4 rounded-2xl bg-${feature.color}/10 border border-${feature.color}/20 inline-block mb-6 shadow-[0_0_20px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all`}>
                                <feature.icon className={`h-8 w-8 text-${feature.color}`} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="glass-panel border-t border-white/10 mt-20">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-muted-foreground text-sm">
                            © 2025 Mumbai Pulse. Powered by AI for a healthier city.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                About
                            </Link>
                            <Link to="/login" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                Login
                            </Link>
                            <Link to="/signup" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                                Signup
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
