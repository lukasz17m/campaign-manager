const config = {
  /**
   * Development environment config
   */
  development: {
    http: {
      port: 3000,
    },
    mongoose: {
      database: {
        user: 'use',
        password: 'your',
        host: 'own',
        port: 'database',
        name: ':)',
      },
      options: {
        useMongoClient: true,
      },
      reconnectTimeoutMS: 32000,
    },
  },
  /**
   * Production environment config
   */
  production: {
    http: {
      port: 80,
    },
    mongoose: {
      database: {
        user: 'setup',
        password: 'db',
        host: 'connection',
        port: 'also',
        name: 'here',
      },
      options: {
        useMongoClient: true,
      },
      reconnectTimeoutMS: 32000,
    },
  },
};

module.exports = (env = 'development') => config[env];
