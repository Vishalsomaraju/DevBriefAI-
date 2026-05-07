import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGenerateContentStream } = vi.hoisted(() => ({
  mockGenerateContentStream: vi.fn()
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContentStream: mockGenerateContentStream
    })
  }))
}));

vi.mock('@/services/analyticsService', () => ({
  analyticsService: {
    trackQuestionAsked: vi.fn(),
    trackError: vi.fn(),
  }
}));

// Import after mocks
import { geminiService } from '@/services/geminiService';
import { analyticsService } from '@/services/analyticsService';

describe('GeminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('streamCodeAnalysis handles successful stream', async () => {
    const mockChunkText = vi.fn().mockReturnValue('chunk');
    
    // Create a proper async iterable for result.stream
    async function* makeStream() {
      yield { text: mockChunkText };
      yield { text: mockChunkText };
    }
    
    mockGenerateContentStream.mockResolvedValue({ stream: makeStream() });

    const onChunk = vi.fn();
    await geminiService.streamCodeAnalysis('What does this do?', 'const a = 1;', onChunk);
    
    expect(mockGenerateContentStream).toHaveBeenCalled();
    expect(analyticsService.trackQuestionAsked).toHaveBeenCalled();
    expect(onChunk).toHaveBeenCalledWith('chunk');
    expect(onChunk).toHaveBeenCalledTimes(2);
  });

  it('streamCodeAnalysis handles error in stream', async () => {
    mockGenerateContentStream.mockRejectedValue(new Error('API Error'));

    const onChunk = vi.fn();
    await geminiService.streamCodeAnalysis('What?', 'code', onChunk);
    
    expect(analyticsService.trackError).toHaveBeenCalledWith('gemini', 'API Error');
  });

  it('streamCodeAnalysis truncates long context', async () => {
    async function* makeStream() {
      yield { text: vi.fn().mockReturnValue('response') };
    }
    mockGenerateContentStream.mockResolvedValue({ stream: makeStream() });

    const longContext = 'x'.repeat(35000);
    const onChunk = vi.fn();
    await geminiService.streamCodeAnalysis('question', longContext, onChunk);
    
    const callArg = mockGenerateContentStream.mock.calls[0][0] as string;
    // Should be truncated to maxCodeContextLength (30000 chars from constants)
    expect(callArg.length).toBeLessThan(longContext.length + 500);
  });
});
