import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AsistentesEntity } from "./asistenteEventos.entity";

@Entity('CLIENTE')
export class ClienteEntity{
    @PrimaryGeneratedColumn({name:'IDCLIENTE'})
    idCliente:number;

    @Column({name:'NOMBRE1',type:'varchar',length:20,nullable:true})
    nombre1:string;

    @Column({name:'NOMBRE2',type:'varchar',length:20,nullable:true})
    nombre2:string;

    @Column({name:'APELLIDO1',type:'varchar',length:20,nullable:true})
    apellido1:string;

    @Column({name:'APELLIDO2',type:'varchar',length:20,nullable:true})
    apellido2:string;

    @Column({name:'DOCUMENTO',type:'varchar',length:20,nullable:true})
    documento:string;

    @Column({name:'IDTIPODOCUMENTO',type:'int',nullable:true})
    idTipoDocumento:number;

    @Column({name:'EMAIL',type:'varchar',length:100,nullable:true})
    email:string;

    @Column({name:'USUARIOCREA',type:'varchar',length:50,nullable:true})
    usuarioCrea:string;

    @Column({name:'TELEFONO2',type:'varchar',length:20,nullable:true})
    celular:string;
    
    @Column({name:'FECHACREACION',type:'datetime',nullable:true})
    fechaCreacion:Date;

    @Column({name:'FECHANACIMIENTO',type:'datetime',nullable:true})
    fechaNacimiento:Date;

    @Column({name:'DIRECCIONRESIDENCIA',type:'varchar',length:100,nullable:true})
    direccionResidencia:string;

    @Column({name:'HABEASDATA',type:'varchar',length:20,nullable:true})
    habeasData:string;
}