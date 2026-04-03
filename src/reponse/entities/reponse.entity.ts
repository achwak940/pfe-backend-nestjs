import { Enquete } from "src/enquete/entities/enquete.entity";
import { Question } from "src/question/entities/question.entity";
import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Option as QuestionOption } from "src/option/entities/option.entity";
@Entity()
export class Reponse {
     @PrimaryGeneratedColumn()
  id: number;
  //chaque user admet un seul reponse 
  @ManyToOne(() => Utilisateur, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;
  //chaque reponse liee a un seul question
  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;
  // option_id si c’est question choix multiple/unique, sinon null
   @ManyToOne(() => QuestionOption, { nullable: true })
  @JoinColumn({ name: 'option_id' })
  option: QuestionOption | null;
  // chaque reponse liee a une seul enquete
  @ManyToOne(() => Enquete, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enquete_id' })
  enquete: Enquete;
  @Column({ type: 'text', nullable: true })
  reponseTexte: string | null; 

  // waqt li jawweb utilisateur
  @Column({ type: 'timestamp', default: () => 'NOW()' })
  dateReponse: Date;
}
