// // src/app.ts
// import express from "express";
// import cors from "cors";
// import { requestIdMiddleware } from "./middleware/requestId";
// import { apiLimiter } from "./middleware/rateLimiter";
// import { errorHandler } from "./middleware/errorHandler";
// // import auditRoutes from './routes/audit.routes'; // We will forge this next
// // import { healthCheck } from './controllers/health.controller';

// export const app = express();

// // Trust proxy if you are putting this behind Nginx or an Ingress in the future
// app.set("trust proxy", 1);

// // Global Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(requestIdMiddleware);
// app.use(apiLimiter);

// // System Routes
// // app.get('/health', healthCheck);

// // API Routes
// // app.use('/audit', auditRoutes);

// // The Final Shield
// app.use(errorHandler);


// src/app.ts
import express from 'express';
import cors from 'cors';
import { requestIdMiddleware } from './middleware/requestId';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import auditRoutes from './routes/audit.routes';
import { healthCheck } from './controllers/health.controller'; 

export const app = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());
app.use(requestIdMiddleware);
app.use(apiLimiter);

app.get('/health', healthCheck);
app.use('/api/audit', auditRoutes);

app.use(errorHandler);