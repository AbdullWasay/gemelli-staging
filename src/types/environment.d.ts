declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Existing environment variables
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      JWT_SECRET: string;
      
      // Stripe variables
      STRIPE_SECRET_KEY: string;
      STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
      
      // AWS S3 variables
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_S3_BUCKET_NAME: string;
      
      // Other app variables
      [key: string]: string | undefined;
    }
  }
}

// Converting this into a module
export {}





