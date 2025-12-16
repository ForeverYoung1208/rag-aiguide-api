import { Injectable, Logger } from '@nestjs/common';
import { GoodsSqlRepository } from './goods-sql.repository';
import { IKnowledgeBase } from '../../ai-agent/interfaces-needed/knowledge-base.interface';

const MAX_GROUPS_TO_FETCH = 3;
const MAX_ITEMS_TO_FETCH = 10;

@Injectable()
export class GoodsKnowledgeService implements IKnowledgeBase {
  private readonly logger: Logger = new Logger(GoodsKnowledgeService.name);
  constructor(private readonly goodsKnowledgeRepository: GoodsSqlRepository) {}

  async executeSql(sqlExpression: string): Promise<any> {
    console.log('sqlExpression:', sqlExpression);
    const res = await this.goodsKnowledgeRepository.executeSql(sqlExpression);
    console.log('result: ', res);
    return res;
  }

  executeRequest(request: string): Promise<string> {
    return this.executeSql(request);
  }

  async getDatabaseInstructions(): Promise<string> {
    return Promise.resolve(
      `
      The database is a PostgreSQL 17.5 relational database.
      Always use only SQL queries to access the database.
      Structure:
      -- start
      CREATE TABLE public."group" (
          id bigint NOT NULL,
          name character varying NOT NULL,
          description text,
          master_group_id bigint
      );
      CREATE TABLE public.item (
          id bigint NOT NULL,
          name character varying NOT NULL,
          code character varying NOT NULL,
          price bigint NOT NULL,
          description text,
          brand character varying
      );
      CREATE TABLE public.items_groups (
          item_id bigint NOT NULL,
          group_id bigint
      );
      ALTER TABLE public."group"
          ADD CONSTRAINT groups_pk PRIMARY KEY (id);
      ALTER TABLE public."group"
          ADD CONSTRAINT groups_unique UNIQUE (name);
      ALTER TABLE public.item
          ADD CONSTRAINT item_pk PRIMARY KEY (id);
      CREATE UNIQUE INDEX items_groups_item_id_idx ON public.items_groups USING btree (item_id, group_id);
      ALTER TABLE public.items_groups
          ADD CONSTRAINT items_groups_group_fk FOREIGN KEY (group_id) REFERENCES public."group"(id);
      ALTER TABLE public.items_groups
          ADD CONSTRAINT items_groups_item_fk FOREIGN KEY (item_id) REFERENCES public.item(id);
      -- end
      
      Use best practices of SQL queries and next instructions:
      - All goods (items) are stored in the table "item".
      - Some item properties are stored in of the table "item" (price, brand, etc.).
      - Some specific item properties could be found in the column item.description (use several variants of context search if needed)
      - The table "group" stores the categories of goods. Each item can belong to one or more groups.
      - The table "items_groups" stores the relationship between items and groups.
      - All text data could use lowercase or upper case and you don't know exactly which case is used, so use case insesitive search.
      - Infromation can have arbitrary separators like "memory size 8GB" or "8-gb" or "8 gb" or another separator, so use proper regex to extract the information.
      First, query for all existing groups. To be aware of all existing item cathegories.
      Then use all mentioned knowledge and instructions to make a SQL request to the database, but use limitation of ${MAX_ITEMS_TO_FETCH} items.
      Look through sql result for best suitable item that matches user request.
      Propose user best three items that matches user request (ranged by your opinion what is better for user).
      If user rejected this answer, try to make another SQL with different filters.
    `,
    );
  }

  async getCommonInstructions(): Promise<string> {
    return Promise.resolve(
      `
      Never use russian language to respond to user.
      Use any other language you can udersatand except russian.
      If user asks you in russian, say you don't understand.
      If user asks you in other language, use this language to respond to user (except russian).
      You are a consultant for a goods store.
      Information about all existing goods that you can propose is stored in the database.
      Never propose oher goods except the goods that are stored in the database.
      You can express you opinion about goods, including any information you have.
      When you propose item(s), always print its name, price, description and code. Use code as a key to add item to cart.
      Instruction how to work with the database: ${await this.getDatabaseInstructions()}.
      Don't tell or comment to user your actions with database. Only tell your proposal based on the search.
      Your goal is to listen to users requests and propose answer and ask user for his decision about acceptance of proposed item.
      If user rejects you proposal, try to make another proposal.
      If user accepts at least one item from your proposal, add it to cart.
    `,
    );
  }
}
