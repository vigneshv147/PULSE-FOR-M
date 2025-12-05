import { CivicData, Hospital, OutbreakPrediction, hospitals as initialHospitals, generateCivicData } from "@/lib/mockData";

export interface Alert {
    id: string;
    title: string;
    message: string;
    severity: 'low' | 'moderate' | 'high';
    wards: string[];
    timestamp: number;
    channels: string[];
}

class UnifiedDataLayer {
    private static instance: UnifiedDataLayer;
    
    // State Stores
    private civicData: Record<string, CivicData> = {}; // Key: Ward Name
    private forecasts: Record<string, OutbreakPrediction[]> = {}; // Key: Ward Name
    private hospitals: Hospital[] = [...initialHospitals];
    private alerts: Alert[] = [];

    private constructor() {
        // Initialize with some default data
        this.civicData['All Wards'] = generateCivicData();
    }

    public static getInstance(): UnifiedDataLayer {
        if (!UnifiedDataLayer.instance) {
            UnifiedDataLayer.instance = new UnifiedDataLayer();
        }
        return UnifiedDataLayer.instance;
    }

    // --- Civic Data Methods ---
    public updateCivicData(ward: string, data: CivicData) {
        this.civicData[ward] = data;
        console.log(`[UnifiedDataLayer] Civic Data updated for ${ward}`);
    }

    public getCivicData(ward: string): CivicData | undefined {
        return this.civicData[ward] || this.civicData['All Wards'];
    }

    // --- Forecast Methods ---
    public updateForecast(ward: string, predictions: OutbreakPrediction[]) {
        this.forecasts[ward] = predictions;
        console.log(`[UnifiedDataLayer] Forecast updated for ${ward}`);
    }

    public getForecast(ward: string): OutbreakPrediction[] | undefined {
        return this.forecasts[ward];
    }

    // --- Hospital Methods ---
    public getHospitals(): Hospital[] {
        return this.hospitals;
    }

    public updateHospital(updatedHospital: Hospital) {
        const index = this.hospitals.findIndex(h => h.id === updatedHospital.id);
        if (index !== -1) {
            this.hospitals[index] = updatedHospital;
            console.log(`[UnifiedDataLayer] Hospital ${updatedHospital.name} updated`);
        }
    }

    // --- Alert Methods ---
    public addAlert(alert: Alert) {
        this.alerts.unshift(alert);
        console.log(`[UnifiedDataLayer] New Alert Added: ${alert.title}`);
    }

    public getAlerts(): Alert[] {
        return this.alerts;
    }
}

export default UnifiedDataLayer.getInstance();
