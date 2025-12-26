import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessageDataDto {
  @ApiProperty()
  @Expose()
  dialogId!: string;

  @ApiProperty()
  @Expose()
  message!: string;
}
