import { registerAs } from '@nestjs/config';

// PostgreSQL configuration for goods database
export const goodsDataSourceOptions = registerAs(
  'goods-data-source-options',
  () => ({
    host: process.env.DB_HOST, // assume that same host is used for goods db, change if needed
    port: parseInt(process.env.DB_PORT || '', 10), // assume that same port is used for goods db, change if needed
    database: process.env.DB_GOODS_DATABASE,
    username: process.env.DB_USERNAME, // assume that same user is used for goods db, change if needed
    password: process.env.DB_PASSWORD, // assume that same user password is used for goods db, change if needed
  }),
);
