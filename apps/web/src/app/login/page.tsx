"use client";

import { useState } from "react";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { Box, Center, Flex, VStack, Heading, Text, HStack } from "@chakra-ui/react";
import { MessageSquare, CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Real-time speech transcription",
  "Hand gesture sign detection",
  "Text-to-speech synthesis",
  "Persistent conversation history",
];

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <Flex h="full" overflow="hidden">
      {/* Left branding panel — hidden on mobile */}
      <Box
        display={{ base: "none", lg: "flex" }}
        flex="1"
        bgGradient="to-br"
        gradientFrom="indigo.600"
        gradientTo="purple.700"
        p="16"
        flexDirection="column"
        justify="center"
        color="white"
      >
        <VStack align="start" gap="10" maxW="md">
          <HStack gap="3">
            <Center w="12" h="12" bg="white/20" rounded="xl">
              <MessageSquare size={28} />
            </Center>
            <Heading size="3xl" fontWeight="black">
              Sensa
            </Heading>
          </HStack>

          <VStack align="start" gap="3">
            <Heading size="4xl" fontWeight="black" lineHeight="shorter">
              Accessibility Without Boundaries.
            </Heading>
            <Text fontSize="lg" opacity={0.85}>
              Sign in to access your personalized communication hub.
            </Text>
          </VStack>

          <VStack align="start" gap="3">
            {FEATURES.map((f) => (
              <HStack key={f} gap="3">
                <CheckCircle2 size={20} color="rgba(255,255,255,0.8)" />
                <Text fontSize="md" opacity={0.9}>
                  {f}
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Box>

      {/* Right form panel */}
      <Center flex="1" bg="bg.panel" p="8" overflowY="auto">
        <Box w="full" maxW="md">
          {showSignIn ? (
            <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
          )}
        </Box>
      </Center>
    </Flex>
  );
}
