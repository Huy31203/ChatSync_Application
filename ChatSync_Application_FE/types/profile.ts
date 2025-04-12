import { IBaseModel, IMember } from '.';

export interface IProfile extends IBaseModel {
  email: string;
  name: string;
  avatarUrl: string;
  havePassword: boolean;
  members: IMember[];
}
