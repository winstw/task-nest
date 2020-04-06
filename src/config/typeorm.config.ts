import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
// console.log(__dirname);
// console.log(fs.readFileSync(__dirname + '/../auth/user.entity.js', { encoding: 'utf-8' }));
const dbConfig = config.get('db')

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: ["dist/**/*.entity{.ts,.js}",
        "dist/**/*.entity{.ts,.js}"],
    // entities: [__dirname + '/../**/*.entity{.ts,.js}',
    // __dirname + '/../auth/user.entity{.js, .ts}'
    // ],
    synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
}
