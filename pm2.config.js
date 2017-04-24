module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // MOCK-SERVER PROD
    {
      name      : "MOCK-SERVER",
      script    : "./server.js",
      args      : "8080",
      env_production : {
        NODE_ENV: "production"
      }
    },

    // MOCK-SERVER DEVELOPMENT
    {
      name      : "MOCK-SERVER-DEV",
      script    : "./server.js",
      args      : "8081",
      watch     : [
        "./models",
        "./node_modules",
        "./routes",
        "./middlewares",
        "./server.js",
        "./server.config.js"
      ],
      ignore_watch : "./data",
      env_production : {
        NODE_ENV: "development"
      }
    },
  ]
}
