# Complete Setup Guide - Healthy Nation App

## Project Structure

```
healthy-nation-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation (Home, Assistant, Doctors, Profile, Health)
│   │   ├── index.tsx             # Home/Dashboard screen
│   │   ├── assistant.tsx         # AI Health Assistant
│   │   ├── doctors.tsx           # Find Doctors
│   │   ├── profile.tsx           # User Profile & Medical History
│   │   └── health.tsx            # Health Monitoring Dashboard
│   ├── pharmacy/
│   │   ├── _layout.tsx           # Pharmacy routes
│   │   ├── index.tsx             # Medical shops listing
│   │   └── [id].tsx              # Shop details
│   ├── checkout/
│   │   └── index.tsx             # Checkout & payment flow
│   ├── _layout.tsx               # Root layout provider
│   └── +not-found.tsx            # 404 page
├── components/
│   └── BluetoothScanner.tsx       # Bluetooth device connection UI
├── constants/
│   ├── colors.ts                 # Color palette
│   └── mocks.ts                  # Mock data
├── app.json                      # Expo configuration
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── .gitignore                    # Git ignore rules
└── README.md                     # Project documentation
```

## File Creation Instructions

Follow the detailed code sections below to create each file:

### 1. app.json

```json
{
  "expo": {
    "name": "Healthy Nation",
    "slug": "healthy-nation-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.healthynation.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.healthynation.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 2. tsconfig.json

```json
{
  "compilerOptions": {
    "allowJs": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "lib": ["ES2020"],
    "moduleResolution": "bundler",
    "module": "ESNext",
    "noEmit": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "ES2020",
    "baseUrl": "./",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 3. constants/colors.ts

```typescript
export const Colors = {
  primary: '#5B9CF6',           // Medical Blue
  secondary: '#F472B6',         // Soft Pink
  accent: '#14B8A6',            // Teal
  background: '#F8FAFC',        // Light Gray
  lightBackground: '#ffffff',   
  surface: '#ffffff',
  
  light: {
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#5B9CF6',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    background: '#F8FAFC',
  },
  
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

export default Colors;
```

### 4. constants/mocks.ts

```typescript
export const VITALS = [
  { id: 'heartRate', label: 'Heart Rate', value: 72, unit: 'bpm', trend: 'stable', icon: 'Heart' },
  { id: 'blood Pressure', label: 'BP', value: '120/80', unit: 'mmHg', trend: 'stable', icon: 'Activity' },
  { id: 'spo2', label: 'SpO₂', value: 98, unit: '%', trend: 'optimal', icon: 'Wind' },
  { id: 'glucose', label: 'Glucose', value: 95, unit: 'mg/dL', trend: 'normal', icon: 'Droplet' },
];

export const DOCTORS = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiology',
    experience: '15 years',
    rating: 4.8,
    reviews: 342,
    available: true,
    hospital: 'Apollo Hospital',
  },
  {
    id: '2',
    name: 'Dr. Priya Singh',
    specialty: 'Neurology',
    experience: '12 years',
    rating: 4.7,
    reviews: 289,
    available: true,
    hospital: 'Fortis Hospital',
  },
];

export const MEDICAL_SHOPS = [
  {
    id: '1',
    name: 'MediCare Plus',
    distance: '0.5 km',
    rating: 4.6,
    open247: true,
    deliveryTime: '30 mins',
  },
];

export const HEALTH_PARAMETERS = {
  heartRate: { normal: '60-100', unit: 'bpm' },
  bloodPressure: { normal: '90-120/60-80', unit: 'mmHg' },
  spO2: { normal: '95-100', unit: '%' },
  glucose: { normal: '70-99', unit: 'mg/dL' },
};
```

## Implementation Notes

### For app/(tabs)/_layout.tsx
- Import and configure Tabs.Screen components
- Set up bottom tab navigation with icons: Home, MessageSquareHeart, Stethoscope, Activity, User
- Configure screen options and header styles

### For app/(tabs)/index.tsx (Home Screen)
- Display Daily Vitals in horizontal ScrollView
- Show AI Symptom Check banner
- Add Quick Services grid (Pharmacy, Emergency, Doctors, Delivery)
- Display Upcoming Appointments list

### For app/(tabs)/assistant.tsx (AI Chatbot)
- Implement chat interface with message bubbles
- Integrate OpenAI/Perplexity API with auto-detection
- Add suggested symptoms chips
- Include typing indicators and loading states

### For app/(tabs)/doctors.tsx
- Create searchable doctor list
- Show doctor cards with rating, experience, booking button
- Implement filtering by specialty

### For app/(tabs)/profile.tsx
- Display user health stats
- Show medical history timeline
- Add settings and connected devices section

### For app/(tabs)/health.tsx
- Show connected device status (smartwatch/fitness band)
- Display comprehensive health metrics
- Add Bluetooth connection prompt on mount
- Show device battery and sync status

### For components/BluetoothScanner.tsx
- Create animated modal for device scanning
- Implement device list and pairing animation
- Add data transfer progress visualization
- Handle connection success/error states

## Key Dependencies

All are defined in package.json:
- expo & expo-router: Framework and navigation
- react & react-native: Core framework
- lucide-react-native: Icons
- react-native-reanimated: Animations
- TypeScript: Type safety

## Environment Variables

Create a `.env` file:
```
EXPO_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

The app auto-detects API key type:
- sk-... → OpenAI (GPT-4o)
- pplx-... → Perplexity (llama-3.1-sonar)

## Running the App

```bash
npm install
npx expo start

# Scan QR code with Expo Go app
```

## Next Steps

1. Create the directory structure
2. Create each TypeScript/React Native file using the code from this guide
3. Copy the component code into respective files
4. Install dependencies: `npm install`
5. Run the app: `npx expo start`
6. Scan QR code with Expo Go on your phone

For detailed component code, refer to the Rork project or implement based on the descriptions above.
