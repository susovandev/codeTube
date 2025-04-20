import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeTube Api',
      version: '1.0.0',
      description: 'API documentation for CodeTube Api',
    },
    servers: [
      {
        url: 'http://localhost:8080/api/v1',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/features/**/*.routes.ts', './src/features/**/*.controller.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
