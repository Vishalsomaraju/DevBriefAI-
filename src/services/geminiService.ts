/**
 * @module services/geminiService
 * @description Manages interactions with Google Gemini API, including prompt construction and response streaming.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '@/config/env';
import { APP_CONFIG, GEMINI } from '@/constants';
import { ApiResponse } from '@/types';
import { analyticsService } from './analyticsService';

class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = ENV.gemini.apiKey;
    if (!apiKey) {
      console.error('[GeminiService] API Key is missing. Check your .env file.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'MISSING_KEY');
  }

  /**
   * Streams a response from Gemini based on user question and code context.
   * Truncates context to the max length defined in APP_CONFIG.
   * 
   * @param {string} question - The user's prompt or question.
   * @param {string} codeContext - The provided codebase URL or raw code.
   * @param {(chunk: string) => void} onChunk - Callback executed when a new text chunk is received.
   * @returns {Promise<ApiResponse<string>>} Structured API response containing the full text or an error.
   */
  public async streamCodeAnalysis(
    question: string,
    codeContext: string,
    onChunk: (chunk: string) => void
  ): Promise<ApiResponse<string>> {
    try {
      const model = this.genAI.getGenerativeModel({ model: GEMINI.MODEL });
      
      const truncatedContext = codeContext.substring(0, APP_CONFIG.maxCodeContextLength);
      if (codeContext.length > APP_CONFIG.maxCodeContextLength) {
        console.warn(`[GeminiService] Context truncated from ${codeContext.length} to ${APP_CONFIG.maxCodeContextLength} characters.`);
      }

      const systemPrompt = `You are an expert developer assistant analyzing a codebase.
Code Context provided:
${truncatedContext}

Please answer the following question or perform the requested task based on the context above. Provide structured, accurate markdown with syntax highlighting.`;

      const prompt = `${systemPrompt}\n\nUser Question/Task: ${question}`;
      
      analyticsService.trackQuestionAsked();

      const result = await model.generateContentStream(prompt);
      let fullText = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        onChunk(chunkText);
      }

      return { data: fullText, error: null };
    } catch (error) {
      console.error('[GeminiService] Streaming Error:', error);
      analyticsService.trackError('gemini', error instanceof Error ? error.message : 'Unknown streaming error');
      return { data: null, error: 'Failed to analyze code with Gemini' };
    }
  }
}

export const geminiService = new GeminiService();
