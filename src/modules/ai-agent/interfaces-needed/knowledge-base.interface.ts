export interface IKnowledgeBase {
  executeRequest(expression: string): Promise<any>;
  getDatabaseInstructions(): Promise<string>;
  getCommonInstructions(): Promise<string>;
}
