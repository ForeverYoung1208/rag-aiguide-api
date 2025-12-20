import { registerAs } from '@nestjs/config';

export interface ILLMConfig {
  embeddingModel: string;
  chatModel: string;
  ollamaBaseUrl: string;
}

export const llmConfig = registerAs<ILLMConfig>('llmConfig', () => ({
  embeddingModel: process.env.EMBEDDING_MODEL!,
  chatModel: process.env.CHAT_MODEL!,
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL!,
  // messagesInChunk: process.env.MESSAGES_IN_CHUNK,
  // chunkOverlap: process.env.CHUNK_OVERLAP,
}));
