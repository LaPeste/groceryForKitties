declare global {
    namespace NodeJS {
      interface ProcessEnv {
        TODO_DB_HOST: string;
        TODO_DB_PORT: number;
        TODO_DB_NAME: string;
        TODO_DB_USER: string;
        TODO_DB_PASS: DynamicPassword;
        TODO_DB_MAX_CONNECTIONS: number;
        TODO_DB_ADMIN_USER: string;
        TODO_DB_ADMIN_NAME: string;
        TODO_DB_ADMIN_PASS: string;
        NODE_ENV: 'development' | 'production';
        PORT: string;
        PWD: string;
        API_BASE_PATH: string;
      }
    }
  }

  export{}