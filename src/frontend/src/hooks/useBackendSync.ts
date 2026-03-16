import { useCallback, useEffect, useRef, useState } from "react";
import type { Contact, Conversation } from "../backend.d";
import { useActor } from "./useActor";

export interface UseBackendSyncReturn {
  backendConversations: Conversation[];
  backendContacts: Contact[];
  isBackendLoading: boolean;
  isBackendConnected: boolean;
  sendBackendMessage: (convId: bigint, content: string) => Promise<void>;
  markConvRead: (convId: bigint) => Promise<void>;
}

export function useBackendSync(): UseBackendSyncReturn {
  const { actor, isFetching } = useActor();
  const [backendConversations, setBackendConversations] = useState<
    Conversation[]
  >([]);
  const [backendContacts, setBackendContacts] = useState<Contact[]>([]);
  const [isBackendLoading, setIsBackendLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!actor) return;
    try {
      const convs = await actor.getConversations();
      setBackendConversations(convs);
    } catch {
      // silently ignore
    }
  }, [actor]);

  const fetchContacts = useCallback(async () => {
    if (!actor) return;
    try {
      const contacts = await actor.getContacts();
      setBackendContacts(contacts);
    } catch {
      // silently ignore
    }
  }, [actor]);

  useEffect(() => {
    if (!actor || isFetching) return;
    setIsBackendLoading(true);
    Promise.all([fetchConversations(), fetchContacts()]).finally(() => {
      setIsBackendLoading(false);
    });

    intervalRef.current = setInterval(() => {
      fetchConversations();
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, isFetching, fetchConversations, fetchContacts]);

  const sendBackendMessage = useCallback(
    async (convId: bigint, content: string) => {
      if (!actor) return;
      try {
        const updated = await actor.sendMessage(convId, content);
        setBackendConversations((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
      } catch {
        // silently ignore
      }
    },
    [actor],
  );

  const markConvRead = useCallback(
    async (convId: bigint) => {
      if (!actor) return;
      try {
        await actor.markAsRead(convId);
        setBackendConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0n } : c)),
        );
      } catch {
        // silently ignore
      }
    },
    [actor],
  );

  return {
    backendConversations,
    backendContacts,
    isBackendLoading,
    isBackendConnected: !!actor && !isFetching,
    sendBackendMessage,
    markConvRead,
  };
}
