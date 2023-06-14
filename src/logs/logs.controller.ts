import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { LogInterface, LogQueryFilter, LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
    constructor(
        private logService: LogsService,
    ) {}

    @Get()
    @Roles(Role.Super, Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    find(@Query() query: LogQueryFilter): Promise<LogInterface[]> {
        return this.logService.find(query);
    }
}
