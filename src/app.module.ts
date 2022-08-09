import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const HOST:string = process.env.MONGODB_HOST || 'localhost';
const PORT:string = process.env.MONGODB_PORT || '27017';
const DATABASE:string = process.env.MONGODB_DATABASE || 'test';
const URI:string = `mongodb://${HOST}:${PORT}/${DATABASE}`;

@Module({
  imports: [
    MongooseModule.forRoot(URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
