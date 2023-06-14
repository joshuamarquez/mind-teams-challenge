import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { AccountInterface, AccountService } from './account.service';
import { RolesGuard } from '../roles/roles.guard';

@Controller('account')
export class AccountController {
    constructor(
        private accountService: AccountService
    ) { }

    @Get()
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    find() {
        return this.accountService.find();
    }

    @Post()
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    create(@Body() body: AccountInterface) {
        return this.accountService.create(body);
    }

    @Put(':id')
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    update(@Param('id') id: number, @Body() body: AccountInterface) {
        return this.accountService.update(id, body);
    }

    @Delete(':id')
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    delete(@Param('id') id: number) {
        return this.accountService.delete(id);
    }
}
