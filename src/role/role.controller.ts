import {
  Controller, Get, Post, Put, Delete, Patch,
  Param, Body, ParseIntPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  /** Toggle actif/inactif — notifie + emaile les utilisateurs du rôle */
  @Patch(':id/toggle-statut')
  toggleStatut(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.toggleStatut(id);
  }

  // ---- Assignation ----

  @Post(':roleId/assign/:userId')
  assignToUser(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.roleService.assignRoleToUser(roleId, userId);
  }

  @Post(':roleId/assign-bulk')
  assignToUsers(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body('userIds') userIds: number[],
  ) {
    return this.roleService.assignRoleToUsers(roleId, userIds);
  }

  @Delete('unassign/:userId')
  unassign(@Param('userId', ParseIntPipe) userId: number) {
    return this.roleService.unassignRoleFromUser(userId);
  }
}