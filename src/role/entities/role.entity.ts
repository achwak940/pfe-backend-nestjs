import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

import { Utilisateur } from "src/utilisateur/entities/utilisateur.entity";

@Entity()
export class Role {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nom: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: "#6B7280" })
  couleur: string;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Utilisateur, (utilisateur) => utilisateur.role)
  utilisateurs: Utilisateur[];
}