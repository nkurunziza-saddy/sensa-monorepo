"use client";

import { useEffect, useState } from "react";
import { useGestureDetection } from "@/hooks/use-gesture-detection";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { LargeButton } from "@/components/ui/large-button";
import { Camera, Hand, MessageSquare, Trash2, Send, ChevronRight, Info } from "lucide-react";
import {
  Container,
  Grid,
  GridItem,
  AspectRatio,
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Button,
  Center,
  Badge,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";

interface GestureLog {
  id: string;
  phrase: string;
  icon: string;
  timestamp: number;
}

export default function GesturePage() {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [gestureHistory, setGestureHistory] = useState<GestureLog[]>([]);
  const [currentSentence, setCurrentSentence] = useState<string[]>([]);
  const { speak, isSpeaking } = useSpeechSynthesis();

  const {
    isDetecting,
    detectedGesture,
    metadata,
    error,
    start,
    simulateGesture,
    availableGestures,
  } = useGestureDetection(videoElement || undefined);

  // Handle detection hints based on metadata
  const [hint, setHint] = useState<string | null>(null);
  useEffect(() => {
    if (!isDetecting) {
      setHint("Camera is off. Start the camera to begin.");
      return;
    }
    if (!metadata.handFound) {
      setHint("Show your hand to the camera");
    } else if (!metadata.isCentered) {
      setHint("Center your hand in the frame");
    } else if (metadata.distance === "far") {
      setHint("Move your hand closer");
    } else if (metadata.distance === "near") {
      setHint("Move your hand back a bit");
    } else {
      setHint("Great! Hold steady to detect signs");
    }
  }, [metadata, isDetecting]);

  // Handle sentence building and history
  useEffect(() => {
    if (detectedGesture) {
      // 1. Add to history
      const newLog: GestureLog = {
        id: Math.random().toString(36).substring(7),
        phrase: detectedGesture.phrase,
        icon: availableGestures.find((g) => g.gesture === detectedGesture.gesture)?.icon || "✋",
        timestamp: Date.now(),
      };

      setGestureHistory((prev) => {
        if (
          prev.length > 0 &&
          prev[0].phrase === newLog.phrase &&
          Date.now() - prev[0].timestamp < 2000
        ) {
          return prev;
        }
        return [newLog, ...prev].slice(0, 20);
      });

      // 2. Build sentence (Avoid adding same word consecutively)
      setCurrentSentence((prev) => {
        if (prev.length > 0 && prev[prev.length - 1] === detectedGesture.phrase) {
          return prev;
        }
        return [...prev, detectedGesture.phrase];
      });

      // 3. Special gesture: "fist" to commit/speak sentence
      if (detectedGesture.gesture === "fist" && currentSentence.length > 0) {
        handleCommitSentence();
      }
    }
  }, [detectedGesture, availableGestures, currentSentence.length]); // Added currentSentence.length to satisfy dependencies for handleCommitSentence if needed

  const handleCommitSentence = () => {
    if (currentSentence.length === 0) return;
    const fullText = currentSentence.join(" ");
    speak(fullText);
    setCurrentSentence([]);
  };

  const clearSentence = () => setCurrentSentence([]);

  // Auto-start camera when video element is ready
  useEffect(() => {
    if (videoElement && !isDetecting) {
      start();
    }
  }, [videoElement, start, isDetecting]);

  return (
    <Container maxW="6xl" py="8" h="full">
      <Grid templateColumns={{ base: "1fr", lg: "1fr 350px" }} gap="8" h="full">
        <GridItem>
          <VStack gap="6" align="stretch">
            <Flex justify="space-between" align="flex-end">
              <VStack gap="2" textAlign="left" align="start">
                <Heading size="4xl" fontWeight="bold" letterSpacing="tight">
                  Gesture Lab
                </Heading>
                <Text fontSize="xl" color="fg.muted">
                  Translate hand signs into full sentences
                </Text>
              </VStack>
              <Badge
                colorPalette={isDetecting ? "green" : "red"}
                variant="subtle"
                size="lg"
                rounded="full"
                px="4"
              >
                {isDetecting ? "System Live" : "Offline"}
              </Badge>
            </Flex>

            {/* Sentence Builder Area */}
            <Box
              bg="bg.panel"
              p="6"
              rounded="3xl"
              borderWidth="2px"
              borderColor="indigo.500/20"
              boxShadow="xl"
            >
              <VStack gap="4" align="stretch">
                <Flex justify="space-between" align="center">
                  <Heading size="sm" display="flex" alignItems="center" gap="2" color="indigo.600">
                    <MessageSquare size={18} />
                    Current Sentence
                  </Heading>
                  <HStack gap="2">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={clearSentence}
                      disabled={currentSentence.length === 0}
                      leftIcon={<Trash2 size={14} />}
                    >
                      Clear
                    </Button>
                  </HStack>
                </Flex>

                <Flex
                  minH="80px"
                  bg="bg.muted"
                  rounded="2xl"
                  p="4"
                  align="center"
                  wrap="wrap"
                  gap="2"
                  borderWidth="1px"
                >
                  {currentSentence.map((word, idx) => (
                    <Badge
                      key={idx}
                      colorPalette="indigo"
                      size="lg"
                      rounded="lg"
                      variant="solid"
                      animation="scale-in 0.2s ease-out"
                    >
                      {word}
                    </Badge>
                  ))}
                  {currentSentence.length === 0 && (
                    <Text color="fg.muted" fontStyle="italic">
                      Start signing to build a sentence...
                    </Text>
                  )}
                  {currentSentence.length > 0 && (
                    <ChevronRight size={20} color="var(--chakra-colors-indigo-400)" />
                  )}
                </Flex>

                <LargeButton
                  variant="accent"
                  onClick={handleCommitSentence}
                  disabled={currentSentence.length === 0 || isSpeaking}
                  h="14"
                  gap="3"
                >
                  <Send size={20} />
                  Speak Sentence
                </LargeButton>
                <Text fontSize="xs" color="fg.muted" textAlign="center">
                  💡 Tip: Make a <b>Fist</b> ✊ to automatically speak and clear the sentence.
                </Text>
              </VStack>
            </Box>

            <Box position="relative">
              <AspectRatio ratio={16 / 9}>
                <Box
                  bg="black"
                  rounded="3xl"
                  overflow="hidden"
                  borderWidth="4px"
                  borderColor={
                    isDetecting
                      ? metadata.handFound && metadata.isCentered
                        ? "green.500"
                        : "indigo.500"
                      : "gray.700"
                  }
                  boxShadow="2xl"
                  transition="border-color 0.3s"
                >
                  <video
                    ref={setVideoElement}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />

                  {/* Hint Overlay */}
                  {isDetecting && (
                    <Box position="absolute" top="4" left="4" right="4">
                      <Flex
                        bg="black/60"
                        backdropFilter="blur(8px)"
                        p="3"
                        rounded="xl"
                        align="center"
                        gap="3"
                        color="white"
                        borderWidth="1px"
                        borderColor="white/10"
                        animation="slide-in-from-top-2 0.3s ease-out"
                      >
                        <Info size={18} />
                        <Text fontWeight="medium">{hint}</Text>
                      </Flex>
                    </Box>
                  )}

                  {!isDetecting && !error && (
                    <Flex
                      position="absolute"
                      inset="0"
                      direction="column"
                      align="center"
                      justify="center"
                      gap="4"
                      bg="black/80"
                      color="white/50"
                    >
                      <Camera size={64} />
                      <LargeButton onClick={start}>Start Camera</LargeButton>
                    </Flex>
                  )}
                </Box>
              </AspectRatio>

              {isDetecting && detectedGesture && (
                <Box
                  position="absolute"
                  bottom="6"
                  left="6"
                  right="6"
                  bg="bg.panel"
                  borderWidth="1px"
                  p="6"
                  rounded="2xl"
                  boxShadow="2xl"
                  animation="slide-in-from-bottom-4 0.3s ease-out"
                >
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap="4">
                      <Text fontSize="5xl">
                        {availableGestures.find((g) => g.gesture === detectedGesture.gesture)?.icon}
                      </Text>
                      <VStack align="start" gap="1">
                        <Text fontSize="3xl" fontWeight="bold">
                          {detectedGesture.phrase}
                        </Text>
                        <Box
                          w="100px"
                          h="2px"
                          bg="gray.200"
                          rounded="full"
                          overflow="hidden"
                          mt="2"
                        >
                          <Box w="90%" h="full" bg="green.500" />
                        </Box>
                      </VStack>
                    </Flex>
                  </Flex>
                </Box>
              )}
            </Box>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack gap="6" align="stretch">
            {/* Transcription Log */}
            <Box
              bg="bg.panel"
              p="6"
              rounded="3xl"
              borderWidth="1px"
              boxShadow="lg"
              display="flex"
              flexDirection="column"
              maxH="500px"
            >
              <Flex justify="space-between" align="center" mb="6">
                <Heading size="lg" display="flex" alignItems="center" gap="2">
                  <MessageSquare size={24} />
                  History
                </Heading>
                {gestureHistory.length > 0 && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setGestureHistory([])}
                    leftIcon={<Trash2 size={14} />}
                  >
                    Clear
                  </Button>
                )}
              </Flex>

              <VStack
                gap="3"
                align="stretch"
                overflowY="auto"
                pr="2"
                css={{
                  "&::-webkit-scrollbar": { width: "4px" },
                  "&::-webkit-scrollbar-track": { background: "transparent" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "var(--chakra-colors-gray-200)",
                    borderRadius: "4px",
                  },
                }}
              >
                {gestureHistory.map((log) => (
                  <Box
                    key={log.id}
                    p="3"
                    rounded="xl"
                    bg="bg.muted"
                    borderWidth="1px"
                    borderColor="transparent"
                    _hover={{ borderColor: "indigo.500/30", bg: "bg.panel" }}
                    transition="all 0.2s"
                    cursor="pointer"
                    onClick={() => speak(log.phrase)}
                  >
                    <Flex justify="space-between" align="center" mb="1">
                      <HStack gap="2">
                        <Text fontSize="xl">{log.icon}</Text>
                        <Text fontWeight="bold" fontSize="md">
                          {log.phrase}
                        </Text>
                      </HStack>
                      <Text fontSize="2xs" color="fg.muted">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </Text>
                    </Flex>
                  </Box>
                ))}
                {gestureHistory.length === 0 && (
                  <Center py="10" flexDirection="column" color="fg.muted" gap="2">
                    <Hand size={32} style={{ opacity: 0.2 }} />
                    <Text fontSize="sm">Waiting for signs...</Text>
                  </Center>
                )}
              </VStack>
            </Box>

            {/* Gesture Guide */}
            <Box bg="bg.panel" p="6" rounded="3xl" borderWidth="1px" boxShadow="md">
              <Heading size="md" mb="4">
                Guide
              </Heading>
              <SimpleGrid columns={2} gap="2">
                {availableGestures.map((g) => (
                  <HStack
                    key={g.gesture}
                    gap="2"
                    p="2"
                    rounded="lg"
                    bg="bg.muted"
                    fontSize="xs"
                    cursor="pointer"
                    onClick={() => simulateGesture(g.gesture)}
                  >
                    <Text fontSize="lg">{g.icon}</Text>
                    <Text fontWeight="medium" isTruncated>
                      {g.phrase}
                    </Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
}
