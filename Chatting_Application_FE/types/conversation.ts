import { IBaseModel, IMember } from '.';

export interface IConversation extends IBaseModel {
  sender: IMember;
  receiver: IMember;
  relatedConversation: IConversation;
  directMessages: IDirectMessage[];
}

export interface IConversationsCreated {
  conversationMeOther: IConversation;
  conversationOtherMe: IConversation;
}

export interface IDirectMessage extends IBaseModel {
  content?: string;
  fileUrls?: string[];
  conversation: IConversation;
  deleted: boolean;
}
