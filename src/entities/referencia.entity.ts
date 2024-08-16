import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('REFERENCIAS')
export class ReferenciaEntity{
    @PrimaryGeneratedColumn({name:'IDREFERENCIA'})
    idReferencia:number;

    @Column({name:'IDTIPOREFERENCIA',type:'integer',nullable:true})
    idTipoReferencia:number;

    @Column({name:'DESCRIPCION',type:'varchar',length:50,nullable:true})
    descripcion:string;    

    
}