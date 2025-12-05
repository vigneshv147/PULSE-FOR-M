import { useState, useEffect } from "react";
import {
  CloudRain,
  Wind,
  Calendar,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Droplets,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { generateCivicData, type CivicData } from "@/lib/mockData";
import MumbaiMap from "@/components/MumbaiMap";
import NearbyHospitals from "@/components/NearbyHospitals";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  // ------------------ LOGIN USER DATA ------------------
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("loggedInUser");
    if (data) setUser(JSON.parse(data));
  }, []);

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  // ------------------ CIVIC DATA ------------------
  const [civicData, setCivicData] = useState<CivicData>(generateCivicData());
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const newData = generateCivicData();
      setCivicData(newData);
      setLastUpdate(new Date());
      setRefreshing(false);

      toast({
        title: "Data Updated",
        description: `Risk level: ${newData.riskLevel.toUpperCase()} | Confidence: ${newData.confidence}%`,
      });
    }, 1500);
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "destructive";
      case "moderate":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ------------------ USER HEADER ------------------ */}
      <div className="glass-panel p-5 rounded-2xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
        <div className="relative z-10 flex items-center gap-3">
          {user ? (
            <>
              <div className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">{user.email.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Logged in as</p>
                <p className="text-base font-bold text-white">{user.email}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No user logged in</p>
          )}
        </div>

        <Button
          onClick={logout}
          variant="outline"
          className="relative z-10 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
        >
          Logout
        </Button>
      </div>


      {/* ------------------ HERO SECTION ------------------ */}
      <div className="glass-panel rounded-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-5xl font-bold text-white neon-text">
              Mumbai Health Command
            </h1>
          </div>

          <p className="text-xl text-white/80 mb-8 max-w-2xl">
            AI-Powered Outbreak Prediction & Intelligent Resource Management System
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/forecaster">
              <Button size="lg" className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                <TrendingUp className="mr-2 h-5 w-5" />
                View Detailed Forecast
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {refreshing ? (
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-5 w-5" />
              )}
              Update Data
            </Button>
          </div>
        </div>
      </div>

      {/* ------------------ METRICS GRID ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rainfall */}
        <div className="glass-card rounded-2xl p-6 group hover:border-primary/50 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CloudRain className="h-24 w-24 text-primary" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform duration-300">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-mono text-primary/70 bg-primary/5 px-2 py-1 rounded border border-primary/10">LIVE</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Rainfall (24h)</h3>
            <div className="text-4xl font-bold text-white tracking-tight group-hover:text-primary transition-colors duration-300">
              {civicData.rainfall} <span className="text-lg text-muted-foreground font-normal">mm</span>
            </div>
            <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]" style={{ width: `${Math.min((civicData.rainfall / 150) * 100, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* AQI */}
        <div className="glass-card rounded-2xl p-6 group hover:border-secondary/50 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wind className="h-24 w-24 text-secondary" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-5 w-5 text-secondary" />
            </div>
            <span className="text-xs font-mono text-secondary/70 bg-secondary/5 px-2 py-1 rounded border border-secondary/10">AQI</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Air Quality</h3>
            <div className="text-4xl font-bold text-white tracking-tight group-hover:text-secondary transition-colors duration-300">
              {civicData.aqi}
            </div>
            <p className={`text-xs font-medium mt-1 ${civicData.aqi > 200 ? "text-red-400" : civicData.aqi > 150 ? "text-yellow-400" : "text-green-400"}`}>
              {civicData.aqi > 200 ? "Poor Condition" : civicData.aqi > 150 ? "Moderate" : "Good Quality"}
            </p>
            <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${civicData.aqi > 200 ? 'bg-red-500' : civicData.aqi > 150 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min((civicData.aqi / 300) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Event Density */}
        <div className="glass-card rounded-2xl p-6 group hover:border-accent/50 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="h-24 w-24 text-accent" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-5 w-5 text-accent" />
            </div>
            <span className="text-xs font-mono text-accent/70 bg-accent/5 px-2 py-1 rounded border border-accent/10">EVENTS</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Crowd Density</h3>
            <div className="text-4xl font-bold text-white tracking-tight group-hover:text-accent transition-colors duration-300">
              {civicData.eventDensity}
            </div>
            <Badge variant="outline" className="mt-2 bg-accent/10 border-accent/20 text-accent group-hover:bg-accent/20 transition-colors">
              {civicData.eventDensity === "High" ? "Peak Season" : "Normal Flow"}
            </Badge>
          </div>
        </div>

        {/* Risk Forecast */}
        <div className="glass-card rounded-2xl p-6 group hover:border-destructive/50 transition-all duration-500 relative overflow-hidden animate-pulse-slow">
          <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/20 group-hover:scale-110 transition-transform duration-300">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <span className="text-xs font-mono text-destructive/70 bg-destructive/5 px-2 py-1 rounded border border-destructive/10">AI FORECAST</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Outbreak Risk</h3>
            <div className="text-4xl font-bold text-white tracking-tight group-hover:text-destructive transition-colors duration-300">
              {civicData.riskLevel.toUpperCase()}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-destructive rounded-full shadow-[0_0_10px_rgba(255,0,0,0.5)]" style={{ width: `${civicData.confidence}%` }} />
              </div>
              <span className="text-xs font-bold text-destructive">{civicData.confidence}% AI Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------ Nearby Hospitals ------------------ */}
      <NearbyHospitals />

      {/* ------------------ Map ------------------ */}
      <Card className="glass-panel border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-white">Hospital Network - Live Map</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Real-time visualization of Mumbai's hospital infrastructure and alert levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-inner">
            <MumbaiMap />
          </div>
        </CardContent>
      </Card>

      {/* ------------------ Footer ------------------ */}
      <Card className="glass-panel border-white/5 mt-8">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_#00ff00]" />
              <span className="text-sm font-medium text-white/80">System Online</span>
            </div>

            <div className="text-sm text-muted-foreground font-mono">
              Last updated: <span className="text-primary">{lastUpdate.toLocaleTimeString("en-IN")}</span>
            </div>

            <Link to="/hospitals">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all">
                View All Hospitals
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;