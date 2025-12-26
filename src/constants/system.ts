export const ENV_LOCAL = 'local';
export const ENV_DEV = 'development';
export const ENV_STAGE = 'staging';
export const ENV_PROD = 'production';
export const ENV_TEST = 'test';

export const REGEX_DATE_CHECK = new RegExp(/\\d{4}-\\d{2}-\\d{2}/);
export const REGEX_PASSWORD_CHECK = new RegExp(
  /^(?=.*\d)(?=.*[a-zA-Z\u0400-\u04FF])(?=.*\W).+$/,
);

export const DATE_FORMAT = 'YYYY-MM-DD';

export enum OrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ThrottlerRule {
  DEFAULT = 'default',
}

export enum AUTH_TYPES {
  JWT = 'JWT',
}

export enum ErrorCodes {
  UNKNOWN_ERROR = 'unknown-error',
  VALIDATION_FAILED = 'validation-failed',
  COMMON_ERROR_WITH_MESSAGE = 'common-error-with-message',
  DATA_PROCESSING_ERROR = 'data-processing-error',
  DATABASE_SERVER_ERROR = 'database-server-error',
  ACCESS_ERROR = 'access-error',
}

export const USER_PHRASE_MAX_LENGTH = 2048;

export const SUMMARIZE_MODEL_MAX_OUTPUT_TOKENS = 1000;
export const MAX_DIALOG_LENGTH = 20;
export const LEAVE_ORIGINAL_MESSAGES = 5;

export enum EEventCustomTypes {
  COMPLETE = 'complete',
}

export enum ELMTypes {
  HUMAN = 'human',
  SYSTEM = 'system',
  AI = 'ai',
  TOOL = 'tool',
}

