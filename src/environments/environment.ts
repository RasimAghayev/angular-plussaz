/**
 * The configuration of the production build.
 *
 * The address of the API is the one of the public mock the demonstration
 * talks to. A deployment can point the same image at another API with the
 * file `config.json`, which the web server places next to the application.
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://jsonplaceholder.typicode.com',
};
