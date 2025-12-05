import * as XLSX from 'xlsx';
import { useState, useEffect } from 'react';
import OutbreakForecaster from '@/agents/OutbreakForecaster';
import { TrendingUp, Download, Play, Loader2, MapPin, Calendar, CloudRain, Wind, RefreshCw, Activity, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { generateOutbreakPredictions, generateCivicData, type CivicData } from '@/lib/mockData';
import { fetchWeatherData, fetchAQIData, calculateRiskScore } from '@/services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Forecaster = () => {
  const [predictions, setPredictions] = useState(generateOutbreakPredictions());
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState<string>("All Wards");
  const [civicData, setCivicData] = useState<CivicData>(generateCivicData());
  const [isLiveData, setIsLiveData] = useState(false);
  const { toast } = useToast();

  // Real coordinates for Mumbai Wards
  const WARD_COORDINATES: Record<string, { lat: number; lon: number }> = {
    "All Wards": { lat: 19.0760, lon: 72.8777 }, // Mumbai Center
    "A Ward": { lat: 18.9389, lon: 72.8354 }, // Colaba
    "B Ward": { lat: 18.9569, lon: 72.8377 }, // Sandhurst Road
    "C Ward": { lat: 18.9483, lon: 72.8258 }, // Marine Lines
    "D Ward": { lat: 18.9633, lon: 72.8133 }, // Grant Road
    "E Ward": { lat: 18.9733, lon: 72.8281 }, // Byculla
    "F North": { lat: 19.0298, lon: 72.8576 }, // Matunga
    "F South": { lat: 19.0018, lon: 72.8428 }, // Parel
    "G North": { lat: 19.0269, lon: 72.8397 }, // Dadar
    "G South": { lat: 19.0076, lon: 72.8156 }, // Worli
    "H East": { lat: 19.0843, lon: 72.8360 }, // Santacruz East
    "H West": { lat: 19.0596, lon: 72.8295 }, // Bandra West
  };

  const wards = Object.keys(WARD_COORDINATES);

  useEffect(() => {
    loadLiveData();
  }, [selectedWard]);

  const loadLiveData = async () => {
    setDataLoading(true);
    try {
      const { lat, lon } = WARD_COORDINATES[selectedWard] || WARD_COORDINATES["All Wards"];
      const weather = await fetchWeatherData(lat, lon);
      const aqi = await fetchAQIData(lat, lon);
      const riskAnalysis = calculateRiskScore(weather, aqi);

      setCivicData(prev => ({
        ...prev,
        ...riskAnalysis,
        rainfall: weather.rainfall,
        aqi: aqi.aqi
      }));
      setIsLiveData(true);
      toast({
        title: `☁️ Live Data: ${selectedWard}`,
        description: `Synced with Open-Meteo for precise location`,
      });
    } catch (error) {
      console.error("Failed to load live data", error);
      toast({
        title: "⚠️ Live Data Failed",
        description: "Falling back to historical data simulation",
        variant: "destructive"
      });
    } finally {
      setDataLoading(false);
    }
  };

  const runForecast = async () => {
    setLoading(true);
    toast({
      title: '🤖 Agent 2: Forecasting Running',
      description: `Analyzing patterns for ${selectedWard}...`,
    });

    try {
      // Use Agent 2 to generate forecast
      const newPredictions = await OutbreakForecaster.generateForecast(selectedWard);
      setPredictions(newPredictions);

      toast({
        title: '✅ Forecast Complete',
        description: `7-day prediction generated for ${selectedWard}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: '❌ Forecast Failed',
        description: 'Agent 2 could not generate predictions.',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // 1. Prepare Data for Excel
    const summaryData = [
      ["Forecast Report", ""],
      ["Generated At", new Date().toLocaleString()],
      ["Ward", selectedWard],
      ["Data Source", isLiveData ? "Open-Meteo Real-time API" : "Simulated/Historical"],
      ["Model Confidence", `${civicData.confidence}%`],
      ["Risk Level", civicData.riskLevel.toUpperCase()],
      ["Predicted Outbreak", civicData.predictedOutbreak],
      ["Rainfall", `${civicData.rainfall} mm`],
      ["AQI", civicData.aqi],
      ["", ""] // Empty row
    ];

    const predictionsData = [
      ["Date", "Disease", "Predicted Cases", "Confidence", "Status"],
      ...predictions.map(p => [
        new Date(p.date).toLocaleDateString(),
        p.disease,
        p.cases,
        `${p.confidence}%`,
        p.cases > 50 ? "High Alert" : "Monitor"
      ])
    ];

    // 2. Create Workbook and Worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([...summaryData, ...predictionsData]);

    // 3. Append Worksheet to Workbook
    XLSX.utils.book_append_sheet(wb, ws, "Forecast Report");

    // 4. Generate Excel File
    XLSX.writeFile(wb, `m-pulse-forecast-${selectedWard.replace(' ', '-')}-${Date.now()}.xlsx`);

    toast({
      title: '📥 Excel Report Downloaded',
      description: 'Forecast data exported to .xlsx successfully',
    });
  };

  const chartData = predictions.map(p => ({
    date: new Date(p.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    cases: p.cases,
    confidence: p.confidence,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 glass-panel p-8 rounded-3xl relative overflow-hidden border-primary/20 shadow-[0_0_40px_rgba(0,243,255,0.1)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50 animate-pulse-slow" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h1 className="text-5xl font-bold tracking-tight text-white neon-text mb-3 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
              <Activity className="h-8 w-8 text-primary animate-pulse" />
            </div>
            AI Outbreak Forecaster
          </h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2 max-w-2xl">
            Predictive analytics engine with ward-level precision and real-time environmental monitoring.
            {isLiveData && (
              <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-400 border-green-500/30 animate-pulse-slow px-3 py-1">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse shadow-[0_0_10px_#00ff00]"></span>
                Live Data Stream Active
              </Badge>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center relative z-10 bg-black/40 p-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white focus:ring-primary/50 h-12 rounded-xl">
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white backdrop-blur-xl">
              {wards.map((ward) => (
                <SelectItem key={ward} value={ward} className="focus:bg-primary/20 focus:text-primary cursor-pointer py-3">{ward}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={exportReport} variant="outline" className="h-12 border-white/10 hover:bg-white/5 hover:text-primary hover:border-primary/30 transition-all rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>

          <Button
            onClick={runForecast}
            disabled={loading}
            className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all duration-300 rounded-xl px-6"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Play className="mr-2 h-5 w-5 fill-current" />
            )}
            Run AI Forecast
          </Button>
        </div>
      </div>

      {/* Environmental & Event Factors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Environmental Data Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
            <CloudRain className="h-32 w-32 text-blue-500" />
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <CloudRain className="h-6 w-6 text-blue-400" />
              </div>
              Environmental Data
              {dataLoading && <Loader2 className="h-4 w-4 animate-spin ml-auto text-blue-400" />}
            </h3>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-medium text-muted-foreground">Rainfall (Current)</span>
                  <span className="text-3xl font-bold text-white">{civicData.rainfall} <span className="text-sm font-normal text-muted-foreground">mm</span></span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${Math.min((civicData.rainfall / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-medium text-muted-foreground">AQI Level</span>
                  <span className={`text-3xl font-bold ${civicData.aqi > 200 ? 'text-red-400' : 'text-green-400'}`}>
                    {civicData.aqi}
                  </span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor] ${civicData.aqi > 200 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-green-600 to-green-400'}`}
                    style={{ width: `${Math.min((civicData.aqi / 300) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Calendar Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-all duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
            <Calendar className="h-32 w-32 text-purple-500" />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Calendar className="h-6 w-6 text-purple-400" />
              </div>
              Event Calendar
            </h3>
            <p className="text-sm text-muted-foreground mb-6 pl-1">Major events affecting public health</p>

            <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar max-h-[250px]">
              {/* Monsoon Seasons */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-blue-400" /> Monsoon Seasons
                </p>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-sm font-medium text-white">Southwest Monsoon</span>
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]">Critical</Badge>
                </div>
              </div>

              {/* Major Festivals */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-purple-400" /> Upcoming Festivals
                </p>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-sm font-medium text-white">Ganesh Chaturthi</span>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]">High Density</Badge>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-sm font-medium text-white">Diwali</span>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)]">High Density</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Risk Model Card */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

          <div className="relative z-10 w-full">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center justify-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              Dynamic Risk Model
            </h3>

            <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              {/* Circular Progress Background */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                <circle cx="96" cy="96" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                <circle
                  cx="96" cy="96" r="80"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray="502"
                  strokeDashoffset={502 - (502 * civicData.confidence) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f3ff" />
                    <stop offset="100%" stopColor="#bc13fe" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="text-center">
                <div className="text-5xl font-bold text-white neon-text mb-1">{civicData.confidence}%</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Confidence</div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Badge variant="outline" className={`px-4 py-1.5 text-sm ${civicData.riskLevel === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}>
                RISK: {civicData.riskLevel.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="px-4 py-1.5 text-sm bg-white/5 text-white border-white/20">
                {civicData.predictedOutbreak}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Location Analysis */}
      <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border-white/5">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              AI Location Analysis: <span className="text-primary">{selectedWard}</span>
            </h2>
            <p className="text-muted-foreground mt-1">Agentic AI insights for ward-specific health risk factors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Demographics */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/10 group">
            <h4 className="font-bold text-lg text-white mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
              <Activity className="h-5 w-5 text-purple-400" />
              Demographics & Density
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Population Density</span>
                <span className="font-medium text-white">
                  {selectedWard === "All Wards" ? "High" :
                    selectedWard.includes("South") ? "Very High" :
                      selectedWard.includes("North") ? "High" : "Moderate"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Vulnerable Groups</span>
                <span className="font-medium text-white">
                  {Math.floor(Math.random() * 30 + 15)}%
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Slum Population</span>
                <span className="font-medium text-white">
                  {selectedWard.includes("East") ? "35%" :
                    selectedWard.includes("South") ? "45%" : "20%"}
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/10 group">
            <h4 className="font-bold text-lg text-white mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Infrastructure Assessment
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Healthcare Access</span>
                <Badge variant="outline" className={selectedWard.includes("South") ? "text-green-400 border-green-500/30 bg-green-500/10" : "text-yellow-400 border-yellow-500/30 bg-yellow-500/10"}>
                  {selectedWard.includes("South") ? "Good" : "Moderate"}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Water Supply</span>
                <Badge variant="outline" className={civicData.rainfall > 20 ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-green-400 border-green-500/30 bg-green-500/10"}>
                  {civicData.rainfall > 20 ? "At Risk" : "Stable"}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Sanitation Score</span>
                <span className="font-medium text-white">
                  {selectedWard.includes("West") ? "7.5/10" : "6.2/10"}
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Factors */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all hover:bg-white/10 group">
            <h4 className="font-bold text-lg text-white mb-4 flex items-center gap-2 group-hover:text-primary transition-colors">
              <CloudRain className="h-5 w-5 text-blue-400" />
              Environmental Factors
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Flood Risk Zone</span>
                <Badge variant="outline" className={selectedWard.includes("East") || civicData.rainfall > 30 ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-green-400 border-green-500/30 bg-green-500/10"}>
                  {selectedWard.includes("East") || civicData.rainfall > 30 ? "High" : "Low"}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Air Quality Trend</span>
                <Badge variant="outline" className={civicData.aqi > 150 ? "text-red-400 border-red-500/30 bg-red-500/10" : "text-green-400 border-green-500/30 bg-green-500/10"}>
                  {civicData.aqi > 150 ? "Deteriorating" : "Stable"}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5">
                <span className="text-muted-foreground">Vector Breeding Sites</span>
                <span className={`font-medium ${civicData.rainfall > 20 ? "text-red-400" : "text-green-400"}`}>
                  {civicData.rainfall > 20 ? "Elevated" : "Normal"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <h4 className="font-bold text-lg text-blue-400 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Recommendations
            </h4>
            <ul className="space-y-3 text-sm">
              {civicData.rainfall > 20 && (
                <li className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/10">
                  <Info className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                  <span className="text-white leading-relaxed">Deploy mosquito fogging teams in low-lying areas immediately.</span>
                </li>
              )}
              {civicData.aqi > 150 && (
                <li className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/10">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 shrink-0" />
                  <span className="text-white leading-relaxed">Issue respiratory health advisories for sensitive groups.</span>
                </li>
              )}
              {civicData.riskLevel === 'high' && (
                <li className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-white leading-relaxed">Increase medical staff allocation by 25% in this ward.</span>
                </li>
              )}
              <li className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/10">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-white leading-relaxed">Conduct door-to-door health screening in high-density zones.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Chart */}
      <div className="glass-panel rounded-3xl p-8 border-primary/20 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">7-Day Disease Projection</h2>
            <p className="text-muted-foreground">Predicted daily case count by disease category</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-2 text-sm">
            AI Confidence: {civicData.confidence}%
          </Badge>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#bc13fe" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 15, 0.9)',
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                  color: '#fff',
                  padding: '12px'
                }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Area
                type="monotone"
                dataKey="cases"
                stroke="#00f3ff"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCases)"
                name="Predicted Cases"
                animationDuration={2000}
              />
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="#bc13fe"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorConfidence)"
                name="Confidence %"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Predictions Table */}
      <div className="glass-panel rounded-3xl p-8 border-white/5">
        <h2 className="text-2xl font-bold text-white mb-6">Detailed Risk Analysis</h2>
        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all duration-500 animate-slide-up group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-5 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20 group-hover:scale-110 transition-transform">
                  {new Date(prediction.date).getDate()}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">{new Date(prediction.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'long'
                  })}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-muted-foreground">{prediction.disease}</p>
                    <Badge variant="outline" className="text-[10px] h-5 px-2 border-white/10 text-muted-foreground bg-white/5">
                      {selectedWard}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <p className="font-bold text-white text-xl group-hover:text-primary transition-colors">{prediction.cases} <span className="text-sm font-normal text-muted-foreground">cases</span></p>
                  <p className="text-xs text-muted-foreground">{prediction.confidence}% confidence</p>
                </div>
                <div className="w-32 h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${prediction.cases > 50 ? 'bg-red-500' : 'bg-primary'}`}
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forecaster;
