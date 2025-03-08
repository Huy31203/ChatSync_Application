export interface IProfile extends IBaseModel {
  email: string;
  name: string;
  avatarUrl: string;
  members: IMember[];
}
