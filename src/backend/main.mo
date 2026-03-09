import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

actor {
  type Contact = {
    id : Nat;
    name : Text;
    avatarInitials : Text;
    phone : Text;
  };

  type Message = {
    id : Nat;
    senderId : Nat;
    content : Text;
    timestamp : Time.Time;
    isRead : Bool;
  };

  type Conversation = {
    id : Nat;
    contactId : Nat;
    messages : [Message];
    unreadCount : Nat;
    lastMessage : ?Message;
    lastMessageTime : ?Time.Time;
  };

  // Pre-seeded contacts
  let contacts = Map.fromIter<Nat, Contact>(
    [(1, { id = 1; name = "Alice"; avatarInitials = "A"; phone = "123-456-7890" }), (2, { id = 2; name = "Bob"; avatarInitials = "B"; phone = "234-567-8901" }), (3, { id = 3; name = "Charlie"; avatarInitials = "C"; phone = "345-678-9012" }), (4, { id = 4; name = "David"; avatarInitials = "D"; phone = "456-789-0123" }), (5, { id = 5; name = "Eve"; avatarInitials = "E"; phone = "567-890-1234" })].values()
  );

  // Pre-seeded conversations
  let conversations = Map.fromIter<Nat, Conversation>(
    [(1, { id = 1; contactId = 1; messages = [{ id = 1; senderId = 1; content = "Hey Alice!"; timestamp = Time.now(); isRead = false }, { id = 2; senderId = 1; content = "How are you?"; timestamp = Time.now(); isRead = false }]; unreadCount = 2; lastMessage = ?{ id = 2; senderId = 1; content = "How are you?"; timestamp = Time.now(); isRead = false }; lastMessageTime = ?Time.now() }), (2, { id = 2; contactId = 2; messages = [{ id = 1; senderId = 2; content = "Hey Bob!"; timestamp = Time.now(); isRead = true }, { id = 2; senderId = 2; content = "Let's meet up."; timestamp = Time.now(); isRead = false }]; unreadCount = 1; lastMessage = ?{ id = 2; senderId = 2; content = "Let's meet up."; timestamp = Time.now(); isRead = false }; lastMessageTime = ?Time.now() }), (3, { id = 3; contactId = 3; messages = [{ id = 1; senderId = 3; content = "Hi Charlie!"; timestamp = Time.now(); isRead = false }]; unreadCount = 1; lastMessage = ?{ id = 1; senderId = 3; content = "Hi Charlie!"; timestamp = Time.now(); isRead = false }; lastMessageTime = ?Time.now() })].values()
  );

  public query ({ caller }) func getContacts() : async [Contact] {
    contacts.values().toArray();
  };

  public query ({ caller }) func getConversations() : async [Conversation] {
    conversations.values().toArray();
  };

  public query ({ caller }) func getMessages(conversationId : Nat) : async [Message] {
    switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?conversation) { conversation.messages };
    };
  };

  public shared ({ caller }) func sendMessage(conversationId : Nat, content : Text) : async Conversation {
    switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?conversation) {
        let newMessage = {
          id = conversation.messages.size() + 1;
          senderId = 0; // Assuming current user is sender
          content;
          timestamp = Time.now();
          isRead = false;
        };

        let updatedMessages = conversation.messages.concat([newMessage]);

        let updatedConversation = {
          conversation with
          messages = updatedMessages;
          unreadCount = conversation.unreadCount + 1;
          lastMessage = ?newMessage;
          lastMessageTime = ?Time.now();
        };

        conversations.add(conversationId, updatedConversation);
        updatedConversation;
      };
    };
  };

  public shared ({ caller }) func markAsRead(conversationId : Nat) : async () {
    switch (conversations.get(conversationId)) {
      case (null) { Runtime.trap("Conversation not found") };
      case (?conversation) {
        let updatedMessages = conversation.messages.map(func(msg) { { msg with isRead = true } });

        let updatedConversation = {
          conversation with
          messages = updatedMessages;
          unreadCount = 0;
        };

        conversations.add(conversationId, updatedConversation);
      };
    };
  };
};
