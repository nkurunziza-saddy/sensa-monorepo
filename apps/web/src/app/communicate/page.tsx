"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Container, VStack, HStack, Text, Center } from "@chakra-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { AIInput } from "@/components/ui/smoothui/ai-input";
import { VoiceInput } from "@/components/ui/smoothui/voice-input";
import { Orb, type AgentState } from "@sensa-monorepo/ui";
import { Eye, Mic, Volume2, User, ArrowLeft, ArrowRightLeft, Hand } from "lucide-react";
import NextLink from "next/link";
import { useGestureDetection } from "@/hooks/use-gesture-detection";

const MotionBox = motion(Box);

type Condition = "visual" | "vocal" | "auditory" | "none";
type Message = { id: string; sender: string; content: string; time: string; modality: string };

function getInitialActiveUser(a: Condition, b: Condition): "A" | "B" {
  if (a !== "vocal" && b === "vocal") return "B";
  return "A";
}

function CommunicateContent() {
  const searchParams = useSearchParams();
  const a = (searchParams.get("a") as Condition) || "none";
  const b = (searchParams.get("b") as Condition) || "none";

  const [activeUser, setActiveUser] = useState<"A" | "B">(() => getInitialActiveUser(a, b));
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
      // Small delay to allow element mounting and prevent rapid start/stop
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
    setActiveUser(getInitialActiveUser(a, b));
  }, [a, b]);

  const addMessage = (sender: string, content: string, modality: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      modality,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleMessage = (msg: { source: "user" | "ai"; message: string }) => {
    if (msg.source === "ai") {
      setAgentState("talking");
      addMessage("Assistant", msg.message, "audio");
      setTimeout(() => setAgentState(null), 3000);
    } else {
      setAgentState("listening");
      if (msg.source === "user") {
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
    }
  };

  return (
    <Box bg="canvas" h="calc(100vh - 64px)" display="flex" flexDirection="column" overflow="hidden">
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

            <HStack gap={3} opacity={0.4}>
              <Box w={2} h={2} rounded="full" bg="brand-teal" />
              <Text fontSize="9px" fontWeight="700" textTransform="uppercase" letterSpacing="0.1em">
                Live Bridge
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Box flex="1" overflowY="auto" py={8} position="relative">
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
                  <VStack gap={2} opacity={0.2} py={4}>
                    <Text fontSize="xs" fontWeight="600">
                      Multimodal stream initialized
                    </Text>
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
                    aspectRatio={16 / 9}
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
                      height={360}
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

function getConditionColors(condition: Condition): [string, string] {
  switch (condition) {
    case "visual":
      return ["#ff4d8b", "#ffb084"];
    case "vocal":
      return ["#1a3a3a", "#a4d4c5"];
    case "auditory":
      return ["#b8a4ed", "#e8b94a"];
    default:
      return ["#0a0a0a", "#6a6a6a"];
  }
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
