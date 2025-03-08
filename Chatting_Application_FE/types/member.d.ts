enum MemberRoleEnum {
  ADMIN,
  MODERATOR,
  GUEST,
}

export interface IMember extends IBaseModel {
  memberRole: MemberRoleEnum;
  profile: IProfile;
  server: IServer;
}
