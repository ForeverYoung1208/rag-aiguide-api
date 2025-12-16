import { MessageEvent } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EEventTypes } from '../constants';
import { MessageDataDto } from './message-data.dto';

export class MyMessageEventDto implements MessageEvent {
  @ApiProperty({
    enum: EEventTypes,
    example: EEventTypes.COMPLETE,
    required: false,
  })
  @Expose()
  type?: EEventTypes;

  @ApiProperty({ required: false })
  @Expose()
  id?: string | undefined;

  @ApiProperty({ required: false })
  @Expose()
  retry?: number | undefined;

  @ApiProperty({ required: true })
  @Expose()
  @Type(() => MessageDataDto)
  data!: MessageDataDto;
}
