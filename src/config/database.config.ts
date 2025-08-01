import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL!,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'observability_db',
  logging: process.env.NODE_ENV !== 'production',
  casing: 'snake_case' as const,
})); 