import { Response } from 'express';

export function ok<T>(res: Response, data: T) {
  return res.json({ success: true, data });
}

export function created<T>(res: Response, data: T) {
  return res.status(201).json({ success: true, data });
}

export function fail(res: Response, message: string, status: number = 400) {
  return res.status(status).json({ success: false, error: message });
}
