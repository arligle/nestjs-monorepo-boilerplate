import { Injectable } from '@nestjs/common';
import { add } from '@aio/data-modeling/index';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello Master!${add(11, 22)}`;
  }
}
