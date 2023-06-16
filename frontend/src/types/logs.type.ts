import AccountInterface from "./account.type";
import UserInterface from "./user.type";

export default interface LogInterface {
    id: number;
    startDate: string;
    endDate?: string;
    user: UserInterface;
    account: AccountInterface;
}
