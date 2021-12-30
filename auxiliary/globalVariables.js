const env = process.env.ENVIRONMENT === 'Development';

// Urls
export const FrontendUrl = env ? process.env.KAIENTAI_DASHBOARD_FRONTEND_URL_DEV : process.env.KAIENTAI_DASHBOARD_FRONTEND_URL_PROD;
export const HostUrl = env ? process.env.HOST_URL_DEV : process.env.HOST_URL_PROD;
export const KaientaiApiUrl = env ? process.env.KAIENTAI_API_URL_DEV : process.env.KAIENTAI_API_URL_PROD;