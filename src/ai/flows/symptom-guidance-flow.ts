'use server';
/**
 * @fileOverview A Genkit flow to provide first-aid guidance based on a user-selected symptom.
 *
 * - getSymptomGuidance - A function that fetches first-aid advice.
 * - SymptomGuidanceInput - The input type for the getSymptomGuidance function.
 * - SymptomGuidanceOutput - The return type for the getSymptomGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomGuidanceInputSchema = z.object({
  symptom: z.string().describe('The symptom selected by the user.'),
});
export type SymptomGuidanceInput = z.infer<typeof SymptomGuidanceInputSchema>;

const SymptomGuidanceOutputSchema = z.object({
  guidance: z.string().describe('First-aid advice for the given symptom. Provide actionable steps. If the symptom is critical, advise calling emergency services first. Format the advice with clear steps or bullet points where appropriate.'),
});
export type SymptomGuidanceOutput = z.infer<typeof SymptomGuidanceOutputSchema>;

export async function getSymptomGuidance(input: SymptomGuidanceInput): Promise<SymptomGuidanceOutput> {
  return symptomGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomGuidancePrompt',
  input: {schema: SymptomGuidanceInputSchema},
  output: {schema: SymptomGuidanceOutputSchema},
  prompt: `You are an AI assistant providing first-aid guidance.
The user has selected the following symptom: "{{symptom}}".

Please provide concise, actionable first-aid steps for this symptom.
If the symptom is indicative of a life-threatening emergency, your first and most important piece of advice MUST be to call local emergency services immediately.
Keep the advice practical and easy to understand for a layperson in a stressful situation.
Format the guidance clearly, using bullet points or numbered steps if appropriate.
Respond with only the guidance text.
`,
});

const symptomGuidanceFlow = ai.defineFlow(
  {
    name: 'symptomGuidanceFlow',
    inputSchema: SymptomGuidanceInputSchema,
    outputSchema: SymptomGuidanceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
