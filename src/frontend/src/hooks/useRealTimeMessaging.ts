import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { playMessageSound } from "../utils/audioUtils";

const CHANNEL_NAME = "wa_realtime";

function getMyUserId(): string {
  let id = localStorage.getItem("wa_my_user_id");
  if (!id) {
    id = `user_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("wa_my_user_id", id);
  }
  return id;
}

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "location"
  | "contact"
  | "sticker"
  | "gif";

export type MessageStatus = "sent" | "delivered" | "read";

export interface Reaction {
  emoji: string;
  users: string[];
}

export interface RTMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  timestamp: number;
  status: MessageStatus;
  reactions: Reaction[];
  mediaUrl?: string;
  editedAt?: number;
  deletedForAll?: boolean;
  deletedForMe?: string[];
  replyTo?: { id: string; content: string; senderId: string };
}

type RTEvent =
  | { kind: "new_message"; message: RTMessage }
  | {
      kind: "edit_message";
      id: string;
      conversationId: string;
      content: string;
      editedAt: number;
    }
  | {
      kind: "delete_message";
      id: string;
      conversationId: string;
      forAll: boolean;
      userId: string;
    }
  | {
      kind: "add_reaction";
      id: string;
      conversationId: string;
      emoji: string;
      userId: string;
    }
  | {
      kind: "remove_reaction";
      id: string;
      conversationId: string;
      emoji: string;
      userId: string;
    }
  | {
      kind: "typing_start";
      conversationId: string;
      userId: string;
      userName: string;
    }
  | { kind: "typing_stop"; conversationId: string; userId: string };

function loadMessages(conversationId: string): RTMessage[] {
  try {
    const raw = localStorage.getItem(`wa_messages_${conversationId}`);
    return raw ? (JSON.parse(raw) as RTMessage[]) : [];
  } catch {
    return [];
  }
}

function saveMessages(conversationId: string, messages: RTMessage[]): void {
  try {
    localStorage.setItem(
      `wa_messages_${conversationId}`,
      JSON.stringify(messages),
    );
  } catch {
    // quota exceeded or private mode
  }
}

function applyEvent(
  messages: RTMessage[],
  event: RTEvent,
  myUserId: string,
): RTMessage[] {
  switch (event.kind) {
    case "new_message":
      if (messages.find((m) => m.id === event.message.id)) return messages;
      return [...messages, event.message];

    case "edit_message":
      return messages.map((m) =>
        m.id === event.id
          ? { ...m, content: event.content, editedAt: event.editedAt }
          : m,
      );

    case "delete_message":
      return messages.map((m) => {
        if (m.id !== event.id) return m;
        if (event.forAll) return { ...m, deletedForAll: true };
        return { ...m, deletedForMe: [...(m.deletedForMe ?? []), myUserId] };
      });

    case "add_reaction": {
      return messages.map((m) => {
        if (m.id !== event.id) return m;
        const existing = m.reactions.find((r) => r.emoji === event.emoji);
        if (existing) {
          if (existing.users.includes(event.userId)) return m;
          return {
            ...m,
            reactions: m.reactions.map((r) =>
              r.emoji === event.emoji
                ? { ...r, users: [...r.users, event.userId] }
                : r,
            ),
          };
        }
        return {
          ...m,
          reactions: [
            ...m.reactions,
            { emoji: event.emoji, users: [event.userId] },
          ],
        };
      });
    }

    case "remove_reaction":
      return messages.map((m) => {
        if (m.id !== event.id) return m;
        return {
          ...m,
          reactions: m.reactions
            .map((r) =>
              r.emoji === event.emoji
                ? { ...r, users: r.users.filter((u) => u !== event.userId) }
                : r,
            )
            .filter((r) => r.users.length > 0),
        };
      });

    default:
      return messages;
  }
}

export interface TypingUser {
  userId: string;
  userName: string;
}

export interface UseRealTimeMessagingReturn {
  messages: RTMessage[];
  sendMessage: (
    content: string,
    type?: MessageType,
    mediaUrl?: string,
    replyTo?: RTMessage,
  ) => void;
  editMessage: (id: string, content: string) => void;
  deleteMessage: (id: string, forAll: boolean) => void;
  addReaction: (id: string, emoji: string) => void;
  removeReaction: (id: string, emoji: string) => void;
  setTyping: (isTyping: boolean) => void;
  typingUsers: TypingUser[];
}

export function useRealTimeMessaging(
  conversationId: string,
): UseRealTimeMessagingReturn {
  const myUserId = useRef(getMyUserId());
  const [messages, setMessages] = useState<RTMessage[]>(() =>
    loadMessages(conversationId),
  );
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const typingTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const lastSyncRef = useRef<number>(Date.now());

  // Setup BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;

      channel.onmessage = (ev: MessageEvent<RTEvent>) => {
        const event = ev.data;
        if (
          event.kind !== "typing_start" &&
          event.kind !== "typing_stop" &&
          "conversationId" in event &&
          event.conversationId !== conversationId
        ) {
          return;
        }

        if (
          event.kind === "typing_start" &&
          event.conversationId === conversationId
        ) {
          if (event.userId === myUserId.current) return;
          setTypingUsers((prev) => {
            if (prev.find((u) => u.userId === event.userId)) return prev;
            return [
              ...prev,
              { userId: event.userId, userName: event.userName },
            ];
          });
          // auto-clear typing after 4s
          const existing = typingTimeoutsRef.current.get(event.userId);
          if (existing) clearTimeout(existing);
          const t = setTimeout(() => {
            setTypingUsers((prev) =>
              prev.filter((u) => u.userId !== event.userId),
            );
            typingTimeoutsRef.current.delete(event.userId);
          }, 4000);
          typingTimeoutsRef.current.set(event.userId, t);
          return;
        }

        if (
          event.kind === "typing_stop" &&
          event.conversationId === conversationId
        ) {
          setTypingUsers((prev) =>
            prev.filter((u) => u.userId !== event.userId),
          );
          return;
        }

        if (
          event.kind === "new_message" &&
          event.message.senderId !== myUserId.current
        ) {
          playMessageSound();
        }

        setMessages((prev) => {
          const next = applyEvent(prev, event, myUserId.current);
          saveMessages(conversationId, next);
          return next;
        });
      };
    } catch {
      // BroadcastChannel not supported, fallback to polling
    }

    // Polling fallback every 2s
    const pollInterval = setInterval(() => {
      const stored = loadMessages(conversationId);
      setMessages((prev) => {
        if (
          stored.length !== prev.length ||
          JSON.stringify(stored.slice(-1)) !== JSON.stringify(prev.slice(-1))
        ) {
          lastSyncRef.current = Date.now();
          return stored;
        }
        return prev;
      });
    }, 2000);

    return () => {
      channel?.close();
      channelRef.current = null;
      clearInterval(pollInterval);
      for (const t of typingTimeoutsRef.current.values()) clearTimeout(t);
    };
  }, [conversationId]);

  const broadcast = useCallback((event: RTEvent) => {
    try {
      channelRef.current?.postMessage(event);
    } catch {
      // ignore
    }
  }, []);

  const sendMessage = useCallback(
    (
      content: string,
      type: MessageType = "text",
      mediaUrl?: string,
      replyTo?: RTMessage,
    ) => {
      const msg: RTMessage = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        conversationId,
        senderId: myUserId.current,
        content,
        type,
        timestamp: Date.now(),
        status: "sent",
        reactions: [],
        ...(mediaUrl ? { mediaUrl } : {}),
        ...(replyTo
          ? {
              replyTo: {
                id: replyTo.id,
                content: replyTo.content,
                senderId: replyTo.senderId,
              },
            }
          : {}),
      };
      setMessages((prev) => {
        const next = [...prev, msg];
        saveMessages(conversationId, next);
        return next;
      });
      broadcast({ kind: "new_message", message: msg });
    },
    [conversationId, broadcast],
  );

  const editMessage = useCallback(
    (id: string, content: string) => {
      const editedAt = Date.now();
      setMessages((prev) => {
        const next = applyEvent(
          prev,
          { kind: "edit_message", id, conversationId, content, editedAt },
          myUserId.current,
        );
        saveMessages(conversationId, next);
        return next;
      });
      broadcast({
        kind: "edit_message",
        id,
        conversationId,
        content,
        editedAt,
      });
    },
    [conversationId, broadcast],
  );

  const deleteMessage = useCallback(
    (id: string, forAll: boolean) => {
      setMessages((prev) => {
        const next = applyEvent(
          prev,
          {
            kind: "delete_message",
            id,
            conversationId,
            forAll,
            userId: myUserId.current,
          },
          myUserId.current,
        );
        saveMessages(conversationId, next);
        return next;
      });
      broadcast({
        kind: "delete_message",
        id,
        conversationId,
        forAll,
        userId: myUserId.current,
      });
    },
    [conversationId, broadcast],
  );

  const addReaction = useCallback(
    (id: string, emoji: string) => {
      setMessages((prev) => {
        const next = applyEvent(
          prev,
          {
            kind: "add_reaction",
            id,
            conversationId,
            emoji,
            userId: myUserId.current,
          },
          myUserId.current,
        );
        saveMessages(conversationId, next);
        return next;
      });
      broadcast({
        kind: "add_reaction",
        id,
        conversationId,
        emoji,
        userId: myUserId.current,
      });
    },
    [conversationId, broadcast],
  );

  const removeReaction = useCallback(
    (id: string, emoji: string) => {
      setMessages((prev) => {
        const next = applyEvent(
          prev,
          {
            kind: "remove_reaction",
            id,
            conversationId,
            emoji,
            userId: myUserId.current,
          },
          myUserId.current,
        );
        saveMessages(conversationId, next);
        return next;
      });
      broadcast({
        kind: "remove_reaction",
        id,
        conversationId,
        emoji,
        userId: myUserId.current,
      });
    },
    [conversationId, broadcast],
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      const profile = localStorage.getItem("wa-profile");
      const userName = profile
        ? (JSON.parse(profile) as { name: string }).name
        : "User";
      if (isTyping) {
        broadcast({
          kind: "typing_start",
          conversationId,
          userId: myUserId.current,
          userName,
        });
      } else {
        broadcast({
          kind: "typing_stop",
          conversationId,
          userId: myUserId.current,
        });
      }
    },
    [conversationId, broadcast],
  );

  return {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    setTyping,
    typingUsers,
  };
}

// Sync backend messages into local state
export function syncBackendMessages(
  conversationId: string,
  backendMessages: Array<{
    id: bigint;
    senderId: bigint;
    content: string;
    timestamp: bigint;
    isRead: boolean;
  }>,
  setMessages: Dispatch<SetStateAction<RTMessage[]>>,
): void {
  if (!backendMessages.length) return;
  const mapped: RTMessage[] = backendMessages.map((m) => ({
    id: `backend_${m.id.toString()}`,
    conversationId,
    senderId: m.senderId.toString(),
    content: m.content,
    type: "text" as MessageType,
    timestamp: Number(m.timestamp) / 1_000_000,
    status: (m.isRead ? "read" : "delivered") as MessageStatus,
    reactions: [],
  }));
  setMessages((prev) => {
    const existingIds = new Set(prev.map((m) => m.id));
    const newOnes = mapped.filter((m) => !existingIds.has(m.id));
    if (!newOnes.length) return prev;
    const merged = [...prev, ...newOnes].sort(
      (a, b) => a.timestamp - b.timestamp,
    );
    saveMessages(conversationId, merged);
    return merged;
  });
}
