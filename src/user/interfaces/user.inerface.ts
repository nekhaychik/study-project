import { Document, Types } from 'mongoose';

export interface User extends Document {
  email: string;
  password?: string;
};

export interface UserDB extends User {
  _id: Types.ObjectId;
};
