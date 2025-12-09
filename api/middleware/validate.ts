import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
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
