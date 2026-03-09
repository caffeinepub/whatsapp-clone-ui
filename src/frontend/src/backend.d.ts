import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    id: bigint;
    content: string;
    isRead: boolean;
    timestamp: Time;
    senderId: bigint;
}
export type Time = bigint;
export interface Conversation {
    id: bigint;
    lastMessageTime?: Time;
    messages: Array<Message>;
    lastMessage?: Message;
    unreadCount: bigint;
    contactId: bigint;
}
export interface Contact {
    id: bigint;
    avatarInitials: string;
    name: string;
    phone: string;
}
export interface backendInterface {
    getContacts(): Promise<Array<Contact>>;
    getConversations(): Promise<Array<Conversation>>;
    getMessages(conversationId: bigint): Promise<Array<Message>>;
    markAsRead(conversationId: bigint): Promise<void>;
    sendMessage(conversationId: bigint, content: string): Promise<Conversation>;
}
