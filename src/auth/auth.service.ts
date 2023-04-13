import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserDetails } from '../user/user-details.interface';
import { ExistingUserDto } from '../user/dtos/existing-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(
    createUserDto: Readonly<CreateUserDto>,
  ): Promise<UserDetails | any> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser) {
      throw new HttpException(
        'User with that email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.userService.getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return this.userService.getUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDto,
  ): Promise<{ token: string } | string> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    console.log('user', user);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const jwt = await this.jwtService.signAsync({ user });

    return { token: jwt };
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (e) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
