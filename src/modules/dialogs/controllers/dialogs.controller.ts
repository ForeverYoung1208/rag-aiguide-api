import { Body, Controller, Post } from '@nestjs/common';
import { DialogsService } from '../services/dialogs.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IdStringDto } from '../../../dto/id-string.dto';
import { UseResponse } from '../../../decorators/use-response.decorator';
import { WithAuth } from '../../../decorators/with-auth.decorator';
import { AuthUser } from '../../../decorators/auth-user.decorator';
import { UserPhraseDto } from '../dto/user-phrase.dto';

@Controller('dialogs')
export class DialogsController {
  constructor(private readonly dialogsService: DialogsService) {}

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
    return this.dialogsService.addUserPhrase(
      authUser.id,
      body.phrase,
      body.continueDialogId,
    );
  }
}
