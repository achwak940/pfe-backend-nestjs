import { BadRequestException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateEnqueteDto } from './dto/create-enquete.dto';
import { UpdateEnqueteDto } from './dto/update-enquete.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enquete } from './entities/enquete.entity';
import { Repository } from 'typeorm';
import { StatusEnquete } from './entities/status.enum';
import { TypeParticipation } from './entities/TypeParticipation.enum';
@Injectable()
export class EnqueteService {
   constructor(@InjectRepository(Enquete) private enqueteRepo: Repository<Enquete>){
   }
  create(createEnqueteDto: CreateEnqueteDto) {
    const enquette=this.enqueteRepo.create(createEnqueteDto)
    if(!createEnqueteDto.titre||createEnqueteDto.titre.trim()===''){
      throw new BadRequestException('titre est obligatoire')
    }
    if(createEnqueteDto.description &&  createEnqueteDto.description?.length<10){
      throw new BadRequestException("Description doit avoir au moins 10 caractères")

    }
 this.enqueteRepo.save(enquette)
    return {
        message: 'Enquête créée avec succès',
        data: enquette
    };
  }
  async findAll() {
   const listeEnquettes =  await this.enqueteRepo.find(
      ({
        order: {
            createAt: 'DESC'  
        }
    })

    )
    if(listeEnquettes.length===0){
      return {
        message:"aucun enquete trouve"
      }

    }
    return listeEnquettes
  }
  findEnqueteByid(id: number) {
    return this.enqueteRepo.findOne({
      where :{id:id}
    });
  }
async update(id: number, updateEnqueteDto: UpdateEnqueteDto) {
   const enquete=await this.findEnqueteByid(id)
   if(!enquete){
    throw new NotFoundException(`Enquete avec id ${id} non trouvée`)
   }
   if(updateEnqueteDto.description && updateEnqueteDto.description.length<10){
      throw new BadRequestException("Description doit avoir au moins 10 caractères")
   }
   if(updateEnqueteDto.userId){
    enquete.user={id:updateEnqueteDto.userId} as any
   }
   Object.assign(enquete,updateEnqueteDto)
   //Empêcher que le champ adminId soit sauvegardé ou modifié par l’utilisateur via update.
   delete (enquete as any).adminId
   const updateEnquete=await this.enqueteRepo.save(enquete)
   return{
    message:'Enquête mise à jour avec succés',
    data:updateEnquete
   }
}
  async remove(id: number) {
    const enquete= await this.findEnqueteByid(id)
    if(!enquete){
  throw new NotFoundException(`Enquete avec id ${id} non trouvée`)
    }
    this.enqueteRepo.delete(id)
    return{
       message:'Enquête supprimée  avec succés',
    data: enquete
    } ;
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

  async changeTypedeParticipation(id:number,type:TypeParticipation){
  const rechEnquete=await this.findEnqueteByid(id)
  if(!rechEnquete){
     throw new NotFoundException(`Enquete avec id ${id} non trouvée`)
    
  }
  rechEnquete.typeParticipation=type
  const updateEnquete = await this.enqueteRepo.save(rechEnquete);

  return {
    message: "Type de participation changé avec succès",
    data: updateEnquete, 
  };
  
}
}
