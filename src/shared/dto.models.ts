import { IUser } from 'src/users/user.model';

export enum ResultErrorEnum {
  sameHouse = 'SAME_HOUSE',
  noUser = 'USER_NOT_FOUND',
  noId = 'NATIONAL_NUMBER_NOT_FOUND',
  wrongPass = 'WRONG_PASSWORD',
  notSigned = 'NOT_SIGNED_IN',
  notPermit = 'NO_PERMISSION',
  repetedOption = 'OPTIONS_WITH_SAME_NAME',
  noOption = "OPTION_NOT_EXIST"
}

export type LoggedinUser = {
  accessToken: string;
  user: IUser;
};
