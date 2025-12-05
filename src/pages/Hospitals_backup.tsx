import { useState, useEffect } from 'react';
import LogisticsCoordinator from '@/agents/LogisticsCoordinator';
import { Activity, Bed, Users, AlertCircle, ArrowRight, Truck, Package, Clock, Calendar, MapPin, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { hospitals, type Hospital } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface HospitalWithDistance extends Hospital {
  distance?: number;
}

const Hospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [sortedHospitals, setSortedHospitals] = useState<HospitalWithDistance[]>(hospitals);
  const { toast } = useToast();

  const getUserLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setUserLocation(location);

          // Calculate distances and sort hospitals
          const hospitalsWithDistance = hospitals.map(hospital => ({
            ...hospital,
            distance: calculateDistance(
              location.lat,
              location.lon,
              hospital.coordinates[1], // lat
              hospital.coordinates[0]  // lon
            )
          })).sort((a, b) => (a.distance || 0) - (b.distance || 0));

          setSortedHospitals(hospitalsWithDistance);
          setLocationLoading(false);

          toast({
            title: '📍 Location Detected',
            description: `Found ${hospitalsWithDistance.length} hospitals nearby`,
          });
        },
        (error) => {
          setLocationLoading(false);
          toast({
            title: '⚠️ Location Access Denied',
            description: 'Please enable location services to find nearby hospitals',
            variant: 'destructive'
          });
        }
      );
    } else {
      setLocationLoading(false);
      toast({
        title: '❌ Geolocation Not Supported',
        description: 'Your browser does not support location services',
        variant: 'destructive'
      });
    }
  };

  const handleAutoAllocate = () => {
    toast({
      title: '🤖 Agent 3: Logistics Coordinator',
      description: 'Analyzing hospital capacity and patient distribution...',
    });

    // Use Agent 3 to allocate resources
    const result = LogisticsCoordinator.allocateResources();

    setTimeout(() => {
      toast({
        title: `✅ ${result.status}`,
        description: `Generated ${result.recommendations.length} optimization strategies.`,
      });
    }, 1500);
  };

  const chartData = hospitals.map(h => ({
    name: h.name.replace(' Hospital', ''),
    available: h.bedsAvailable,
    occupied: h.totalBeds - h.bedsAvailable,
    doctors: h.doctorsOnDuty,
  }));

  const getAlertBadge = (level: Hospital['alertLevel']) => {
    const variants = {
      low: 'success',
      moderate: 'warning',
      high: 'destructive',
    } as const;
    return <Badge variant={variants[level]}>{level.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Hospital Command Center</h1>
          <p className="text-muted-foreground mt-1">
            AI-driven logistics: Staffing, Beds, and Supply Chain
          </p>
          {userLocation && (
            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Showing hospitals sorted by distance from your location
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            onClick={getUserLocation}
            variant="outline"
            disabled={locationLoading}
            className="shadow-md"
          >
            {locationLoading ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                {userLocation ? 'Update Location' : 'Find Nearby'}
              </>
            )}
          </Button>
          <Button onClick={handleAutoAllocate} size="lg" className="gradient-primary shadow-glow">
            <Activity className="mr-2 h-5 w-5" />
            Auto-Allocate Resources
          </Button>
        </div>
      </div>

      <Tabs defaultValue="beds" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="beds">Bed Allocation</TabsTrigger>
          <TabsTrigger value="staff">Staff Scheduling</TabsTrigger>
          <TabsTrigger value="supply">Supply Chain</TabsTrigger>
        </TabsList>

        <TabsContent value="beds" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="gradient-card shadow-elevated">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
                <Bed className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {hospitals.reduce((acc, h) => acc + h.bedsAvailable, 0)} / {hospitals.reduce((acc, h) => acc + h.totalBeds, 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Available / Total</p>
                <Progress
                  value={(hospitals.reduce((acc, h) => acc + h.bedsAvailable, 0) / hospitals.reduce((acc, h) => acc + h.totalBeds, 0)) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-elevated">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Doctors On Duty</CardTitle>
                <Users className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {hospitals.reduce((acc, h) => acc + h.doctorsOnDuty, 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all hospitals</p>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-elevated">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">High Alert Hospitals</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {hospitals.filter(h => h.alertLevel === 'high').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Hospital Table */}
          <Card className="gradient-card shadow-elevated">
            <CardHeader>
              <CardTitle>Hospital Status</CardTitle>
              <CardDescription>
                {userLocation ? 'Sorted by distance from your location' : 'Real-time capacity and staffing overview'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hospital</TableHead>
                      <TableHead>Ward</TableHead>
                      {userLocation && <TableHead>Distance</TableHead>}
                      <TableHead>Beds Available</TableHead>
                      <TableHead>Doctors</TableHead>
                      <TableHead>Alert Level</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedHospitals.map((hospital) => (
                      <TableRow key={hospital.id} className="animate-slide-up">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {hospital.distance && hospital.distance < 3 && (
                              <MapPin className="h-4 w-4 text-green-600" />
                            )}
                            {hospital.name}
                          </div>
                        </TableCell>
                        <TableCell>{hospital.ward}</TableCell>
                        {userLocation && (
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {hospital.distance?.toFixed(1)} km
                            </Badge>
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {hospital.bedsAvailable}/{hospital.totalBeds}
                            </span>
                            <Progress
                              value={(hospital.bedsAvailable / hospital.totalBeds) * 100}
                              className="w-16"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{hospital.doctorsOnDuty}</TableCell>
                        <TableCell>{getAlertBadge(hospital.alertLevel)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (hospital.website) {
                                window.open(hospital.website, '_blank');
                                toast({
                                  title: '🌐 Opening Hospital Website',
                                  description: `Redirecting to ${hospital.name} official website`,
                                });
                              } else {
                                toast({
                                  title: '⚠️ Website Not Available',
                                  description: `No website found for ${hospital.name}`,
                                  variant: 'destructive'
                                });
                              }
                            }}
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis for Selected Hospital */}
          {selectedHospital && (
            <Card className="gradient-card shadow-elevated border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Activity className="h-6 w-6 text-primary" />
                      AI Analysis: {selectedHospital.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Real-time data analysis and recommendations
                      {userLocation && sortedHospitals.find(h => h.id === selectedHospital.id)?.distance && (
                        <span className="ml-2 text-green-600 font-medium">
                          • {sortedHospitals.find(h => h.id === selectedHospital.id)?.distance?.toFixed(1)} km from your location
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedHospital(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Capacity Analysis */}
                  <div className="p-4 rounded-lg border border-border bg-background/50">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Bed className="h-4 w-4 text-blue-500" />
                      Capacity Analysis
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Bed Occupancy</span>
                          <span className="font-medium">
                            {Math.round((1 - selectedHospital.bedsAvailable / selectedHospital.totalBeds) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(1 - selectedHospital.bedsAvailable / selectedHospital.totalBeds) * 100}
                          className="h-2"
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available Beds</span>
                        <Badge variant={selectedHospital.bedsAvailable < 50 ? "destructive" : "default"}>
                          {selectedHospital.bedsAvailable} / {selectedHospital.totalBeds}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Wait Time</span>
                        <span className="font-medium text-orange-600">
                          {selectedHospital.alertLevel === 'high' ? '45-60 min' :
                            selectedHospital.alertLevel === 'moderate' ? '20-30 min' : '10-15 min'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resource Availability */}
                  <div className="p-4 rounded-lg border border-border bg-background/50">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Resource Availability
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doctors on Duty</span>
                        <span className="font-medium">{selectedHospital.doctorsOnDuty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ICU Beds</span>
                        <Badge variant="outline">
                          {Math.floor(selectedHospital.totalBeds * 0.15)} available
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Emergency Services</span>
                        <Badge variant="default">24/7 Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ambulance Fleet</span>
                        <span className="font-medium">
                          {Math.floor(selectedHospital.totalBeds / 50)} units
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="p-4 rounded-lg border border-border bg-background/50">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      {selectedHospital.phone && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone</span>
                          <a href={`tel:${selectedHospital.phone}`} className="font-medium text-blue-600 hover:underline">
                            {selectedHospital.phone}
                          </a>
                        </div>
                      )}
                      {selectedHospital.email && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email</span>
                          <a href={`mailto:${selectedHospital.email}`} className="font-medium text-blue-600 hover:underline">
                            {selectedHospital.email}
                          </a>
                        </div>
                      )}
                      {selectedHospital.website && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Website</span>
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-blue-600"
                            onClick={() => window.open(selectedHospital.website, '_blank')}
                          >
                            Visit Website →
                          </Button>
                        </div>
                      )}
                      <div className="pt-2">
                        <Button
                          className="w-full gradient-primary"
                          onClick={() => {
                            if (selectedHospital.website) {
                              window.open(selectedHospital.website, '_blank');
                              toast({
                                title: '🌐 Opening Hospital Website',
                                description: `Redirecting to ${selectedHospital.name} official website`,
                              });
                            }
                          }}
                        >
                          <ArrowRight className="mr-2 h-4 w-4" />
                          Request Resources
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="p-4 rounded-lg border border-border bg-blue-50 dark:bg-blue-950/20 md:col-span-2">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      AI Recommendations
                    </h4>
                    <ul className="space-y-2 text-sm">
                      {selectedHospital.alertLevel === 'high' && (
                        <>
                          <li className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span><strong>High Alert:</strong> Consider alternative hospitals if non-emergency</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>Recommend diverting 20% of incoming patients to nearby facilities</span>
                          </li>
                        </>
                      )}
                      {selectedHospital.alertLevel === 'moderate' && (
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Moderate capacity - suitable for most cases</span>
                        </li>
                      )}
                      {selectedHospital.alertLevel === 'low' && (
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span><strong>Recommended:</strong> Good availability for immediate care</span>
                        </li>
                      )}
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>Specialties: General Medicine, Emergency Care, Surgery</span>
                      </li>
                      {userLocation && (
                        <li className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>
                            Estimated travel time: {
                              sortedHospitals.find(h => h.id === selectedHospital.id)?.distance! < 5 ? '10-15 min' :
                                sortedHospitals.find(h => h.id === selectedHospital.id)?.distance! < 10 ? '20-30 min' : '30-45 min'
                            }
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="staff" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="gradient-card shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Shift Optimization
                </CardTitle>
                <CardDescription>AI-recommended staffing adjustments based on forecasted load</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { hospital: 'KEM Hospital', action: 'Add 5 Nurses', shift: 'Night Shift (22:00 - 06:00)', reason: 'Predicted trauma surge' },
                    { hospital: 'Sion Hospital', action: 'Add 3 Senior Residents', shift: 'Evening Shift (14:00 - 22:00)', reason: 'Dengue OPD overflow' },
                    { hospital: 'Cooper Hospital', action: 'Reduce 2 General Staff', shift: 'Morning Shift (06:00 - 14:00)', reason: 'Low occupancy predicted' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start justify-between p-3 border rounded-lg bg-muted/30">
                      <div>
                        <p className="font-semibold">{item.hospital}</p>
                        <p className="text-sm text-primary font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{item.shift}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{item.reason}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card shadow-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Roster Gaps
                </CardTitle>
                <CardDescription>Critical staffing shortages for next 48 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-500/10">
                    <h4 className="font-bold text-red-600">Urgent: Anesthetists Needed</h4>
                    <p className="text-sm mt-1">Sion Hospital requires 2 anesthetists for emergency surgeries tonight.</p>
                    <Button size="sm" variant="destructive" className="mt-2">Deploy Reserve Team</Button>
                  </div>
                  <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-500/10">
                    <h4 className="font-bold text-yellow-600">Warning: Pediatric Ward</h4>
                    <p className="text-sm mt-1">Nair Hospital pediatric ward understaffed by 20% for tomorrow morning.</p>
                    <Button size="sm" variant="secondary" className="mt-2">Request Inter-hospital Transfer</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="supply" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Oxygen Cylinders', status: 'Healthy', level: 85, color: 'bg-green-500' },
              { name: 'IV Fluids', status: 'Low', level: 25, color: 'bg-red-500' },
              { name: 'PPE Kits', status: 'Moderate', level: 45, color: 'bg-yellow-500' },
            ].map((item, i) => (
              <Card key={i} className="gradient-card shadow-elevated">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex justify-between">
                    {item.name}
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{item.status}</div>
                  <Progress value={item.level} className={`h-2 ${item.color}`} />
                  <p className="text-xs text-muted-foreground mt-2">{item.level}% of stockpile capacity</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="gradient-card shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                Active Deliveries
              </CardTitle>
              <CardDescription>Real-time tracking of medical supplies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Contents</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: '#SHP-2024-001', content: '2000 Units Saline', dest: 'Cooper Hospital', eta: '45 mins', status: 'In Transit' },
                      { id: '#SHP-2024-002', content: '50 Oxygen Cylinders', dest: 'KEM Hospital', eta: '10 mins', status: 'Arriving' },
                      { id: '#SHP-2024-003', content: 'Emergency Trauma Kits', dest: 'Sion Hospital', eta: '2 hours', status: 'Dispatched' },
                    ].map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{row.id}</TableCell>
                        <TableCell>{row.content}</TableCell>
                        <TableCell>{row.dest}</TableCell>
                        <TableCell>{row.eta}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hospital Details Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-2xl m-4 shadow-elevated">
            <CardHeader>
              <CardTitle>{selectedHospital.name}</CardTitle>
              <CardDescription>Detailed Information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ward</p>
                  <p className="text-lg font-medium">{selectedHospital.ward}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alert Level</p>
                  {getAlertBadge(selectedHospital.alertLevel)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Beds</p>
                  <p className="text-lg font-medium">{selectedHospital.totalBeds}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Beds</p>
                  <p className="text-lg font-medium text-success">{selectedHospital.bedsAvailable}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Doctors on Duty</p>
                  <p className="text-lg font-medium">{selectedHospital.doctorsOnDuty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                  <p className="text-lg font-medium">
                    {Math.round(((selectedHospital.totalBeds - selectedHospital.bedsAvailable) / selectedHospital.totalBeds) * 100)}%
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedHospital(null)}>
                  Close
                </Button>
                <Button className="gradient-primary">Request Resources</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Hospitals;
