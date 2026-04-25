import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Owl Manager API",
      version: "1.0.0",
      description: "Documentación de la API de Owl Manager",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            username: { type: "string" },
            role: { type: "string", enum: ["admin", "ejecutivo", "agente"] },
          },
        },
        Client: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
            assignedTo: { type: "string" },
          },
        },
        Ticket: {
          type: "object",
          properties: {
            _id: { type: "string" },
            status: {
              type: "string",
              enum: ["pendiente", "en_proceso", "cancelado", "cerrado"],
            },
            client: { type: "string" },
          },
        },
        Sale: {
          type: "object",
          properties: {
            _id: { type: "string" },
            amount: { type: "number" },
            client: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/**/*.ts',
  './dist/**/*.js' ]
};

export const swaggerSpec = swaggerJSDoc(options);