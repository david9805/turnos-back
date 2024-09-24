import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/turnos')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
    getEventos(
        @Query('fecha') fecha:any,
        @Query('user') user:string
    ){
        return this.appService.getTurno(fecha,user);
    }

    @Get('/minuto')
    getTurno(){
        return this.appService.getTurnosFirst();
    }

    @Get('/asistentes')
    getAsistentes(
        @Query('fecha') fecha:any
    ){
        return this.appService.getAsistentes(fecha);
    }

    @Get('/asistentes/:idCliente')
    getAsistentesByIdCliente(
        @Query('fecha') fecha:any,
        @Query('modal') modal:string,
        @Param('idCliente') idCliente:number
    ){
        return this.appService.getAsistentesByIdCliente(idCliente,fecha,modal);
    }

    @Post('/asistentes')
    postAsistentes(
        @Body() body:any
    ){
        return this.appService.postAsistentes(body);
    }

    @Put('/asistentes/:idAsistente')
    putAsistentes(
        @Body() body:any,
        @Param('idAsistente')  idAlmacen:number
    ){ 
        return this.appService.putAsistente(body,idAlmacen)               
    }

    @Get('/cliente/:documento')
    getCliente(
        @Param('documento') documento:string
    ){
        return this.appService.getCliente(documento);
    }

    @Post('/cliente')
    postCliente(
        @Body() body:any
    )
    {           
        return this.appService.postCliente(body);
    }

    @Put('/cliente/:idCliente')
    putCliente(
        @Body() body:any,
        @Param('idCliente') idCliente:number
    )
    {           
        return this.appService.putCliente(idCliente,body);
    }

    @Get('/tipoDocumento')
    getTipoDocumento(){
        return this.appService.getTipoDocumento();
    }

    @Delete('/asistentes/:idAsistente')
    deleteAsistente(
        @Param('idAsistente') idAsistente:number
    ){
        return this.appService.deleteAsistente(idAsistente);
    }

    @Post('/usuarios')
    loginUsuarios(
        @Body() body:any
    ){
        return this.appService.loginUsuarios(body);
    }

    @Put('/asist/:idAsistente')
    asist(
        @Body() body:any,
        @Param('idAsistente') idAsistente:number
    ){
        return this.appService.asist(idAsistente,body);
    }

    @Get('/sendNotification')
    sendNotification(
        @Query('idCliente') idCliente:number,
        @Query('fecha') fecha:Date,
        @Query('typeComunication') typeComunication:string
    )
    {        
        return this.appService.sendNotification(idCliente,fecha,typeComunication);
    }
}
