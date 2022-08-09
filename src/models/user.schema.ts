import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
});

UserSchema.pre(
  'save',
  async function(next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
      const hashed: string = await bcrypt.hash(this['password'], 10);
      this['password'] = hashed;
      return next();
    } catch (err) {
      return next(err);
    }
  }
)