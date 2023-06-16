import { Controller, Post, Put, Param, Body, UseGuards, Delete, Get, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService, UserClass } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { Role } from '../roles/role.enum';
import { RolesGuard } from '../roles/roles.guard';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    find() {
        return this.userService.find(null, { account: true });
    }

    @Put(':id')
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    update(@Param('id') id: number, @Body() body: UserClass) {
        return this.userService.update(id, body);
    }

    @Delete(':id')
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }

    @Post(':id/addToAccount/:accountId')
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    addToAccount(@Param('id') id: number, @Param('accountId') accountId: number) {
        return this.userService.addToAccount(id, accountId);
    }
}
