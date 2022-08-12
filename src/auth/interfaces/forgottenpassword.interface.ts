import { Document, Types } from 'mongoose';

export interface ForgottenPassword extends Document {
  email: string;
  newPasswordToken: string;
  timestamp: Date;
}

export interface ForgottenPasswordDB extends ForgottenPassword {
  _id: Types.ObjectId;
}
