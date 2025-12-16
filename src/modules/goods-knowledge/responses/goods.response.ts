import { TypedListResponseFactory } from '../../../responses/typed-list.response.factory';
import { GoodsItemResponse } from './goodsItem.response';

export class GoodsResponse extends TypedListResponseFactory(
  GoodsItemResponse,
) {}
