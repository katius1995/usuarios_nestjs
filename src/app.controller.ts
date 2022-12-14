import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { GlobalService } from './global.variables';
import { MailService } from './mail/mail.service';
import { Usuarios } from './usuarios/app.usuarios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private mailService: MailService) {
    GlobalService.services = { usuarios: Usuarios };
  }

  @MessagePattern('nest_usuarios') // Our topic name
  getHello(@Payload() message, @Ctx() context: KafkaContext) {
    try {
      const generales = message.generales;
      GlobalService.services[generales.tipo_servicio].getStart(
        message,
        context,
        this.appService,
        this.mailService
      );
    } catch (error) {
      console.log(error);
    }
  }

  @MessagePattern('nest_usuarios-utils') // Our topic name
  getUtils(@Payload() message) {
    try {
      let prom = message.promise_valor;
      console.log("Entra a Utils promise... = "+message);
      GlobalService.promises[prom](message);

    } catch (error) {
      console.log(error);
    }
  }
}
