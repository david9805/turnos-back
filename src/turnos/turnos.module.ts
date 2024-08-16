import { Module } from '@nestjs/common';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventosEntity } from 'src/entities/eventos.entity';
import { ClienteEntity } from 'src/entities/cliente.entity';
import { AsistentesEntity } from 'src/entities/asistenteEventos.entity';
import { TipoReferenciaEntity } from 'src/entities/tipoReferencia.entity';
import { ReferenciaEntity } from 'src/entities/referencia.entity';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  controllers: [TurnosController],
  providers: [TurnosService],
  imports:[
    ConfigModule.forRoot({
      isGlobal:true
    }),
    // TypeOrmModule.forRootAsync(
    //   {
    //     imports:[ConfigModule],
    //     useFactory: async (configService:ConfigService)=>({
    //       type:'mssql',
    //       host: configService.get<string>('DB_HOST'),
    //       username:configService.get<string>('DB_USERNAME'),
    //       password:configService.get<string>('DB_PASSWORD'),
    //       database:configService.get<string>('DB_DATABASE'),
    //       entities:[],
    //       options:{
    //         encrypt:true,
    //         trustServerCertificate:true
    //       },
    //       synchronize:false
    //     }),
    //     inject:[ConfigService]
    //   }
    // ),
    TypeOrmModule.forFeature([EventosEntity,ClienteEntity,AsistentesEntity,TipoReferenciaEntity,ReferenciaEntity,UserEntity])
  ]
})
export class TurnosModule {}
