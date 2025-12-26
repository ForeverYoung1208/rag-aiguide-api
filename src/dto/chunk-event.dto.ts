import { MessageEvent } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EEventCustomTypes } from '../constants/system';

export class ChunkEventDto implements MessageEvent {
  @ApiProperty({
    enum: EEventCustomTypes,
    example: EEventCustomTypes.COMPLETE,
    required: false,
  })
  @Expose()
  type?: EEventCustomTypes;

  @ApiProperty({ required: false })
  @Expose()
  dialogId?: string | undefined;

  @ApiProperty({ required: false })
  @Expose()
  retry?: number | undefined;

  @ApiProperty({ required: true })
  @Expose()
  data!: string;
}
