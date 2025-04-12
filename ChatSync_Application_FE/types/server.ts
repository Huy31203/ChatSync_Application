import { IBaseModel, IChannel, IMember } from '.';

export interface IServer extends IBaseModel {
  name: string;
  imageUrl: string;
  inviteCode: string;
  members: IMember[];
  channels: IChannel[];
}
