import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientProxyModule } from './proxyrmq/proxyrmq.module';

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
          user: 'AKIA4KCP6CKKMS2EP4NU',
          pass: 'BBMCxEYxkR5nbvAsC++XNSrWBMtIp9YOQ0WAoBTrlE9+',
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
