import {
  Body,
  Controller,
  MessageEvent,
  Post,
  Query,
  Sse,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserPhraseDto } from '../dto/user-phrase.dto';
import { AiAgentService } from '../services/ai-agent.service';
import { Observable } from 'rxjs';
import { AuthUser } from '../../../decorators/auth-user.decorator';
import { WithAuth } from '../../../decorators/with-auth.decorator';
import { UseResponse } from '../../../decorators/use-response.decorator';
import { IdStringDto } from '../../../dto/id-string.dto';
import { MyMessageEventDto } from '../dto/message-event.dto';
import { DialogIdentifiersDto } from '../../dialogs/dto/dialog-identifiers.dto';
import { DialogsService } from '../../dialogs/services/dialogs.service';

@Controller('ai-agent')
export class AiAgentController {
  constructor(
    private readonly aiAgentService: AiAgentService,
    private readonly dialogsService: DialogsService,
  ) {}

  @ApiOperation({
    description: 'User request (phrase)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dialog id',
    type: () => IdStringDto,
  })
  @UseResponse(IdStringDto)
  @Post('user-phrase')
  @WithAuth()
  async userPhrase(
    @AuthUser() authUser: IdStringDto,
    @Body() body: UserPhraseDto,
  ) {
    return this.aiAgentService.addUserPhrase(
      authUser.id,
      body.phrase,
      body.continueDialogId,
    );
  }

  @Sse('send-dialog-to-ai')
  @ApiOperation({
    summary: 'Send dialog to AI',
    description:
      'Opens a Server-Sent Events stream with AI response chunks for the given dialog and phrase.',
  })
  @ApiProduces('text/event-stream')
  @ApiOkResponse({
    description: 'SSE stream of AI response chunks',
    type: MyMessageEventDto,
    content: {
      'text/event-stream': {
        schema: {
          $ref: getSchemaPath(MyMessageEventDto),
        },
      },
    },
  })
  async stream(
    @Query() dialogIdentifiers: DialogIdentifiersDto,
  ): Promise<Observable<MyMessageEventDto>> {
    await this.dialogsService.checkSseToken(dialogIdentifiers);
    return this.aiAgentService.sendDialogToAiStreamed(dialogIdentifiers.id);
  }
}
