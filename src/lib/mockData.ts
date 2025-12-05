// Mock data for M-Pulse system

export interface Hospital {
  id: string;
  name: string;
  ward: string;
  bedsAvailable: number;
  totalBeds: number;
  doctorsOnDuty: number;
  alertLevel: 'low' | 'moderate' | 'high';
  coordinates: [number, number];
  website?: string;
  phone?: string;
  email?: string;
}

export interface CivicData {
  rainfall: number;
  aqi: number;
  eventDensity: 'Low' | 'Moderate' | 'High';
  predictedOutbreak: string;
  confidence: number;
  riskLevel: 'low' | 'moderate' | 'high';
}

export interface OutbreakPrediction {
  date: string;
  disease: string;
  cases: number;
  confidence: number;
}

export const hospitals: Hospital[] = [
  {
    id: '1',
    name: 'KEM Hospital',
    ward: 'G North',
    bedsAvailable: 145,
    totalBeds: 250,
    doctorsOnDuty: 32,
    alertLevel: 'moderate',
    coordinates: [72.8479, 19.0053],
    website: 'https://www.kem.edu/',
    phone: '+91-22-2410-7000',
    email: 'info@kem.edu'
  },
  {
    id: '2',
    name: 'Sion Hospital',
    ward: 'F North',
    bedsAvailable: 89,
    totalBeds: 200,
    doctorsOnDuty: 28,
    alertLevel: 'high',
    coordinates: [72.8637, 19.0433],
    website: 'https://sionhospitalmumbai.com/',
    phone: '+91-22-2407-6521',
    email: 'sion.hospital@gov.in'
  },
  {
    id: '3',
    name: 'JJ Hospital',
    ward: 'D Ward',
    bedsAvailable: 178,
    totalBeds: 300,
    doctorsOnDuty: 45,
    alertLevel: 'low',
    coordinates: [72.8365, 18.9593],
    website: 'https://jjhospital.org/',
    phone: '+91-22-2373-5555',
    email: 'admin@jjhospital.org'
  },
  {
    id: '4',
    name: 'Cooper Hospital',
    ward: 'H West',
    bedsAvailable: 67,
    totalBeds: 150,
    doctorsOnDuty: 22,
    alertLevel: 'high',
    coordinates: [72.8323, 19.0566],
    website: 'https://www.cooperhospitals.com/',
    phone: '+91-22-2620-2891',
    email: 'contact@cooperhospital.org'
  },
  {
    id: '5',
    name: 'Nair Hospital',
    ward: 'E Ward',
    bedsAvailable: 112,
    totalBeds: 220,
    doctorsOnDuty: 35,
    alertLevel: 'moderate',
    coordinates: [72.8418, 18.9950],
    website: 'https://www.tnmchospital.com/',
    phone: '+91-22-2307-4761',
    email: 'info@nairhospital.org'
  }
];

export const generateCivicData = (): CivicData => {
  const rainfall = Math.floor(Math.random() * 150);
  const aqi = Math.floor(Math.random() * 300) + 50;
  const eventDensityOptions: ('Low' | 'Moderate' | 'High')[] = ['Low', 'Moderate', 'High'];
  const eventDensity = eventDensityOptions[Math.floor(Math.random() * 3)];

  let predictedOutbreak = 'None';
  let riskLevel: 'low' | 'moderate' | 'high' = 'low';
  let confidence = 0;

  if (rainfall > 100) {
    predictedOutbreak = 'Leptospirosis & Waterborne Diseases';
    riskLevel = 'high';
    confidence = 85 + Math.floor(Math.random() * 15);
  } else if (rainfall > 50) {
    predictedOutbreak = 'Dengue & Malaria';
    riskLevel = 'moderate';
    confidence = 65 + Math.floor(Math.random() * 20);
  } else if (aqi > 200) {
    predictedOutbreak = 'Respiratory Issues';
    riskLevel = 'high';
    confidence = 75 + Math.floor(Math.random() * 20);
  } else if (aqi > 150) {
    predictedOutbreak = 'Mild Respiratory Symptoms';
    riskLevel = 'moderate';
    confidence = 60 + Math.floor(Math.random() * 15);
  } else if (eventDensity === 'High') {
    predictedOutbreak = 'Trauma & Crowd-related Injuries';
    riskLevel = 'moderate';
    confidence = 70 + Math.floor(Math.random() * 15);
  } else {
    confidence = 40 + Math.floor(Math.random() * 20);
  }

  return {
    rainfall,
    aqi,
    eventDensity,
    predictedOutbreak,
    confidence,
    riskLevel
  };
};

