export interface IServer extends IBaseModel {
  name: string;
  imageUrl: string;
  inviteCode: string;
  members: IProfile[];
}
