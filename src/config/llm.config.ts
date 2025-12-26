import { registerAs } from '@nestjs/config';

export interface ILLMConfig {
  embeddingModel: string;
  chatModel: string;
  ollamaBaseUrl: string;
  temperature: number;
}

export const llmConfig = registerAs<ILLMConfig>('llmConfig', () => ({
  embeddingModel: process.env.EMBEDDING_MODEL!,
  chatModel: process.env.CHAT_MODEL!,
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL!,
  temperature: 0.7,
  // messagesInChunk: process.env.MESSAGES_IN_CHUNK,
  // chunkOverlap: process.env.CHUNK_OVERLAP,
}));
