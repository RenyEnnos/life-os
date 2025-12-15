import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = schema.parse(req.body);
        // Apply sanitized/normalized values from schema transforms
        (req as any).body = parsed;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            console.warn('[Validation Failed]', { path: req.originalUrl, body: req.body, errors: error.errors });
            return res.status(400).json({
                error: 'Validation Failed',
                details: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                })),
            });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
