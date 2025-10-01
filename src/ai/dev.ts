import { config } from 'dotenv';
config();

import '@/ai/flows/emergency-guidance.ts';
import '@/ai/flows/symptom-guidance-flow.ts';
import '@/ai/flows/nearby-hospitals-flow.ts';
