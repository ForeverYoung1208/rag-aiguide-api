import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InSqlDto {
  @ApiProperty({
    example: 'SELECT * FROM item i WHERE i.id=1',
  })
  @IsString()
  sql!: string;
}
