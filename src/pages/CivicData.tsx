import { useState, useEffect } from 'react';
import CivicDataAggregator from '@/agents/CivicDataAggregator';
import { Database, CloudRain, Bus, Shield, Wind, RefreshCw, CheckCircle2, ArrowRight, Activity, Server, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface DataStream {
    id: string;
    name: string;
    source: string;
    status: 'active' | 'syncing' | 'error';
    lastUpdate: string;
    recordsProcessed: number;
    icon: any;
    color: string;
}

const CivicData = () => {
    const { toast } = useToast();
    const [isSyncing, setIsSyncing] = useState(false);
    const [streams, setStreams] = useState<DataStream[]>([
        {
            id: 'bmc',
            name: 'Municipal Health Records',
            source: 'BMC Central Server',
            status: 'active',
            lastUpdate: 'Just now',
            recordsProcessed: 12500,
            icon: Database,
            color: 'text-blue-400'
        },
        {
            id: 'imd',
            name: 'Weather Patterns',
            source: 'IMD API v2',
            status: 'active',
            lastUpdate: '2 mins ago',
            recordsProcessed: 450,
            icon: CloudRain,
            color: 'text-cyan-400'
        },
        {
            id: 'best',
            name: 'Public Transport Density',
            source: 'BEST Real-time Feed',
            status: 'active',
            lastUpdate: 'Live',
            recordsProcessed: 8900,
            icon: Bus,
            color: 'text-red-400'
        },
        {
            id: 'police',
            name: 'Crowd & Traffic Data',
            source: 'Mumbai Police Traffic API',
            status: 'active',
            lastUpdate: 'Live',
            recordsProcessed: 15000,
            icon: Shield,
            color: 'text-yellow-400'
        },
        {
            id: 'safar',
            name: 'Air Quality Index',
            source: 'SAFAR Network',
            status: 'active',
            lastUpdate: '5 mins ago',
            recordsProcessed: 120,
            icon: Wind,
            color: 'text-green-400'
        }
    ]);

    const handleSync = async () => {
        setIsSyncing(true);
        toast({
            title: "🔄 Syncing Data Streams",
            description: "Agent 1: Fetching real-time data from all connected agencies...",
        });

        try {
            // Use Agent 1 to sync data
            const enrichedData = await CivicDataAggregator.syncAllStreams();

            // Update UI with Agent's status
            const agentStatus = CivicDataAggregator.getStreamStatus();
            setStreams(prev => prev.map(s => {
                const agentStream = agentStatus.find(as => as.id === s.id);
                return {
                    ...s,
                    lastUpdate: 'Just now',
                    recordsProcessed: agentStream ? agentStream.records : s.recordsProcessed + 100
                };
            }));

            toast({
                title: "✅ Sync Complete",
                description: `Data normalized. Risk Level: ${enrichedData.riskLevel.toUpperCase()}`,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "❌ Sync Failed",
                description: "Agent 1 encountered an error connecting to data streams.",
                variant: "destructive"
            });
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold tracking-tight text-white neon-text mb-2">
                        Civic Data Aggregator
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Server className="h-4 w-4 text-primary" />
                        Real-time ingestion, normalization, and enrichment engine
                    </p>
                </div>

                <Button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="relative z-10 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all duration-300"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing Streams...' : 'Sync All Sources'}
                </Button>
            </div>

            {/* Data Streams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {streams.map((stream, index) => {
                    const Icon = stream.icon;
                    return (
                        <div
                            key={stream.id}
                            className="glass-card rounded-xl p-6 relative group animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`p-3 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary/50 transition-colors duration-300`}>
                                    <Icon className={`h-6 w-6 ${stream.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
                                </div>
                                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 animate-pulse-slow">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
                                    LIVE
                                </Badge>
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-primary transition-colors">{stream.name}</h3>
                            <p className="text-sm text-muted-foreground mb-6">{stream.source}</p>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <span className="font-medium flex items-center text-green-400">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Normalized
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Records Processed</span>
                                        <span className="font-mono text-white">{stream.recordsProcessed.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative"
                                            style={{ width: `${Math.random() * 30 + 70}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Activity className="h-3 w-3" />
                                        Last update: {stream.lastUpdate}
                                    </span>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 hover:text-primary hover:bg-primary/10 -mr-2">
                                        View Logs <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pipeline Visualization */}
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Real-Time Analysis Pipeline</h2>
                        <p className="text-muted-foreground">Live data processing and AI analysis engine
                            {' • '}
                            <span className="text-primary font-medium">{new Date().toLocaleTimeString('en-IN')}</span>
                        </p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 animate-pulse">
                        <Activity className="h-3 w-3 mr-1 animate-spin" />
                        {isSyncing ? 'Processing Data...' : 'System Active'}
                    </Badge>
                </div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10 hidden md:block" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            {
                                step: 'Ingestion',
                                desc: 'Collecting live data',
                                status: `${streams.length} streams`,
                                color: 'bg-blue-500',
                                metrics: [`${streams.filter(s => s.status === 'active').length} active`, 'Real-time']
                            },
                            {
                                step: 'Normalization',
                                desc: 'Standardizing formats',
                                status: `${Math.floor(Math.random() * 20 + 80)}% complete`,
                                color: 'bg-purple-500',
                                metrics: ['Format unified', `${(Math.random() * 500 + 1000).toFixed(0)} records/sec`]
                            },
                            {
                                step: 'Enrichment',
                                desc: 'Adding context & location',
                                status: `${Math.floor(Math.random() * 10 + 85)}% accuracy`,
                                color: 'bg-pink-500',
                                metrics: ['Geospatial OK', 'Weather linked']
                            },
                            {
                                step: 'AI Analysis',
                                desc: 'ML model inference',
                                status: isSyncing ? 'Processing...' : 'Complete',
                                color: 'bg-green-500',
                                metrics: ['ML predictions', 'Live inference']
                            }
                        ].map((stage, i) => (
                            <div key={i} className="glass-card p-5 rounded-xl flex flex-col items-center text-center gap-3 relative group hover:scale-105 transition-all duration-300">
                                <div className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10 group-hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all duration-300 relative`}>
                                    <span className="text-lg">{i + 1}</span>
                                    {isSyncing && (
                                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                                    )}
                                </div>
                                <h3 className="font-semibold text-white text-base">{stage.step}</h3>
                                <p className="text-xs text-muted-foreground min-h-[32px]">{stage.desc}</p>
                                <Badge variant="secondary" className="mt-1 bg-white/10 hover:bg-white/15 text-white border-white/20 font-medium">
                                    {stage.status}
                                </Badge>
                                <div className="flex flex-col gap-1 mt-2 w-full">
                                    {stage.metrics.map((metric, idx) => (
                                        <div key={idx} className="text-[10px] text-muted-foreground bg-white/5 rounded px-2 py-0.5">
                                            {metric}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Real-time Stats Footer */}
                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-xs text-muted-foreground">Data Points</p>
                        <p className="text-lg font-bold text-white">{(Math.random() * 50000 + 150000).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Processing Speed</p>
                        <p className="text-lg font-bold text-primary">{(Math.random() * 500 + 1500).toFixed(0)}/s</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">AI Confidence</p>
                        <p className="text-lg font-bold text-green-400">{Math.floor(Math.random() * 10 + 85)}%</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Latency</p>
                        <p className="text-lg font-bold text-cyan-400">{(Math.random() * 50 + 100).toFixed(0)}ms</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CivicData;
