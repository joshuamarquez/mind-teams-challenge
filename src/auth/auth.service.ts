import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly logger: Logger
  ) {}

  async signIn(email, pass) {
    const user = await this.usersService.findOne(email);

    this.logger.log({ user });

    if (user) {
      const match = await bcrypt.compare(pass, user.password);
      if (match) {
        const payload = {
          id: user.id,
          name: user.name, 
          email: user.email,
          role: user.role,
          account: user.account
        };

        return {
          user,
          access_token: await this.jwtService.signAsync(payload),
        };
      }
    }

    throw new UnauthorizedException();
  }
}
