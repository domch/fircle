import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async sendInAppNotification(userId: number, type: string, message: string) {
    return this.prisma.notification.create({
      data: { userId, type, message },
    });
  }

  async sendEmailNotification(email: string, subject: string, message: string) {
    if (!process.env.SENDGRID_API_KEY) return;
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM || 'no-reply@fircle.app',
      subject,
      text: message,
    };
    try {
      await sgMail.send(msg);
    } catch (err) {
      console.error('SendGrid error', err);
    }
  }

  async notifyInviteAccepted(userId: number, email: string, fircleName: string) {
    const message = `You have been added to ${fircleName}`;
    await this.sendInAppNotification(userId, 'INVITE_ACCEPTED', message);
    await this.sendEmailNotification(email, 'Invite accepted', message);
  }

  async notifyNewItem(userId: number, email: string, itemName: string) {
    const message = `New item added: ${itemName}`;
    await this.sendInAppNotification(userId, 'NEW_ITEM', message);
    await this.sendEmailNotification(email, 'New item added', message);
  }

  async notifyLendingRequestReceived(userId: number, email: string, itemName: string) {
    const message = `Lending request received for ${itemName}`;
    await this.sendInAppNotification(userId, 'LENDING_REQUEST', message);
    await this.sendEmailNotification(email, 'Lending request received', message);
  }

  async notifyLendingRequestStatus(userId: number, email: string, itemName: string, status: string) {
    const message = `Your lending request for ${itemName} was ${status}`;
    await this.sendInAppNotification(userId, 'LENDING_STATUS', message);
    await this.sendEmailNotification(email, 'Lending request update', message);
  }

  async notifyAuctionEvent(userId: number, email: string, event: string) {
    const message = `Auction update: ${event}`;
    await this.sendInAppNotification(userId, 'AUCTION', message);
    await this.sendEmailNotification(email, 'Auction update', message);
  }
}
