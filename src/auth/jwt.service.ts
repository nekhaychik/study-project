import * as jwt from 'jsonwebtoken';
import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Interfaces
import { User, UserDB } from 'src/user/interfaces/user.inerface';
import { IToken } from './interfaces/token.interface';
import { Payload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JWTService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  public async createToken(email: string): Promise<IToken> {
    const expiresIn: string = process.env.EXPIRES_IN;
    const secretOrKey: string = process.env.SECRET_KEY;
    const userInfo: Payload = { email: email };
    const token: string = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  public async validateUser(signedUser): Promise<UserDB | null> {
    const userFromDb: UserDB = await this.userModel.findOne({ email: signedUser.email});
    if (userFromDb) {
      return userFromDb;
    }
    return null;
  }
}
