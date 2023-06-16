import AccountInterface from "./account.type";

export default interface UserInterface {
  id?: any | null,
  name?: string | null,
  email?: string,
  password?: string,
  role?: Array<string>,
  isAdmin?: boolean,
  account?: AccountInterface
}
