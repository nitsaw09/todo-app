import { IsEmail, IsString } from "class-validator";

export class LoginDTO {
    @IsEmail({}, { message: "Invalid email format" })
    email: string;
  
    @IsString()
    password: string;
}