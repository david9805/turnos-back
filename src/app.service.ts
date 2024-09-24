import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventosEntity } from './entities/eventos.entity';
import { DataSource, Repository } from 'typeorm';
import { ClienteEntity } from './entities/cliente.entity';
import { AsistentesEntity } from './entities/asistenteEventos.entity';
import { ReferenciaEntity } from './entities/referencia.entity';
import { TipoReferenciaEntity } from './entities/tipoReferencia.entity';
import { UserEntity } from './entities/user.entity';
import { MailService } from './mail/mail.service';
import { format } from 'date-fns/format';

@Injectable()
export class AppService {
  constructor(@InjectRepository(EventosEntity)
  private readonly eventosRepository: Repository<EventosEntity>,
    @InjectRepository(ClienteEntity)
    private readonly clienteRepository: Repository<ClienteEntity>,
    @InjectRepository(AsistentesEntity)
    private readonly asistenteRepository: Repository<AsistentesEntity>,
    @InjectRepository(ReferenciaEntity)
    private readonly referenciaRepository: Repository<ReferenciaEntity>,
    @InjectRepository(TipoReferenciaEntity)
    private readonly tipoReferenciaRepository: Repository<TipoReferenciaEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private emailService:MailService
  ) {

  }

  private arrayTurnos = [];

  private evento: EventosEntity;
  async getTurno(fechaQuery: Date,user:string) {
    try {
      const date = new Date();
      const fecha = new Date(fechaQuery);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      const fechaHoy = anio * 10000 + mes * 100 + dia;
      const fechaHoyCompare = (date.getFullYear() * 10000) + ((date.getMonth() + 1) * 100) + (date.getDate());
      this.evento = await this.eventosRepository.createQueryBuilder("EVENTOS")
        .where(":fecha BETWEEN DATEPART(YYYY,FECHAINICIAL)*10000 + DATEPART(MM,FECHAINICIAL)*100 + DATEPART(DD,FECHAINICIAL) AND  DATEPART(YYYY,FECHAFINAL)*10000 + DATEPART(MM,FECHAFINAL)*100 + DATEPART(DD,FECHAFINAL)", { fecha: fechaHoy })
        // .andWhere(" CAST(:hora AS time)  BETWEEN CONVERT(time, HORAINICIAL) AND CONVERT(time, HORAFINAL)",{hora:horaHoy})
        .getOne();

      if ((fecha.getMinutes() % this.evento.periodicidad) != 0) {
        const mod = fecha.getMinutes() % this.evento.periodicidad;
        fecha.setMinutes(fecha.getMinutes() + (this.evento.periodicidad - mod));
      }
      else {
        const minutes = fecha.getMinutes() + 1;
        fecha.setMinutes(minutes);
        const mod = fecha.getMinutes() % this.evento.periodicidad;
        fecha.setMinutes(fecha.getMinutes() + (this.evento.periodicidad - mod));
      }

      const hora = fecha.getHours();

      const minutos = fecha.getMinutes().toString() === '0' ? fecha.getMinutes().toString() + '0' : fecha.getMinutes().toString();
      let timeIntervals: any;

      let horaHoy = `${hora}:${minutos}`;
      const { hour: hourWeb, minute: minuteWeb } = this.getHoursAndMinutes(horaHoy);
      const { hour: hourEvent, minute: minuteEvent } = this.getHoursAndMinutes(this.evento.horaInicial);

      if (hourWeb < hourEvent || (hourWeb === hourEvent && minuteWeb < minuteEvent)) {
        horaHoy = this.evento.horaInicial
      }

      if (fechaHoy !== fechaHoyCompare) {
        horaHoy = this.evento.horaInicial
      }
      if (this.evento) {
        timeIntervals = await this.generateTimeIntervals(horaHoy, this.evento.horaFinal, this.evento.periodicidad, fechaHoy, this.evento.capacidad,user);
      } else {
        this.catchError('Evento no existe en los parametros', 'Evento no existe en los parametros');
      }


      return {
        turnos: timeIntervals,
        idEvento: this.evento.idEvento
      };
    }
    catch (error) {
      this.catchError(error);
    }
  }

  async getTurnosFirst() {
    return this.arrayTurnos;
  }

