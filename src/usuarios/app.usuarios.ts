
export class Usuarios {
  static getStart(message, context, appService, mailService) {
    console.log('Entra a usuarios.');
    switch (message.generales.operacion) {
      case 'login':
        {
             appService.validateData(message.data, {username:"listo",password:"listo"}).then(async errores => {
                console.log("Se completa con valor = "+errores);
                if(Object.keys(JSON.parse(errores)).length == 0){
                    console.log('Entra a login...');
                    let query = 'SELECT us.*, es.descripcion FROM usuarios us '
                    + ' LEFT JOIN estados_activos es ON es.id=us.estadoactivo_id '
                    + ' WHERE us.codigo=$1 and us.psw=$2';
                    let params = [
                        message.data.username,
                        message.data.password,
                    ];
                    
                    
                    appService.searchNodeUtils(query, params, message, function(valor) {
                      if(valor.estado_p == 200){
                        appService.sendMessage(context.getArgs()[0].key, valor, 'nest_usuarios');
                        mailService.sendUserConfirmation(message.data.username, "cfcirom@uqvirtual.edu.co");
                      }else{
                        console.log("No llegaron datos...");
                        appService.sendMessage(context.getArgs()[0].key, valor, 'nest_usuarios');
                      }
                    });
                }else{
                    console.log("Error valor = "+Object.keys(JSON.parse(errores)).length);
                    const response = {};
                    response['estado_p'] = 502;
                    response['data'] = { errores: JSON.parse(errores) };
                    response['contador'] = message.data.contador;
                    appService.sendMessage(
                        context.getArgs()[0].key,
                        response,
                        'nest_usuarios',
                    );
                }
            }, err => {
                console.log("Error reject = "+err);
                const response = {};
                response['estado_p'] = 502;
                response['data'] = { errores: "\""+err+"\"" };
                response['contador'] = message.data.contador;
                appService.sendMessage(
                    context.getArgs()[0].key,
                    response,
                    'nest_usuarios',
                );
            });
        }
        break;

      case 'crear':
        {
          let query = 'INSERT INTO usuarios (codigo, nombre, estado, alias, psw, psw2, estadosino_id, estadoactivo_id) values ($1,$2,$3,$4,$5,$6,$7,$8)';
          let params = [
            message.data.codigo,
            message.data.nombre,
            message.data.estado,
            message.data.alias,
            message.data.psw,
            message.data.psw2,
            message.data.estadosino_id,
            message.data.estadoactivo_id,
          ];
          //message.generales.operacion = 'crear';
          //appService.sendMessage('nest_nododatos', message, 'nest_gateway');
          appService.searchMaster(query, params, message);
        }
        break;

      case 'codigotodos':
        {
          let query = 'SELECT * FROM usuarios WHERE codigo ilike $1';
          let params = ['%' + message.data.codigo + '%'];
          //appService.sendMessage('nest_nododatos', message, 'nest_gateway');
          appService.searchMaster(query, params, message);
        }
        break;
    case 'nombre':
        {
            let query = 'SELECT * FROM usuarios WHERE nombre ilike $1';
            let params = ['%' + message.data.codigo + '%'];
            //message.generales.operacion = 'consultar';
            //appService.sendMessage('nest_nododatos', message, 'nest_gateway');
            appService.searchMaster(query, params, message);
        }
        break;
    case 'codigo':
        {
            let query = 'SELECT * FROM usuarios WHERE codigo = $1';
            let params = [message.data.codigo];
            //message.generales.operacion = 'consultar';
            //appService.sendMessage('nest_nododatos', message, 'nest_gateway');
            appService.searchMaster(query, params, message);
        }
        break;
      default:
        {
          const response = {};
          response['estado_p'] = 502;
          response['data'] = { mensaje: 'Operacion no permitida.' };
          response['contador'] = message.data.contador;
          appService.sendMessage(
            context.getArgs()[0].key,
            message,
            'nest_usuarios',
          );
        }
        break;
    }
  }
}
