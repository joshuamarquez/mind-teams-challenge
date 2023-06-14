import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
 
export const devConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'database',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true,
}

export const testConfig: TypeOrmModuleOptions = {
  type: "sqlite",
  database: ":memory:",
  dropSchema: true,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  synchronize: true,
  logging: false
}
