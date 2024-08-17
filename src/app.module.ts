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
          host: 'www.comprasinteligentes.co',
          username:configService.get<string>('DB_USERNAME2'),
          password:configService.get<string>('DB_PASSWORD2'),
          database:configService.get<string>('DB_DATABASE2'),
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
    TypeOrmModule.forFeature([EventosEntity,ClienteEntity,AsistentesEntity,TipoReferenciaEntity,ReferenciaEntity,UserEntity]),
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
