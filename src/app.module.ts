import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { Producer } from 'kafkajs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaProducerProvider } from './kafka-producer.provider';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, KafkaProducerProvider],
})
export class AppModule implements OnModuleDestroy {
  constructor(
    @Inject('KafkaProducer')
    private readonly kafkaProducer: Producer,
  ) {}

  async onModuleDestroy(): Promise<void> {
    await this.kafkaProducer.disconnect();
  }
}
