import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('EVENTOS')
export class EventosEntity{
    @PrimaryGeneratedColumn({name:'IDEVENTO'})
    idEvento:number;

    @Column({name:'EVENTO',type:'varchar',length:250,nullable:true})
    evento:string;

    @Column({name:'FECHAINICIAL',type:'datetime',nullable:true})
    fechaInicial:Date;

    @Column({name:'FECHAFINAL',type:'datetime',nullable:true})
    fechaFinal:Date;

    @Column({name:'HORAINICIAL',type:'varchar',length:5,nullable:true})
    horaInicial:string;

    @Column({name:'HORAFINAL',type:'varchar',length:5,nullable:true})
    horaFinal:string;

    @Column({name:'PERIODICIDAD',type:'int',nullable:true})
    periodicidad:number;

    @Column({name:'CAPACIDAD',type:'int',nullable:true})
    capacidad:number;

    @Column({name:'MAXIMOPREMIOS',type:'smallint',nullable:true})
    maximoPremios:number;

    
}