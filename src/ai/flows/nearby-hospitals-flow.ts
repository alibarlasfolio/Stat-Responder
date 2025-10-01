'use server';
/**
 * @fileOverview A Genkit flow to find nearby hospitals using the Google Maps Places API.
 *
 * - getNearbyHospitals - A function that fetches hospitals within a specified radius.
 * - NearbyHospitalsInput - The input type for the getNearbyHospitals function.
 * - NearbyHospitalsOutput - The return type for the getNearbyHospitals function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

const NearbyHospitalsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the user\'s location.'),
  longitude: z.number().describe('The longitude of the user\'s location.'),
});
export type NearbyHospitalsInput = z.infer<typeof NearbyHospitalsInputSchema>;

const HospitalSchema = z.object({
  name: z.string().describe('The name of the hospital.'),
  vicinity: z.string().describe('The address or general vicinity of the hospital.'),
  place_id: z.string().describe('A unique identifier for the place.'),
});
export type Hospital = z.infer<typeof HospitalSchema>;

const NearbyHospitalsOutputSchema = z.object({
  hospitals: z.array(HospitalSchema).describe('A list of nearby hospitals.'),
});
export type NearbyHospitalsOutput = z.infer<typeof NearbyHospitalsOutputSchema>;

export async function getNearbyHospitals(input: NearbyHospitalsInput): Promise<NearbyHospitalsOutput> {
  return getNearbyHospitalsFlow(input);
}

const getNearbyHospitalsFlow = ai.defineFlow(
  {
    name: 'getNearbyHospitalsFlow',
    inputSchema: NearbyHospitalsInputSchema,
    outputSchema: NearbyHospitalsOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY environment variable is not set.');
    }

    const radius = 30000; // 30km
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${input.latitude},${input.longitude}&radius=${radius}&type=hospital&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data: any = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Places API request failed with status: ${data.status}. ${data.error_message || ''}`);
      }

      const hospitals = data.results.map((result: any) => ({
        name: result.name,
        vicinity: result.vicinity,
        place_id: result.place_id,
      }));

      return { hospitals };
    } catch (error: any) {
      console.error('Error fetching nearby hospitals:', error);
      // Re-throw the error to be caught by the client
      throw new Error(`Failed to fetch nearby hospitals: ${error.message}`);
    }
  }
);
