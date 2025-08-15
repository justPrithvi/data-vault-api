module.exports = {
  apps: [
    {
      name: "data-vault-api",
      script: "dist/main.js",
      env: {
        NODE_ENV: "production",
        APP_PORT: 5001,
        DB_TYPE: "mysql",
        DB_HOST: "localhost",
        DB_PORT: 3306,
        DB_USERNAME: "nest_user",
        DB_PASSWORD: "securepassword",
        DB_DATABASE: "my_nest_app",
        JWT_SECRET: "your_secret_key",
        JWT_REFRESH_SECRET: "your_refresh_secret",
        AWS_ACCESS_KEY_ID: "AKIAUW4RBFE7KCY4FEBK",
        AWS_SECRET_ACCESS_KEY: "ZypZh6qgNbpveZtDAVifUjzZB5a6s8XJzft29X+L",
        AWS_REGION: "eu-north-1",
        PROFILE_BUCKET: "prithvi-demo-bucket",
        QUEUE_URL: "https://sqs.eu-north-1.amazonaws.com/324037323070/ConnectionRequestQueue",
        COGNITO_CLIENT_ID: "4gamvra2c4hadqtmv57s83f3er",
        COGNITO_USER_POOL_ID: "eu-north-1_dWNBeQfUG"
      }
    }
  ]
};
