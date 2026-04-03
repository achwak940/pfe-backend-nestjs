import { Enquete } from 'src/enquete/entities/enquete.entity';
import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { FeedbackType } from './enum.TypeFeedback';
import { FeedbackStatut } from './enum.feedbackStatut';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Utilisateur, (user) => user.feedbacks, { nullable: true })
  utilisateur: Utilisateur;

  @ManyToOne(() => Enquete, (enquete) => enquete.feedbacks, { nullable: true })
  enquete: Enquete;

  @Column({
    type: 'enum',
    enum: FeedbackType,
    default: FeedbackType.SUGGESTION,
  })
  type: FeedbackType;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: FeedbackStatut,
    default: FeedbackStatut.NOUVEAU,
  })
  statut: FeedbackStatut;

  @CreateDateColumn({ type: 'timestamp' })
  date_creation: Date;
}