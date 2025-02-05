import { User } from "../../database/models/users";

export class UsersRepository {
  /**
   * Finds a user by their email address
   * @param email - The email address to search for
   * @returns A promise that resolves to the user object if found, or null if not found
  */
  async findByEmail(email: string) {
    return User.findOne({ email }).lean();
  }

  /**
   * Creates a new user in the database
   * @param data - An object containing the user details to create a new user
   * @returns A promise that resolves to the created user object
  */
  async createUser(data: { username: string, email: string, password: string}) {
    const user = new User(data);
    return await user.save();
  }
}
