import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ForgottenPasswordDocument = ForgottenPassword & Document;

@Schema()
export class ForgottenPassword {
  @Prop()
  email: string;

  @Prop()
  newPasswordToken: string;

  @Prop()
  timestamp: Date;
}

export const ForgottenPasswordSchema =
  SchemaFactory.createForClass(ForgottenPassword);
