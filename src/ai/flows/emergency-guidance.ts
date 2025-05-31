// 'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing a user's voice recording
 * and providing relevant first-aid guidance based on identified keywords.
 *
 * - voiceAnalysisForEmergencyGuidance - A function that handles the voice analysis and guidance process.
 * - VoiceAnalysisForEmergencyGuidanceInput - The input type for the voiceAnalysisForEmergencyGuidance function.
 * - VoiceAnalysisForEmergencyGuidanceOutput - The return type for the voiceAnalysisForEmergencyGuidance function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceAnalysisForEmergencyGuidanceInputSchema = z.object({
  voiceRecordingDataUri: z
    .string()
    .describe(
      "A voice recording of the user's distress call, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceAnalysisForEmergencyGuidanceInput = z.infer<typeof VoiceAnalysisForEmergencyGuidanceInputSchema>;

const VoiceAnalysisForEmergencyGuidanceOutputSchema = z.object({
  keywords: z.array(z.string()).describe('The keywords identified in the voice recording.'),
  guidance: z.string().describe('The first-aid guidance based on the identified keywords.'),
});
export type VoiceAnalysisForEmergencyGuidanceOutput = z.infer<typeof VoiceAnalysisForEmergencyGuidanceOutputSchema>;

export async function voiceAnalysisForEmergencyGuidance(
  input: VoiceAnalysisForEmergencyGuidanceInput
): Promise<VoiceAnalysisForEmergencyGuidanceOutput> {
  return voiceAnalysisForEmergencyGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceAnalysisForEmergencyGuidancePrompt',
  input: {schema: VoiceAnalysisForEmergencyGuidanceInputSchema},
  output: {schema: VoiceAnalysisForEmergencyGuidanceOutputSchema},
  prompt: `You are an AI assistant specialized in providing first-aid guidance based on voice analysis.

You will receive a voice recording of a user in distress. Your task is to analyze the recording, identify keywords related to medical emergencies, and provide relevant first-aid guidance.

Analyze the following voice recording for keywords:
{{media url=voiceRecordingDataUri}}

Based on the identified keywords, provide first-aid guidance. Respond in a JSON format:

{
  "keywords": ["keyword1", "keyword2", ...],
  "guidance": "First-aid guidance based on the identified keywords."
}
`,
});

const voiceAnalysisForEmergencyGuidanceFlow = ai.defineFlow(
  {
    name: 'voiceAnalysisForEmergencyGuidanceFlow',
    inputSchema: VoiceAnalysisForEmergencyGuidanceInputSchema,
    outputSchema: VoiceAnalysisForEmergencyGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
