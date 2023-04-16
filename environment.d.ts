declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      GUILD_ID: string;
      ENVIRONMENT: "dev" | "prod" | "debug";
    }
  }
}

export {};
