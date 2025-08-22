import { OpenAPIV3 } from 'openapi-types';

const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Evidence API',
    version: '1.0.0',
    description: 'API documentation for Evidence Team 14 backend',
  },
  servers: [
    {
      url: 'http://localhost:5000',
    },
  ],
  paths: {},
};

export default swaggerSpec;