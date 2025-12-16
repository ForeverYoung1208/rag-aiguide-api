import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SqlResultResponse {
  @Expose()
  @ApiProperty()
  rows!: any[];

  @Expose()
  @ApiProperty()
  rowCount!: any[];
}
