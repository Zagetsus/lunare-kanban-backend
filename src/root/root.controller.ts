import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { RootService } from './root.service';

@Controller({
  version: VERSION_NEUTRAL
})
export class RootController {
  constructor(private readonly appService: RootService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
