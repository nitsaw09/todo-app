import { IsEmail, IsNotEmpty, IsString, Length, Validate } from "class-validator";

class MatchPassword {
  validate(value: any, args: any) {
    return value === args.object.password;
  }

  defaultMessage() {
    return "Passwords do not match";
  }
}

export class SignupDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Length(6, 20, { message: "Password must be 6-20 characters" })
  password: string;

  @Validate(MatchPassword, { message: "Confirm password must match password" })
  confirmPassword: string;
}
