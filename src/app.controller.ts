import { All, Controller, Request, Response} from '@nestjs/common';
import { AppService } from './app.service';

@Controller("*")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All()
  // skipcq: JS-0323
  async forward(@Request() req , @Response() res): Promise<void> {
    await this.appService.forward(req , res);
  }
}
