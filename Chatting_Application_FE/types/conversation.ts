import { IBaseModel, IMember } from '.';

export interface IConversation extends IBaseModel {
  sender: IMember;
  receiver: IMember;
  directMessages: IDirectMessage[];
}

export interface IDirectMessage extends IBaseModel {
  content?: string;
  fileUrl?: string;
  conversation: IConversation;
}
