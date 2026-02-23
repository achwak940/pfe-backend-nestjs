import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnqueteService } from './enquete.service';
import { CreateEnqueteDto } from './dto/create-enquete.dto';
import { UpdateEnqueteDto } from './dto/update-enquete.dto';
import { StatusEnquete } from './entities/status.enum';
@Controller('enquete')
export class EnqueteController {
  constructor(private readonly enqueteService: EnqueteService) {}
  @Post('/creation')
  create(@Body() createEnqueteDto: CreateEnqueteDto) {
    return this.enqueteService.create(createEnqueteDto);
  
  }
  @Get("/all")
  findAll() {
    return this.enqueteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enqueteService.findOne(+id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateEnqueteDto: UpdateEnqueteDto) {
    return this.enqueteService.update(+id, updateEnqueteDto);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.enqueteService.remove(+id);
  }
  @Get('/findbyuser/:id')
  findenquetebyUser(id:number){
    return this.enqueteService.findByUser(id)
  }
@Patch('/change-statut/:id')
changeStatut(
    @Param('id') id: string,
    @Body('statut') statut: StatusEnquete
) 
{
    return this.enqueteService.changeStatut(+id, statut);
}
}
