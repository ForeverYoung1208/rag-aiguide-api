import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class IdStringDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Expose()
  @ApiProperty({ example: '1234567890asdf' })
  id!: string;
}
