"use client";

import { useState } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { LargeButton } from "@/components/ui/large-button";
import { Volume2, Send, AlertCircle } from "lucide-react";
import { GESTURE_MAPPINGS } from "@sensa-monorepo/communication";
import { Container, VStack, Heading, Text, Box, Flex, SimpleGrid, Input } from "@chakra-ui/react";

export default function ReplyPage() {
  const { speak, isSpeaking, error } = useSpeechSynthesis();
  const [customText, setCustomText] = useState("");

  const handleSpeak = (text: string) => {
    speak(text);
  };

  return (
    <Container maxW="5xl" py="8" h="full">
      <VStack gap="8" align="stretch" h="full">
        <VStack gap="4" textAlign="center">
          <Heading size="4xl" fontWeight="bold" letterSpacing="tight">Phrase Board</Heading>
          <Text fontSize="xl" color="fg.muted">Tap a phrase to speak it aloud</Text>
        </VStack>

        {error && (
          <Flex 
            bg="red.100" 
            color="red.700" 
            _dark={{ bg: "red.900/30", color: "red.400" }} 
            p="4" 
            rounded="xl" 
            align="center" 
            gap="3"
          >
            <AlertCircle size={24} />
            <Text fontSize="lg">{error}</Text>
          </Flex>
        )}

        <Box bg="bg.panel" p="6" rounded="2xl" borderWidth="1px" boxShadow="sm">
          <Flex gap="4">
            <Input
              placeholder="Type something to say..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              size="xl"
              fontSize="2xl"
              h="16"
              rounded="xl"
              onKeyPress={(e) => e.key === "Enter" && handleSpeak(customText)}
            />
            <LargeButton
              onClick={() => handleSpeak(customText)}
              disabled={!customText || isSpeaking}
              size="lg"
              h="16"
              w="24"
            >
              <Send size={24} />
            </LargeButton>
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4" flex="1">
          {GESTURE_MAPPINGS.map((mapping) => (
            <LargeButton
              key={mapping.gesture}
              variant="outline"
              size="lg"
              h="32"
              flexDirection="column"
              gap="2"
              onClick={() => handleSpeak(mapping.phrase)}
            >
              <Text fontSize="4xl">{mapping.icon}</Text>
              <Text>{mapping.phrase}</Text>
            </LargeButton>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
