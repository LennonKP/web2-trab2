import { sign, verify } from 'jsonwebtoken';
import { JwtPayload, JwtProvider } from '../../application/ports/JwtProvider';

export default class JsonWebTokenProvider implements JwtProvider {
  private secret = 'SEGREDO_SECRETO';

  async sign(payload: object): Promise<string> {
    return sign(payload, this.secret, { expiresIn: '1d' });
  }

  async verify(token: string): Promise<JwtPayload | null> {
    try {
      const payload = verify(token, this.secret);
      return payload as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}