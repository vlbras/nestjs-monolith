// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Lavarage API',
    version: '1.0.0',
    description: 'API documentation for Lavarage SDK methods',
  },
  host: 'partner-api.lavarave.wtf',
  schemes: ['https'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./dist/server.js']; // Adjust if necessary

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated');
});
