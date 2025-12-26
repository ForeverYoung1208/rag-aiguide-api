import { Controller, Param, Post, Sse } from '@nestjs/common';
import { AiLangchainService } from './services/ai-langchain.service';
import { Observable } from 'rxjs';
import { ChunkEventDto } from '../../dto/chunk-event.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  getSchemaPath,
} from '@nestjs/swagger';

@Controller('ai-langchain')
export class AiLangchainController {
  constructor(private readonly aiService: AiLangchainService) {}

  @Post('start/:dialogId')
  @Sse('send-dialog-to-ai')
  @ApiOperation({
    summary: 'Send dialog to AI',
    description:
      'Opens a Server-Sent Events stream with AI response chunks for the given dialog and phrase.',
  })
  @ApiProduces('text/event-stream')
  @ApiOkResponse({
    description: 'SSE stream of AI response chunks',
    type: ChunkEventDto,
    content: {
      'text/event-stream': {
        schema: {
          $ref: getSchemaPath(ChunkEventDto),
        },
      },
    },
  })
  startConversation(
    @Param('dialogId') dialogId: string,
  ): Observable<ChunkEventDto> {
    return this.aiService.sendDialogToAiStreamed(dialogId);
  }
}
