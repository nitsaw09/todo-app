import { JsonController, Post, Body, HttpCode } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { AuthService } from "./auth.service";
import { SignupDTO } from "./dto/signup.dto";
import { LoginDTO } from "./dto/login.dto";

@JsonController("/v1/auth")
export class AuthController {
  private authService = new AuthService();

  @Post("/signup")
  @OpenAPI({ summary: "User Signup" })
  @HttpCode(201)
  async signup(@Body() signupDto: SignupDTO) {
    return await this.authService.signup(signupDto);
  }

  @Post("/login")
  @OpenAPI({ summary: "User Login" })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDTO) {
    return await this.authService.login(loginDto);
  }
}
