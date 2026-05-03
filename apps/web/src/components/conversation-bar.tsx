"use client";

import * as React from "react";
import { useConversation } from "@elevenlabs/react";
import { ArrowUpIcon, ChevronDown, Keyboard, Mic, MicOff, PhoneIcon, XIcon } from "lucide-react";

import { cn, SmoothButton, Card, LiveWaveform } from "@sensa-monorepo/ui";
import { Separator, Textarea, Box, HStack } from "@chakra-ui/react";
import { trpc } from "@/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

export type AgentConnectionState = "disconnected" | "connecting" | "connected" | "disconnecting";

export interface ConversationBarProps {
  agentId: string;
  className?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (message: { source: "user" | "ai"; message: string }) => void;
  onSendMessage?: (message: string) => void;
}

export const ConversationBar = React.forwardRef<HTMLDivElement, ConversationBarProps>(
  (
    { agentId: _agentId, className, onConnect, onDisconnect, onError, onMessage, onSendMessage },
    ref,
  ) => {
    const [isMuted, setIsMuted] = React.useState(false);
    const [agentState, setAgentState] = React.useState<AgentConnectionState>("disconnected");
    const [keyboardOpen, setKeyboardOpen] = React.useState(false);
    const [textInput, setTextInput] = React.useState("");
    const mediaStreamRef = React.useRef<MediaStream | null>(null);

    // Using the hook inside the component
    const queryClient = useQueryClient();

    const conversation = useConversation({
      onConnect: () => {
        onConnect?.();
      },
      onDisconnect: () => {
        setAgentState("disconnected");
        onDisconnect?.();
        setKeyboardOpen(false);
      },
      onMessage: (message) => {
        onMessage?.(message);
      },
      micMuted: isMuted,
      onError: (error: unknown) => {
        console.error("Error:", error);
        setAgentState("disconnected");
        const errorObj =
          error instanceof Error
            ? error
            : new Error(typeof error === "string" ? error : JSON.stringify(error));
        onError?.(errorObj);
      },
    });

    const getMicStream = React.useCallback(async () => {
      if (mediaStreamRef.current) return mediaStreamRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      return stream;
    }, []);

    const startConversation = React.useCallback(async () => {
      try {
        setAgentState("connecting");

        const signedUrl = await queryClient.fetchQuery(
          trpc.communication.getElevenLabsToken.queryOptions(),
        );

        await getMicStream();

        await conversation.startSession({
          signedUrl,
          onStatusChange: (status) => setAgentState(status.status as AgentConnectionState),
        });
      } catch (error) {
        console.error("Error starting conversation:", error);
        setAgentState("disconnected");
        onError?.(error as Error);
      }
    }, [conversation, getMicStream, onError, queryClient]);

    const handleEndSession = React.useCallback(() => {
      conversation.endSession();
      setAgentState("disconnected");
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    }, [conversation]);

    const toggleMute = React.useCallback(() => {
      setIsMuted((prev) => !prev);
    }, []);

    const handleStartOrEnd = React.useCallback(() => {
      if (agentState === "connected" || agentState === "connecting") {
        handleEndSession();
      } else if (agentState === "disconnected") {
        startConversation();
      }
    }, [agentState, handleEndSession, startConversation]);

    const handleSendText = React.useCallback(() => {
      if (!textInput.trim()) return;
      const messageToSend = textInput;
      conversation.sendUserMessage(messageToSend);
      setTextInput("");
      onSendMessage?.(messageToSend);
    }, [conversation, textInput, onSendMessage]);

    const isConnected = agentState === "connected";

    const handleTextChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setTextInput(value);
        if (value.trim() && isConnected) {
          conversation.sendContextualUpdate(value);
        }
      },
      [conversation, isConnected],
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSendText();
        }
      },
      [handleSendText],
    );

    React.useEffect(() => {
      return () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        }
      };
    }, []);

    return (
      <Box ref={ref} className={cn("flex w-full items-end justify-center", className)}>
        <Card className="m-0 w-full overflow-hidden border border-hairline bg-canvas shadow-none rounded-clay-xl">
          <Box display="flex" flexDirection="column-reverse">
            <Box>
              {keyboardOpen && <Separator borderColor="hairline" />}
              <HStack justify="space-between" p="3" gap="2">
                <Box h="10" w="140px">
                  <HStack
                    h="full"
                    rounded="clay-md"
                    bg="surface-soft"
                    border="1px solid"
                    borderColor="hairline-soft"
                    px="3"
                  >
                    <Box
                      h="full"
                      flex="1"
                      position="relative"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      overflow="hidden"
                    >
                      <LiveWaveform
                        key={agentState === "disconnected" ? "idle" : "active"}
                        active={isConnected && !isMuted}
                        processing={agentState === "connecting"}
                        barWidth={2}
                        barGap={1}
                        barRadius={1}
                        height={16}
                        className={cn(
                          "transition-opacity duration-300",
                          agentState === "disconnected" && "opacity-0",
                        )}
                      />
                      {agentState === "disconnected" && (
                        <Box
                          as="span"
                          fontSize="10px"
                          fontWeight="bold"
                          textTransform="uppercase"
                          letterSpacing="wider"
                          color="muted"
                        >
                          Standby
                        </Box>
                      )}
                    </Box>
                  </HStack>
                </Box>
                <HStack gap={1}>
                  <SmoothButton
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    disabled={!isConnected}
                    className={cn("rounded-full", isMuted && "bg-brand-pink/10 text-brand-pink")}
                  >
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </SmoothButton>
                  <SmoothButton
                    variant="ghost"
                    size="icon"
                    onClick={() => setKeyboardOpen((v) => !v)}
                    disabled={!isConnected}
                    className="rounded-full"
                  >
                    {keyboardOpen ? <ChevronDown size={18} /> : <Keyboard size={18} />}
                  </SmoothButton>
                  <Separator orientation="vertical" h="6" borderColor="hairline" />
                  <SmoothButton
                    variant={isConnected || agentState === "connecting" ? "destructive" : "default"}
                    size="icon"
                    onClick={handleStartOrEnd}
                    disabled={agentState === "disconnecting"}
                    className="rounded-full"
                  >
                    {isConnected || agentState === "connecting" ? (
                      <XIcon size={18} />
                    ) : (
                      <PhoneIcon size={18} />
                    )}
                  </SmoothButton>
                </HStack>
              </HStack>
            </Box>

            <Box
              overflow="hidden"
              transition="all 0.3s cubic-bezier(0.22,1,0.36,1)"
              maxH={keyboardOpen ? "160px" : "0"}
            >
              <Box position="relative" p="4">
                <Textarea
                  value={textInput}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  border="none"
                  focusVisibleRing="none"
                  className="min-h-[100px] p-0 text-sm placeholder:text-muted"
                  disabled={!isConnected}
                />
                <SmoothButton
                  size="icon"
                  variant="ghost"
                  onClick={handleSendText}
                  disabled={!textInput.trim() || !isConnected}
                  className="absolute right-4 bottom-4 h-8 w-8 rounded-full"
                >
                  <ArrowUpIcon size={16} />
                </SmoothButton>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    );
  },
);

ConversationBar.displayName = "ConversationBar";
