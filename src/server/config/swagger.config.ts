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

        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Error interno del servidor"
            }
          }
        },

        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: {
              type: "string",
              example: "admin"
            },
            password: {
              type: "string",
              example: "123456"
            }
          }
        },

        AuthResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
            userId: {
              type: "string",
              example: "6823f7b8c91a2d001f6d9abc"
            }
          }
        },
        CreateUserRequest: {
          type: "object",

          required: [
            "name",
            "username",
            "email",
            "password"
          ],

          properties: {

            name: {
              type: "string",
              example: "Juan Pérez"
            },

            username: {
              type: "string",
              example: "juanperez"
            },

            email: {
              type: "string",
              example: "juan@email.com"
            },

            password: {
              type: "string",
              example: "123456"
            },

            role: {
              type: "string",
              enum: ["ADMIN", "EXECUTIVE", "AGENT"],
              example: "AGENT"
            }
          }
        },

        UpdateUserRequest: {
          type: "object",

          properties: {

            name: {
              type: "string"
            },

            username: {
              type: "string"
            },

            email: {
              type: "string"
            },

            password: {
              type: "string"
            },

            role: {
              type: "string",
              enum: ["ADMIN", "EXECUTIVE", "AGENT"]
            },

            isActive: {
              type: "boolean"
            }
          }
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6823f7b8c91a2d001f6d9abc"
            },

            username: {
              type: "string",
              example: "admin"
            },

            name: {
              type: "string",
              example: "Administrador General"
            },

            email: {
              type: "string",
              example: "admin@owlmanager.com"
            },

            role: {
              type: "string",
              enum: ["ADMIN", "EXECUTIVE", "AGENT"],
              example: "ADMIN"
            },

            isActive: {
              type: "boolean",
              example: true
            },

            createdAt: {
              type: "string",
              format: "date-time"
            },

            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
        },
        Client: {
          type: "object",

          properties: {

            _id: {
              type: "string",
              example: "6823f7b8c91a2d001f6d9abc"
            },

            name: {
              type: "string",
              example: "Empresa ABC"
            },

            email: {
              type: "string",
              example: "contacto@empresa.com"
            },

            phone: {
              type: "string",
              example: "3312345678"
            },

            company: {
              type: "string",
              example: "Tech Solutions"
            },

            assignedTo: {
              type: "string"
            }

          }
        },
        Ticket: {
          type: "object",

          properties: {

            _id:{ type:"string" },

            ticketId:{
              type:"string",
              example:"TCK-001"
            },

            requestName:{
              type:"string"
            },

            clientId:{
              type:"string"
            },

            assignedTo:{
              type:"string"
            },

            createdBy:{
              type:"string"
            },

            status:{
              type:"string",
              enum:[
                "PENDING",
                "IN_PROCESS",
                "CLOSED",
                "CANCELED"
              ]
            },

            cancelReason:{
              type:"string"
            },

            comments:{
              type:"array",
              items:{
                type:"object",
                properties:{
                  authorName:{
                    type:"string"
                  },

                  text:{
                    type:"string"
                  },

                  createdAt:{
                    type:"string",
                    format:"date-time"
                  }
                }
              }
            }
          }
        },
        Sale: {
          type: "object",

          properties: {

            _id: {
              type: "string"
            },

            clientId: {
              type: "string"
            },

            registeredBy: {
              type: "string"
            },

            amount: {
              type: "number",
              example: 1500
            },

            description: {
              type: "string",
              example: "Premium service sale"
            },

            saleDate: {
              type: "string",
              format: "date-time"
            },

            isActive: {
              type: "boolean",
              example: true
            },

            createdAt: {
              type: "string",
              format: "date-time"
            },

            updatedAt: {
              type: "string",
              format: "date-time"
            }
          }
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