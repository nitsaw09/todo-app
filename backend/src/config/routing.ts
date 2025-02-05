import path from "path";
import { Action } from "routing-controllers";
import jwt from 'jsonwebtoken';

export const routingControllerOptions = {
  cors: true,
  controllers: [path.join(__dirname, '../modules/**/*.controller.ts')],
  interceptors: [path.join(__dirname, '../utils/interceptors/*.interceptor.ts')],
  middlewares: [path.join(__dirname, '../utils/middlewares/*.middleware.ts')],
  defaultErrorHandler: false,
  validation: true, 
  classTransformer: true, 
  routePrefix: '/api',
  currentUserChecker: async (action: Action) => {
    const token = action.request.headers['authorization']?.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  }
}