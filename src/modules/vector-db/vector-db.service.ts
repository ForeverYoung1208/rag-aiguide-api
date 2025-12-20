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
  public readonly embeddingsInterface: OllamaEmbeddings;

  private readonly vectorDbConfig: IVectorDbConfig;
  private readonly llmConfig: ILLMConfig;

  constructor(private readonly configService: ConfigService) {
    this.vectorDbConfig =
      this.configService.get<() => IVectorDbConfig>('vectorDbConfig')!();
    this.llmConfig = this.configService.get<() => ILLMConfig>('llmConfig')!();
    this.embeddingsInterface = this.createEmbeddingsInterface();
  }

  createEmbeddingsInterface(): OllamaEmbeddings {
    const embeddingsInterface = new OllamaEmbeddings({
      model: this.llmConfig.embeddingModel,
      baseUrl: this.llmConfig.ollamaBaseUrl,
    });
    if (!embeddingsInterface.model || !embeddingsInterface.baseUrl) {
      throw new DataException('Embeddings model or baseUrl not found');
    }
    return embeddingsInterface;
  }

  async getVectorStore(collectionName: string): Promise<QdrantVectorStore> {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
      this.embeddingsInterface,
      {
        url: `${this.vectorDbConfig.vectorDbHost}:${this.vectorDbConfig.vectorDbPort}`,
        collectionName: collectionName,
      },
    );
    return vectorStore;
  }

  async ingestData({
    collectionName,
    documents,
  }: {
    collectionName: string;
    documents: Document[];
  }): Promise<QdrantVectorStore> {
    const existingCollection = await this.getVectorStore(collectionName);
    const existingCollectionInfo =
      await existingCollection.client.getCollection(collectionName);
    this.logger.log(
      `Existing collection ${collectionName} has ${existingCollectionInfo.points_count} points`,
    );

    const newStore = await QdrantVectorStore.fromDocuments(
      documents,
      this.embeddingsInterface,
      {
        collectionName,
        url: `${this.vectorDbConfig.vectorDbHost}:${this.vectorDbConfig.vectorDbPort}`,
      },
    );
    const collectionInfo = await newStore.client.getCollection(collectionName);
    this.logger.log(
      `After ingestion, collection ${collectionName} has ${collectionInfo.points_count} points`,
    );
    return newStore;
  }

  transformProductsToDocuments(products: Product[]): Document[] {
    const documents: Document[] = [];
    products.forEach((product) => {
      documents.push(
        new Document({
          id: product.id + 10000,
          pageContent: `Name: ${product.name}. Description: ${product.description}. Brand: ${product.brand}. Price: ${product.price}`,
          metadata: {
            product_id: product.id,
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
