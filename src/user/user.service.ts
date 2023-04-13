import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.chema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDetails } from './user-details.interface';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async getUserDetails(user: UserDocument): Promise<UserDetails> {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      return null;
    }

    return this.getUserDetails(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
}
