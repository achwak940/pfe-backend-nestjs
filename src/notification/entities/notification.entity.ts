import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Utilisateur } from 'src/utilisateur/entities/utilisateur.entity';
import { Message } from 'src/message/entities/message.entity';

export enum NotificationType {
  MESSAGE = 'MESSAGE',
  RECLAMATION = 'RECLAMATION',
  ENQUETE = 'ENQUETE',
  FEEDBACK = 'FEEDBACK',
  SYSTEME = 'SYSTEME',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titre: string;

  @Column('text')
  contenu: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEME,
  })
  type: NotificationType;

  @Column({ default: false })
  lu: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  // 👤 utilisateur
  @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'utilisateurId' })
  utilisateur: Utilisateur;

  // 💬 message (optionnel)
  @ManyToOne(() => Message, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'messageId' })
  message?: Message;
}