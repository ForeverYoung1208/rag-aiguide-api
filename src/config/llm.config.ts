import { registerAs } from '@nestjs/config';
import {
  LEAVE_ORIGINAL_MESSAGES,
  MAX_DIALOG_LENGTH,
} from '../constants/system';

export interface ILLMConfig {
  embeddingModel: string;
  chatModel: string;
  summarizeModel: string;
  ollamaBaseUrl: string;
  temperature: number;
  keepMessages: number;
  triggerSummarize: number;
  dbMemoryUri: string;
}

export const llmConfig = registerAs<ILLMConfig>('llmConfig', () => ({
  embeddingModel: process.env.EMBEDDING_MODEL!,
  chatModel: process.env.CHAT_MODEL!,
  summarizeModel: process.env.SUMMARIZE_MODEL!,
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL!,
  temperature: 0.7,
  keepMessages: LEAVE_ORIGINAL_MESSAGES,
  triggerSummarize: MAX_DIALOG_LENGTH,
  dbMemoryUri: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?sslmode=disable`,
}));
