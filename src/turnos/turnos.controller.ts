import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TurnosService } from './turnos.service';

@Controller('api/turnos')
export class TurnosController {
    constructor(private turnosService:TurnosService){

    }

    @Get()
    getEventos(
        @Query('fecha') fecha:any
    ){
        return this.turnosService.getTurno(fecha);
    }

    @Get('/minuto')
    getTurno(){
        return this.turnosService.getTurnosFirst();
    }

    @Get('/asistentes')
    getAsistentes(
        @Query('fecha') fecha:any
    ){
        return this.turnosService.getAsistentes(fecha);
    }

    @Get('/asistentes/:idCliente')
    getAsistentesByIdCliente(
        @Query('fecha') fecha:any,
        @Query('modal') modal:string,
        @Param('idCliente') idCliente:number
    ){
        return this.turnosService.getAsistentesByIdCliente(idCliente,fecha,modal);
    }

    @Post('/asistentes')
    postAsistentes(
        @Body() body:any
    ){
        return this.turnosService.postAsistentes(body);
    }

    @Put('/asistentes/:idAsistente')
    putAsistentes(
        @Body() body:any,
        @Param('idAsistente')  idAlmacen:number
    ){ 
        return this.turnosService.putAsistente(body,idAlmacen)               
    }

    @Get('/cliente/:documento')
    getCliente(
        @Param('documento') documento:string
    ){
        return this.turnosService.getCliente(documento);
    }

    @Post('/cliente')
    postCliente(
        @Body() body:any
    )
    {           
        return this.turnosService.postCliente(body);
    }

    @Get('/tipoDocumento')
    getTipoDocumento(){
        return this.turnosService.getTipoDocumento();
    }

    @Delete('/asistentes/:idAsistente')
    deleteAsistente(
        @Param('idAsistente') idAsistente:number
    ){
        return this.turnosService.deleteAsistente(idAsistente);
    }

    @Post('/usuarios')
    loginUsuarios(
        @Body() body:any
    ){
        return this.turnosService.loginUsuarios(body);
    }

    @Put('/asist/:idAsistente')
    asist(
        @Body() body:any,
        @Param('idAsistente') idAsistente:number
    ){
        return this.turnosService.asist(idAsistente,body);
    }

    
}
