import UnifiedDataLayer from './UnifiedDataLayer';
import { generateOutbreakPredictions, OutbreakPrediction } from '@/lib/mockData';

class OutbreakForecaster {
    private static instance: OutbreakForecaster;

    private constructor() { }

    public static getInstance(): OutbreakForecaster {
        if (!OutbreakForecaster.instance) {
            OutbreakForecaster.instance = new OutbreakForecaster();
        }
        return OutbreakForecaster.instance;
    }

    // Mission: Predict disease surges with ward-level precision.
    public async generateForecast(ward: string): Promise<OutbreakPrediction[]> {
        console.log(`[Agent 2: OutbreakForecaster] Running ML models for ${ward}...`);

        // 1. Fetch Enriched Data from Agent 1 (via Unified Layer)
        const civicData = UnifiedDataLayer.getCivicData(ward);

        // 2. Run Prediction Models (Simulated)
        // In a real system, this would call a Python ML service (Random Forest/XGBoost/LSTM)
        // Here we simulate the output based on risk factors
        const predictions = generateOutbreakPredictions();

        // Adjust predictions based on current risk level
        if (civicData?.riskLevel === 'high') {
            predictions.forEach(p => {
                p.cases = Math.floor(p.cases * 1.5); // Increase cases by 50% for high risk
                p.confidence = Math.min(p.confidence + 5, 99);
            });
        }

        // 3. Update Unified Data Layer
        UnifiedDataLayer.updateForecast(ward, predictions);

        console.log(`[Agent 2: OutbreakForecaster] Forecast generated for ${ward}. Max predicted cases: ${Math.max(...predictions.map(p => p.cases))}`);
        return predictions;
    }

    public getRiskHeatmap() {
        // Returns a simulated heatmap data structure
        return {
            "G North": 0.8,
            "F South": 0.6,
            "H West": 0.4,
            "D Ward": 0.2
        };
    }
}

export default OutbreakForecaster.getInstance();
