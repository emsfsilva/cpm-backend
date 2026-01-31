module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/main.js',
      env: {
        PORT: 8081,
      },
    },
  ],
};
