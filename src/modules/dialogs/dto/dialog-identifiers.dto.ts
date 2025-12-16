import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class DialogIdentifiersDto {
  @Expose()
  @IsString()
  @ApiProperty()
  id!: string;

  @Expose()
  @IsString()
  @ApiProperty()
  sseToken!: string;
}
