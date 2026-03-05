import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusEnquete } from "./status.enum";
import { type } from "os";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
import { TypeParticipation } from "./TypeParticipation.enum";
import { Question } from "src/question/entities/question.entity";
@Entity()
export class Enquete {
    @PrimaryGeneratedColumn()
    id :number
    @Column()
    titre:string
    @Column({ type: "text", nullable: true })
    description?: string;
       @Column({
        type: "enum",
        enum: StatusEnquete,
        default: StatusEnquete.Brouillon
    })
    statut: StatusEnquete;
    statu:StatusEnquete
    @Column({
        type:'enum',
        enum:TypeParticipation,
        default:TypeParticipation.connecte
    })
    typeParticipation:TypeParticipation
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    createAt:Date
    @Column({ type: "date", nullable: true })
    dateFin:Date
    @ManyToOne(() => Utilisateur, user => user.enquetes)
    @JoinColumn({ name: 'userId' }) // <-- ça relie correctement la colonne userId
    user: Utilisateur;
  @ManyToMany(() => Question, (question) => question.enquetes)
@JoinTable() // dima tet7at fi côté wa7ed bark
questions: Question[];
}
