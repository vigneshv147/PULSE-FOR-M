import UnifiedDataLayer from './UnifiedDataLayer';
import { Hospital } from '@/lib/mockData';

class LogisticsCoordinator {
    private static instance: LogisticsCoordinator;

    private constructor() { }

    public static getInstance(): LogisticsCoordinator {
        if (!LogisticsCoordinator.instance) {
            LogisticsCoordinator.instance = new LogisticsCoordinator();
        }
        return LogisticsCoordinator.instance;
    }

    // Mission: Optimize medical resources across Mumbai hospitals.
    public allocateResources() {
        console.log(`[Agent 3: LogisticsCoordinator] Analyzing resource allocation...`);

        const hospitals = UnifiedDataLayer.getHospitals();
        const forecasts = UnifiedDataLayer.getForecast('All Wards'); // Simplified for demo

        // 1. Analyze Capacity vs Demand
        hospitals.forEach(hospital => {
            const occupancyRate = (hospital.totalBeds - hospital.bedsAvailable) / hospital.totalBeds;

            // 2. Dynamic Load Balancing Logic
            if (occupancyRate > 0.85) {
                // Hospital is overloaded
                console.log(`[Agent 3] ${hospital.name} is overloaded (${(occupancyRate * 100).toFixed(1)}%). Recommending diversion.`);

                // Find nearby hospital with capacity (Simulated logic)
                const nearbyHospital = hospitals.find(h => h.id !== hospital.id && (h.totalBeds - h.bedsAvailable) / h.totalBeds < 0.6);

                if (nearbyHospital) {
                    console.log(`[Agent 3] -> Divert non-critical patients to ${nearbyHospital.name}`);
                }
            }
        });

        // 3. Staffing Optimization
        // Logic to recommend staff movement based on predicted surges
        const highRiskWards = forecasts?.filter(f => f.cases > 50).map(f => f.disease) || [];
        if (highRiskWards.length > 0) {
            console.log(`[Agent 3] High risk detected for ${highRiskWards.join(', ')}. Recommending overtime for emergency staff.`);
        }

        return {
            status: 'Optimized',
            recommendations: [
                "Divert 20% of non-critical patients from Sion to KEM",
                "Activate reserve nursing staff for Night Shift in G-North",
                "Restock O2 cylinders in Cooper Hospital (Stock < 15%)"
            ]
        };
    }

    public suggestAmbulanceRoutes(start: { lat: number, lon: number }, end: { lat: number, lon: number }) {
        // In a real system, this would use Google Maps API or OSRM
        return {
            route: "Via Western Express Highway",
            eta: "25 mins",
            trafficStatus: "Moderate"
        };
    }
}

export default LogisticsCoordinator.getInstance();
