import { IBaseModel, IMember, IServer } from '.';

export enum ChannelTypeEnum {
  TEXT = 'TEXT',
}

export interface IChannel extends IBaseModel {
  name: string;
  type: ChannelTypeEnum;
  server: IServer;
}

export interface IMessage extends IBaseModel {
  content?: string;
  fileUrls?: string[];
  channel: IChannel;
  sender: IMember;
  deleted: boolean;
}
