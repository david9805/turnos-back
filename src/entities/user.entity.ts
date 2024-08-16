import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('USUARIOS')
export class UserEntity {
    @PrimaryGeneratedColumn({ name: 'IDUSUARIO' })
    idUsuario: number;
  
    @Column({ name: 'USUARIO', type: 'varchar', length: 50, nullable: true })
    usuario: string;
  
    @Column({ name: 'NOMBRECOMPLETO', type: 'varchar', length: 50, nullable: true })
    nombreCompleto: string;
  
    @Column({ name: 'CLAVE', type: 'varchar', length: 50, nullable: true })
    clave: string;
  
    @Column({ name: 'ESTADO', type: 'varchar', length: 10, nullable: true })
    estado: string;

    // @Column({name:'VISUALIZARALMACEN',type:'varchar',length:1,nullable:true})
    // visualizarAlmacen:string;

    // @Column({name:'MODIFICARPROPIETARIO',type:'varchar',length:1,nullable:true})
    // modificarPropietario:string;

    // @Column({name:'MODIFICARCONTACTO',type:'varchar',length:1,nullable:true})
    // modificarContacto:string;

    // @Column({name:'MODIFICAALMACEN',type:'varchar',length:1,nullable:true})
    // modificaAlmacen:string;

    // @Column({name:'VISUALIZARPROPIETARIO',type:'varchar',length:1,nullable:true})
    // visualizarPropietario:string;

    // @Column({name:'VISUALIZARCONTACTO',type:'varchar',length:1,nullable:true})
    // visualizarContacto:string;
  
    // Agrega las demás columnas aquí...
  }
