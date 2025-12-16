# AI Codebase Instructions & Architecture Overview

This document serves as a knowledge base for LLMs to quickly understand the project structure, patterns, and conventions of the `aiguide-api`.

## Project is API for e-commerce platform with RAG AI shopping assistant

## 1. Technology Stack
- **Framework**: NestJS
- **Language**: TypeScript
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Documentation**: Swagger (implied by `@ApiProperty` usage)
- **Serialization**: `class-transformer`

## 2. Project Structure
The project follows a modular architecture within `src/modules`.
- **`src/entities`**: Contains global TypeORM entity definitions.
- **`src/modules`**: Feature-specific modules (e.g., `carts`, `users`, `goods-knowledge`, `auth`, `dialogs`).
- **`src/db/migrations`**: Database migrations.

## 3. Database Schema & Relationships
Key entities and their relationships observed:
- **`User`**: The central actor.
- **`Cart`**: 
  - Belongs to a `User`.
  - Has many `CartsProducts` (items).
- **`Product`**:
  - Represents catalog items (name, code, price, description, brand).
  - Linked to carts via `CartsProducts`.
- **`CartsProducts`**: 
  - A Join Table Entity with additional columns (`quantity`, `priceForOne`, `dialogId`).
  - Connects `Cart` and `Product`.
  - Optionally links to a `Dialog` (likely for AI-assisted shopping context).
- **`Dialog`**: Represents chat sessions/conversations.

## 4. Coding Patterns & Conventions

### Response DTOs (Serialization)
- **Location**: `src/modules/<module-name>/responses/`
- **Naming**: `*.response.ts`
- **Base Decorators**:
  - Classes must use `@Exclude()` to hide properties by default.
  - Properties exposed to the client must use `@Expose()`.
- **Swagger**: properties need `@ApiProperty()`.
- **Nested Objects**: 
  - **CRITICAL**: When nesting objects (e.g., a `ProductResponse` inside `CartsProductsResponse`), you **MUST** use the `@Type(() => ClassName)` decorator from `class-transformer`. Without this, the nested object will not be serialized correctly.
  
  *Example:*
  ```typescript
  @Exclude()
  export class ParentResponse {
    @Expose()
    @ApiProperty()
    @Type(() => ChildResponse)
    child!: ChildResponse;
  }
  ```

### Services & repositories
- Business logic resides in `*.service.ts`.
- Standard TypeORM `Repository` pattern is used.
- Custom interfaces for inter-module communication may exist (e.g., `src/modules/ai-agent/interfaces-needed/`).

### Migrations
- Migrations are timestamped key files in `src/db/migrations`.
- Use `QueryRunner` for DDL operations (`CREATE TABLE`, `ALTER TABLE`, etc.).

## 5. Development Workflow
- **MCP Servers**: The project is configured to use MCP servers for local database access (configured in `.vscode/mcp.json`).
- **Cart Logic**: The cart system handles adding items, checking prices, and linking items to dialog contexts.

## 6. There are 2 SQL databases (both accessible through MCP servers)
- main database aiguide (src/config/db/data-source-options.config.ts) - for all application data, including main products database. Access throug standart TypeORM connection.
- secondary database goods (src/config/db/goods-data-source-options.config.ts) - for goods knowledge base for AI agent, manually synced with main database. Access through custom postgres connection pool.
