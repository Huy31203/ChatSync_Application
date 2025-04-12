import { IBaseModel, IProfile, IServer } from '.';

export enum MemberRoleEnum {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST',
}

export interface IMember extends IBaseModel {
  memberRole: MemberRoleEnum;
  profile: IProfile;
  server: IServer;
}
