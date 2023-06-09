import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
 
export const devConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'database',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: true,
}
