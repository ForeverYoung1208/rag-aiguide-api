import { registerAs } from '@nestjs/config';

export interface IVectorDbConfig {
  vectorDbHost: string;
  vectorDbPort: number;
  productsCollectionName: string;
}

export const vectorDbConfig = registerAs<IVectorDbConfig>(
  'vectorDbConfig',
  () => {
    let vectorDbHost = process.env.VECTOR_DB_HOST;
    if (vectorDbHost?.slice(0, 4) !== 'http') {
      vectorDbHost = 'http://' + vectorDbHost;
    }
    return {
      vectorDbHost,
      vectorDbPort: Number(process.env.VECTOR_DB_PORT!),
      productsCollectionName: process.env.PRODUCTS_COLLECTION_NAME!,
    };
  },
);
