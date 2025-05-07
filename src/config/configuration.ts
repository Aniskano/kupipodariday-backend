export default () => ({
  db: {
    autoloadEntities: Boolean(process.env.DATABASE_AUTOLOAD_ENTITIES),
    host: process.env.DATABASE_HOST ?? 'localhost',
    name: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE),
    username: process.env.DATABASE_USERNAME,
  },
  jwt: {
    secretKey: process.env.JWT_PRIVATE_KEY,
    tokenTimeLimit: process.env.JWT_TOKEN_TIME_LIMIT,
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  },
});
