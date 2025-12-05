# Healthy Nation App

An AI-powered mobile health monitoring application designed to address early detection and remote monitoring of chronic diseases with access to quality healthcare.

## Features

### 1. Dashboard (Home Screen)
- **Daily Vitals**: Real-time health data (Heart Rate, SpO2, BP, Glucose) with trend indicators
- **AI Symptom Check Banner**: Quick access to health checkups
- **Upcoming Appointments**: List of scheduled doctor visits with video call options
- **Quick Services**: Fast access to Pharmacy, Emergency, Doctors, and Delivery

### 2. AI Health Assistant
- **Symptom Checker**: Describe symptoms and get AI-powered analysis
- **Health Parameter Monitoring**: Tracks normal and abnormal vital ranges
- **Emergency Alerts**: Immediate alerts for critical conditions
- **Medication Recommendations**: Personalized treatment suggestions

### 3. Find Doctors
- **Doctor Search**: Find specialists by condition
- **Doctor Profiles**: View experience, qualifications, and success rates
- **Rating System**: Hospital and doctor rankings based on customer service
- **Appointment Booking**: Schedule visits and online consultations

### 4. Profile & Medical History
- **Virtual Medical Records**: Complete health history without physical documents
- **Health Stats**: Quick overview of age, blood type, weight
- **Medical Timeline**: Past visits and results
- **Settings**: Connected devices, insurance, preferences

### 5. Pharmacy & Local Services
- **Medical Shop Locator**: Find nearby pharmacies with ratings
- **24/7 Emergency Shops**: Highlighted for emergency needs
- **Local Delivery**: Integration with local delivery apps
- **Payment Options**: Credit/Debit, Apple Pay, Cash on Delivery

### 6. Fitness Tracker Integration
- **Bluetooth Connection**: Seamless smartwatch/fitness band pairing
- **Health Metrics**: Heart Rate, Blood Pressure, SpO2, ECG, Body Composition
- **Distance Tracking**: Steps and distance walked
- **Real-time Sync**: Live data synchronization from wearable devices

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Icons**: lucide-react-native
- **State Management**: React Hooks
- **AI Integration**: OpenAI/Perplexity API

## Installation

```bash
npm install
# or
bun install
```

## Environment Variables

Create a `.env` file with:

```
EXPO_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

## Running the App

```bash
npx expo start
```

Scan the QR code with Expo Go app or run on emulator.

## Project Structure

```
app/
  (tabs)/
    _layout.tsx      # Tab navigation
    index.tsx        # Home dashboard
    assistant.tsx    # AI chatbot
    doctors.tsx      # Doctor finder
    profile.tsx      # User profile
    health.tsx       # Health monitoring
  pharmacy/
    _layout.tsx      # Pharmacy routes
    index.tsx        # Shop listing
    [id].tsx         # Shop details
  checkout/
    index.tsx        # Checkout flow
  _layout.tsx        # Root layout
  +not-found.tsx     # Not found page

components/
  BluetoothScanner.tsx  # Device pairing UI

constants/
  colors.ts          # Color palette
  mocks.ts           # Mock data
```

## Features in Detail

### Health Monitoring
- Heart Rate: 60-100 bpm (Normal)
- Blood Pressure: 90-120 / 60-80 mmHg
- SpO2: 95-100% (Normal)
- ECG: Normal Sinus Rhythm
- Blood Sugar: 70-99 mg/dL (Fasting)

### Wearable Devices
Supports integration with:
- Smartwatches (Apple Watch, Wear OS)
- Fitness Bands
- Health Rings

## API Integration

### OpenAI/Perplexity API
The app automatically detects your API key type:
- **OpenAI keys** (sk-...): Uses GPT-4o model
- **Perplexity keys** (pplx-...): Uses llama-3.1-sonar model

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
