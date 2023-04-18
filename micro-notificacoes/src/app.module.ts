import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyModule } from './proxyrmq/proxyrmq.module';

const configService = new ConfigService();
const SES_USER = configService.get<string>('SES_USER');
const SES_PASS = configService.get<string>('SES_PASS');

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false,
        tls: {
          ciphers: 'SSLv3',
        },
        auth: {
          user: SES_USER,
          pass: SES_PASS,
        },
      },
    }),
    ClientProxyModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
