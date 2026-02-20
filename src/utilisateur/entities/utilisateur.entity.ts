import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../role.enum";
import { Status } from "../status.enum";
@Entity()
export class Utilisateur {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    prenom:string
    @Column()
    nom:string
    @Column({unique:true})
    email:string
    @Column()
    mot_de_passe:string
    @Column({
        type:'enum',
        enum:Role,
        default:Role.USER_CONNECTE
    })
    role:Role
  @Column({
  type: 'enum',
  enum: Status,
  default: Status.INACTIF
})
statut: Status;

    @Column({default:false})
    est_verifie:boolean
    @Column({type: 'varchar', nullable:true})
    code_verification:string | null
    @Column({nullable:true})
    code_reset:string
    @Column({type:'timestamp', nullable:true})
    token_expiration:Date | null
    @Column({nullable:true})
    google_id:string
    @Column({default:() => 'NOW()'})
    date_creation:Date
    @Column({nullable:true})
    date_modification:Date
}