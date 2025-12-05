import { useState } from 'react';
import PublicAlertSystem from '@/agents/PublicAlertSystem';
import { AlertTriangle, Send, Globe, Activity, Smartphone, Share2, Radio, Bell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { publicAdvisories } from '@/lib/mockData';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Language = 'en' | 'hi' | 'mr';

const Advisories = () => {
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [channels, setChannels] = useState({
    sms: true,
    social: false,
    app: true,
    radio: false
  });
  const { toast } = useToast();

  const sendAlert = (advisoryId: string) => {
    const activeChannels = Object.entries(channels)
      .filter(([_, active]) => active)
      .map(([channel]) => channel.toUpperCase());

    if (activeChannels.length === 0) {
      toast({
        title: '❌ Broadcast Failed',
        description: 'Please select at least one channel.',
        variant: 'destructive'
      });
      return;
    }

    const result = PublicAlertSystem.broadcastAlert(advisoryId, activeChannels);
    toast({
      title: '📢 Agent 4: Public Alert Broadcasted',
      description: `Sent to ${result.recipients.toLocaleString()} citizens via ${activeChannels.join(', ')}`,
    });
  };

  const languageNames: Record<Language, string> = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi'
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-4xl font-bold text-white neon-text mb-2 flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary animate-pulse" />
              Public Advisory System
            </h1>
            <p className="text-muted-foreground">Targeted multi-channel health alerts</p>
          </div>
          <div className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLang === lang ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedLang(lang);
                    toast({
                      title: 'Language Changed',
                      description: `Advisory messages now in ${languageNames[lang]}`,
                    });
                  }}
                  className={selectedLang === lang
                    ? 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30'
                    : 'border-white/10 hover:bg-white/5'}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Channels */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Broadcast Channels
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Select mediums for alert distribution</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${channels.sms
            ? 'border-blue-500/50 bg-blue-500/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
            }`} onClick={() => setChannels(prev => ({ ...prev, sms: !prev.sms }))}>
            <div className="flex items-center space-x-2">
              <Checkbox id="sms" checked={channels.sms} onCheckedChange={(c) => setChannels(prev => ({ ...prev, sms: !!c }))} />
              <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer">
                <Smartphone className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium text-white">SMS</p>
                  <p className="text-xs text-muted-foreground">Broadcast</p>
                </div>
              </Label>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${channels.social
            ? 'border-pink-500/50 bg-pink-500/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
            }`} onClick={() => setChannels(prev => ({ ...prev, social: !prev.social }))}>
            <div className="flex items-center space-x-2">
              <Checkbox id="social" checked={channels.social} onCheckedChange={(c) => setChannels(prev => ({ ...prev, social: !!c }))} />
              <Label htmlFor="social" className="flex items-center gap-2 cursor-pointer">
                <Share2 className="h-5 w-5 text-pink-400" />
                <div>
                  <p className="font-medium text-white">Social</p>
                  <p className="text-xs text-muted-foreground">Media</p>
                </div>
              </Label>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${channels.app
            ? 'border-green-500/50 bg-green-500/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
            }`} onClick={() => setChannels(prev => ({ ...prev, app: !prev.app }))}>
            <div className="flex items-center space-x-2">
              <Checkbox id="app" checked={channels.app} onCheckedChange={(c) => setChannels(prev => ({ ...prev, app: !!c }))} />
              <Label htmlFor="app" className="flex items-center gap-2 cursor-pointer">
                <Activity className="h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium text-white">M-Pulse</p>
                  <p className="text-xs text-muted-foreground">App</p>
                </div>
              </Label>
            </div>
          </div>

          <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${channels.radio
            ? 'border-orange-500/50 bg-orange-500/10'
            : 'border-white/10 bg-white/5 hover:border-white/20'
            }`} onClick={() => setChannels(prev => ({ ...prev, radio: !prev.radio }))}>
            <div className="flex items-center space-x-2">
              <Checkbox id="radio" checked={channels.radio} onCheckedChange={(c) => setChannels(prev => ({ ...prev, radio: !!c }))} />
              <Label htmlFor="radio" className="flex items-center gap-2 cursor-pointer">
                <Radio className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="font-medium text-white">Radio</p>
                  <p className="text-xs text-muted-foreground">Municipal</p>
                </div>
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Active Advisories - HUD Style */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          Active Advisories
        </h2>
        {publicAdvisories.map((advisory, index) => (
          <div
            key={advisory.id}
            className={`glass-panel rounded-xl p-6 border-l-4 ${advisory.severity === 'high'
              ? 'border-red-500 bg-red-500/5'
              : advisory.severity === 'moderate'
                ? 'border-yellow-500 bg-yellow-500/5'
                : 'border-green-500 bg-green-500/5'
              } animate-slide-up hover:border-primary/50 transition-all duration-300`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className={
                    advisory.severity === 'high'
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : advisory.severity === 'moderate'
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                        : 'bg-green-500/20 text-green-400 border-green-500/50'
                  }>
                    {advisory.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-white">
                    {advisory.severity === 'high' ? 'Health Alert' : advisory.severity === 'moderate' ? 'Advisory' : 'Notice'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Issued: {new Date().toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{advisory.translations[selectedLang]}</h3>
                <p className="text-muted-foreground mb-3">{advisory.message}</p>
                <div className="flex flex-wrap gap-2">
                  {advisory.wards.map((area, i) => (
                    <Badge key={i} variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => sendAlert(advisory.id)}
                  className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 shadow-[0_0_20px_rgba(0,243,255,0.2)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all duration-300"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Broadcast Alert
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  {Object.entries(channels).filter(([_, active]) => active).length} channels active
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Alerts Sent</span>
            <Send className="h-4 w-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-white">1,247</div>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Citizens Reached</span>
            <Activity className="h-4 w-4 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white">8.2M</div>
          <p className="text-xs text-muted-foreground mt-1">Across all channels</p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Response Rate</span>
            <Zap className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold text-white">94%</div>
          <p className="text-xs text-muted-foreground mt-1">Acknowledgment rate</p>
        </div>
      </div>
    </div>
  );
};

export default Advisories;
