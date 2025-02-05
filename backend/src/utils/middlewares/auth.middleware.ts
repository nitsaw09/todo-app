import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      (req as any).user = decoded; 
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}
