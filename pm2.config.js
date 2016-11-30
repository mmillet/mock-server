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

  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/production",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env production"
    },
    dev : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/development",
      "post-deploy" : "npm install && pm2 startOrRestart ecosystem.json --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
}
