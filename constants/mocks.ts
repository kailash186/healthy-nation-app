export type VitalTrend = 'stable' | 'up' | 'down' | 'optimal' | 'normal';

export interface Vital {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  trend: VitalTrend;
  icon: 'Heart' | 'Activity' | 'Wind' | 'Droplet';
}

export const VITALS: Vital[] = [
  { id: 'heartRate', label: 'Heart Rate', value: 72, unit: 'bpm', trend: 'stable', icon: 'Heart' },
  { id: 'bloodPressure', label: 'BP', value: '120/80', unit: 'mmHg', trend: 'stable', icon: 'Activity' },
  { id: 'spo2', label: 'SpO₂', value: 98, unit: '%', trend: 'optimal', icon: 'Wind' },
  { id: 'glucose', label: 'Glucose', value: 95, unit: 'mg/dL', trend: 'normal', icon: 'Droplet' },
];

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  available: boolean;
  hospital: string;
}

export const DOCTORS: Doctor[] = [
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
  {
    id: '3',
    name: 'Dr. Anil Mehta',
    specialty: 'Endocrinology',
    experience: '10 years',
    rating: 4.6,
    reviews: 198,
    available: false,
    hospital: 'Max Healthcare',
  },
];

export interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
}

export const APPOINTMENTS: Appointment[] = [
  { id: 'a1', doctorId: '1', date: '2026-09-12', time: '10:30', type: 'video' },
  { id: 'a2', doctorId: '2', date: '2026-09-18', time: '15:00', type: 'in-person' },
];

export interface MedicalShop {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  open247: boolean;
  deliveryTime: string;
}

export const MEDICAL_SHOPS: MedicalShop[] = [
  {
    id: '1',
    name: 'MediCare Plus',
    address: '12 MG Road',
    distance: '0.5 km',
    rating: 4.6,
    open247: true,
    deliveryTime: '30 mins',
  },
  {
    id: '2',
    name: 'City Pharmacy',
    address: '48 Park Street',
    distance: '1.2 km',
    rating: 4.3,
    open247: false,
    deliveryTime: '45 mins',
  },
];

export const HEALTH_PARAMETERS = {
  heartRate: { label: 'Heart Rate', normal: '60-100', unit: 'bpm' },
  bloodPressure: { label: 'Blood Pressure', normal: '90-120/60-80', unit: 'mmHg' },
  spO2: { label: 'SpO₂', normal: '95-100', unit: '%' },
  glucose: { label: 'Blood Sugar (Fasting)', normal: '70-99', unit: 'mg/dL' },
} as const;

export const USER_PROFILE = {
  name: 'Aarav Sharma',
  age: 34,
  bloodType: 'O+',
  weightKg: 72,
  heightCm: 175,
  history: [
    { id: 'h1', date: '2026-06-02', title: 'Annual check-up', result: 'All parameters normal' },
    { id: 'h2', date: '2026-02-14', title: 'Lipid profile', result: 'LDL slightly elevated' },
  ],
};
