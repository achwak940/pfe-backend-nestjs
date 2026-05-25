import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Status } from "../status.enum";
import { Enquete } from "src/enquete/entities/enquete.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";
import { Reclamation } from "src/reclamation/entities/reclamation.entity";
import { Notification } from "src/notification/entities/notification.entity";
import { Role } from "src/role/entities/role.entity";

@Entity()
export class Utilisateur {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  prenom: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, length: 8 })
  telephone: string;

  // utilisateur.entity.ts
@Column({ nullable: true, type: 'varchar' })
photo_profil: string | null;

  @Column()
  mot_de_passe: string;


  @Column({
    type: 'enum',
    enum: Status,
    default: Status.INACTIF
  })
  statut: Status;

  @Column({ default: false })
  est_verifie: boolean;

  @Column({ type: 'varchar', nullable: true })
  code_verification: string | null;

  @Column({ nullable: true })
  code_reset: string;

  @Column({ type: 'timestamp', nullable: true })
  token_expiration: Date | null;

  @Column({ nullable: true })
  google_id: string;

  @Column({ default: () => 'NOW()' })
  date_creation: Date;

  @Column({ nullable: true })
  date_modification: Date;
  @ManyToOne(() => Role, (role) => role.utilisateurs, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role | null;

  @OneToMany(() => Enquete, enquete => enquete.user)
  enquetes: Enquete[];

  @OneToMany(() => Feedback, feedback => feedback.utilisateur)
  feedbacks: Feedback[];

  @OneToMany(() => Reclamation, rec => rec.user)
  reclamations: Reclamation[];

  @OneToMany(() => Notification, notification => notification.utilisateur)
  notifications: Notification[];
}    