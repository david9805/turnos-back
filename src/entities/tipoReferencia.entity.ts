import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('TIPOSREFERENCIA')
export class TipoReferenciaEntity{
    @PrimaryGeneratedColumn({name:'IDTIPOREFERENCIA'})
    idTipoReferencia:number;

    @Column({name:'TIPOREFERENCIA',type:'varchar',length:50,nullable:true})
    tipoReferencia:string;    
    
}