export const generateOutbreakPredictions = (): OutbreakPrediction[] => {
  const diseases = ['Dengue', 'Leptospirosis', 'Malaria', 'Respiratory Issues', 'Waterborne Diseases'];
  const predictions: OutbreakPrediction[] = [];

  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    predictions.push({
      date: date.toISOString().split('T')[0],
      disease: diseases[Math.floor(Math.random() * diseases.length)],
      cases: Math.floor(Math.random() * 100) + 20,
      confidence: Math.floor(Math.random() * 30) + 70
    });
  }

  return predictions;
};

export const publicAdvisories = [
  {
    id: '1',
    title: '⚠️ Waterborne Disease Alert',
    message: 'Avoid wading through flooded areas in Ward G South. High risk of leptospirosis. Seek immediate medical attention if fever develops.',
    severity: 'high' as const,
    wards: ['G South', 'G North'],
    translations: {
      en: 'Avoid wading through flooded areas in Ward G South. High risk of leptospirosis.',
      hi: 'वार्ड जी साउथ में जलभराव वाले क्षेत्रों से बचें। लेप्टोस्पायरोसिस का उच्च जोखिम।',
      mr: 'वॉर्ड जी साउथमधील पूरग्रस्त भागात जाऊ नका. लेप्टोस्पायरोसिसचा उच्च धोका.'
    }
  },
  {
    id: '2',
    title: '😷 Poor Air Quality Warning',
    message: 'AQI exceeds 200 in multiple wards. Limit outdoor exposure, especially for children and elderly. Use N95 masks if venturing outside.',
    severity: 'moderate' as const,
    wards: ['All'],
    translations: {
      en: 'AQI exceeds 200. Limit outdoor exposure and use N95 masks.',
      hi: 'AQI 200 से अधिक है। बाहरी गतिविधियां सीमित करें और N95 मास्क का उपयोग करें।',
      mr: 'AQI 200 पेक्षा जास्त आहे. बाहेरील प्रदर्शन मर्यादित करा आणि N95 मास्क वापरा.'
    }
  },
  {
    id: '3',
    title: '🎉 Festival Season Advisory',
    message: 'High crowd density expected during upcoming festivals. Maintain hygiene, stay hydrated, and follow safety protocols at public gatherings.',
    severity: 'low' as const,
    wards: ['All'],
    translations: {
      en: 'High crowd density expected. Maintain hygiene and follow safety protocols.',
      hi: 'उच्च भीड़ की उम्मीद है। स्वच्छता बनाए रखें और सुरक्षा प्रोटोकॉल का पालन करें।',
      mr: 'उच्च गर्दी अपेक्षित आहे. स्वच्छता राखा आणि सुरक्षा नियमांचे पालन करा.'
    }
  }
];

export const aiResponses: Record<string, string> = {
  'dengue': 'Based on current rainfall patterns and historical data, dengue risk is elevated in wards with standing water. Recommend intensified vector control measures in G South, F North, and H West wards.',
  'leptospirosis': 'Leptospirosis risk is HIGH in flooded areas. Immediate advisory issued for wards G South and F North. Hospital alert systems activated. Recommend public awareness campaign.',
  'respiratory': 'Respiratory disease risk moderate to high due to elevated AQI levels. Recommend limiting outdoor activities and distributing masks in affected wards.',
  'trauma': 'Trauma case surge expected during festival period. Alert level raised for Cooper and Sion hospitals. Recommend pre-positioning additional emergency staff.',
  'default': 'M-Pulse AI is analyzing your query. Our predictive models are processing real-time civic data, weather patterns, and hospital capacity metrics to provide actionable insights.'
};
