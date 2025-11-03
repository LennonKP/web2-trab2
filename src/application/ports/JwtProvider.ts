export interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

export interface JwtProvider {
  sign(payload: object): Promise<string>;
  verify(token: string): Promise<JwtPayload | null>;
}