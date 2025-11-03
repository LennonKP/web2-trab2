import { Response, NextFunction } from 'express';
import { JwtProvider } from '../../../application/ports/JwtProvider';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export default function createAuthMiddleware (jwtProvider: JwtProvider) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.token;
            if (!token) return res.redirect('/auth/login');

            const payload = await jwtProvider.verify(token);
            if (!payload?.userId) return res.redirect('/auth/login');

            req.user = payload;
            next();
        } catch (err: any) {
            return res.redirect('/auth/login');
        }
    };
};