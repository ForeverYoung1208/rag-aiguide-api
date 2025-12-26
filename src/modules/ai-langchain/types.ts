import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';

export type TLangchainMessagesTypes =
  | HumanMessage
  | AIMessage
  | SystemMessage
  | ToolMessage;
