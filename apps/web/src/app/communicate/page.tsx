"use client";

import * as React from "react";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Container, VStack, HStack, Text, Center, Heading } from "@chakra-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { AIInput } from "@/components/ui/smoothui/ai-input";
import { VoiceInput } from "@/components/ui/smoothui/voice-input";
import {
  type AgentState,
  SmoothButton,
  getConditionColors,
  type Condition,
} from "@sensa-monorepo/ui";
import { Eye, Mic, Volume2, User, ArrowLeft, ArrowRightLeft, Trash2, Hand } from "lucide-react";
import NextLink from "next/link";
import { useGestureDetection } from "@/hooks/use-gesture-detection";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import dynamic from "next/dynamic";

const Orb = dynamic(() => import("@sensa-monorepo/ui").then((mod) => mod.Orb), {
  ssr: false,
  loading: () => <Box w="full" h="full" bg="surface-soft/20" rounded="full" />,
});

const MotionBox = motion(Box);

type Message = { id: string; sender: string; content: string; time: string; modality: string };

function getInitialActiveUser(a: Condition, b: Condition): "A" | "B" {
  if (a !== "vocal" && b === "vocal") return "B";
  return "A";
}

function CommunicateContent() {
  const searchParams = useSearchParams();
  const a = (searchParams.get("a") as Condition) || "none";
  const b = (searchParams.get("b") as Condition) || "none";

  const defaultUser = useMemo(() => getInitialActiveUser(a, b), [a, b]);
  const [activeUserOverride, setActiveUserOverride] = useState<"A" | "B" | null>(null);
  const activeUser = activeUserOverride ?? defaultUser;

  const [agentState, setAgentState] = useState<AgentState>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const currentCondition = activeUser === "A" ? a : b;

  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);

  const {
    start: startGestures,
    stop: stopGestures,
    isDetecting,
    detectedGesture,
    error: gestureError,
  } = useGestureDetection(videoElement || undefined, canvasElement || undefined);

  const { speak } = useSpeechSynthesis();

  const lastGestureRef = React.useRef<string | null>(null);

  useEffect(() => {
    if (detectedGesture && detectedGesture.gesture !== lastGestureRef.current) {
      addMessage(`Person ${activeUser}`, detectedGesture.phrase, "gesture");
      lastGestureRef.current = detectedGesture.gesture;

      const timer = setTimeout(() => {
        lastGestureRef.current = null;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [detectedGesture, activeUser]);

  useEffect(() => {
    let isActive = true;

    if (currentCondition === "vocal" && videoElement) {
      const timer = setTimeout(() => {
        if (isActive) startGestures();
      }, 100);
      return () => {
        isActive = false;
        clearTimeout(timer);
        stopGestures();
      };
    } else {
      stopGestures();
      return () => {};
    }
  }, [currentCondition, startGestures, stopGestures, videoElement]);

  useEffect(() => {
    setActiveUserOverride(null);
  }, [a, b]);

  const setActiveUser = (user: "A" | "B") => {
    setActiveUserOverride(user);
  };

  const addMessage = (sender: string, content: string, modality: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modality,
    };
    setMessages((prev) => [...prev, newMessage]);

    // Accessibility: Auto-speak incoming messages if the receiver is in "visual" (Not Seeing) mode
    const isAssistant = sender === "Assistant";
    const receiverCondition = isAssistant ? (activeUser === "A" ? a : b) : sender.includes("A") ? b : a;
    if (receiverCondition === "visual") {
      speak(content);
    }
  };

  const handleMessage = (msg: { source: "user" | "ai"; message: string }) => {
    if (msg.source === "ai") {
      setAgentState("talking");
      addMessage("Assistant", msg.message, "audio");
      setTimeout(() => setAgentState(null), 3000);
    } else {
      setAgentState("listening");
      const modality =
        activeUser === "A"
          ? a === "visual"
            ? "speech"
            : "text"
          : b === "visual"
            ? "speech"
            : "text";
      addMessage(`Person ${activeUser}`, msg.message, modality);
    }
  };

  const clearMessages = () => setMessages([]);

  return (
    <Box bg="canvas" h="calc(100vh - 64px)" display="flex" flexDirection="column" overflow="hidden">
      {/* Header Bridge Info */}
      <Box py={4} borderBottom="1px solid" borderColor="hairline-soft" bg="canvas" zIndex={10}>
        <Container maxW="1200px">
          <HStack justify="space-between">
            <NextLink href="/">
              <HStack gap={2} color="muted" _hover={{ color: "primary" }} transition="all 0.2s">
                <ArrowLeft size={14} />
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                >
                  Cancel Bridge
                </Text>
              </HStack>
            </NextLink>

            <HStack
              gap={8}
              bg="surface-soft"
              px={6}
              py={2}
              rounded="full"
              border="1px solid"
              borderColor="hairline-soft"
            >
              <ParticipantInfo
                label="Person A"
                condition={a}
                active={activeUser === "A"}
                onClick={() => setActiveUser("A")}
              />
              <ArrowRightLeft size={12} opacity={0.3} />
              <ParticipantInfo
                label="Person B"
                condition={b}
                active={activeUser === "B"}
                onClick={() => setActiveUser("B")}
              />
            </HStack>

            <HStack gap={4}>
              <SmoothButton variant="ghost" size="sm" onClick={clearMessages} color="muted">
                <Trash2 size={14} />
              </SmoothButton>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Content / Feed */}
      <Box flex="1" overflowY="auto" py={8} position="relative" className="custom-scrollbar">
        <Container maxW="800px">
          <VStack gap={10} w="full">
            <Box position="relative" w="full" display="flex" justifyContent="center">
              <Box w={{ base: "180px", md: "240px" }} h={{ base: "180px", md: "240px" }}>
                <Orb agentState={agentState} colors={getConditionColors(currentCondition)} />
              </Box>
              <Center position="absolute" inset="0" pointerEvents="none">
                <VStack gap={1}>
                  <Text
                    fontSize="9px"
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing="0.4em"
                    opacity={0.3}
                  >
                    {activeUser === "A" ? "Person A" : "Person B"}
                  </Text>
                  <Text fontSize="xs" fontWeight="500">
                    {getConditionLabel(currentCondition)}
                  </Text>
                </VStack>
              </Center>
            </Box>

            <VStack gap={6} w="full" align="stretch">
              <AnimatePresence initial={false}>
                {messages.length === 0 ? (
                  <VStack gap={4} opacity={0.4} py={12} textAlign="center">
                    <VStack gap={1}>
                      <Heading fontSize="md" fontWeight="600">
                        Bridge Established
                      </Heading>
                      <Text fontSize="sm">
                        Waiting for Person {activeUser} to {getConditionActionLabel(currentCondition)}
                      </Text>
                    </VStack>
                    <Box w="1" h="1" rounded="full" bg="primary" />
                  </VStack>
                ) : (
                  messages.map((m) => (
                    <MessageBubble
                      key={m.id}
                      sender={m.sender}
                      content={m.content}
                      time={m.time}
                      modality={m.modality}
                    />
                  ))
                )}
              </AnimatePresence>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* Interaction Layer */}
      <Box
        bg="rgba(255, 250, 240, 0.9)"
        backdropFilter="blur(30px)"
        py={8}
        borderTop="1px solid"
        borderColor="hairline-soft"
        zIndex={10}
      >
        <Container maxW="800px">
          <AnimatePresence mode="wait">
            <MotionBox
              key={`${activeUser}-${currentCondition}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              w="full"
            >
              {currentCondition === "vocal" ? (
                <VStack w="full" gap={6}>
                  <Box
                    w="full"
                    maxW="480px"
                    aspectRatio={4 / 3}
                    bg="primary"
                    rounded="clay-md"
                    overflow="hidden"
                    position="relative"
                    border="1px solid"
                    borderColor="hairline"
                  >
                    <video
                      ref={setVideoElement}
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scaleX(-1)",
                      }}
                    />
                    <canvas
                      ref={setCanvasElement}
                      width={640}
                      height={480}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                    />
                    {!isDetecting && (
                      <Center
                        position="absolute"
                        inset="0"
                        bg="primary/40"
                        backdropFilter="blur(4px)"
                        color="white"
                      >
                        <VStack gap={2}>
                          <Hand size={24} strokeWidth={1.5} opacity={0.8} />
                          <Text
                            fontSize="xs"
                            fontWeight="600"
                            textShadow="0 2px 4px rgba(0,0,0,0.3)"
                          >
                            {gestureError ? "Camera Error" : "Initializing..."}
                          </Text>
                        </VStack>
                      </Center>
                    )}
                  </Box>
                  <HStack gap={4}>
                    <Box w={2} h={2} rounded="full" bg={gestureError ? "brand-pink" : "success"} />
                    <Text
                      fontSize="xs"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="muted"
                    >
                      {gestureError ? `Error: ${gestureError}` : "Surgical Bridge Active"}
                    </Text>
                  </HStack>
                </VStack>
              ) : currentCondition === "visual" ? (
                <VoiceInput onMessage={handleMessage} />
              ) : (
                <AIInput onMessage={handleMessage} />
              )}
            </MotionBox>
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
}

export default function CommunicatePage() {
  return (
    <Suspense
      fallback={
        <Center h="full">
          <Text>Establishing bridge...</Text>
        </Center>
      }
    >
      <CommunicateContent />
    </Suspense>
  );
}

function ParticipantInfo({
  label,
  condition,
  active,
  onClick,
}: {
  label: string;
  condition: Condition;
  active: boolean;
  onClick: () => void;
}) {
  const Icon =
    condition === "visual"
      ? Eye
      : condition === "vocal"
        ? Mic
        : condition === "auditory"
          ? Volume2
          : User;

  return (
    <HStack
      as="button"
      onClick={onClick}
      gap={3}
      px={3}
      py={1.5}
      rounded="clay-md"
      bg={active ? "canvas" : "transparent"}
      border="1px solid"
      borderColor={active ? "hairline" : "transparent"}
      transition="all 0.2s"
    >
      <Center
        w={6}
        h={6}
        rounded="full"
        bg={active ? "primary" : "surface-soft"}
        color={active ? "white" : "muted"}
      >
        <Icon size={12} strokeWidth={2} />
      </Center>
      <VStack align="start" gap={0}>
        <Text
          fontSize="9px"
          fontWeight="700"
          textTransform="uppercase"
          letterSpacing="0.1em"
          color={active ? "primary" : "muted"}
        >
          {label}
        </Text>
        <Text fontSize="10px" fontWeight="600" opacity={active ? 1 : 0.5}>
          {condition === "none"
            ? "Standard"
            : condition.charAt(0).toUpperCase() + condition.slice(1)}
        </Text>
      </VStack>
    </HStack>
  );
}

function MessageBubble({
  sender,
  content,
  time,
  modality,
}: {
  sender: string;
  content: string;
  time: string;
  modality: string;
}) {
  return (
    <MotionBox initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} w="full">
      <VStack align="start" gap={2} w="full" px={2}>
        <HStack w="full" justify="space-between">
          <HStack gap={3}>
            <Text
              fontSize="10px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="primary"
            >
              {sender}
            </Text>
            <Box w="1px" h="2" bg="hairline" />
            <Text
              fontSize="9px"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.1em"
              color="muted"
            >
              {modality}
            </Text>
          </HStack>
          <Text fontSize="10px" color="muted" fontWeight="500">
            {time}
          </Text>
        </HStack>
        <Box
          p={6}
          bg="surface-soft"
          rounded="clay-md"
          border="1px solid"
          borderColor="hairline-soft"
          w="full"
        >
          <Text fontSize="md" lineHeight="1.6" fontWeight="400">
            {content}
          </Text>
        </Box>
      </VStack>
    </MotionBox>
  );
}

function getConditionLabel(condition: Condition): string {
  switch (condition) {
    case "visual":
      return "Aural Focus";
    case "vocal":
      return "Gesture Bridge";
    case "auditory":
      return "Visual Stream";
    default:
      return "Standard Access";
  }
}

function getConditionActionLabel(condition: Condition): string {
  switch (condition) {
    case "visual":
      return "speak";
    case "vocal":
      return "perform a gesture";
    case "auditory":
      return "type a message";
    default:
      return "interact";
  }
}
