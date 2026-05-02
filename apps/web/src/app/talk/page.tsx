"use client";

import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { LargeButton } from "@/components/ui/large-button";
import { Mic, Square, AlertCircle, Copy, Volume2 } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { Container, VStack, Heading, Text, Box, Flex } from "@chakra-ui/react";

export default function TalkPage() {
  const { isListening, transcript, error, start, stop } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  return (
    <Container maxW="4xl" py="8" h="full">
      <VStack gap="8" align="center" h="full">
        <VStack gap="4" textAlign="center">
          <Heading size="4xl" fontWeight="bold" letterSpacing="tight">Speech to Text</Heading>
          <Text fontSize="xl" color="fg.muted">Tap the microphone to start speaking</Text>
        </VStack>

        <VStack flex="1" w="full" justify="center" gap="8">
          {error && (
            <Flex 
              bg="red.100" 
              color="red.700" 
              _dark={{ bg: "red.900/30", color: "red.400" }} 
              p="4" 
              rounded="xl" 
              align="center" 
              gap="3" 
              w="full" 
              maxW="md"
            >
              <AlertCircle size={24} />
              <Text fontSize="lg">{error}</Text>
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
              onClick={isListening ? stop : start}
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
              boxShadow="sm" 
              rounded="2xl" 
              p={{ base: "6", md: "8" }}
            >
              <Text fontSize={{ base: "2xl", md: "4xl" }} lineHeight="relaxed" fontWeight="medium" minH="100px">
                {transcript}
              </Text>
              <Flex gap="4" mt="6" pt="6" borderTopWidth="1px">
                <LargeButton 
                  variant="outline" 
                  size="sm" 
                  flex="1"
                  gap="2"
                  onClick={() => speak(transcript)}
                >
                  <Volume2 size={20} />
                  Read Aloud
                </LargeButton>
                <LargeButton 
                  variant="outline" 
                  size="sm" 
                  flex="1"
                  gap="2"
                  onClick={() => navigator.clipboard.writeText(transcript)}
                >
                  <Copy size={20} />
                  Copy
                </LargeButton>
              </Flex>
            </Box>
          )}
        </VStack>
      </VStack>
    </Container>
  );
}
