import * as jwt from 'jsonwebtoken';
import { Injectable} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/types/user';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JWTService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createToken(email: string) {
    const expiresIn = process.env.EXPIRES_IN;
    const secretOrKey = process.env.SECRET_KEY;
    const userInfo = { email: email };
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(signedUser): Promise<User> {
    const userFromDb = await this.userModel.findOne({ email: signedUser.email});
    if (userFromDb) {
      return userFromDb;
    }
    return null;
  }
}
