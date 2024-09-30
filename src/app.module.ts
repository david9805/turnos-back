import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventosEntity } from './entities/eventos.entity';
import { ClienteEntity } from './entities/cliente.entity';
import { AsistentesEntity } from './entities/asistenteEventos.entity';
import { TipoReferenciaEntity } from './entities/tipoReferencia.entity';
import { ReferenciaEntity } from './entities/referencia.entity';
import { UserEntity } from './entities/user.entity';
import { MailService } from './mail/mail.service';
import { SmsService } from './sms/sms.service';
import { HttpModule } from '@nestjs/axios';
import { BloqueoTurnosEntity } from './entities/bloqueoTurnos';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRootAsync(
      {
        imports:[ConfigModule],
        useFactory: async (configService:ConfigService)=>({
          type:'mssql',
          host: configService.get<string>('DB_HOST'),
          username:configService.get<string>('DB_USERNAME'),
          password:configService.get<string>('DB_PASSWORD'),
          database:configService.get<string>('DB_DATABASE'),
          entities:[EventosEntity,ClienteEntity,AsistentesEntity,TipoReferenciaEntity,ReferenciaEntity,UserEntity,BloqueoTurnosEntity],
          options:{
            encrypt:true,
            trustServerCertificate:true
          },
          synchronize:false,
          // logging:true
        }),
        inject:[ConfigService],     
                  
      }
    ),
    TypeOrmModule.forFeature([EventosEntity,ClienteEntity,AsistentesEntity,TipoReferenciaEntity,ReferenciaEntity,UserEntity,BloqueoTurnosEntity]),
    HttpModule
  
  ],
  controllers: [AppController],
  providers: [AppService, MailService, SmsService],
})
export class AppModule {
}
