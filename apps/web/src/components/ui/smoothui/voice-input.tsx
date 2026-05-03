"use client";

import React, { useEffect, useRef } from "react";
import { Box, Text, VStack, Center, HStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Waves } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { SmoothButton } from "@sensa-monorepo/ui";

interface VoiceInputProps {
  onMessage?: (msg: { source: "user" | "ai"; message: string }) => void;
}

const MotionBox = motion(Box);

export function VoiceInput({ onMessage }: VoiceInputProps) {
  const { isListening, transcript, start, stop, error } = useSpeechRecognition({
    onEnd: (finalTranscript) => {
      if (finalTranscript.trim()) {
        onMessage?.({ source: "user", message: finalTranscript });
      }
    },
  });

  const handleStart = () => {
    start();
  };

  return (
    <VStack gap={6} w="full">
      <AnimatePresence mode="wait">
        {isListening ? (
          <MotionBox
            key="listening"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            w="full"
          >
            <VStack
              gap={4}
              p={8}
              bg="surface-soft"
              rounded="clay-lg"
              border="1px solid"
              borderColor="primary"
            >
              <HStack gap={3}>
                <Box animation="pulse 1.5s infinite">
                  <Waves size={20} color="var(--color-brand-pink)" />
                </Box>
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                >
                  Listening...
                </Text>
              </HStack>
              <Text fontSize="lg" fontWeight="500" textAlign="center" color="primary">
                {transcript || "Speak clearly now..."}
              </Text>
              <SmoothButton variant="destructive" onClick={stop} h="10" rounded="full" px={6}>
                Finish Speaking
              </SmoothButton>
            </VStack>
          </MotionBox>
        ) : (
          <MotionBox
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            w="full"
          >
            <SmoothButton
              variant="outline"
              w="full"
              h="20"
              rounded="clay-lg"
              onClick={handleStart}
              borderColor="hairline"
              _hover={{ borderColor: "primary", bg: "surface-soft" }}
            >
              <HStack gap={4}>
                <Center w="10" h="10" bg="primary" color="white" rounded="full">
                  <Mic size={20} />
                </Center>
                <VStack align="start" gap={0}>
                  <Text fontWeight="600" fontSize="md">
                    Tap to Speak
                  </Text>
                  <Text fontSize="xs" color="muted">
                    Voice-over mode active
                  </Text>
                </VStack>
              </HStack>
            </SmoothButton>
          </MotionBox>
        )}
      </AnimatePresence>
      {error && (
        <Text color="brand-pink" fontSize="xs" fontWeight="600">
          {error}
        </Text>
      )}
    </VStack>
  );
}
