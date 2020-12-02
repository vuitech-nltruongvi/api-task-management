import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentitalsDto } from './dto/auth-credentials.dto';


@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) { }

   @Post('/signup')
   signUp(@Body(ValidationPipe) authCredentitalsDto: AuthCredentitalsDto): Promise<void> {
      return this.authService.signUp(authCredentitalsDto)
   }

   @Post('/signin')
   signIn(@Body(ValidationPipe) authCredentitalsDto: AuthCredentitalsDto): Promise<{ accessToken: string }> {
      return this.authService.signIn(authCredentitalsDto)
   }
}
