export interface ICartService {
  addItemToCart(userId: string, productId: string): Promise<void>;
}
