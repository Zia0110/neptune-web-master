// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
declare var ENV_CONFIG: any
export const environment = {
  production: false,
  baseUrl: ENV_CONFIG.API_URL,
  gzipBaseUrl: ENV_CONFIG.GZIP_API_URL,
  imageBaseUrl: '',
  // baseUrl:'http://localhost:5050'
}
