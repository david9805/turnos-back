import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TurnosModule } from './turnos/turnos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventosEntity } from './entities/eventos.entity';
import { ClienteEntity } from './entities/cliente.entity';
import { AsistentesEntity } from './entities/asistenteEventos.entity';
import { TipoReferenciaEntity } from './entities/tipoReferencia.entity';
import { ReferenciaEntity } from './entities/referencia.entity';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    TurnosModule,
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
          entities:[EventosEntity,ClienteEntity,AsistentesEntity,TipoReferenciaEntity,ReferenciaEntity,UserEntity],
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
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
