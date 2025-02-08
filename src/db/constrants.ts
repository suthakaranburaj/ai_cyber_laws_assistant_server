import Knex, { Knex as KnexType } from 'knex';

const knex: KnexType = Knex({
    client: 'postgresql',
    connection: {
        host: process.env.DB_HOST as string,
        user: process.env.DB_USER as string,
        database: process.env.DB_NAME as string,
        password: process.env.DB_PASSWORD as string,
        port: Number(process.env.DB_PORT) || 3306,
        timezone: 'utc',
    },
});

export function knexDb(DB_NAME: string): KnexType {
    return Knex({
        client: 'postgresql',
        connection: {
            host: process.env.DB_HOST as string,
            user: process.env.DB_USER as string,
            database: DB_NAME,
            password: process.env.DB_PASSWORD as string,
            port: Number(process.env.DB_PORT) || 3306,
            timezone: 'utc',
        },
    });
}

export default knex;
