declare var ENV_CONFIG: any
export const environment = {
  production: true,
  baseUrl: ENV_CONFIG.API_URL,
  gzipBaseUrl: ENV_CONFIG.GZIP_API_URL,
  imageBaseUrl: '',
}
