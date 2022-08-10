import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [UserService],
  controllers: [],
  exports: [
    UserService,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})
export class UserModule {}
