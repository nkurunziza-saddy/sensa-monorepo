"use client";

import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useGestureDetection } from "@/hooks/use-gesture-detection";
import { useAccessibilitySettings } from "@/hooks/use-accessibility-settings";
import { LargeButton } from "@/components/ui/large-button";
import {
  Mic,
  MessageSquare,
  Hand,
  Volume2,
  Square,
  Send,
  Camera,
  Info,
  History,
} from "lucide-react";
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Flex,
  IconButton,
  Input,
  Tabs,
  Center,
  Badge,
  HStack,
  Separator,
} from "@chakra-ui/react";

export default function CommunicatePage() {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [textInput, setTextInput] = useState("");
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const conversationId = "unified-session";
  const { autoReadMessages } = useAccessibilitySettings();

  // --- Database Logic ---
  const { data: messages, refetch } = useQuery(
    trpc.communication.listMessages.queryOptions({ conversationId }),
  );
  const addMessage = useMutation(
    trpc.communication.addMessage.mutationOptions({
      onSuccess: () => refetch(),
    }),
  );

  const saveMessage = useCallback(
    (content: string, inputModality: "speech" | "text" | "gesture") => {
      addMessage.mutate({
        conversationId,
        inputModality,
        outputModality: "text",
        content,
      });
    },
    [addMessage, conversationId],
  );

  // --- Speech Logic ---
  const { isListening, transcript, start: startSTT, stop: stopSTT } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      saveMessage(transcript, "speech");
      if (autoReadMessages) speak(transcript);
    }
  }, [transcript, saveMessage, autoReadMessages]);

  // --- Gesture Logic ---
  const {
    isDetecting,
    detectedGesture,
    metadata,
    start: startGesture,
    stop: stopGesture,
    availableGestures,
  } = useGestureDetection(videoElement || undefined);

  useEffect(() => {
    if (detectedGesture) {
      saveMessage(detectedGesture.phrase, "gesture");
      speak(detectedGesture.phrase);
    }
  }, [detectedGesture, saveMessage]);

  // --- Speech Synthesis ---
  const { speak } = useSpeechSynthesis();

  const handleSendText = () => {
    if (!textInput.trim()) return;
    saveMessage(textInput, "text");
    setTextInput("");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "gesture") {
      // Auto-start gesture when tab opens
      // We rely on videoElement being set via callback ref
    } else {
      stopGesture();
    }
  };

  return (
    <Container maxW="7xl" py="6" h="full" display="flex" flexDirection="column" gap="6">
      <Flex justify="space-between" align="center" borderBottomWidth="1px" pb="4">
        <HStack gap="4">
          <Center w="12" h="12" bg="indigo.600" rounded="xl" color="white" boxShadow="md">
            <MessageSquare size={24} />
          </Center>
          <VStack align="start" gap="0">
            <Heading size="2xl" fontWeight="bold" letterSpacing="tight">
              Command Center
            </Heading>
            <Text fontSize="sm" color="fg.muted">
              Multimodal Communication Hub
            </Text>
          </VStack>
        </HStack>

        <HStack gap="3">
          <Badge
            colorPalette={isListening ? "red" : "gray"}
            variant="subtle"
            px="3"
            py="1"
            rounded="full"
          >
            {isListening ? "Mic Active" : "Mic Ready"}
          </Badge>
          <Badge
            colorPalette={isDetecting ? "green" : "gray"}
            variant="subtle"
            px="3"
            py="1"
            rounded="full"
          >
            {isDetecting ? "Camera Active" : "Camera Ready"}
          </Badge>
        </HStack>
      </Flex>

      <Flex direction={{ base: "column", lg: "row" }} gap="6" flex="1" overflow="hidden">
        {/* LEFT: Input & Controls */}
        <VStack w={{ base: "full", lg: "450px" }} gap="6" align="stretch">
          <Box bg="bg.panel" borderWidth="1px" rounded="3xl" p="6" boxShadow="lg">
            <Tabs.Root
              value={activeTab}
              onValueChange={(e) => handleTabChange(e.value)}
              variant="subtle"
            >
              <Tabs.List gap="2" mb="6" bg="bg.muted" p="1" rounded="2xl">
                <Tabs.Trigger
                  value="text"
                  flex="1"
                  gap="2"
                  rounded="xl"
                  _selected={{ bg: "bg.panel", boxShadow: "sm" }}
                >
                  <MessageSquare size={16} /> Type
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="speech"
                  flex="1"
                  gap="2"
                  rounded="xl"
                  _selected={{ bg: "bg.panel", boxShadow: "sm" }}
                >
                  <Mic size={16} /> Speak
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="gesture"
                  flex="1"
                  gap="2"
                  rounded="xl"
                  _selected={{ bg: "bg.panel", boxShadow: "sm" }}
                >
                  <Hand size={16} /> Sign
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="text" p="0">
                <VStack gap="4">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type to chat..."
                    size="xl"
                    bg="bg.muted"
                    rounded="2xl"
                    fontSize="xl"
                    h="20"
                    onKeyDown={(e) => e.key === "Enter" && handleSendText()}
                  />
                  <LargeButton variant="accent" onClick={handleSendText} h="16" w="full" gap="2">
                    <Send size={20} /> Send Message
                  </LargeButton>
                </VStack>
              </Tabs.Content>

              <Tabs.Content value="speech" p="0">
                <Center py="6" flexDirection="column" gap="6">
                  <Box position="relative">
                    {isListening && (
                      <Box
                        position="absolute"
                        inset="-4"
                        bg="red.500/10"
                        rounded="full"
                        animation="ping 2s infinite"
                      />
                    )}
                    <LargeButton
                      size="xl"
                      variant={isListening ? "destructive" : "default"}
                      onClick={isListening ? stopSTT : startSTT}
                      rounded="full"
                      w="40"
                      h="40"
                      boxShadow="xl"
                    >
                      {isListening ? <Square size={56} fill="currentColor" /> : <Mic size={56} />}
                    </LargeButton>
                  </Box>
                  <VStack gap="1">
                    <Text fontWeight="bold" fontSize="lg">
                      {isListening ? "Listening..." : "Tap to Speak"}
                    </Text>
                    <Text fontSize="sm" color="fg.muted">
                      Voice will be transcribed and shared
                    </Text>
                  </VStack>
                </Center>
              </Tabs.Content>

              <Tabs.Content value="gesture" p="0">
                <VStack gap="4">
                  <Box
                    position="relative"
                    w="full"
                    rounded="2xl"
                    overflow="hidden"
                    bg="black"
                    aspectRatio={4 / 3}
                  >
                    <video
                      ref={setVideoElement}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted
                    />
                    {!isDetecting && (
                      <Center
                        position="absolute"
                        inset="0"
                        bg="black/60"
                        backdropFilter="blur(4px)"
                      >
                        <LargeButton size="sm" onClick={startGesture} gap="2">
                          <Camera size={18} /> Start Camera
                        </LargeButton>
                      </Center>
                    )}
                    {isDetecting && (
                      <Box position="absolute" top="3" left="3" right="3">
                        <Flex
                          bg="black/50"
                          backdropFilter="blur(8px)"
                          p="2"
                          rounded="lg"
                          align="center"
                          gap="2"
                          color="white"
                          fontSize="xs"
                        >
                          <Info size={14} />
                          <Text isTruncated>
                            {!metadata.handFound
                              ? "Show hand"
                              : !metadata.isCentered
                                ? "Center hand"
                                : "System ready"}
                          </Text>
                        </Flex>
                      </Box>
                    )}
                  </Box>
                  <Box w="full" bg="bg.muted" p="3" rounded="xl">
                    <Heading size="xs" mb="2" color="indigo.600">
                      Quick Signs
                    </Heading>
                    <Flex wrap="wrap" gap="2">
                      {availableGestures.slice(0, 8).map((g) => (
                        <Badge
                          key={g.gesture}
                          variant="outline"
                          cursor="pointer"
                          onClick={() => speak(g.phrase)}
                        >
                          {g.icon} {g.phrase}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                </VStack>
              </Tabs.Content>
            </Tabs.Root>
          </Box>

          {/* Status/Settings Summary */}
          <Box bg="bg.panel" p="4" rounded="2xl" borderWidth="1px">
            <HStack justify="space-between">
              <Text fontSize="xs" fontWeight="bold" color="fg.muted">
                AUTO-REPLY MODE
              </Text>
              <Badge colorPalette={autoReadMessages ? "green" : "orange"} size="sm">
                {autoReadMessages ? "ACTIVE" : "OFF"}
              </Badge>
            </HStack>
          </Box>
        </VStack>

        {/* RIGHT: Chat History (The Connection) */}
        <VStack flex="1" gap="4" align="stretch" overflow="hidden">
          <Box
            flex="1"
            overflowY="auto"
            rounded="3xl"
            borderWidth="1px"
            bg="bg.panel"
            p="6"
            boxShadow="inner"
            display="flex"
            flexDirection="column-reverse" // Show newest at bottom
          >
            <VStack gap="6" align="stretch">
              {messages?.map((msg) => (
                <Flex
                  key={msg.id}
                  gap="4"
                  align="start"
                  animation="slide-in-from-bottom-2 0.4s ease-out"
                >
                  <Center
                    w="10"
                    h="10"
                    rounded="full"
                    bg={
                      msg.inputModality === "gesture"
                        ? "purple.100"
                        : msg.inputModality === "speech"
                          ? "blue.100"
                          : "indigo.100"
                    }
                    _dark={{
                      bg:
                        msg.inputModality === "gesture"
                          ? "purple.900/30"
                          : msg.inputModality === "speech"
                            ? "blue.900/30"
                            : "indigo.900/30",
                    }}
                    flexShrink="0"
                  >
                    {msg.inputModality === "speech" && (
                      <Mic size={18} color="var(--chakra-colors-blue-500)" />
                    )}
                    {msg.inputModality === "text" && (
                      <MessageSquare size={18} color="var(--chakra-colors-indigo-500)" />
                    )}
                    {msg.inputModality === "gesture" && (
                      <Hand size={18} color="var(--chakra-colors-purple-500)" />
                    )}
                  </Center>

                  <VStack align="start" gap="1" flex="1">
                    <Flex align="center" gap="2" w="full">
                      <Text fontWeight="bold" fontSize="sm" textTransform="capitalize">
                        {msg.inputModality} Input
                      </Text>
                      <Separator orientation="vertical" h="3" />
                      <Text fontSize="xs" color="fg.muted">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Flex>

                    <Box
                      p="4"
                      rounded="2xl"
                      roundedTopLeft="0"
                      bg="bg.muted"
                      maxW="full"
                      borderWidth="1px"
                    >
                      <Text fontSize="xl" lineHeight="short">
                        {msg.content}
                      </Text>
                    </Box>
                  </VStack>

                  <IconButton
                    variant="ghost"
                    rounded="full"
                    size="sm"
                    aria-label="Read"
                    onClick={() => speak(msg.content)}
                  >
                    <Volume2 size={18} />
                  </IconButton>
                </Flex>
              ))}

              {messages?.length === 0 && (
                <Center h="300px" flexDirection="column" color="fg.muted" gap="4">
                  <History size={64} style={{ opacity: 0.1 }} />
                  <Text fontSize="lg" opacity={0.5}>
                    Your communication history will appear here
                  </Text>
                </Center>
              )}
            </VStack>
          </Box>
        </VStack>
      </Flex>
    </Container>
  );
}
