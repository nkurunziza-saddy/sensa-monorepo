"use client";

import { useState, useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useGestureDetection } from "@/hooks/use-gesture-detection";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { getEmojiForText, GESTURE_MAPPINGS } from "@sensa-monorepo/communication";
import { LargeButton } from "@/components/ui/large-button";
import { Mic, Square, AlertCircle, Copy, Volume2, MessageSquare } from "lucide-react";
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Flex,
  HStack,
  Center,
  Badge,
} from "@chakra-ui/react";

interface Result {
  id: string;
  type: "speech" | "gesture";
  content: string;
  timestamp: number;
  icon: string;
}

export default function TalkPage() {
  const [results, setResults] = useState<Result[]>([]);
  const {
    isListening,
    transcript,
    error: speechError,
    start: startSpeech,
    stop: stopSpeech,
  } = useSpeechRecognition();
  const {
    detectedGesture,
    error: gestureError,
    start: startGesture,
    stop: stopGesture,
  } = useGestureDetection();
  const { speak } = useSpeechSynthesis();

  // Initialize gesture detection (background/mock)
  useEffect(() => {
    startGesture();
    return () => stopGesture();
  }, [startGesture, stopGesture]);

  // Handle new speech results
  useEffect(() => {
    if (transcript) {
      const emoji = getEmojiForText(transcript);
      const newResult: Result = {
        id: Math.random().toString(36).substring(7),
        type: "speech",
        content: transcript,
        timestamp: Date.now(),
        icon: emoji,
      };
      setResults((prev) => [newResult, ...prev].slice(0, 10));
    }
  }, [transcript]);

  // Handle new gesture results
  useEffect(() => {
    if (detectedGesture) {
      const emoji =
        GESTURE_MAPPINGS.find((g) => g.gesture === detectedGesture.gesture)?.icon || "✋";
      const newResult: Result = {
        id: Math.random().toString(36).substring(7),
        type: "gesture",
        content: detectedGesture.phrase,
        timestamp: Date.now(),
        icon: emoji,
      };
      setResults((prev) => [newResult, ...prev].slice(0, 10));
    }
  }, [detectedGesture]);

  return (
    <Container maxW="5xl" py="8" h="full">
      <VStack gap="10" align="stretch" h="full">
        <VStack gap="2" textAlign="center">
          <Heading size="4xl" fontWeight="bold" letterSpacing="tight">
            Live Results
          </Heading>
          <Text fontSize="xl" color="fg.muted">
            Transcribing speech and detecting signs in real-time
          </Text>
        </VStack>

        <Flex direction={{ base: "column", lg: "row" }} gap="8" flex="1">
          {/* Main Action Area */}
          <VStack flex="1" gap="8" justify="center">
            {(speechError || gestureError) && (
              <Flex
                bg="red.100"
                color="red.700"
                _dark={{ bg: "red.900/30", color: "red.400" }}
                p="4"
                rounded="xl"
                align="center"
                gap="3"
                w="full"
              >
                <AlertCircle size={24} />
                <Text fontSize="lg">{speechError || gestureError}</Text>
              </Flex>
            )}

            <Box position="relative">
              {isListening && (
                <Box
                  position="absolute"
                  inset="0"
                  bg="red.500/20"
                  rounded="full"
                  animation="ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
                  transform="scale(1.5)"
                />
              )}
              <LargeButton
                size="xl"
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? stopSpeech : startSpeech}
                rounded="full"
                w="48"
                h="48"
                display="flex"
                flexDirection="column"
                gap="4"
                position="relative"
                zIndex="10"
                boxShadow="xl"
                aria-label={isListening ? "Stop listening" : "Start listening"}
              >
                {isListening ? (
                  <>
                    <Square size={64} fill="currentColor" />
                    <Text>Stop</Text>
                  </>
                ) : (
                  <>
                    <Mic size={64} />
                    <Text>Speak</Text>
                  </>
                )}
              </LargeButton>
            </Box>

            {transcript && (
              <Box
                w="full"
                bg="bg.panel"
                borderWidth="1px"
                boxShadow="lg"
                rounded="2xl"
                p="6"
                animation="slide-in-from-bottom-2 0.3s ease-out"
              >
                <Flex align="center" gap="2" mb="3" color="indigo.600">
                  <Mic size={18} />
                  <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
                    Live Transcript
                  </Text>
                </Flex>
                <Flex align="center" gap="4" mb="6">
                  <Text fontSize="4xl">{getEmojiForText(transcript)}</Text>
                  <Text fontSize="2xl" fontWeight="medium">
                    {transcript}
                  </Text>
                </Flex>
                <HStack gap="4">
                  <LargeButton
                    variant="outline"
                    size="sm"
                    flex="1"
                    gap="2"
                    onClick={() => speak(transcript)}
                  >
                    <Volume2 size={18} /> Read
                  </LargeButton>
                  <LargeButton
                    variant="outline"
                    size="sm"
                    flex="1"
                    gap="2"
                    onClick={() => navigator.clipboard.writeText(transcript)}
                  >
                    <Copy size={18} /> Copy
                  </LargeButton>
                </HStack>
              </Box>
            )}
          </VStack>

          {/* Results Sidebar */}
          <Box
            w={{ base: "full", lg: "400px" }}
            bg="bg.panel"
            borderWidth="1px"
            rounded="3xl"
            p="6"
            boxShadow="sm"
          >
            <VStack align="stretch" gap="6" h="full">
              <Heading size="md" display="flex" alignItems="center" gap="2">
                <MessageSquare size={20} />
                Recent History
              </Heading>

              <VStack gap="4" align="stretch" overflowY="auto" maxH="600px">
                {results.map((res) => (
                  <Box
                    key={res.id}
                    p="4"
                    rounded="2xl"
                    bg="bg.muted"
                    borderWidth="1px"
                    borderColor="transparent"
                    _hover={{ borderColor: "indigo.500/30", bg: "bg.panel" }}
                    transition="all 0.2s"
                    position="relative"
                  >
                    <Flex justify="space-between" align="start" mb="2">
                      <HStack gap="3">
                        <Text fontSize="2xl">{res.icon}</Text>
                        <VStack align="start" gap="0">
                          {res.type === "speech" ? (
                            <Badge colorPalette="blue" rounded="md" px="2" size="sm">
                              Speech
                            </Badge>
                          ) : (
                            <Badge colorPalette="purple" rounded="md" px="2" size="sm">
                              Sign
                            </Badge>
                          )}
                        </VStack>
                      </HStack>
                      <Text fontSize="xs" color="fg.muted">
                        {new Date(res.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </Text>
                    </Flex>
                    <Text fontSize="lg" fontWeight="medium">
                      {res.content}
                    </Text>
                    <Flex justify="flex-end" mt="2">
                      <Volume2
                        size={16}
                        style={{ cursor: "pointer", opacity: 0.6 }}
                        onClick={() => speak(res.content)}
                      />
                    </Flex>
                  </Box>
                ))}
                {results.length === 0 && (
                  <Center py="20" flexDirection="column" color="fg.muted" gap="4">
                    <MessageSquare size={48} style={{ opacity: 0.2 }} />
                    <Text textAlign="center">No results yet. Try speaking or showing a sign.</Text>
                  </Center>
                )}
              </VStack>
            </VStack>
          </Box>
        </Flex>
      </VStack>
    </Container>
  );
}
