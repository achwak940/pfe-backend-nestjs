// src/message/message.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    try {
      const expediteur = await this.utilisateurRepository.findOne({
        where: { id: createMessageDto.expediteurId }
      });
      if (!expediteur) {
        return { success: false, message: 'Expéditeur non trouvé' };
      }

      const destinataire = await this.utilisateurRepository.findOne({
        where: { id: createMessageDto.destinataireId }
      });
      if (!destinataire) {
        return { success: false, message: 'Destinataire non trouvé' };
      }

      const message = this.messageRepository.create({
        expediteurId: createMessageDto.expediteurId,
        destinataireId: createMessageDto.destinataireId,
        sujet: createMessageDto.sujet,
        contenu: createMessageDto.contenu,
        lu: false,
      });

      await this.messageRepository.save(message);

      return {
        success: true,
        message: 'Message envoyé avec succès',
        data: {
          id: message.id,
          sujet: message.sujet,
          contenu: message.contenu,
          dateEnvoi: message.dateEnvoi,
          expediteurId: message.expediteurId,
          destinataireId: message.destinataireId
        }
      };
    } catch (error) {
      console.error('Erreur envoi message:', error);
      return { success: false, message: 'Erreur lors de l\'envoi du message' };
    }
  }

  async findAllByUser(userId: number) {
    try {
      const messages = await this.messageRepository.find({
        where: [
          { expediteurId: userId },
          { destinataireId: userId }
        ],
        relations: ['expediteur', 'destinataire'],
        order: { dateEnvoi: 'DESC' }
      });

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sujet: msg.sujet,
        contenu: msg.contenu,
        lu: msg.lu,
        dateEnvoi: msg.dateEnvoi,
        estEnvoyeur: msg.expediteurId === userId,
        interlocuteur: msg.expediteurId === userId ? {
          id: msg.destinataire.id,
          prenom: msg.destinataire.prenom,
          nom: msg.destinataire.nom,
          email: msg.destinataire.email,
          photo_profil: msg.destinataire.photo_profil
        } : {
          id: msg.expediteur.id,
          prenom: msg.expediteur.prenom,
          nom: msg.expediteur.nom,
          email: msg.expediteur.email,
          photo_profil: msg.expediteur.photo_profil
        }
      }));

      return { success: true, data: formattedMessages };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération des messages' };
    }
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      const message = await this.messageRepository.findOne({ where: { id } });
      if (!message) {
        return { success: false, message: 'Message non trouvé' };
      }

      if (updateMessageDto.sujet) message.sujet = updateMessageDto.sujet;
      if (updateMessageDto.contenu) message.contenu = updateMessageDto.contenu;
      if (updateMessageDto.lu !== undefined) {
        message.lu = updateMessageDto.lu;
        if (updateMessageDto.lu === true) {
          message.dateLecture = new Date();
        }
      }

      await this.messageRepository.save(message);

      return {
        success: true,
        message: 'Message mis à jour avec succès',
        data: {
          id: message.id,
          sujet: message.sujet,
          contenu: message.contenu,
          lu: message.lu,
          dateEnvoi: message.dateEnvoi
        }
      };
    } catch (error) {
      console.error('Erreur mise à jour message:', error);
      return { success: false, message: 'Erreur lors de la mise à jour du message' };
    }
  }

  async getReceivedMessages(userId: number) {
    try {
      const messages = await this.messageRepository.find({
        where: { destinataireId: userId },
        relations: ['expediteur'],
        order: { dateEnvoi: 'DESC' }
      });

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sujet: msg.sujet,
        contenu: msg.contenu,
        lu: msg.lu,
        dateEnvoi: msg.dateEnvoi,
        expediteur: {
          id: msg.expediteur.id,
          prenom: msg.expediteur.prenom,
          nom: msg.expediteur.nom,
          email: msg.expediteur.email,
          photo_profil: msg.expediteur.photo_profil
        }
      }));

      return { success: true, data: formattedMessages };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération des messages reçus' };
    }
  }

  async getSentMessages(userId: number) {
    try {
      const messages = await this.messageRepository.find({
        where: { expediteurId: userId },
        relations: ['destinataire'],
        order: { dateEnvoi: 'DESC' }
      });

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sujet: msg.sujet,
        contenu: msg.contenu,
        lu: msg.lu,
        dateEnvoi: msg.dateEnvoi,
        destinataire: {
          id: msg.destinataire.id,
          prenom: msg.destinataire.prenom,
          nom: msg.destinataire.nom,
          email: msg.destinataire.email,
          photo_profil: msg.destinataire.photo_profil
        }
      }));

      return { success: true, data: formattedMessages };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération des messages envoyés' };
    }
  }

  async getConversation(userId1: number, userId2: number) {
    try {
      console.log(`Recherche conversation entre ${userId1} et ${userId2}`);
      
      const user1 = await this.utilisateurRepository.findOne({ where: { id: userId1 } });
      const user2 = await this.utilisateurRepository.findOne({ where: { id: userId2 } });
      
      if (!user1 || !user2) {
        return { 
          success: false, 
          message: 'Un ou plusieurs utilisateurs n\'existent pas',
          data: [] 
        };
      }
      
      const messages = await this.messageRepository.find({
        where: [
          { expediteurId: userId1, destinataireId: userId2 },
          { expediteurId: userId2, destinataireId: userId1 }
        ],
        relations: ['expediteur', 'destinataire'],
        order: { dateEnvoi: 'ASC' }
      });

      console.log(`Messages trouvés: ${messages.length}`);

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sujet: msg.sujet,
        contenu: msg.contenu,
        lu: msg.lu,
        dateEnvoi: msg.dateEnvoi,
        expediteurId: msg.expediteurId,
        destinataireId: msg.destinataireId,
        estMoi: msg.expediteurId === userId1,
        expediteurNom: msg.expediteur.prenom + ' ' + msg.expediteur.nom,
        destinataireNom: msg.destinataire.prenom + ' ' + msg.destinataire.nom
      }));

      return { success: true, data: formattedMessages };
    } catch (error) {
      console.error('Erreur getConversation:', error);
      return { success: false, message: 'Erreur lors de la récupération de la conversation', data: [] };
    }
  }

  async markAsRead(id: number) {
    try {
      const message = await this.messageRepository.findOne({ where: { id } });
      if (!message) {
        return { success: false, message: 'Message non trouvé' };
      }

      message.lu = true;
      message.dateLecture = new Date();
      await this.messageRepository.save(message);

      return { success: true, message: 'Message marqué comme lu' };
    } catch (error) {
      return { success: false, message: 'Erreur lors du marquage du message' };
    }
  }

  async getUnreadCount(userId: number) {
    try {
      const count = await this.messageRepository.count({
        where: { destinataireId: userId, lu: false }
      });
      return { success: true, count };
    } catch (error) {
      return { success: false, count: 0 };
    }
  }

  async findOne(id: number) {
    try {
      const message = await this.messageRepository.findOne({
        where: { id },
        relations: ['expediteur', 'destinataire']
      });
      
      if (!message) {
        return { success: false, message: 'Message non trouvé' };
      }

      return {
        success: true,
        data: {
          id: message.id,
          sujet: message.sujet,
          contenu: message.contenu,
          lu: message.lu,
          dateEnvoi: message.dateEnvoi,
          expediteur: {
            id: message.expediteur.id,
            prenom: message.expediteur.prenom,
            nom: message.expediteur.nom
          },
          destinataire: {
            id: message.destinataire.id,
            prenom: message.destinataire.prenom,
            nom: message.destinataire.nom
          }
        }
      };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération du message' };
    }
  }

  async remove(id: number) {
    try {
      const message = await this.messageRepository.findOne({ where: { id } });
      if (!message) {
        return { success: false, message: 'Message non trouvé' };
      }

      await this.messageRepository.remove(message);
      return { success: true, message: 'Message supprimé avec succès' };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la suppression du message' };
    }
  }

  async getConversations(userId: number) {
    try {
      // Récupérer tous les utilisateurs qui ont eu une conversation avec l'utilisateur
      const expediteurs = await this.messageRepository.find({
        where: { destinataireId: userId },
        relations: ['expediteur'],
        order: { dateEnvoi: 'DESC' }
      });

      const destinataires = await this.messageRepository.find({
        where: { expediteurId: userId },
        relations: ['destinataire'],
        order: { dateEnvoi: 'DESC' }
      });

      const conversationsMap = new Map();

      // Ajouter les conversations de l'expéditeur
      expediteurs.forEach(msg => {
        const user = msg.expediteur;
        const key = user.id;
        const isUnread = !msg.lu;

        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            user: {
              id: user.id,
              prenom: user.prenom,
              nom: user.nom,
              email: user.email,
              photo_profil: user.photo_profil,
              online: user.statut === 'ACTIF'
            },
            dernierMessage: msg.contenu,
            dateDernierMessage: msg.dateEnvoi,
            nonLu: isUnread ? 1 : 0,
            derniereActivite: msg.dateEnvoi
          });
        } else if (isUnread) {
          const conv = conversationsMap.get(key);
          conv.nonLu++;
          if (msg.dateEnvoi > conv.dateDernierMessage) {
            conv.dernierMessage = msg.contenu;
            conv.dateDernierMessage = msg.dateEnvoi;
          }
        } else if (msg.dateEnvoi > conversationsMap.get(key).dateDernierMessage) {
          const conv = conversationsMap.get(key);
          conv.dernierMessage = msg.contenu;
          conv.dateDernierMessage = msg.dateEnvoi;
        }
      });

      // Ajouter les conversations du destinataire
      destinataires.forEach(msg => {
        const user = msg.destinataire;
        const key = user.id;

        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            user: {
              id: user.id,
              prenom: user.prenom,
              nom: user.nom,
              email: user.email,
              photo_profil: user.photo_profil,
              online: user.statut === 'ACTIF'
            },
            dernierMessage: msg.contenu,
            dateDernierMessage: msg.dateEnvoi,
            nonLu: 0,
            derniereActivite: msg.dateEnvoi
          });
        } else if (msg.dateEnvoi > conversationsMap.get(key).dateDernierMessage) {
          const conv = conversationsMap.get(key);
          conv.dernierMessage = msg.contenu;
          conv.dateDernierMessage = msg.dateEnvoi;
          conv.derniereActivite = msg.dateEnvoi;
        }
      });

      const conversations = Array.from(conversationsMap.values());
      conversations.sort((a, b) => new Date(b.dateDernierMessage).getTime() - new Date(a.dateDernierMessage).getTime());

      return { success: true, data: conversations };
    } catch (error) {
      console.error('Erreur getConversations:', error);
      return { success: false, message: 'Erreur lors de la récupération des conversations', data: [] };
    }
  }

  // Nouvelle méthode pour marquer tous les messages d'une conversation comme lus
  async markConversationAsRead(userId: number, interlocuteurId: number) {
    try {
      await this.messageRepository.update(
        {
          expediteurId: interlocuteurId,
          destinataireId: userId,
          lu: false
        },
        {
          lu: true,
          dateLecture: new Date()
        }
      );
      return { success: true, message: 'Conversation marquée comme lue' };
    } catch (error) {
      return { success: false, message: 'Erreur lors du marquage de la conversation' };
    }
  }
  // Ajoutez cette méthode dans message.service.ts

async deleteConversation(userId: number, interlocuteurId: number) {
  try {
    await this.messageRepository.delete({
      expediteurId: userId,
      destinataireId: interlocuteurId
    });
    
    await this.messageRepository.delete({
      expediteurId: interlocuteurId,
      destinataireId: userId
    });
    
    return { success: true, message: 'Conversation supprimée avec succès' };
  } catch (error) {
    console.error('Erreur suppression conversation:', error);
    return { success: false, message: 'Erreur lors de la suppression de la conversation' };
  }
}
}