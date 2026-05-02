"use client";

import { useState } from "react";
import NextLink from "next/link";
import { trpc } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useAccessibilitySettings } from "@/hooks/use-accessibility-settings";
import { LargeButton } from "@/components/ui/large-button";
import { Mic, MessageSquare, Hand, Volume2, Square, Send } from "lucide-react";
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
} from "@chakra-ui/react";

export default function CommunicatePage() {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [textInput, setTextInput] = useState("");

  const conversationId = "default-conversation";

  const { data: messages, refetch } = useQuery(
    trpc.communication.listMessages.queryOptions({ conversationId }),
  );
  const addMessage = useMutation(
    trpc.communication.addMessage.mutationOptions({
      onSuccess: () => refetch(),
    }),
  );

  const { isListening, start: startSTT, stop: stopSTT } = useSpeechRecognition();
  const handleSTTStart = () => {
    startSTT();
  };

  const { speak } = useSpeechSynthesis();
  useAccessibilitySettings();

  const handleSendText = () => {
    if (!textInput.trim()) return;
    addMessage.mutate({
      conversationId,
      inputModality: "text",
      outputModality: "text",
      content: textInput,
    });
    setTextInput("");
  };

  return (
    <Container maxW="4xl" py="8" h="full" display="flex" flexDirection="column" gap="6">
      <Flex align="center" gap="4" borderBottomWidth="1px" pb="4">
        <MessageSquare size={32} color="indigo.600" />
        <Heading size="3xl" fontWeight="bold" letterSpacing="tight">
          Unified Chat
        </Heading>
      </Flex>

      {/* Chat History */}
      <Box
        flex="1"
        overflowY="auto"
        rounded="3xl"
        borderWidth="1px"
        bg="bg.panel"
        p={{ base: "4", md: "6" }}
        boxShadow="sm"
      >
        <VStack gap="4" align="stretch">
          {messages?.map((msg) => (
            <Box
              key={msg.id}
              maxW="80%"
              p="4"
              rounded="2xl"
              bg="bg.muted"
              animation="slide-in-from-bottom-2 0.3s ease-out"
            >
              <Flex align="center" gap="2" fontSize="sm" color="fg.muted" mb="2">
                {msg.inputModality === "speech" && <Mic size={16} />}
                {msg.inputModality === "text" && <MessageSquare size={16} />}
                {msg.inputModality === "gesture" && <Hand size={16} />}
                <Text textTransform="capitalize">{msg.inputModality}</Text>
              </Flex>
              <Text fontSize="xl">{msg.content}</Text>
              <Flex justify="flex-end" mt="2">
                <IconButton
                  variant="ghost"
                  rounded="full"
                  size="sm"
                  aria-label="Read message aloud"
                  onClick={() => speak(msg.content)}
                >
                  <Volume2 size={20} color="indigo.600" />
                </IconButton>
              </Flex>
            </Box>
          ))}
          {messages?.length === 0 && (
            <Center h="full" flexDirection="column" color="fg.muted">
              <MessageSquare size={64} style={{ opacity: 0.2, marginBottom: "1rem" }} />
              <Text fontSize="xl">No messages yet. Start communicating!</Text>
            </Center>
          )}
        </VStack>
      </Box>

      {/* Input Area */}
      <Box bg="bg.panel" borderWidth="1px" rounded="3xl" p="4" boxShadow="sm">
        <Tabs.Root value={activeTab} onValueChange={(e) => setActiveTab(e.value)} variant="subtle">
          <Tabs.List gap="2" mb="4" borderBottom="none">
            <Tabs.Trigger value="text" flex="1" gap="2" rounded="xl">
              <MessageSquare size={16} /> Type
            </Tabs.Trigger>
            <Tabs.Trigger value="speech" flex="1" gap="2" rounded="xl">
              <Mic size={16} /> Speak
            </Tabs.Trigger>
            <Tabs.Trigger value="gesture" flex="1" gap="2" rounded="xl">
              <Hand size={16} /> Gesture
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="text">
            <Flex gap="4">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type a message..."
                size="xl"
                bg="bg.muted"
                rounded="2xl"
                fontSize="xl"
                h="16"
                onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              />
              <LargeButton variant="accent" onClick={handleSendText} h="16" w="24">
                <Send size={24} />
              </LargeButton>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="speech">
            <Center py="8" flexDirection="column">
              <LargeButton
                size="xl"
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? stopSTT : handleSTTStart}
                rounded="full"
                w="32"
                h="32"
              >
                {isListening ? <Square size={48} fill="currentColor" /> : <Mic size={48} />}
              </LargeButton>
              <Text mt="4" color="fg.muted">
                {isListening ? "Listening..." : "Tap to speak"}
              </Text>
            </Center>
          </Tabs.Content>

          <Tabs.Content value="gesture">
            <Center py="8" flexDirection="column" textAlign="center" gap="4">
              <Hand size={64} style={{ opacity: 0.5 }} />
              <Text fontSize="lg">
                For gesture input, please use the dedicated{" "}
                <NextLink
                  href="/gesture"
                  style={{ color: "var(--chakra-colors-indigo-600)", textDecoration: "underline" }}
                >
                  Gesture page
                </NextLink>
                .
              </Text>
            </Center>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
}
