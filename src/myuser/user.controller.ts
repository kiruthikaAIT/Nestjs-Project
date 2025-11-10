import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Userservice } from './user.service';
import { User } from './user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly Userservice: Userservice) {}
  
  @Post()
  create(@Body() body: Partial<User>) {
    return this.Userservice.create(body);
  }

  @Get()
  findAll() {
    return this.Userservice.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.Userservice.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<User>) {
    return this.Userservice.update(id, body);
  }

  @Patch(':id')
  updatePartial(@Param('id') id: string, @Body() body: Partial<User>) {
    return this.Userservice.updatePartial(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.Userservice.remove(id);
  }
}
