import { useCallback, useEffect, useRef, useState } from "react";

interface UseWebRTCOptions {
  onIncomingCall?: (contactId: string, type: "voice" | "video") => void;
  onCallEnd?: () => void;
}

export interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  startCall: (contactId: string, type: "voice" | "video") => Promise<void>;
  answerCall: (contactId: string) => Promise<void>;
  endCall: () => void;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
}

export function useWebRTC(options: UseWebRTCOptions = {}): UseWebRTCReturn {
  const { onIncomingCall, onCallEnd } = options;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const currentContactRef = useRef<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ICE_SERVERS: RTCIceServer[] = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ];

  const createPC = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onicecandidate = (ev) => {
      if (!ev.candidate || !currentContactRef.current) return;
      const key = `wa_webrtc_ice_${currentContactRef.current}`;
      try {
        const existing: RTCIceCandidateInit[] = JSON.parse(
          localStorage.getItem(key) ?? "[]",
        );
        existing.push(ev.candidate.toJSON());
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        // ignore
      }
    };

    pc.ontrack = (ev) => {
      const stream = ev.streams[0];
      if (stream) {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
        setIsConnected(true);
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        endCall();
      }
    };

    return pc;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getLocalStream = useCallback(
    async (video: boolean): Promise<MediaStream> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video,
        });
        return stream;
      } catch {
        // Return silent/empty stream if permission denied
        return new MediaStream();
      }
    },
    [],
  );

  const startCall = useCallback(
    async (contactId: string, type: "voice" | "video") => {
      currentContactRef.current = contactId;
      const pc = createPC();
      pcRef.current = pc;

      const stream = await getLocalStream(type === "video");
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Store offer as signaling
      localStorage.setItem(
        `wa_webrtc_offer_${contactId}`,
        JSON.stringify({
          sdp: pc.localDescription,
          type,
          timestamp: Date.now(),
        }),
      );

      // Poll for answer
      pollingRef.current = setInterval(async () => {
        try {
          const answerRaw = localStorage.getItem(
            `wa_webrtc_answer_${contactId}`,
          );
          if (!answerRaw) return;
          const answerData = JSON.parse(answerRaw) as {
            sdp: RTCSessionDescriptionInit;
          };
          if (pc.signalingState !== "have-local-offer") return;
          await pc.setRemoteDescription(
            new RTCSessionDescription(answerData.sdp),
          );
          // Add ICE candidates
          const iceRaw = localStorage.getItem(
            `wa_webrtc_ice_remote_${contactId}`,
          );
          if (iceRaw) {
            const candidates = JSON.parse(iceRaw) as RTCIceCandidateInit[];
            for (const c of candidates) {
              await pc.addIceCandidate(new RTCIceCandidate(c));
            }
          }
          if (pollingRef.current) clearInterval(pollingRef.current);
        } catch {
          // ignore race conditions
        }
      }, 1000);
    },
    [createPC, getLocalStream],
  );

  const answerCall = useCallback(
    async (contactId: string) => {
      currentContactRef.current = contactId;
      const offerRaw = localStorage.getItem(`wa_webrtc_offer_${contactId}`);
      if (!offerRaw) return;
      const offerData = JSON.parse(offerRaw) as {
        sdp: RTCSessionDescriptionInit;
        type: "voice" | "video";
      };

      const pc = createPC();
      pcRef.current = pc;

      const stream = await getLocalStream(offerData.type === "video");
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }

      await pc.setRemoteDescription(new RTCSessionDescription(offerData.sdp));

      // Add caller's ICE candidates
      const iceRaw = localStorage.getItem(`wa_webrtc_ice_${contactId}`);
      if (iceRaw) {
        const candidates = JSON.parse(iceRaw) as RTCIceCandidateInit[];
        for (const c of candidates) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(c));
          } catch {
            // ignore
          }
        }
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Store answer for caller to read
      localStorage.setItem(
        `wa_webrtc_answer_${contactId}`,
        JSON.stringify({ sdp: pc.localDescription }),
      );

      setIsConnected(true);
    },
    [createPC, getLocalStream],
  );

  const endCall = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    const pc = pcRef.current;
    if (pc) {
      pc.ontrack = null;
      pc.onicecandidate = null;
      pc.onconnectionstatechange = null;
      pc.close();
      pcRef.current = null;
    }

    const contactId = currentContactRef.current;
    if (contactId) {
      // Clean up signaling data
      localStorage.removeItem(`wa_webrtc_offer_${contactId}`);
      localStorage.removeItem(`wa_webrtc_answer_${contactId}`);
      localStorage.removeItem(`wa_webrtc_ice_${contactId}`);
      localStorage.removeItem(`wa_webrtc_ice_remote_${contactId}`);
    }
    currentContactRef.current = null;

    for (const t of localStream?.getTracks() ?? []) t.stop();
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

    onCallEnd?.();
  }, [localStream, onCallEnd]);

  // Poll for incoming calls
  useEffect(() => {
    if (!onIncomingCall) return;
    const checkIncoming = setInterval(() => {
      // Look for any offer not from us
      const myId = localStorage.getItem("wa_my_user_id") ?? "";
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith("wa_webrtc_offer_")) continue;
        const contactId = key.replace("wa_webrtc_offer_", "");
        if (contactId === myId) continue;
        try {
          const offerRaw = localStorage.getItem(key);
          if (!offerRaw) continue;
          const offer = JSON.parse(offerRaw) as {
            sdp: RTCSessionDescriptionInit;
            type: "voice" | "video";
            timestamp: number;
          };
          // Only respond to recent offers (within 30s)
          if (Date.now() - offer.timestamp > 30000) {
            localStorage.removeItem(key);
            continue;
          }
          // Don't answer if already in a call
          if (pcRef.current) continue;
          onIncomingCall(contactId, offer.type);
        } catch {
          // ignore
        }
      }
    }, 2000);

    return () => clearInterval(checkIncoming);
  }, [onIncomingCall]);

  return {
    localStream,
    remoteStream,
    isConnected,
    startCall,
    answerCall,
    endCall,
    localVideoRef,
    remoteVideoRef,
  };
}
