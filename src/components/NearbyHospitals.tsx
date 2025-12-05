import { useState, useEffect } from 'react';
import { MapPin, Navigation, Bed, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { hospitals, type Hospital } from '@/lib/mockData';
import { getUserLocation, calculateDistance, type Coordinates } from '@/lib/geolocation';

interface HospitalWithDistance extends Hospital {
  distance: number;
}

const NearbyHospitals = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<HospitalWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getLocation = async () => {
    setLoading(true);
    try {
      const location = await getUserLocation();
      setUserLocation(location);

      // Calculate distances and sort
      const hospitalsWithDistance = hospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance(
          location,
          { latitude: hospital.coordinates[1], longitude: hospital.coordinates[0] }
        )
      })).sort((a, b) => a.distance - b.distance);

      setNearbyHospitals(hospitalsWithDistance);

      toast({
        title: 'Location Found',
        description: `Found ${hospitalsWithDistance.length} hospitals nearby`,
      });
    } catch (error) {
      toast({
        title: 'Location Error',
        description: 'Could not access your location. Please enable location services.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getAlertColor = (level: Hospital['alertLevel']) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'moderate': return 'warning';
      default: return 'success';
    }
  };

  const openInMaps = (hospital: Hospital) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates[1]},${hospital.coordinates[0]}`;
    window.open(url, '_blank');
  };

  if (!userLocation && !loading) {
    return (
      <Card className="gradient-card shadow-elevated border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Nearby Hospitals
          </CardTitle>
          <CardDescription>Find hospitals near your location</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Enable location access to see nearby hospitals
          </p>
          <Button onClick={getLocation} className="gradient-primary">
            <Navigation className="h-4 w-4 mr-2" />
            Get My Location
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="gradient-card shadow-elevated border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Finding nearby hospitals...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card shadow-elevated border-border/50 animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Nearby Hospitals
            </CardTitle>
            <CardDescription>
              Sorted by distance from your location
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={getLocation} disabled={loading}>
            <Navigation className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {nearbyHospitals.map((hospital, index) => (
          <div
            key={hospital.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover-lift bg-card"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold">{hospital.name}</h4>
                  <p className="text-xs text-muted-foreground">{hospital.ward}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-xs ml-11">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" />
                  <span className="font-medium">{hospital.distance} km away</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="h-3 w-3" />
                  <span>{hospital.bedsAvailable}/{hospital.totalBeds} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{hospital.doctorsOnDuty} doctors</span>
                </div>
                <Badge variant={getAlertColor(hospital.alertLevel)} className="text-xs">
                  {hospital.alertLevel}
                </Badge>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => openInMaps(hospital)}
              className="ml-4"
            >
              <Navigation className="h-4 w-4 mr-1" />
              Directions
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NearbyHospitals;
