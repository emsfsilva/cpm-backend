import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginPayload } from '../dtos/loginPayload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'seu-secret',
    });
  }

  async validate(payload: LoginPayload): Promise<LoginPayload> {
    // Aqui você pode adicionar validações extras se quiser
    return payload;
  }
}
