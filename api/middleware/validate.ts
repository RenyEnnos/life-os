import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = await schema.parseAsync(req.body);
        req.body = parsed as typeof req.body;
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const details = error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            console.warn('[Validation Failed]', JSON.stringify({ path: req.originalUrl, body: req.body, errors: details }));
            return res.status(400).json({
                error: 'Validation Failed',
                code: 'VALIDATION_ERROR',
                details,
            });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
