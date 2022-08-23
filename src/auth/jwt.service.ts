import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import config from 'src/config';

// Interfaces
import { IToken } from './interfaces/token.interface';
import { Payload } from './interfaces/jwt-payload.interface';

// Schemas
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class JWTService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  public async createToken(email: string): Promise<IToken> {
    const expiresIn: number = config.jwt.expiresId;
    const secretOrKey: string = process.env.SECRET_KEY;
    const userInfo: Payload = { email: email };
    const token: string = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  public async validateUser(signedUser): Promise<UserDocument | null> {
    const userFromDb: UserDocument = await this.userModel.findOne({
      email: signedUser.email,
    });
    if (userFromDb) {
      return userFromDb;
    }
    return null;
  }
}
