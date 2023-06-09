import { Controller, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService, UserInterface } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { RolesGuard } from '../roles/roles.guard';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @Put(':id')
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    update(@Param('id') id: string, @Body() body: UserInterface) {
        return this.userService.update(id, body);
    }

    // @Post(':id/addToAccount/:accountId')
    // @Roles(Role.Super, Role.Admin)
    // @UseGuards(AuthGuard, RolesGuard)
    // addToAccount(@Param('id') id: string, @Param('accountId') accountId: string) {
    //     return this.userService.addToAccount(id, accountId);
    // }
}
