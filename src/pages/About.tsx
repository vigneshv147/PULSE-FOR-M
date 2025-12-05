import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Eye, Users, Zap, Shield, Globe, Heart, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />
            </div>

            {/* Back to Home */}
            <Link to="/" className="absolute top-6 left-6 z-50">
                <Button variant="ghost" className="text-white hover:text-primary hover:bg-white/5">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Button>
            </Link>

            <div className="container mx-auto px-6 py-20">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                        <span className="neon-text">About</span>{' '}
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            Mumbai Pulse
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Transforming urban healthcare through AI-powered predictive analytics and real-time civic intelligence.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
                    {/* Mission */}
                    <div className="glass-card p-10 rounded-3xl border-white/10 hover:border-primary/50 transition-all duration-500 group animate-in fade-in slide-in-from-left">
                        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 inline-block mb-6 shadow-[0_0_20px_rgba(0,243,255,0.3)] group-hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all">
                            <Target className="h-10 w-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            To revolutionize public health management in Mumbai by leveraging cutting-edge AI technology,
                            enabling proactive disease prevention, optimized hospital operations, and data-driven civic planning
                            for a healthier, more resilient city.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="glass-card p-10 rounded-3xl border-white/10 hover:border-secondary/50 transition-all duration-500 group animate-in fade-in slide-in-from-right">
                        <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 inline-block mb-6 shadow-[0_0_20px_rgba(188,19,254,0.3)] group-hover:shadow-[0_0_30px_rgba(188,19,254,0.5)] transition-all">
                            <Eye className="h-10 w-10 text-secondary" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-secondary transition-colors">Our Vision</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            To establish Mumbai as a global benchmark for smart healthcare cities, where AI-driven insights
                            empower citizens, healthcare providers, and policymakers to create a sustainable, equitable,
                            and future-ready urban health ecosystem.
                        </p>
                    </div>
                </div>

                {/* Core Values */}
                <div className="max-w-6xl mx-auto mb-20">
                    <h2 className="text-4xl font-bold text-white text-center mb-12 animate-in fade-in">
                        Core <span className="text-primary">Values</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Heart,
                                title: 'People First',
                                description: 'Every decision prioritizes citizen health and well-being',
                                color: 'text-red-400',
                                bgColor: 'bg-red-500/10',
                                borderColor: 'border-red-500/20'
                            },
                            {
                                icon: Shield,
                                title: 'Data Security',
                                description: 'Enterprise-grade encryption and privacy protection',
                                color: 'text-blue-400',
                                bgColor: 'bg-blue-500/10',
                                borderColor: 'border-blue-500/20'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Innovation',
                                description: 'Continuous improvement through AI and technology',
                                color: 'text-green-400',
                                bgColor: 'bg-green-500/10',
                                borderColor: 'border-green-500/20'
                            }
                        ].map((value, index) => (
                            <div
                                key={index}
                                className="glass-card p-8 rounded-2xl border-white/10 hover:border-primary/30 transition-all duration-500 group animate-in fade-in slide-in-from-bottom"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`p-3 rounded-xl ${value.bgColor} border ${value.borderColor} inline-block mb-4`}>
                                    <value.icon className={`h-8 w-8 ${value.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                <p className="text-muted-foreground">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Features */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-12 animate-in fade-in">
                        Platform <span className="text-secondary">Features</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Zap,
                                title: 'AI Outbreak Forecasting',
                                description: '7-day disease prediction with 95% accuracy using machine learning models',
                            },
                            {
                                icon: Users,
                                title: 'Hospital Logistics',
                                description: 'Real-time bed allocation, staff scheduling, and resource optimization',
                            },
                            {
                                icon: Globe,
                                title: 'Civic Data Analytics',
                                description: 'Live environmental monitoring, AQI tracking, and event density analysis',
                            },
                            {
                                icon: Shield,
                                title: 'Secure Infrastructure',
                                description: 'Government-grade security with encrypted data transmission',
                            },
                            {
                                icon: TrendingUp,
                                title: 'Predictive Insights',
                                description: 'Ward-level health risk assessment and proactive recommendations',
                            },
                            {
                                icon: Award,
                                title: 'Multi-Agent AI',
                                description: 'Specialized AI agents for forecasting, logistics, and advisory services',
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="glass-card p-6 rounded-2xl border-white/10 hover:border-accent/50 transition-all duration-500 group animate-in fade-in slide-in-from-bottom"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 inline-block mb-4 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                                    <feature.icon className="h-6 w-6 text-accent" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto mt-20 text-center glass-card p-12 rounded-3xl border-primary/20 shadow-[0_0_40px_rgba(0,243,255,0.15)] animate-in fade-in">
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Healthcare?</h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join Mumbai Pulse and be part of the smart city revolution.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:shadow-[0_0_40px_rgba(0,243,255,0.6)] transition-all duration-300 px-8 py-6 text-lg">
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:border-primary/50 px-8 py-6 text-lg transition-all">
                                View Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
