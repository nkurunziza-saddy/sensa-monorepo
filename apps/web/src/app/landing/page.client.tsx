"use client";

import NextLink from "next/link";
import {
  Box,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Captions,
  Eye,
  Mic,
  User,
  Volume2,
  LayoutDashboard,
  Hand,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

import { Orb, type AgentState, ScrambleText, Card, SmoothButton } from "@sensa-monorepo/ui";

const MotionBox = motion(Box);

type Condition = "visual" | "vocal" | "auditory" | "none";

const modes: Array<{
  id: Condition;
  title: string;
  description: string;
  detail: string;
  icon: React.ReactNode;
}> = [
  {
    id: "visual",
    title: "Not Seeing",
    description: "Voice-forward interaction with clear spoken guidance.",
    detail:
      "Prioritizes audio cues and assistant speech when the screen cannot carry the conversation.",
    icon: <Eye size={18} strokeWidth={1.5} />,
  },
  {
    id: "vocal",
    title: "Not Speaking",
    description: "Gesture and text become the primary bridge.",
    detail:
      "Large controls and camera-assisted input reduce the pressure to speak to be understood.",
    icon: <Mic size={18} strokeWidth={1.5} />,
  },
  {
    id: "auditory",
    title: "Not Hearing",
    description: "Visual prompts and readable responses stay in focus.",
    detail: "Captions, pacing, and legible message cards keep the exchange grounded on screen.",
    icon: <Volume2 size={18} strokeWidth={1.5} />,
  },
  {
    id: "none",
    title: "Standard",
    description: "Keeps everyone in the same shared interaction model.",
    detail:
      "Sensa stays useful even without an access barrier by keeping the bridge explicit and calm.",
    icon: <User size={18} strokeWidth={1.5} />,
  },
];

const transcript = [
  {
    speaker: "Person A",
    role: "gesture",
    message: "I need the answer shown clearly on screen.",
  },
  {
    speaker: "Sensa",
    role: "bridge",
    message: "Switching to visual prompts and live text.",
  },
  {
    speaker: "Person B",
    role: "reply",
    message: "Now I know how to respond without guessing.",
  },
];

const stats = [
  { value: "2 people", label: "one shared bridge" },
  { value: "3 modes", label: "adaptive access paths" },
  { value: "< 1 min", label: "from setup to live use" },
];

export default function LandingClientPage() {
  const agentState: AgentState = "thinking";
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <Box bg="canvas" minH="calc(100vh - 64px)" position="relative" overflowY="auto" pb={20}>
      {/* Decorative Orbs */}
      <Box
        position="absolute"
        inset="0"
        bg="radial-gradient(circle at top left, rgba(255, 77, 139, 0.05), transparent 40%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="10%"
        right="-5%"
        w="400px"
        h="400px"
        bg="radial-gradient(circle, rgba(26, 58, 58, 0.04), transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="1100px" py={{ base: 12, md: 20 }}>
        <VStack align="stretch" gap={{ base: 12, md: 24 }}>
          {/* Hero Section */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 380px" }} gap={12} alignItems="center">
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <VStack align="start" gap={8}>
                  <HStack
                    px={4}
                    py={1.5}
                    rounded="full"
                    border="1px solid"
                    borderColor="hairline-soft"
                    bg="white"
                    shadow="sm"
                  >
                    <Box w="2" h="2" rounded="full" bg="brand-pink" />
                    <Text
                      fontSize="10px"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.15em"
                    >
                      Clay Refined • Accessibility Without Boundaries
                    </Text>
                  </HStack>

                  <VStack align="start" gap={5}>
                    <Heading
                      fontSize={{ base: "3.5rem", md: "4.8rem" }}
                      fontWeight="500"
                      letterSpacing="-0.04em"
                      lineHeight="0.95"
                    >
                      <ScrambleText text="A quieter way to keep two people understood." />
                    </Heading>
                    <Text maxW="580px" fontSize="17px" lineHeight="1.6" color="body">
                      Sensa is the world's first unified translation layer connecting Speech, Sign
                      Language, and Text in one seamless, adaptive experience.
                    </Text>
                  </VStack>

                  <HStack gap={4} flexWrap="wrap">
                    <NextLink href="/">
                      <SmoothButton variant="default" size="lg">
                        Launch setup <ArrowRight size={18} />
                      </SmoothButton>
                    </NextLink>
                    <NextLink href="/communicate?a=none&b=auditory">
                      <SmoothButton variant="outline" size="lg">
                        Preview bridge
                      </SmoothButton>
                    </NextLink>
                  </HStack>

                  <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={4} w="full">
                    {stats.map((stat, index) => (
                      <MotionBox
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      >
                        <Card p={4} className="shadow-none border-hairline-soft bg-surface-soft/30">
                          <Text fontSize="20px" fontWeight="600" letterSpacing="-0.02em">
                            {stat.value}
                          </Text>
                          <Text
                            mt={1}
                            fontSize="10px"
                            fontWeight="700"
                            textTransform="uppercase"
                            letterSpacing="0.1em"
                            color="muted"
                          >
                            {stat.label}
                          </Text>
                        </Card>
                      </MotionBox>
                    ))}
                  </Grid>
                </VStack>
              </MotionBox>
            </GridItem>

            <GridItem>
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card p={6} className="shadow-none border-hairline bg-white">
                  <VStack align="stretch" gap={6}>
                    <HStack justify="space-between" align="center">
                      <VStack align="start" gap={0}>
                        <Text
                          fontSize="10px"
                          fontWeight="700"
                          textTransform="uppercase"
                          letterSpacing="0.1em"
                          color="muted"
                        >
                          Interface Demo
                        </Text>
                        <Heading fontSize="22px" fontWeight="500">
                          Active Bridge
                        </Heading>
                      </VStack>
                      <Center
                        w="10"
                        h="10"
                        rounded="full"
                        bg="surface-soft"
                        color="brand-pink"
                        border="1px solid"
                        borderColor="hairline-soft"
                      >
                        <Captions size={18} />
                      </Center>
                    </HStack>

                    <Center py={4}>
                      <Box w="200px" h="200px">
                        <Orb agentState={agentState} colors={getConditionColors("auditory")} />
                      </Box>
                    </Center>

                    <VStack align="stretch" gap={3}>
                      {transcript.map((item) => (
                        <Box
                          key={`${item.speaker}-${item.message}`}
                          p={4}
                          rounded="clay-md"
                          bg="surface-soft"
                          border="1px solid"
                          borderColor="hairline-soft"
                        >
                          <HStack justify="space-between" align="center" mb={1.5}>
                            <Text
                              fontSize="9px"
                              fontWeight="800"
                              textTransform="uppercase"
                              letterSpacing="0.1em"
                            >
                              {item.speaker}
                            </Text>
                            <Badge size="sm" variant="subtle" colorPalette="gray" fontSize="8px">
                              {item.role}
                            </Badge>
                          </HStack>
                          <Text fontSize="13px" lineHeight="1.5" color="body">
                            {item.message}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </VStack>
                </Card>
              </MotionBox>
            </GridItem>
          </Grid>

          {/* Features Section */}
          <VStack gap={12} align="stretch">
            <VStack align="start" gap={3} maxW="600px">
              <Text
                fontSize="10px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.2em"
                color="brand-pink"
              >
                Core Capabilities
              </Text>
              <Heading
                fontSize={{ base: "2.2rem", md: "3rem" }}
                fontWeight="500"
                letterSpacing="-0.03em"
              >
                Everything you need to stay connected.
              </Heading>
            </VStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              <FeatureCard
                icon={<LayoutDashboard size={24} />}
                title="Unified Hub"
                description="The Command Center for all communication. Type, speak, or sign without ever leaving the page."
              />
              <FeatureCard
                icon={<Hand size={24} />}
                title="Sign Lab"
                description="Advanced hand-landmark detection powered by MediaPipe. Real-time recognition via your camera."
              />
              <FeatureCard
                icon={<Mic size={24} />}
                title="Speech Core"
                description="Ultra-low latency transcription using Groq and Whisper, bridged with neural text-to-speech."
              />
            </Grid>
          </VStack>

          {/* Adaptation Modes */}
          <Grid templateColumns={{ base: "1fr", lg: "320px 1fr" }} gap={12} alignItems="start">
            <VStack align="start" gap={5} position={{ lg: "sticky" }} top="100px">
              <Text
                fontSize="10px"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="0.15em"
                color="muted"
              >
                Adaptive Access
              </Text>
              <Heading
                fontSize={{ base: "2rem", md: "2.8rem" }}
                fontWeight="500"
                letterSpacing="-0.04em"
                lineHeight="1.1"
              >
                Interfaces that change for the people.
              </Heading>
              <Text fontSize="15px" lineHeight="1.6" color="body">
                Sensa adapts the interface to the people in the conversation. Instead of asking one
                side to work around a barrier, it changes the bridge itself.
              </Text>

              <VStack align="start" gap={3} pt={4}>
                <HStack gap={3}>
                  <CheckCircle2 size={16} color="var(--color-brand-teal)" />
                  <Text fontSize="14px" fontWeight="600">
                    Real-time Sign Detection
                  </Text>
                </HStack>
                <HStack gap={3}>
                  <CheckCircle2 size={16} color="var(--color-brand-teal)" />
                  <Text fontSize="14px" fontWeight="600">
                    Groq Whisper STT
                  </Text>
                </HStack>
                <HStack gap={3}>
                  <CheckCircle2 size={16} color="var(--color-brand-teal)" />
                  <Text fontSize="14px" fontWeight="600">
                    Multimodal Neural TTS
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              {modes.map((mode, index) => (
                <MotionBox
                  key={mode.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    p={6}
                    className="shadow-none border-hairline bg-white h-full hover:border-primary transition-all duration-300"
                  >
                    <VStack align="start" gap={5}>
                      <Center
                        w="10"
                        h="10"
                        rounded="clay-sm"
                        bg="surface-soft"
                        color="primary"
                        border="1px solid"
                        borderColor="hairline-soft"
                      >
                        {mode.icon}
                      </Center>
                      <VStack align="start" gap={2}>
                        <Heading fontSize="17px" fontWeight="600">
                          {mode.title}
                        </Heading>
                        <Text fontSize="14px" lineHeight="1.5" color="body">
                          {mode.description}
                        </Text>
                      </VStack>
                      <Text fontSize="12px" lineHeight="1.5" color="muted">
                        {mode.detail}
                      </Text>
                    </VStack>
                  </Card>
                </MotionBox>
              ))}
            </Grid>
          </Grid>

          {/* Bottom CTA & Status */}
          <VStack gap={6}>
            <Card
              p={{ base: 8, md: 10 }}
              className="shadow-none border-hairline-soft bg-surface-soft/30 w-full overflow-hidden position-relative"
            >
              <Box
                position="absolute"
                top="-50%"
                right="-10%"
                w="300px"
                h="300px"
                bg="radial-gradient(circle, rgba(255, 77, 139, 0.05), transparent 70%)"
                pointerEvents="none"
              />

              <Grid templateColumns={{ base: "1fr", md: "1fr auto" }} gap={8} alignItems="center">
                <GridItem>
                  <VStack align="start" gap={4}>
                    <Text
                      fontSize="10px"
                      fontWeight="700"
                      textTransform="uppercase"
                      letterSpacing="0.1em"
                      color="muted"
                    >
                      Start your conversation
                    </Text>
                    <Heading
                      fontSize={{ base: "1.8rem", md: "2.4rem" }}
                      fontWeight="500"
                      letterSpacing="-0.03em"
                      lineHeight="1.2"
                    >
                      Ready to break communication barriers? <br />
                      Launch the bridge setup now.
                    </Heading>
                  </VStack>
                </GridItem>
                <GridItem>
                  <HStack gap={4} flexWrap="wrap">
                    <NextLink href="/">
                      <SmoothButton variant="default" size="lg">
                        Launch Setup
                      </SmoothButton>
                    </NextLink>
                  </HStack>
                </GridItem>
              </Grid>
            </Card>

            <Card p={6} className="shadow-none border-hairline-soft bg-canvas w-full">
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="space-between"
                gap={8}
              >
                <HStack gap={6}>
                  <Center
                    w={12}
                    h={12}
                    bg="surface-soft"
                    rounded="full"
                    color="brand-pink"
                    border="1px solid"
                    borderColor="hairline-soft"
                  >
                    <Zap size={24} />
                  </Center>
                  <VStack align="start" gap={0}>
                    <Text fontWeight="600" fontSize="16px">
                      System Integrity
                    </Text>
                    <Text color="muted" fontSize="13px">
                      Backend services status
                    </Text>
                  </VStack>
                </HStack>

                <HStack gap={6}>
                  <Badge
                    colorPalette={healthCheck.data ? "green" : "red"}
                    size="md"
                    rounded="full"
                    px={4}
                    py={1}
                  >
                    {healthCheck.isLoading
                      ? "Probing..."
                      : healthCheck.data
                        ? "Connected"
                        : "Offline"}
                  </Badge>
                  <Text
                    fontSize="11px"
                    fontWeight="700"
                    color="muted"
                    letterSpacing="0.1em"
                    textTransform="uppercase"
                  >
                    v1.2.0-MVP
                  </Text>
                </HStack>
              </Flex>
            </Card>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card
      p={6}
      className="shadow-none border-hairline bg-white h-full hover:border-brand-pink transition-all duration-300"
    >
      <VStack align="start" gap={5}>
        <Center
          w={10}
          h={10}
          bg="surface-soft"
          rounded="clay-sm"
          color="brand-pink"
          border="1px solid"
          borderColor="hairline-soft"
        >
          {icon}
        </Center>
        <VStack align="start" gap={2}>
          <Heading fontSize="18px" fontWeight="600">
            {title}
          </Heading>
          <Text fontSize="14px" lineHeight="1.6" color="body">
            {description}
          </Text>
        </VStack>
      </VStack>
    </Card>
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
