import { Request, Response } from 'express';
import AuthService from '../../../application/services/AuthService';
import { loginSchema, registerSchema } from '../schemas/AuthSchema';
import z from 'zod';

export default class AuthController {
    constructor(private authService: AuthService) {}

    public renderLoginPage(req: Request, res: Response) {
        res.render('auth_login', { title: 'Login' });
    }

    public renderRegisterPage(req: Request, res: Response) {
        res.render('auth_register', { title: 'Registro' });
    }

    public handleSignout(_req: Request, res: Response) {
        res.clearCookie('token').redirect('/auth/login');
    }

    public async handleLogin(req: Request, res: Response) {
        const title = 'Login';
        const view = 'auth_login';

        const validationResult = loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            const formatedErrors = z.treeifyError(validationResult.error);
            return res.status(422).render(view, {
                title,
                errors: formatedErrors.properties,
                oldInput: req.body
            });
        }

        try {
            const { email, password } = validationResult.data;
            const { token } = await this.authService.login(email, password);
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');
        } catch (e: any) {
            res.render(view, { title, error: e.message, oldInput: req.body });
        }
    }

    public async handleRegister(req: Request, res: Response) {
        const title = 'Registro';
        const view = 'auth_register';

        const validationResult = registerSchema.safeParse(req.body);
        if (!validationResult.success) {
            const formatedErrors = z.treeifyError(validationResult.error);
            console.log(formatedErrors.properties);
            
            return res.status(422).render(view, {
                title,
                errors: formatedErrors.properties,
                oldInput: req.body
            });
        }

        try {
            const { email, name, password } = validationResult.data;
            const { token } = await this.authService.register(name, email, password);
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');
        } catch (e: any) {
            res.render(view, { title, error: e.message, oldInput: req.body });
        }
    }
}