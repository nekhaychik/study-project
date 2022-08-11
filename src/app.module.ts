import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

// Modules
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

const HOST: string = process.env.MONGODB_HOST || 'localhost';
const PORT: string = process.env.MONGODB_PORT || '27017';
const DATABASE: string = process.env.MONGODB_DATABASE || 'test';
const URI: string = `mongodb://${HOST}:${PORT}/${DATABASE}`;

@Module({
  imports: [
    MongooseModule.forRoot(URI),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
