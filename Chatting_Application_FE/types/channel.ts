import { IBaseModel, IServer } from '.';

export enum ChannelTypeEnum {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

export interface IChannel extends IBaseModel {
  name: string;
  type: ChannelTypeEnum;
  server: IServer;
}
