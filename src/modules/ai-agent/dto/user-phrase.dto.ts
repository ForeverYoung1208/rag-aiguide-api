import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { USER_PHRASE_MAX_LENGTH } from '../../../constants/system';
import { ApiProperty } from '@nestjs/swagger';

export class UserPhraseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(USER_PHRASE_MAX_LENGTH)
  phrase!: string;

  @IsString()
  @IsOptional()
  @MaxLength(USER_PHRASE_MAX_LENGTH)
  @ApiProperty({ required: false })
  continueDialogId?: string;
}
