import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
    constructor(private http:HttpService,
                private configService:ConfigService
    ){

    }

    async sendSms(phone:string,message:string){
        const url = this.configService.get<string>('API_SMS');
        const headers = {
            Authorization: `Bearer ${this.configService.get<string>('SIGMA_TOKEN')}`,
        };
        const fecha = new Date();
        const anio = fecha.getFullYear().toString();
        const mes = (fecha.getMonth() + 1).toString();
        const dia = (fecha.getDate()).toString();       
        const hora = (fecha.getHours()).toString(); 
        const minuto = (fecha.getMinutes()).toString(); 
        const segundo = (fecha.getSeconds()).toString(); 
        const name = 'SMS'+anio + mes + dia + hora + minuto +  segundo;
        const data = {
            "idSmsCategory": 1,
            "name": name,
            "template": message,
            "dateNow": 1,
            "type": "lote",
            "track": 0,
            "sendPush": 0,
            "api": 1,
            "notification": 0,
            "email": this.configService.get<string>('EMAIL_SMS'),
            "rne": 0,
            "receiver": [
                  {
                      "indicative": 57,
                      "phone": phone          
                      /*"message": "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno  de las industrias desde el año 1500 cuando un impresor (N. del T. persona que se dedica a la imprenta) https://www.google.com/"*/
                  }
              ]
        } 
        await this.http.post(url,data,{headers}).subscribe(
            {                
                next:(data:any)=>{
                    console.log(data);
                },
                error: err => {
                    if (err.response?.data?.errors) {
                        console.log('Detalles del error:', err.response.data.errors);
                    } else {
                        console.log('No se encontraron detalles adicionales del error.');
                    }
                }
            }
        );        
    }
}
