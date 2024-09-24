import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
    constructor(private http:HttpService){

    }

    async sendSms(phone:string,message:string,nameClient:string){
        const data = {
            "idSmsCategory": 1,
            "name": "SMS202409",
            "template": "Prueba",
            "dateNow": 1,
            "type": "lote",
            "track": 0,
            "sendPush": 0,
            "api": 1,
            "notification": 0,
            "email": "davids59@hotmail.com",
            "rne": 0,
            "receiver": [
                  {
                      "%%NOMBRE%%": nameClient,
                      "indicative": 57,
                      "phone": 3212875783          
                      /*"message": "Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno  de las industrias desde el año 1500 cuando un impresor (N. del T. persona que se dedica a la imprenta) https://www.google.com/"*/
                  }
              ]
        }
        // this.http.post();
    }
}
