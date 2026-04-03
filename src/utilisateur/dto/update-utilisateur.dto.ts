import { PartialType } from '@nestjs/mapped-types';
import { CreateUtilisateurDto } from './create-utilisateur.dto';

export class UpdateUtilisateurDto extends PartialType(CreateUtilisateurDto) {
    id:number
    prenom:string
    nom:string
    email:string
    telephone:string
    photo_profil:string
    mot_de_passe:string

}
