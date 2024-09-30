import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('BLOQUEARTURNOS')
export class BloqueoTurnosEntity {
    @PrimaryGeneratedColumn({ name: 'IDBLOQUEARTURNOS' })
    idBloquearTurnos: number;
  
    @Column({ name: 'FECHABLOQUEO', type: 'datetime', nullable: true })
    fechaBloqueo: Date;
  
    @Column({ name: 'BLOQUEOPORHORAS', type: 'bit', nullable: true })
    bloqueoPorHoras: boolean;
  
    @Column({ name: 'TURNOS', type: 'text', nullable: true })
    turnos: string;    
  }
