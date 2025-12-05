import UnifiedDataLayer, { Alert } from './UnifiedDataLayer';
import { v4 as uuidv4 } from 'uuid';

class PublicAlertSystem {
    private static instance: PublicAlertSystem;

    private constructor() { }

    public static getInstance(): PublicAlertSystem {
        if (!PublicAlertSystem.instance) {
            PublicAlertSystem.instance = new PublicAlertSystem();
        }
        return PublicAlertSystem.instance;
    }

    // Mission: Deliver targeted citizen alerts to reduce avoidable ER visits.
    public generateAlerts() {
        console.log(`[Agent 4: PublicAlertSystem] Scanning for high-risk patterns...`);

        const forecasts = UnifiedDataLayer.getForecast('All Wards'); // Simplified
        const civicData = UnifiedDataLayer.getCivicData('All Wards');

        if (!forecasts || !civicData) return;

        // 1. Rule-Based Alert Generation
        if (civicData.riskLevel === 'high') {
            const newAlert: Alert = {
                id: uuidv4(),
                title: `⚠️ High Health Risk: ${civicData.predictedOutbreak}`,
                message: `Elevated risk detected due to recent weather and AQI levels. Please take necessary precautions.`,
                severity: 'high',
                wards: ['All Wards'], // In real app, this would be specific wards
                timestamp: Date.now(),
                channels: ['SMS', 'App']
            };

            // 2. Deduplication Check (Simplified)
            const existingAlerts = UnifiedDataLayer.getAlerts();
            const isDuplicate = existingAlerts.some(a => a.title === newAlert.title && Date.now() - a.timestamp < 3600000); // 1 hour cooldown

            if (!isDuplicate) {
                UnifiedDataLayer.addAlert(newAlert);
                console.log(`[Agent 4] Generated new alert: ${newAlert.title}`);
                return newAlert;
            }
        }

        return null;
    }

    public broadcastAlert(alertId: string, channels: string[]) {
        console.log(`[Agent 4] Broadcasting Alert ${alertId} via ${channels.join(', ')}`);
        // Simulate API calls to SMS Gateway / Firebase Cloud Messaging
        return {
            success: true,
            recipients: 150000, // Simulated count
            deliveryTime: 'Immediate'
        };
    }
}

export default PublicAlertSystem.getInstance();
