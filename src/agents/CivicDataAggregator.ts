import UnifiedDataLayer from './UnifiedDataLayer';
import { fetchWeatherData, fetchAQIData, calculateRiskScore } from '@/services/api';
import { generateCivicData } from '@/lib/mockData';

class CivicDataAggregator {
    private static instance: CivicDataAggregator;

    private constructor() { }

    public static getInstance(): CivicDataAggregator {
        if (!CivicDataAggregator.instance) {
            CivicDataAggregator.instance = new CivicDataAggregator();
        }
        return CivicDataAggregator.instance;
    }

    // Mission: Ingest, clean, normalize, and enrich real-time civic data feeds.
    public async syncAllStreams(ward: string = 'All Wards') {
        console.log(`[Agent 1: CivicDataAggregator] Syncing streams for ${ward}...`);

        // 1. Ingest Data (Simulated via API)
        // In a real system, this would connect to Kafka/MQTT streams
        const weather = await fetchWeatherData();
        const aqi = await fetchAQIData();

        // 2. Normalize & Enrich Data
        // Combining disparate sources into a standardized schema
        const riskAnalysis = calculateRiskScore(weather, aqi);

        const enrichedData = {
            ...generateCivicData(), // Base mock data
            rainfall: weather.rainfall,
            aqi: aqi.aqi,
            ...riskAnalysis
        };

        // 3. Update Unified Data Layer
        UnifiedDataLayer.updateCivicData(ward, enrichedData);

        console.log(`[Agent 1: CivicDataAggregator] Data normalized and enriched for ${ward}. Risk Level: ${enrichedData.riskLevel}`);
        return enrichedData;
    }

    public getStreamStatus() {
        return [
            { id: 'bmc', name: 'Municipal Health Records', status: 'active', records: 12500 },
            { id: 'imd', name: 'Weather Patterns', status: 'active', records: 450 },
            { id: 'best', name: 'Public Transport Density', status: 'active', records: 8900 },
            { id: 'police', name: 'Crowd & Traffic Data', status: 'active', records: 15000 },
            { id: 'safar', name: 'Air Quality Index', status: 'active', records: 120 }
        ];
    }
}

export default CivicDataAggregator.getInstance();
