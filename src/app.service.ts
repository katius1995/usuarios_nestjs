import { Inject, Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { GlobalService } from './global.variables';

@Injectable()
export class AppService {
  constructor(
    @Inject('KafkaProducer')
    private readonly kafkaProducer: Producer,
  ) {}

  async validarDatos(datos, validacion):Promise<any>{
    let val = new Promise((resolve, reject) => {
      try{
        let errores = {}
        let size = Object.keys(validacion).length;
        Object.keys(validacion).forEach((object, index) => {
          console.log("Objetc = "+object);
          console.log("index = "+index);
          console.log("value = "+datos[object]);
          if(datos[object] === undefined){
            errores[object] = object + " es requerido.";
          }
          if(index == size-1){
            resolve(JSON.stringify(errores));
          }
        });
      }catch(err){
        reject(err);
      }
    });
    return val;
  }

  async consultarMaster(query,params,body){
    body.generales['sql'] = query;
    body.generales['params'] = params;
    body.generales.operacion = 'consultar';

    this.sendMessage('nest_nododatos', body, 'nest_gateway');
  }

  async consultarNodoUtils(query,params,body,funcion){
    GlobalService.promises = {promise_1:funcion};
    body.generales['promise_valor'] = "promise_1";
    body.generales['sql'] = query;
    body.generales['params'] = params;
    body.generales.operacion = 'consultar';

    console.log("Entra a Utils...");

    this.sendMessage('nest_nododatos', body, 'nest_usuarios-utils');
  }

  async sendMessage(topic, data, key?) {
    return this.kafkaProducer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(data),
          key,
        },
      ],
    });
  }
}