  async generateTimeIntervals(startTime: string, endTime: string, interval: number, fecha: number, capacidad: number,user:string) {
    try {
      this.arrayTurnos = [];
      let [startHour, startMinute] = startTime.split(':').map(Number);
      let [endHour, endMinute] = endTime.split(':').map(Number);
      const asistentes = await this.dataSource.query(
        `
        SELECT HORAASISTENCIA, COUNT(HORAASISTENCIA) AS PARTICIPANTES
        FROM ASISTENTESEVENTOS
        WHERE DATEPART(YYYY,FECHAASISTENCIA) * 10000 + DATEPART(MM,FECHAASISTENCIA) * 100 + DATEPART(DD,FECHAASISTENCIA) = @0
        GROUP BY HORAASISTENCIA
        `,
        [fecha]
      );
      while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
        const turno = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
        const asistente = asistentes.find(asistente => asistente.HORAASISTENCIA === turno);
        const numeroAsistente = asistente ? asistente.PARTICIPANTES : 0;  
        
        if (capacidad !== numeroAsistente){
          this.arrayTurnos.push(
            {
              turno: turno,
              capacidad: capacidad - numeroAsistente,
              asistentes: numeroAsistente
            });
        }        
        else if (user === '0'){
          this.arrayTurnos.push(
            {
              turno: turno,
              capacidad: capacidad - numeroAsistente,
              asistentes: numeroAsistente
            });
        }
        startMinute += interval;
        if (startMinute >= 60) {
          startHour += Math.floor(startMinute / 60);
          startMinute = startMinute % 60;
        }
      }
      return this.arrayTurnos;
    }
    catch (error) {
      this.catchError(error)
    }
  }


  async getAsistentes(fechaQuery: Date) {
    try {      
      const fecha = new Date(fechaQuery);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      const fechaHoy = anio * 10000 + mes * 100 + dia;
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes().toString() === '0' ? fecha.getMinutes().toString() + '0' : fecha.getMinutes().toString();
      const horaHoy = `${hora}:${minutos}`;
      const result = await this.asistenteRepository.createQueryBuilder("asistente")
        .leftJoinAndSelect("asistente.cliente", "cliente")
        .where(" DATEPART(YYYY,FECHAASISTENCIA) * 10000 + DATEPART(MM,FECHAASISTENCIA) * 100 + DATEPART(DD,FECHAASISTENCIA)=:fecha", { fecha: fechaHoy })
        .andWhere(" HORAASISTENCIA =:hora", { hora: horaHoy })
        .getMany();
      return result;
    }
    catch (error) {

    }
  }

  async getAsistentesByIdCliente(idCliente: number, fechaQuery: Date, modal: string) {
    try {
      console.log('Entry getAsistentesByIdCliente');

      const fecha = new Date(fechaQuery);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      const fechaHoy = anio * 10000 + mes * 100 + dia;
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes().toString() === '0' ? fecha.getMinutes().toString() + '0' : fecha.getMinutes().toString();
      const horaHoy = `${hora}:${minutos}`;

      let result: any
      if (modal === 'true') {
        result = await this.asistenteRepository.createQueryBuilder()
          .where(" DATEPART(YYYY,FECHAASISTENCIA) * 10000 + DATEPART(MM,FECHAASISTENCIA) * 100 + DATEPART(DD,FECHAASISTENCIA)=:fecha", { fecha: fechaHoy })
          .andWhere(" HORAASISTENCIA =:hora", { hora: horaHoy })
          .andWhere(" IDCLIENTE =:idcliente", { idcliente: idCliente })
          .getMany();
      }
      else {
        const fechaHoraHoy = `${anio}${mes.toString().padStart(2, '0')}${dia.toString().padStart(2, '0')}${hora.toString().padStart(2, '0')}${minutos}`;
        result = await this.asistenteRepository.createQueryBuilder()
          .where("CAST(CONCAT(DATEPART(YYYY, FECHAASISTENCIA), RIGHT('00' + CAST(DATEPART(MM, FECHAASISTENCIA) AS VARCHAR), 2), RIGHT('00' + CAST(DATEPART(DD, FECHAASISTENCIA) AS VARCHAR), 2), RIGHT('00' + CAST(DATEPART(HH, HORAASISTENCIA) AS VARCHAR), 2), RIGHT('00' + CAST(DATEPART(MI, HORAASISTENCIA) AS VARCHAR), 2)) AS BIGINT) >= :fechaHoraHoy", { fechaHoraHoy })
          .andWhere("IDCLIENTE = :idcliente", { idcliente: idCliente })
          .getMany();
      }


      console.log('Exit getAsistentesByIdCliente');
      return result;
    }
    catch (error) {
      this.catchError(error);
    }
  }

  async postAsistentes(body: any) {
    try {
      if (!body.nombreAsistente) {
        this.catchError("Debe digitar el nombre del asistente", "Debe digitar el nombre  del asistente")
      }
      if (!body.anioNacimiento) {
        this.catchError("Debe digitar el año de nacimiento", "Debe digitar el año de nacimiento")
      }

      if (!body.idCliente) {
        this.catchError("cliente no existe", "cliente no existe");
      }


      const fecha = new Date(body.fechaAsistencia);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      const fechaHoy = anio * 10000 + mes * 100 + dia;
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes().toString() === '0' ? fecha.getMinutes().toString() + '0' : fecha.getMinutes().toString();
      const horaHoy = `${hora}:${minutos}`;
      const consulta = await this.dataSource.query(
        `SELECT COUNT(DISTINCT FECHAASISTENCIA) AS PARTICIPACIONES FROM ASISTENTESEVENTOS
          WHERE IDCLIENTE=@0
          AND (DATEPART(YYYY,FECHAASISTENCIA) * 10000 + DATEPART(MM,FECHAASISTENCIA) * 100 + DATEPART(DD,FECHAASISTENCIA) = @1)
          AND HORAASISTENCIA <> @2
          `
        , [body.idCliente, fechaHoy,horaHoy]
      )
      const participaciones = consulta[0].PARTICIPACIONES;
      if (1 <= participaciones) {
        this.catchError("El cliente ya excedio el maximo de participaciones para el dia de seleccionado", "El cliente ya excedio el maximo de participaciones para el dia de seleccionado");
      }
      const consultaParticipantes = await this.dataSource.query(
        `SELECT COUNT( IDASISTENTESEVENTOS) AS PARTICIPANTES FROM ASISTENTESEVENTOS
          WHERE IDCLIENTE=@0
          AND DATEPART(YYYY,FECHAASISTENCIA) * 10000 + DATEPART(MM,FECHAASISTENCIA) * 100 + DATEPART(DD,FECHAASISTENCIA) = @1
          AND HORAASISTENCIA = @2
          `
        , [body.idCliente, fechaHoy, horaHoy]
      )
      const participantes = consultaParticipantes[0].PARTICIPANTES;

      if (this.evento.maximoPremios <= participantes) {
        this.catchError("El cliente ya excedio el maximo de participaciones para el turno", "El cliente ya excedio el maximo de participaciones para el turno");
      }

      const participantesTurnos = await this.dataSource.query(
        `SELECT COUNT( IDASISTENTESEVENTOS) AS PARTICIPANTES FROM ASISTENTESEVENTOS
          WHERE DATEPART(YYYY,FECHAASISTENCIA) * 10000 + DATEPART(MM,FECHAASISTENCIA) * 100 + DATEPART(DD,FECHAASISTENCIA) = @0
          AND HORAASISTENCIA = @1
          `
        , [fechaHoy, horaHoy]
      )
      const participantesTurno = participantesTurnos[0].PARTICIPANTES;

      if (this.evento.capacidad <= participantesTurno) {
        this.catchError("Para el turno asignado ya no se encuentran cupos disponibles", "Para el turno asignado ya no se encuentran cupos disponibles");
      }
      const result = await this.asistenteRepository.save(
        {
          nombreAsistente: body.nombreAsistente,
          anioNacimiento: body.anioNacimiento,
          idCliente: body.idCliente,
          fechaAsistencia: fecha,
          horaAsistencia: horaHoy,
          idEvento: body.idEvento,
          fechaCrea: new Date()
        }
      )

      return result;
    }
    catch (error) {
      this.catchError(error);
    }
  }

  async putAsistente(body: any, id: number) {
    try {
      if (!body.nombreAsistente) {
        this.catchError("Debe digitar el nombre del asistente", "Debe digitar el nombre  del asistente")
      }
      if (!body.anioNacimiento) {
        this.catchError("Debe digitar el año de nacimiento", "Debe digitar el año de nacimiento")
      }

      if (!body.idCliente) {
        this.catchError("cliente no existe", "cliente no existe");
      }

      const fecha = new Date(body.fechaAsistencia);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      const fechaHoy = anio * 10000 + mes * 100 + dia;
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes().toString() === '0' ? fecha.getMinutes().toString() + '0' : fecha.getMinutes().toString();
      const horaHoy = `${hora}:${minutos}`;

      const consulta = await this.dataSource.query(
        `SELECT COUNT( IDASISTENTESEVENTOS) AS PARTICIPANTES FROM ASISTENTESEVENTOS
WHERE IDCLIENTE=@0
AND DATEPART(YYYY,FECHAASISTENCIA) * 10000 + DATEPART(MM,FECHAASISTENCIA) * 100 + DATEPART(DD,FECHAASISTENCIA) = @1
AND HORAASISTENCIA = @2
`
        , [body.idCliente, fechaHoy, horaHoy]
      )
      const participantes = consulta[0].PARTICIPANTES;

      if (this.evento.capacidad <= participantes) {
        this.catchError("no hay mas disponibilidad para el turno", "no hay mas disponibilidad para el turno");
      }

      const participantesTurnos = await this.dataSource.query(
        `SELECT COUNT( IDASISTENTESEVENTOS) AS PARTICIPANTES FROM ASISTENTESEVENTOS
WHERE DATEPART(YYYY,FECHAASISTENCIA) * 10000 + DATEPART(MM,FECHAASISTENCIA) * 100 + DATEPART(DD,FECHAASISTENCIA) = @0
AND HORAASISTENCIA = @1
`
        , [fechaHoy, horaHoy]
      )
      const participantesTurno = participantesTurnos[0].PARTICIPANTES;

      if (this.evento.capacidad <= participantesTurno) {
        this.catchError("Para el turno asignado ya no se encuentran cupos disponibles", "Para el turno asignado ya no se encuentran cupos disponibles");
      }

      const result = await this.asistenteRepository.update(
        {
          idAsistentesEventos: id
        },
        {
          nombreAsistente: body.nombreAsistente,
          anioNacimiento: body.anioNacimiento,
          fechaAsistencia: fecha,
          horaAsistencia: horaHoy,
        }
      )

      return result;
    }
    catch (error) {
      this.catchError(error);
    }
  }

  async asist(id: number, body: any) {
    try {

      const asiste: number = body.asiste;
      const result = await this.asistenteRepository.update(
        {
          idAsistentesEventos: id
        },
        {
          asiste: Boolean(asiste)
        }
      )

      return result;
    }
    catch (error) {
      this.catchError(error)
    }
  }

  async getCliente(documento: string) {
    try {
      const result = await this.clienteRepository.findOne({
        where: {
          documento: documento
        }
      })

      return {
        element: result,
        'grant-type': 'client'
      };
    }
    catch (error) {
      this.catchError(error);
    }
  }

  async postCliente(data: any) {
    try {
      if (!data.nombre1) {
        this.catchError("Debe digitar un nombre", "Debe digitar un nombre")
      }

      if (!data.apellido1) {
        this.catchError("Debe digitar un apellido", "Debe digitar un apellido")
      }

      if (!data.email) {
        this.catchError("Debe digitar un correo", "Debe digitar un correo")
      }

      if (!data.documento) {
        this.catchError("Debe digitar el documento", "Debe digitar el documento")
      }

      // if (!data.direccionResidencia) {
      //   this.catchError("Debe digitar la dirección", "Debe digitar la dirección")
      // }

      if (!data.celular) {
        this.catchError("Debe digitar el celular", "Debe digitar el celular")
      }

      if (!data.fechaNacimiento) {
        this.catchError("Debe digitar la fecha de nacimiento", "Debe digitar la fecha de nacimiento")
      }

      const consulta = await this.clienteRepository.count({
        where: {
          documento: data.documento
        }
      });

      if (consulta > 0) {
        this.catchError("El cliente ya existe en la base de datos", "El cliente ya existe en la base de datos")
      }
      const result = await this.clienteRepository.save({
        nombre1: data.nombre1,
        // nombre2: data.nombre2,
        apellido1: data.apellido1,
        // apellido2: data.apellido2,
        email: data.email,
        documento: data.documento,
        direccionResidencia: data.direccionResidencia,
        fechaCreacion: data.fechaCreacion,
        usuarioCrea: 'WEB',
        idTipoDocumento: data.idTipoDocumento,
        celular: data.celular,
        habeasData: 'SI',
        fechaNacimiento:data.fechaNacimiento
      });

      return {
        element: result,
        'grant-type': 'client'
      };
    }
    catch (error) {
      this.catchError(error);
    }
  }

  async putCliente(id:number,data: any) {
    try {
      if (!data.email) {
        this.catchError("Debe digitar un correo", "Debe digitar un correo")
      }

      // if (!data.direccionResidencia) {
      //   this.catchError("Debe digitar la dirección", "Debe digitar la dirección")
      // }

      if (!data.celular) {
        this.catchError("Debe digitar el celular", "Debe digitar el celular")
      }


      const result = await this.clienteRepository.update(
        {
          idCliente:id
        },
        {
          email:data.email,
          celular:data.celular
        }
      );

      return {
        element: result,
        'grant-type': 'client'
      };
    }
    catch (error) {
      this.catchError(error);
    }
  }

  async getTipoDocumento() {
    try {
      const tipoReferencia = await this.tipoReferenciaRepository.findOne({
        where: {
          tipoReferencia: 'TIPO DOCUMENTO'
        }
      });
      const [result, count] = await this.referenciaRepository.findAndCount(
        {
          where: {
            idTipoReferencia: tipoReferencia.idTipoReferencia
          }
        }
      )

      return {
        element: result,
        total: count
      }
    }
    catch (error) {
      this.catchError(error)
    }
  }

  async deleteAsistente(idAsistente: number) {
    try {
      const result = await this.asistenteRepository.delete(idAsistente);

      return result;
    }
    catch (error) {
      this.catchError(error)
    }
  }

  async loginUsuarios(body: any) {
    try {
      if (!body.user) {
        this.catchError("Debe digitar el usuario", "Debe digitar el usuario");
      }
      else if (!body.password) {
        this.catchError("Debe digitar la contraseña", "Debe digitar la contraseña");
      }

      const result = await this.userRepository.findOne({
        where: {
          nombreCompleto: body.user,
          clave: body.password
        }
      });

      return {
        element: result,
        'grant-type': 'user'
      }
    }
    catch (error) {
      this.catchError(error);
    }
  }
  async sendNotification(id:number,fechaQuery: Date,typeComunication:string){
    try{
      const fecha = new Date(fechaQuery);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      const fechaHoy = anio * 10000 + mes * 100 + dia;
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes().toString().padStart(2, '0'); // Asegura que tenga dos dígitos
      const horaHoy = `${hora}:${minutos}`;
      const consulta = await this.dataSource.query(
        `SELECT B.DOCUMENTO, B.EMAIL, A.FECHAASISTENCIA, A.HORAASISTENCIA, COUNT(*) AS TOTAL 
        FROM ASISTENTESEVENTOS AS A 
        INNER JOIN CLIENTE AS B ON A.IDCLIENTE = B.IDCLIENTE
        WHERE B.IDCLIENTE = @0
        AND DATEPART(YYYY, A.FECHAASISTENCIA) * 10000 + DATEPART(MM, A.FECHAASISTENCIA) * 100 + DATEPART(DD, A.FECHAASISTENCIA) = @1
        AND A.HORAASISTENCIA = @2
        GROUP BY B.DOCUMENTO, B.EMAIL, A.FECHAASISTENCIA, A.HORAASISTENCIA`,
        [id, fechaHoy, horaHoy]
      );

      // Verifica si hay resultados
      if (consulta.length > 0) {
        const primerRegistro = consulta[0]; // Solo tomamos el primer registro

        const fechaData = new Date(primerRegistro.FECHAASISTENCIA); // La fecha que deseas formatear
        const fechaFormateada = format(fechaData, 'dd/MM/yyyy');
        
        const html = `
          <p>Gracias por registrar tu turno en nuestra estación.</p>
          <ul>
            <li>Documento: ${primerRegistro.DOCUMENTO}</li>
            <li>Fecha del Turno: ${fechaFormateada}</li>
            <li>Hora: ${primerRegistro.HORAASISTENCIA}</li>
            <li>Número de Niños Registrados: ${primerRegistro.TOTAL}</li>
          </ul>
          <p>Recuerda llegar 10 minutos antes de tu turno, de lo contrario tu turno será reasignado</p>
          <a href="https://www.hayueloscc.com/politica-de-tratamiento-de-datos/">https://www.hayueloscc.com/politica-de-tratamiento-de-datos/</a>
        `;

        this.emailService.sendMail(primerRegistro.EMAIL, "Notificación turno", "Prueba", html);
        return primerRegistro; // Devuelve solo el primer registro
      }

    }
    catch(error){
      this.catchError(error);
    }
  }

  private getHoursAndMinutes(time: string) {
    const [hour, minute] = time.split(':').map(Number);

    return { hour, minute }
  }

  private catchError(err, unexpectedMessage = 'Algo salió mal, inténtalo más tarde.') {
    console.error("Error -->", err);
    if (
      err instanceof ServiceUnavailableException ||
      err instanceof InternalServerErrorException ||
      err instanceof NotFoundException ||
      err instanceof ForbiddenException ||
      err instanceof BadRequestException
    ) {
      throw err;
    }
    throw new InternalServerErrorException(
      unexpectedMessage,
      {
        cause: err,
      },
    );
  }
}
