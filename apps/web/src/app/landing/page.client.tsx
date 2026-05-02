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
} from "@chakra-ui/react";
import { motion } from "motion/react";
import { ArrowRight, Captions, Eye, Mic, User, Volume2 } from "lucide-react";

import { Orb, type AgentState } from "@/components/ui/orb";
import { ScrambleText } from "@/components/ui/scramble-text";
import { Card } from "@/components/ui/card";
import { smoothButtonVariants } from "@/components/ui/smoothui/smooth-button";

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
    detail: "Prioritizes audio cues and assistant speech when the screen cannot carry the conversation.",
    icon: <Eye size={16} strokeWidth={1.6} />,
  },
  {
    id: "vocal",
    title: "Not Speaking",
    description: "Gesture and text become the primary bridge.",
    detail: "Large controls and camera-assisted input reduce the pressure to speak to be understood.",
    icon: <Mic size={16} strokeWidth={1.6} />,
  },
  {
    id: "auditory",
    title: "Not Hearing",
    description: "Visual prompts and readable responses stay in focus.",
    detail: "Captions, pacing, and legible message cards keep the exchange grounded on screen.",
    icon: <Volume2 size={16} strokeWidth={1.6} />,
  },
  {
    id: "none",
    title: "Standard",
    description: "Keeps everyone in the same shared interaction model.",
    detail: "Sensa stays useful even without an access barrier by keeping the bridge explicit and calm.",
    icon: <User size={16} strokeWidth={1.6} />,
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

  return (
    <Box bg="canvas" minH="calc(100vh - 64px)" position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset="0"
        bg="radial-gradient(circle at top left, rgba(255, 77, 139, 0.08), transparent 28%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        top="120px"
        right="-120px"
        w="320px"
        h="320px"
        bg="radial-gradient(circle, rgba(26, 58, 58, 0.08), transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="1200px" py={{ base: 10, md: 16 }}>
        <VStack align="stretch" gap={{ base: 8, md: 12 }}>
          <Grid templateColumns={{ base: "1fr", lg: "minmax(0, 1.1fr) 360px" }} gap={6}>
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <VStack align="start" gap={6}>
                  <HStack
                    px={4}
                    py={2}
                    rounded="full"
                    border="1px solid"
                    borderColor="hairline-soft"
                    bg="rgba(255, 250, 240, 0.72)"
                  >
                    <Box w="2" h="2" rounded="full" bg="brand-pink" />
                    <Text fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.18em">
                      Clay Refined • Adaptive bridge
                    </Text>
                  </HStack>

                  <VStack align="start" gap={4} maxW="760px">
                    <Heading
                      fontSize={{ base: "3.1rem", md: "4.7rem" }}
                      fontWeight="500"
                      letterSpacing="-0.04em"
                      lineHeight="0.96"
                    >
                      <ScrambleText text="A quieter way to keep two people understood." />
                    </Heading>
                    <Text maxW="560px" fontSize="15px" lineHeight="1.7" color="body">
                      Sensa adapts the interface to the people in the conversation. Instead of asking
                      one side to work around a barrier, it changes the bridge itself.
                    </Text>
                  </VStack>

                  <HStack gap={3} flexWrap="wrap">
                    <NextLink
                      href="/"
                      className={smoothButtonVariants({ variant: "default", size: "lg", className: "rounded-clay-md" })}
                    >
                      Open bridge setup
                      <ArrowRight size={16} />
                    </NextLink>
                    <NextLink
                      href="/communicate?a=none&b=auditory"
                      className={smoothButtonVariants({ variant: "outline", size: "lg", className: "rounded-clay-md" })}
                    >
                      Preview live bridge
                    </NextLink>
                  </HStack>

                  <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={3} w="full" maxW="760px">
                    {stats.map((stat, index) => (
                      <MotionBox
                        key={stat.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.08 + index * 0.06 }}
                      >
                        <Card p={4} className="shadow-none">
                          <Text fontSize="lg" fontWeight="700" letterSpacing="-0.03em">
                            {stat.value}
                          </Text>
                          <Text mt={1} fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.14em" color="muted">
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card p={6} className="shadow-none">
                  <VStack align="stretch" gap={5}>
                    <HStack justify="space-between" align="start">
                      <VStack align="start" gap={1}>
                        <Text fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.14em" color="muted">
                          Live preview
                        </Text>
                        <Heading fontSize="28px" fontWeight="500" letterSpacing="-0.04em">
                          Bridge mode
                        </Heading>
                      </VStack>
                      <Center
                        w="11"
                        h="11"
                        rounded="full"
                        bg="surface-soft"
                        border="1px solid"
                        borderColor="hairline-soft"
                        color="brand-pink"
                      >
                        <Captions size={18} strokeWidth={1.7} />
                      </Center>
                    </HStack>

                    <Center py={2}>
                      <Box w="180px" h="180px">
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
                          <HStack justify="space-between" align="center" mb={2}>
                            <Text fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.14em">
                              {item.speaker}
                            </Text>
                            <Text fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.14em" color="muted">
                              {item.role}
                            </Text>
                          </HStack>
                          <Text fontSize="14px" lineHeight="1.65" color="body">
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

          <Grid templateColumns={{ base: "1fr", lg: "280px minmax(0, 1fr)" }} gap={6} alignItems="start">
            <GridItem>
              <VStack align="start" gap={4}>
                <Text fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.18em" color="muted">
                  Existing UI, same rules
                </Text>
                <Heading fontSize={{ base: "2rem", md: "3rem" }} fontWeight="500" letterSpacing="-0.04em" lineHeight="1">
                  Focused on the active bridge, not extra chrome.
                </Heading>
                <Text fontSize="15px" lineHeight="1.7" color="body">
                  The layout stays sparse, bordered, and readable so the interface feels like the app it leads into.
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={3}>
                {modes.map((mode, index) => (
                  <MotionBox
                    key={mode.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, delay: 0.08 + index * 0.05 }}
                  >
                    <Card p={5} className="shadow-none">
                      <VStack align="start" gap={4}>
                        <Center
                          w="10"
                          h="10"
                          rounded="clay-sm"
                          bg="surface-soft"
                          border="1px solid"
                          borderColor="hairline-soft"
                          color="primary"
                        >
                          {mode.icon}
                        </Center>
                        <VStack align="start" gap={1}>
                          <Heading fontSize="16px" fontWeight="600">
                            {mode.title}
                          </Heading>
                          <Text fontSize="13px" lineHeight="1.65" color="body">
                            {mode.description}
                          </Text>
                        </VStack>
                        <Text fontSize="12px" lineHeight="1.65" color="muted">
                          {mode.detail}
                        </Text>
                      </VStack>
                    </Card>
                  </MotionBox>
                ))}
              </Grid>
            </GridItem>
          </Grid>

          <Card p={{ base: 5, md: 6 }} className="shadow-none">
            <Grid templateColumns={{ base: "1fr", md: "minmax(0, 1fr) auto" }} gap={6} alignItems="end">
              <GridItem>
                <Text fontSize="10px" fontWeight="700" textTransform="uppercase" letterSpacing="0.14em" color="muted">
                  Start from the real flow
                </Text>
                <Heading mt={3} fontSize={{ base: "2rem", md: "2.6rem" }} fontWeight="500" letterSpacing="-0.04em" lineHeight="1">
                  The landing page should hand off directly into setup, not become a separate experience.
                </Heading>
              </GridItem>
              <GridItem>
                <HStack gap={3} flexWrap="wrap" justify={{ base: "start", md: "end" }}>
                  <NextLink
                    href="/communicate?a=visual&b=none"
                    className={smoothButtonVariants({ variant: "ghost", size: "lg", className: "rounded-clay-md" })}
                  >
                    See a sample route
                  </NextLink>
                  <NextLink
                    href="/"
                    className={smoothButtonVariants({ variant: "default", size: "lg", className: "rounded-clay-md" })}
                  >
                    Launch setup
                    <ArrowRight size={16} />
                  </NextLink>
                </HStack>
              </GridItem>
            </Grid>
          </Card>
        </VStack>
      </Container>
    </Box>
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
