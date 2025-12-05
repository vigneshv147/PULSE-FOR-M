import { useState } from 'react';
import LogisticsCoordinator from '@/agents/LogisticsCoordinator';
import { Activity, Bed, Users, AlertCircle, ArrowRight, Truck, Package, Clock, MapPin, Navigation, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { hospitals, type Hospital } from '@/lib/mockData';

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

interface HospitalWithDistance extends Hospital {
    distance?: number;
}

const Hospitals = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [sortedHospitals, setSortedHospitals] = useState<HospitalWithDistance[]>(hospitals);
    const { toast } = useToast();

    const getUserLocation = () => {
        setLocationLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = { lat: position.coords.latitude, lon: position.coords.longitude };
                    setUserLocation(location);
                    const hospitalsWithDistance = hospitals.map(hospital => ({
                        ...hospital,
                        distance: calculateDistance(location.lat, location.lon, hospital.coordinates[1], hospital.coordinates[0])
                    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
                    setSortedHospitals(hospitalsWithDistance);
                    setLocationLoading(false);
                    toast({ title: '📍 Location Detected', description: `Found ${hospitalsWithDistance.length} hospitals nearby` });
                },
                () => {
                    setLocationLoading(false);
                    toast({ title: '⚠️ Location Access Denied', description: 'Please enable location services', variant: 'destructive' });
                }
            );
        }
    };

    const handleAutoAllocate = () => {
        toast({ title: '🤖 Agent 3: Logistics Coordinator', description: 'Analyzing hospital capacity...' });
        const result = LogisticsCoordinator.allocateResources();
        setTimeout(() => {
            toast({ title: `✅ ${result.status}`, description: `Generated ${result.recommendations.length} strategies.` });
        }, 1500);
    };

    const getOccupancyColor = (available: number, total: number) => {
        const percent = (available / total) * 100;
        if (percent < 20) return 'border-red-500/50 bg-red-500/10';
        if (percent < 50) return 'border-yellow-500/50 bg-yellow-500/10';
        return 'border-green-500/50 bg-green-500/10';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border-primary/20 shadow-[0_0_40px_rgba(0,243,255,0.1)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50 animate-pulse-slow" />
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                    <div>
                        <h1 className="text-5xl font-bold text-white neon-text mb-3 flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                                <Activity className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                            Hospital Command Center
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            AI-driven logistics engine for real-time Staffing, Bed Allocation, and Supply Chain optimization.
                        </p>
                        {userLocation && (
                            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                                <MapPin className="h-4 w-4" />
                                <span className="text-sm font-medium">Location Active: Sorting by proximity</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl">
                        <Button
                            onClick={getUserLocation}
                            variant="ghost"
                            disabled={locationLoading}
                            className="text-white hover:bg-white/10 hover:text-primary transition-all"
                        >
                            {locationLoading ? <Activity className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
                            {userLocation ? 'Update GPS' : 'Find Nearby'}
                        </Button>
                        <Button
                            onClick={handleAutoAllocate}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all"
                        >
                            <Activity className="mr-2 h-5 w-5" />
                            Auto-Allocate Resources
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="beds" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-white/10 p-1 rounded-xl h-auto">
                    <TabsTrigger
                        value="beds"
                        className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:border-primary/50 border border-transparent py-3 transition-all"
                    >
                        Bed Allocation
                    </TabsTrigger>
                    <TabsTrigger
                        value="staff"
                        className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary data-[state=active]:border-secondary/50 border border-transparent py-3 transition-all"
                    >
                        Staff Scheduling
                    </TabsTrigger>
                    <TabsTrigger
                        value="supply"
                        className="data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:border-accent/50 border border-transparent py-3 transition-all"
                    >
                        Supply Chain
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="beds" className="space-y-8 mt-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <Bed className="h-32 w-32 text-primary" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                        <Bed className="h-6 w-6 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Total Capacity</span>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                                    {hospitals.reduce((acc, h) => acc + h.bedsAvailable, 0)}
                                    <span className="text-xl text-muted-foreground font-normal ml-2">/ {hospitals.reduce((acc, h) => acc + h.totalBeds, 0)}</span>
                                </div>
                                <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                                        style={{ width: `${(hospitals.reduce((acc, h) => acc + h.bedsAvailable, 0) / hospitals.reduce((acc, h) => acc + h.totalBeds, 0)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-secondary/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <Users className="h-32 w-32 text-secondary" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                                        <Users className="h-6 w-6 text-secondary" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Active Medical Staff</span>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                                    {hospitals.reduce((acc, h) => acc + h.doctorsOnDuty, 0)}
                                </div>
                                <p className="text-sm text-secondary/80">Doctors currently on duty</p>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-destructive/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                                <AlertCircle className="h-32 w-32 text-destructive" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                                        <AlertCircle className="h-6 w-6 text-destructive" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Critical Alerts</span>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2 tracking-tight">
                                    {hospitals.filter(h => h.alertLevel === 'high').length}
                                </div>
                                <p className="text-sm text-destructive/80">Hospitals requiring immediate aid</p>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Grid */}
                    <div className="glass-panel rounded-3xl p-8 border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Activity className="h-6 w-6 text-primary" />
                            Hospital Status Modules
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedHospitals.map((hospital, index) => (
                                <div
                                    key={hospital.id}
                                    className={`glass-card p-6 rounded-2xl border-2 ${getOccupancyColor(hospital.bedsAvailable, hospital.totalBeds)} hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] transition-all duration-500 animate-slide-up group relative overflow-hidden`}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />

                                    <div className="flex items-start justify-between mb-4 relative z-10">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-white flex items-center gap-2 group-hover:text-primary transition-colors">
                                                {hospital.distance && hospital.distance < 3 && <MapPin className="h-4 w-4 text-green-400 animate-bounce" />}
                                                {hospital.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mt-1">{hospital.ward}</p>
                                        </div>
                                        <Badge variant="outline" className={`px-3 py-1 ${hospital.alertLevel === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.3)]' :
                                            hospital.alertLevel === 'moderate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50' :
                                                'bg-green-500/10 text-green-400 border-green-500/50'
                                            }`}>
                                            {hospital.alertLevel.toUpperCase()}
                                        </Badge>
                                    </div>

                                    {userLocation && hospital.distance && (
                                        <div className="mb-4 text-sm text-green-400 flex items-center gap-2 bg-green-500/5 p-2 rounded-lg border border-green-500/10">
                                            <Navigation className="h-3 w-3" />
                                            <span className="font-mono">{hospital.distance.toFixed(1)} km away</span>
                                        </div>
                                    )}

                                    <div className="space-y-4 relative z-10">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-muted-foreground">Bed Occupancy</span>
                                                <span className="text-white font-bold">{hospital.bedsAvailable}/{hospital.totalBeds}</span>
                                            </div>
                                            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor] ${(hospital.bedsAvailable / hospital.totalBeds) < 0.2 ? 'bg-red-500 text-red-500' :
                                                        (hospital.bedsAvailable / hospital.totalBeds) < 0.5 ? 'bg-yellow-500 text-yellow-500' : 'bg-green-500 text-green-500'
                                                        }`}
                                                    style={{ width: `${(hospital.bedsAvailable / hospital.totalBeds) * 100}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl border border-white/5">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Doctors
                                            </span>
                                            <span className="text-white font-bold text-lg">{hospital.doctorsOnDuty}</span>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 group/btn"
                                            onClick={() => {
                                                if (hospital.website) {
                                                    window.open(hospital.website, '_blank');
                                                    toast({ title: '🌐 Opening Hospital Portal', description: `Redirecting to ${hospital.name} secure dashboard` });
                                                }
                                            }}
                                        >
                                            View Details
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="staff" className="space-y-6 mt-6">
                    {/* Real-time Analysis Header */}
                    <div className="glass-panel p-6 rounded-2xl flex justify-between items-center border-primary/20 shadow-[0_0_20px_rgba(0,243,255,0.1)]">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Live Staffing Analysis
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                AI-powered optimization • Last updated: <span className="text-primary">{new Date().toLocaleTimeString('en-IN')}</span>
                            </p>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 animate-pulse px-3 py-1">
                            <Activity className="h-3 w-3 mr-2" />
                            Live Analysis Active
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-card rounded-2xl p-6 border-white/5">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-400" />
                                Shift Optimization
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Real-time staffing recommendations based on current load
                            </p>
                            <div className="space-y-4">
                                {sortedHospitals.slice(0, 3).map((hospital, i) => {
                                    const occupancyRate = ((hospital.totalBeds - hospital.bedsAvailable) / hospital.totalBeds) * 100;
                                    const staffAction = occupancyRate > 75
                                        ? `Add ${Math.ceil(occupancyRate / 15)} Staff`
                                        : occupancyRate < 40
                                            ? `Reduce ${Math.ceil((60 - occupancyRate) / 20)} Staff`
                                            : 'Maintain Current';
                                    const shift = i === 0 ? 'Night Shift' : i === 1 ? 'Evening Shift' : 'Morning Shift';
                                    const reason = occupancyRate > 75
                                        ? `${occupancyRate.toFixed(0)}% occupancy`
                                        : occupancyRate < 40
                                            ? 'Low demand'
                                            : 'Optimal';
                                    const color = occupancyRate > 75 ? 'text-red-400' : occupancyRate < 40 ? 'text-green-400' : 'text-yellow-400';

                                    return (
                                        <div key={hospital.id} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/10">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="font-bold text-white text-lg">{hospital.name}</p>
                                                    <p className={`text-sm font-medium ${color} flex items-center gap-1`}>
                                                        {occupancyRate > 75 && <AlertCircle className="h-3 w-3" />}
                                                        {staffAction}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="bg-white/5 border-white/20 text-xs px-2 py-1">
                                                    {shift}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3 mt-2">
                                                <span className="text-muted-foreground">
                                                    {hospital.doctorsOnDuty} doctors • {hospital.bedsAvailable}/{hospital.totalBeds} beds
                                                </span>
                                                <Badge variant="outline" className="text-[10px] border-white/10">{reason}</Badge>
                                            </div>
                                            <div className="mt-2 text-[10px] text-muted-foreground flex justify-between">
                                                <span>Predicted load: {Math.floor(occupancyRate + Math.random() * 10)}%</span>
                                                <span className="text-primary">Updated {Math.floor(Math.random() * 5) + 1}m ago</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-start gap-3">
                                <div className="p-1 bg-primary/20 rounded-full">
                                    <Activity className="h-4 w-4 text-primary" />
                                </div>
                                <p className="text-xs text-primary font-medium leading-relaxed">
                                    AI Insight: System analyzing {sortedHospitals.length} hospitals in real-time.
                                    Shift patterns optimized for predicted patient influx.
                                </p>
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl p-6 border-white/5">
                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                                Critical Staffing Alerts
                            </h3>
                            <p className="text-sm text-muted-foreground mb-6">
                                Urgent resource gaps requiring immediate action
                            </p>
                            <div className="space-y-4">
                                {sortedHospitals
                                    .filter(h => h.alertLevel === 'high' || (h.totalBeds - h.bedsAvailable) / h.totalBeds > 0.75)
                                    .slice(0, 2)
                                    .map((hospital, idx) => {
                                        const occupancy = ((hospital.totalBeds - hospital.bedsAvailable) / hospital.totalBeds) * 100;
                                        const isUrgent = idx === 0;
                                        const borderColor = isUrgent ? 'border-red-500' : 'border-yellow-500';
                                        const bgColor = isUrgent ? 'bg-red-500/10' : 'bg-yellow-500/10';
                                        const textColor = isUrgent ? 'text-red-400' : 'text-yellow-400';
                                        const specialty = isUrgent ? 'Emergency Staff' : 'General Staff';
                                        const count = Math.ceil(occupancy / 20);

                                        return (
                                            <div key={hospital.id} className={`p-5 rounded-xl border-l-4 ${borderColor} ${bgColor} relative overflow-hidden`}>
                                                <div className={`absolute inset-0 opacity-10 ${bgColor}`} />
                                                <div className="absolute top-3 right-3">
                                                    <Badge variant="outline" className={`${textColor} border-current text-[10px] animate-pulse`}>
                                                        {isUrgent ? 'URGENT' : 'WARNING'}
                                                    </Badge>
                                                </div>
                                                <h4 className={`font-bold ${textColor} mb-2 flex items-center gap-2 text-lg`}>
                                                    {isUrgent ? '🚨' : '⚠️'} {specialty} Required
                                                </h4>
                                                <p className="text-sm text-white mt-1 pr-16 leading-relaxed">
                                                    <span className="font-bold">{hospital.name}</span> needs <span className="font-bold">{count} {specialty.toLowerCase()}</span> immediately.
                                                    Current capacity at {occupancy.toFixed(0)}%.
                                                </p>
                                                <div className="flex gap-3 mt-4">
                                                    <Button
                                                        size="sm"
                                                        className={`${isUrgent ? 'bg-red-500/20' : 'bg-yellow-500/20'} ${textColor} border border-current hover:${isUrgent ? 'bg-red-500/30' : 'bg-yellow-500/30'} flex-1`}
                                                    >
                                                        {isUrgent ? 'Deploy Now' : 'Schedule Transfer'}
                                                    </Button>
                                                    <span className="text-[10px] text-muted-foreground self-center">
                                                        Detected {Math.floor(Math.random() * 10) + 5}m ago
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}

                                {/* Real-time Stats */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 mt-4">
                                    <div className="grid grid-cols-2 gap-4 text-center divide-x divide-white/10">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Active Alerts</p>
                                            <p className="text-2xl font-bold text-red-400">
                                                {sortedHospitals.filter(h => h.alertLevel === 'high').length}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Avg Response Time</p>
                                            <p className="text-2xl font-bold text-green-400">{Math.floor(Math.random() * 10) + 5} min</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="supply" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'Oxygen Cylinders', status: 'Healthy', level: 85, color: 'bg-green-500', icon: Activity },
                            { name: 'IV Fluids', status: 'Low', level: 25, color: 'bg-red-500', icon: Droplets },
                            { name: 'PPE Kits', status: 'Moderate', level: 45, color: 'bg-yellow-500', icon: Package },
                        ].map((item, i) => (
                            <div key={i} className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                    <item.icon className="h-24 w-24 text-white" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                                        <Package className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">{item.status}</div>
                                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{ width: `${item.level}%` }} />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 font-mono">{item.level}% capacity remaining</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-panel rounded-2xl p-8 border-white/5">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Truck className="h-6 w-6 text-orange-400" />
                            Active Deliveries
                        </h3>
                        <div className="space-y-4">
                            {[
                                { id: '#SHP-001', content: '2000 Units Saline', dest: 'Cooper Hospital', eta: '45 mins', status: 'In Transit' },
                                { id: '#SHP-002', content: '50 Oxygen Cylinders', dest: 'KEM Hospital', eta: '10 mins', status: 'Arriving' },
                                { id: '#SHP-003', content: 'Trauma Kits', dest: 'Sion Hospital', eta: '2 hours', status: 'Dispatched' },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/10 group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Badge variant="outline" className="font-mono text-[10px] bg-black/20 border-white/10">{row.id}</Badge>
                                            <p className="font-bold text-white group-hover:text-primary transition-colors">{row.content}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <MapPin className="h-3 w-3" />
                                            {row.dest}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30 mb-1">{row.status}</Badge>
                                        <p className="text-xs text-muted-foreground font-mono">ETA: {row.eta}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Hospitals;
