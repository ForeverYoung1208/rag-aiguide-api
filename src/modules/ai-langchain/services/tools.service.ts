import { Injectable } from '@nestjs/common';
import { tool } from 'langchain';
import { z } from 'zod';

@Injectable()
export class ToolsService {
  constructor() {}

  getVectorSearchTool() {
    return tool(
      ({ query }: { query: string }) => {
        return `... mock of the vectorSearch for ${query} ...`;
      },
      {
        name: 'vectorSearch',
        description: 'Search for relevant documents',
        schema: z.object({
          query: z.string().describe('Search query'),
        }),
      },
    );
  }
}
