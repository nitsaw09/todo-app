import 'reflect-metadata';
import express from 'express';
import { useExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { connectDatabase } from './database';
import swaggerUi from 'swagger-ui-express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllerOptions } from './config/routing';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

connectDatabase();

app.use(express.json());

useExpressServer(app, routingControllerOptions);

// Generate OpenAPI specification
const storage = getMetadataArgsStorage();
const schemas: Record<string, any> = validationMetadatasToSchemas();

const spec = routingControllersToSpec(storage, routingControllerOptions, {
  info: {
    title: 'TODO API',
    version: '1.0.0',
    description: 'API for managing tasks',
  },
  components: {
    schemas, 
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  }
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
