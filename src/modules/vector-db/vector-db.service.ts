import { OllamaEmbeddings } from '@langchain/ollama';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { ILLMConfig } from '../../config/llm.config';
import { DataException } from '../../exceptions/data-exceptions';
import { QdrantVectorStore } from '@langchain/qdrant';
import { Product } from '../../entities/product.entity';
import { Document } from '@langchain/core/documents';
import { IVectorDbConfig } from '../../config/vector-db.config';

@Injectable()
export class VectorDbService {
  private readonly logger: Logger = new Logger(VectorDbService.name);
  constructor(private readonly configService: ConfigService) {}

  async getVectorStore(collectionName: string): Promise<QdrantVectorStore> {
    const embeddingsInterface = this.createEmbeddingsInterface();
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      embeddingsInterface,
      {
        url: this.configService.get('vectorDbHost'),
        collectionName: collectionName,
      },
    );
    return vectorStore;
  }

  createEmbeddingsInterface(): OllamaEmbeddings {
    const embeddingsInterface = new OllamaEmbeddings({
      model: this.configService.get<ILLMConfig>('llmConfig')?.embeddingModel,
      baseUrl: this.configService.get<ILLMConfig>('llmConfig')?.ollamaBaseUrl,
    });
    if (!embeddingsInterface.model || !embeddingsInterface.baseUrl) {
      throw new DataException('Embeddings model or baseUrl not found');
    }
    return embeddingsInterface;
  }

  async ingestData({
    collectionName,
    documents,
  }: {
    collectionName: string;
    documents: Document[];
  }): Promise<QdrantVectorStore> {
    const embeddingsInterface = this.createEmbeddingsInterface();
    const config =
      this.configService.get<() => IVectorDbConfig>('vectorDbConfig')!();

    return await QdrantVectorStore.fromDocuments(
      documents,
      embeddingsInterface,
      {
        collectionName,
        url: `${config.vectorDbHost}:${config.vectorDbPort}`,
      },
    );
  }

  transformProductsToDocuments(products: Product[]): Document[] {
    const documents: Document[] = [];
    products.forEach((product) => {
      documents.push(
        new Document({
          pageContent: `Name: ${product.name}. Description: ${product.description}. Brand: ${product.brand}. Price: ${product.price}`,
          metadata: {
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
          },
        }),
      );
    });
    return documents;
  }
}
