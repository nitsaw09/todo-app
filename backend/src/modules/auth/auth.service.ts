import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { UsersRepository } from "../users/users.repository";
import { SignupDTO } from "./dto/signup.dto";
import { LoginDTO } from "./dto/login.dto";
import { NotFoundError, BadRequestError, UnauthorizedError } from "routing-controllers";
import { IResponse } from "../../utils/interceptors/interfaces/response.interface";
import { errorMessage, successMessage } from "./auth.constants";
import Logger from "../../utils/logger";

export class AuthService {
  private logger = new Logger(AuthService.name);
  private userRepository = new UsersRepository();

  /**
   * Registers a new user in the system.
   * @param data - The signup data transfer object containing user details.
   * @returns A promise that resolves to an object containing the user ID and a success message.
   * @throws BadRequestError if the email is already registered in the system.
  */
  async signup(data: SignupDTO) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) throw new BadRequestError(errorMessage.EMAIL_ALREADY_EXITS);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.createUser({ ...data, password: hashedPassword });
    
    const response: IResponse<Object> = {};
    response.data = { userId: user._id };
    response.message = successMessage.USER_SIGNUP;
    this.logger.success(response.message);
    return response;
  }

  /**
   * Logs in a user.
   * @param data - The login data transfer object containing email and password.
   * @returns A promise that resolves to an object containing the user's JWT token and a success message.
   * @throws NotFoundError if the email is not registered in the system.
   * @throws UnauthorizedError if the password is invalid.
   */
  async login(data: LoginDTO) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) throw new NotFoundError(errorMessage.EMAIL_NOT_REGISTERED);
    
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError(errorMessage.INVALID_CREDENTIAL);

    const tokenPayload = { userId: user._id };
    const tokenSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(tokenPayload, tokenSecret, { expiresIn: '1h' });

    const response: IResponse<Object> = {};
    response.data = { token };
    response.message = successMessage.USER_LOGIN;
    this.logger.success(response.message);
    return response;
  }
}
