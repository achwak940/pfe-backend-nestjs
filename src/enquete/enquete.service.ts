import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnqueteDto } from './dto/create-enquete.dto';
import { UpdateEnqueteDto } from './dto/update-enquete.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enquete } from './entities/enquete.entity';
import { Repository } from 'typeorm';
import { StatusEnquete } from './entities/status.enum';
@Injectable()
export class EnqueteService {
   constructor(@InjectRepository(Enquete) private enqueteRepo: Repository<Enquete>){
   }
  create(createEnqueteDto: CreateEnqueteDto) {
    const enquette=this.enqueteRepo.create(createEnqueteDto)
 this.enqueteRepo.save(enquette)
    return enquette;
  }
  findAll() {
    return this.enqueteRepo.find(
      ({
        order: {
            createAt: 'DESC'  
        }
    })

    )
  }
  findOne(id: number) {
    return this.enqueteRepo.findOne({
      where :{id:id}
    });
  }
async update(id: number, updateEnqueteDto: UpdateEnqueteDto) {
    // 1️⃣ Trouver l'enquête existante
    const enquete = await this.enqueteRepo.findOne({ where: { id } });
    if (!enquete) {
        throw new NotFoundException(`Enquete avec id ${id} non trouvée`);
    }
    if (updateEnqueteDto.userId) {
        enquete.user = { id: updateEnqueteDto.userId } as any; 
    }
    Object.assign(enquete, updateEnqueteDto);
    delete (enquete as any).adminId; 
    return this.enqueteRepo.save(enquete);
}
  remove(id: number) {
    return this.enqueteRepo.delete(id);
  }
  //pour return les enquette avec leur utilisateur
  async findByUser(userId: number) {
    return this.enqueteRepo.find({
        where: { user: { id: userId } },
        relations: ['user'],
        order: { createAt: 'DESC' }
    });
}
async changeStatut(id: number, newStatut: StatusEnquete) {
    const enquete = await this.enqueteRepo.findOneBy({ id });
    if (!enquete) {
        return {error:"Enquete non trouvée"};  
    }
    enquete.statut = newStatut;
    return this.enqueteRepo.save(enquete);
}
async getAllenqueteEnBrullion(){
  return this.enqueteRepo.find({
    where:{ statut:StatusEnquete.Brouillon}}
  )
}
async getAllEnqueteFerme(){
   return this.enqueteRepo.find({
    where:{ statut:StatusEnquete.Fermee}}
  )
}
async getAllEnquetePubliee(){
  return this.enqueteRepo.find(
    {
      where:{statut:StatusEnquete.Publiee}
    }
  )
}
async getAllEnqueteArchive(){
  return this.enqueteRepo.find(
    {
      where:{statut:StatusEnquete.archive}
    }
  )
}
}
