import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, BarChart3, AlertTriangle, Users, Menu, X, Moon, Sun, MessageSquare, LogOut, User, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AIAssistant from './AIAssistant';
import logo from '@/assets/logo.png';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const { toast } = useToast();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Activity },
    { name: 'Hospitals', href: '/hospitals', icon: Users },
    { name: 'Forecaster', href: '/forecaster', icon: BarChart3 },
    { name: 'Civic Data', href: '/civic-data', icon: Shield },
    { name: 'Advisories', href: '/advisories', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Header / Dock */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="glass-panel rounded-2xl px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={logo}
                alt="M-Pulse"
                className="h-10 w-auto object-contain relative z-10"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tighter text-white neon-text">
                M-Pulse
              </span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                Mumbai Command
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Dock Style */}
          <nav className="hidden md:flex items-center gap-2 bg-black/20 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <div
                    className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 group ${isActive
                      ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="text-sm font-medium">{item.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_#00f3ff]" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAI(!showAI)}
              className={`relative rounded-full hover:bg-secondary/20 hover:text-secondary transition-all duration-300 ${showAI ? 'bg-secondary/20 text-secondary shadow-[0_0_15px_rgba(188,19,254,0.3)]' : ''}`}
            >
              <MessageSquare className="h-5 w-5" />
              {showAI && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-secondary animate-ping" />
              )}
            </Button>

            {/* User Profile */}
            {loggedInUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-white/10 hover:border-primary/50 transition-colors">
                    <Avatar className="h-full w-full">
                      <AvatarImage src="/avatars/01.png" alt={loggedInUser.email} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {loggedInUser.email.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-panel border-white/10 text-white" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-primary">Admin Access</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {loggedInUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400 focus:bg-red-950/30 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden md:flex border-primary/50 text-primary hover:bg-primary/20">
                  <Zap className="h-3 w-3 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden pt-24 px-6 animate-fade-in">
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className={`p-4 rounded-xl flex items-center gap-4 transition-all ${isActive
                    ? 'bg-primary/20 border border-primary/30 text-primary'
                    : 'bg-white/5 border border-white/5 text-white'
                    }`}>
                    <Icon className="h-6 w-6" />
                    <span className="text-lg font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area with 3D Transition */}
      <main className="relative z-10 pt-28 pb-10 px-4 md:px-8 max-w-7xl mx-auto min-h-screen perspective-1000">
        <div key={location.pathname} className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-700 ease-out-expo transform-style-3d">
          {children}
        </div>
      </main>

      {/* AI Assistant Sidebar */}
      {showAI && (
        <div className="fixed right-4 top-24 bottom-4 w-full md:w-[400px] z-40 animate-slide-up">
          <div className="h-full glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <AIAssistant onClose={() => setShowAI(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
