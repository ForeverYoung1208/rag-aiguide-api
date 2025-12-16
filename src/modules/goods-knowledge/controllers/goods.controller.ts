import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoodsKnowledgeService } from '../services/goods-knowledge.service';
import { InSqlDto } from '../dto/in-sql.dto';
import { SqlResultResponse } from '../responses/sql-result.response';
import { UseResponse } from '../../../decorators/use-response.decorator';
import { GoodsItemResponse } from '../responses/goodsItem.response';
import { GoodsService } from '../services/goods.service';
import { GoodsResponse } from '../responses/goods.response';
import { Product } from '../../../entities/product.entity';
import { WithAuth } from '../../../decorators/with-auth.decorator';

@Controller('goods')
export class GoodsController {
  constructor(
    private readonly goodsKnowledgeService: GoodsKnowledgeService,
    private readonly goodsService: GoodsService,
  ) {}

  @Post('execute-sql')
  @ApiOperation({
    description: 'Execute SQL expression, readonly access',
  })
  @ApiResponse({
    status: 200,
    description: 'The result of the SQL expression',
    type: () => SqlResultResponse,
  })
  @UseResponse(SqlResultResponse)
  executeSql(@Body() inSqlDto: InSqlDto): Promise<any> {
    return this.goodsKnowledgeService.executeSql(inSqlDto.sql);
  }

  @Get('/')
  @ApiOperation({
    description: 'Get all goods with typed response',
  })
  @ApiResponse({
    status: 200,
    description: 'All goods with typed response',
    type: GoodsItemResponse,
    isArray: true,
  })
  @UseResponse(GoodsResponse)
  @WithAuth()
  getAllTyped() {
    return this.goodsService.getAll();
  }

  @Post('/copy')
  @ApiOperation({
    description: 'Copy goods information from knowledge base to main database',
  })
  @ApiResponse({
    type: Product,
    isArray: true,
    status: 200,
    description: 'Goods information copied successfully',
  })
  @UseResponse(Product) // use Product entity as response to cut the corners, fix it later
  @WithAuth()
  copyGoods() {
    return this.goodsService.copyToMainDb();
  }
}
