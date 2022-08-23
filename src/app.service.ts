import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { GlobalService } from './global.variables';
import * as PDFDocument from 'pdfkit'
import * as fs from 'fs';
import * as Excel from 'exceljs';


@Injectable()
export class AppService {
  constructor(
    @Inject('KafkaProducer')
    private readonly kafkaProducer: Producer,
  ) {}

  async validateData(datos: any, validacion: any):Promise<any>{
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

  async searchMaster(query:string,params:any,body:any){
    body.generales['sql'] = query;
    body.generales['params'] = params;
    body.generales.operacion = 'consultar';

    this.sendMessage('nest_nododatos', body, 'nest_gateway');
  }

  async searchNodeUtils(query:string,params:any,body:any,funcion:any){
    GlobalService.promises = {promise_1:funcion};
    body.generales['promise_valor'] = "promise_1";
    body.generales['sql'] = query;
    body.generales['params'] = params;
    body.generales.operacion = 'search';

    console.log("Entra a Utils...");

    this.sendMessage('nest_nododatos', body, 'nest_usuarios-utils');
  }

  async sendMessage(topic:string, data:any, key?:string) {
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

  async generatePDF(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(resolve => {
      const filePath = './pdfPrueba.pdf';
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      })

      doc.pipe(fs.createWriteStream(filePath))      
      // customize your PDF document
      doc.text('hello world', 100, 50)
      doc.end()

      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })

    return pdfBuffer
  }

  async generateEXCEL(): Promise<string> {

    const excelBuffer:string = await new Promise(resolve => {

      const numbers: any[] = [
        { product: 'Product A', week1: 5, week2: 10, week3: 27 },
        { product: 'Product B', week1: 5, week2: 5, week3: 11 },
        { product: 'Product C', week1: 1, week2: 2, week3: 3 },
        { product: 'Product D', week1: 6, week2: 1, week3: 2 },
      ];

      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Sales Data');

      worksheet.columns = [
          { header: 'Id', key: 'id', width: 10 },
          { header: 'Name', key: 'name', width: 32 },
          { header: 'D.O.B.', key: 'DOB', width: 10 }
      ];
      worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
      worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});
      workbook.xlsx.writeFile('./temp.xlsx').then(function() {
          // done
          console.log('file is written');
      });

      resolve("")
    })

    return excelBuffer
  }
}
