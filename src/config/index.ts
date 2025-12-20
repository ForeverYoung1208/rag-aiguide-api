import { databaseConfig } from './db/database.config';
import { vectorDbConfig } from './vector-db.config';

import { envValidationConfig } from './env-validation.config';
import { ENV_TEST } from '../constants/system';
import { throttlerConfig } from './throttler.config';
import { llmConfig } from './llm.config';

export const envFilePath = (): string =>
  process.env.NODE_ENV === ENV_TEST ? '.env.test' : '.env';

export default () => ({
  databaseConfig,
  vectorDbConfig,
  llmConfig,
  envValidationConfig,
  throttlerConfig,
});
