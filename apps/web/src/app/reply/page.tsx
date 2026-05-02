"use client";

import { useState } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { LargeButton } from "@/components/ui/large-button";
import { Send, AlertCircle, Hand } from "lucide-react";
import { GESTURE_MAPPINGS, getSignSequence } from "@sensa-monorepo/communication";
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  Flex,
  SimpleGrid,
  Input,
  Center,
  HStack,
} from "@chakra-ui/react";

export default function ReplyPage() {
  const { speak, isSpeaking, error } = useSpeechSynthesis();
  const [customText, setCustomText] = useState("");

  const handleSpeak = (text: string) => {
    speak(text);
  };

  const signSequence = getSignSequence(customText);

  return (
    <Container maxW="5xl" py="8" h="full">
      <VStack gap="8" align="stretch" h="full">
        <VStack gap="4" textAlign="center">
          <Heading size="4xl" fontWeight="bold" letterSpacing="tight">
            Reply & Translate
          </Heading>
          <Text fontSize="xl" color="fg.muted">
            Type to speak and translate to sign language
          </Text>
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

        <Box bg="bg.panel" p="8" rounded="3xl" borderWidth="1px" boxShadow="lg">
          <VStack gap="6" align="stretch">
            <Flex gap="4">
              <Input
                placeholder="Type something to say..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                size="xl"
                fontSize="2xl"
                h="16"
                rounded="2xl"
                onKeyPress={(e) => e.key === "Enter" && handleSpeak(customText)}
              />
              <LargeButton
                onClick={() => handleSpeak(customText)}
                disabled={!customText || isSpeaking}
                size="lg"
                h="16"
                w="24"
                variant="accent"
              >
                <Send size={24} />
              </LargeButton>
            </Flex>

            {customText && (
              <Box bg="bg.muted" p="6" rounded="2xl" borderStyle="dashed" borderWidth="2px">
                <Flex align="center" gap="2" mb="4" color="indigo.600">
                  <Hand size={20} />
                  <Text fontWeight="bold" textTransform="uppercase" fontSize="sm">
                    Sign Language Translation
                  </Text>
                </Flex>

                <HStack gap="6" overflowX="auto" py="2" minH="120px" justify="center">
                  {signSequence.map((sign, idx) => (
                    <VStack key={idx} gap="2" animation="scale-in 0.3s ease-out">
                      <Center
                        w="20"
                        h="20"
                        bg="bg.panel"
                        rounded="2xl"
                        fontSize="4xl"
                        boxShadow="md"
                        borderWidth="1px"
                      >
                        {sign.icon}
                      </Center>
                      <Text
                        fontSize="xs"
                        fontWeight="bold"
                        color="fg.muted"
                        textTransform="uppercase"
                      >
                        {sign.phrase}
                      </Text>
                    </VStack>
                  ))}
                  {signSequence.length === 0 && (
                    <Center h="100px" color="fg.muted">
                      <Text fontStyle="italic">No signs mapped for this text yet</Text>
                    </Center>
                  )}
                </HStack>
              </Box>
            )}
          </VStack>
        </Box>

        <Heading size="md" px="2">
          Phrase Quick-Board
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="4">
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
