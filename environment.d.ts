declare global {
    namespace NodeJS {
      interface ProcessEnv {
        POST_DB_HOST: string;
        POST_DB_PORT: number;
        POST_DB_NAME: string;
        POST_DB_USER: string;
        POST_DB_PASS: DynamicPassword;
        POST_DB_MAX_CONNECTIONS: number;
        POST_DB_ADMIN_USER: string;
        POST_DB_ADMIN_NAME: string;
        POST_DB_ADMIN_PASS: string;
        NODE_ENV: 'development' | 'production';
        PORT: string;
        PWD: string;
        API_BASE_PATH: string;
        API_CURRENT_VERSION: string;
      }
    }
  }

  export{}