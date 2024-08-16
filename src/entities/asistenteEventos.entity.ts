import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClienteEntity } from "./cliente.entity";

@Entity('ASISTENTESEVENTOS')
export class AsistentesEntity{
    @PrimaryGeneratedColumn({name:'IDASISTENTESEVENTOS'})
    idAsistentesEventos:number;

    @Column({name:'IDEVENTO',type:'int'})
    idEvento:number;

    @Column({name:'IDCLIENTE',type:'int'})
    idCliente:number;

    // @Column({name:'EVENTO',type:'varchar',length:250,nullable:true})
    // evento:string;

    @Column({name:'FECHAASISTENCIA',type:'datetime',nullable:true})
    fechaAsistencia:Date;

    @Column({name:'HORAASISTENCIA',type:'varchar',length:5,nullable:true})
    horaAsistencia:string;

    @Column({name:'NOMBREASISTENTE',type:'varchar',length:50,nullable:true})
    nombreAsistente:string;

    @Column({name:'APELLIDOASISTENTE',type:'varchar',length:50,nullable:true})
    apellidoAsistente:string;

    @Column({name:'ASISTE',type:'bit',default:false})
    asiste:boolean;

    @Column({name:'FECHACREA',type:'datetime',nullable:true})
    fechaCrea:Date;

    @Column({name:'FECHAMODIFICA',type:'datetime',nullable:true})
    fechaModifica:Date;

    @ManyToOne(() => ClienteEntity)
    @JoinColumn({ name: 'IDCLIENTE' })
    cliente: ClienteEntity;

}