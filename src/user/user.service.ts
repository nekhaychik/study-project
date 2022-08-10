import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { Payload } from 'src/auth/interfaces/jwt-payload.interface';
import { User, UserDB } from './interfaces/user.inerface';
import { RegisterDTO } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
  ) {}

  async create(RegisterDTO: RegisterDTO): Promise<UserDB> {
    const { email } = RegisterDTO;
    const user: UserDB = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('REGISTER.USER_ALREADY_EXIST', HttpStatus.BAD_REQUEST);
    }
    const createdUser: UserDB = new this.userModel(RegisterDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByPayload(payload: Payload): Promise<UserDB> {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async findByLogin(UserDTO: LoginDTO): Promise<UserDB> {
    const { email, password } = UserDTO;
    const user: UserDB = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('LOGIN.USER_DOES_NOT_EXIST', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('LOGIN.INVALID_CREDENTIAL', HttpStatus.BAD_REQUEST);
    }
  }

  sanitizeUser(user: UserDB): UserDB {
    const sanitized: UserDB = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
}
