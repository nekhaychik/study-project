import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, VerifiedCallback, Strategy } from 'passport-jwt';

// Interfaces
import { UserDB } from 'src/user/interfaces/user.inerface';

// Services
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  public async validate(req: any, done: VerifiedCallback) {
    const user: UserDB = await this.authService.validateUser(req);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}
