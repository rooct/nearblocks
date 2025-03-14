import { ConnectionOptions } from 'tls';

import { createKnex, Knex } from 'nb-knex';

import config from '#config';

const ssl: ConnectionOptions = {
  rejectUnauthorized: true,
};

if (config.dbCa) {
  ssl.ca = Buffer.from(config.dbCa, 'base64').toString('utf-8');
  ssl.cert = Buffer.from(config.dbCert, 'base64').toString('utf-8');
  ssl.key = Buffer.from(config.dbKey, 'base64').toString('utf-8');
}

const knex: Knex = createKnex({
  client: 'pg',
  connection: {
    application_name: 'indexer-base',
    connectionString: config.dbUrl,
    ssl: ssl?.ca ? ssl : false,
    statement_timeout: 60 * 1000, // 60s
  },
  pool: {
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 20,
    min: 10,
    propagateCreateError: false,
  },
});

export default knex;
