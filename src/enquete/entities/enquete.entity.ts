import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusEnquete } from "./status.enum";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
import { TypeParticipation } from "./TypeParticipation.enum";
import { Question } from "src/question/entities/question.entity";
import { Reponse } from "src/reponse/entities/reponse.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";

@Entity()
export class Enquete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({
    type: "enum",
    enum: StatusEnquete,
    default: StatusEnquete.Brouillon
  })
  statut: StatusEnquete;

  @Column({
    type:'enum',
    enum: TypeParticipation,
    default: TypeParticipation.connecte
  })
  typeParticipation: TypeParticipation;

  @Column({ type: "date", default: () => "CURRENT_DATE" })
  createAt: Date;

  @Column({ type: "date", nullable: true })
  dateFin: Date;

  @ManyToOne(() => Utilisateur, user => user.enquetes)
  @JoinColumn({ name: 'userId' })
  user: Utilisateur;

  @ManyToMany(() => Question, question => question.enquetes)
  @JoinTable()
  questions: Question[];

  @OneToMany(() => Reponse, reponse => reponse.enquete)
  reponses: Reponse[];

  // 🔹 Relation Feedback
  @OneToMany(() => Feedback, feedback => feedback.enquete)
  feedbacks: Feedback[];
}