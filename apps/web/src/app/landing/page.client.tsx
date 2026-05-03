"use client";

import NextLink from "next/link";
import {
  Box,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
  Grid,
} from "@chakra-ui/react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Eye,
  Mic,
  Volume2,
  User,
} from "lucide-react";
import {
  Orb,
  ScrambleText,
  SmoothButton,
  getConditionColors,
  type Condition,
} from "@sensa-monorepo/ui";

const MotionBox = motion(Box);

export default function LandingClientPage() {
  return (
    <Box 
      bg="canvas" 
      minH="calc(100vh - 64px)" 
      display="flex" 
      flexDirection="column"
      position="relative" 
      overflowX="hidden"
    >
      {/* Subtle background element */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w="500px"
        h="500px"
        bg="radial-gradient(circle, rgba(255, 77, 139, 0.03), transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="1000px" py={{ base: 12, md: 24 }} flex="1" display="flex" alignItems="center">
        <VStack align="start" gap={12} w="full">
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <VStack align="start" gap={8}>
              <HStack gap={3} opacity={0.5}>
                <Text
                  fontSize="10px"
                  fontWeight="700"
                  textTransform="uppercase"
                  letterSpacing="0.2em"
                >
                  Sensa • Accessible Bridge
                </Text>
              </HStack>

              <VStack align="start" gap={6}>
                <Heading
                  fontSize={{ base: "3rem", md: "4.5rem" }}
                  fontWeight="500"
                  letterSpacing="-0.04em"
                  lineHeight="1"
                >
                  <ScrambleText text="A calm bridge between modalities." />
                </Heading>
                <Text maxW="540px" fontSize="lg" lineHeight="1.6" color="muted">
                  Sensa connects speech, sign, and text through an adaptive interface that adjusts to your specific interaction needs. No barriers, just communication.
                </Text>
              </VStack>

              <HStack gap={4}>
                <NextLink href="/">
                  <SmoothButton variant="default" h="14" px={10} rounded="clay-md" fontSize="md">
                    Launch Bridge <ArrowRight size={18} style={{ marginLeft: "8px" }} />
                  </SmoothButton>
                </NextLink>
                <NextLink href="/communicate?a=none&b=auditory">
                  <SmoothButton variant="outline" h="14" px={8} color="muted">
                    Preview Experience
                  </SmoothButton>
                </NextLink>
              </HStack>
            </VStack>
          </MotionBox>

          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} w="full" pt={8}>
             <ModePreview 
               condition="visual" 
               icon={<Eye size={20} />} 
               title="Audio Path" 
               desc="Voice focus for visual needs." 
             />
             <ModePreview 
               condition="vocal" 
               icon={<Mic size={20} />} 
               title="Gesture Path" 
               desc="Sign focus for vocal needs." 
             />
             <ModePreview 
               condition="auditory" 
               icon={<Volume2 size={20} />} 
               title="Visual Path" 
               desc="Text focus for hearing needs." 
             />
          </Grid>
        </VStack>
      </Container>

      <Box py={8} borderTop="1px solid" borderColor="hairline-soft">
        <Container maxW="1000px">
          <HStack justify="space-between" opacity={0.4} fontSize="10px" fontWeight="700" letterSpacing="0.1em">
            <Text>MODERN ACCESSIBILITY</Text>
            <Text>© 2026 SENSA</Text>
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}

function ModePreview({ 
  condition, 
  icon, 
  title, 
  desc 
}: { 
  condition: Condition; 
  icon: React.ReactNode; 
  title: string; 
  desc: string;
}) {
  return (
    <Box
      p={6}
      bg="canvas"
      border="1px solid"
      borderColor="hairline-soft"
      rounded="clay-md"
      display="flex"
      flexDirection="column"
      gap={4}
    >
      <HStack gap={4}>
        <Box
          p={3}
          rounded="clay-sm"
          bg="surface-soft"
          color="primary"
        >
          {icon}
        </Box>
        <Box w="40px" h="40px">
          <Orb agentState={null} colors={getConditionColors(condition)} />
        </Box>
      </HStack>
      <VStack align="start" gap={1}>
        <Heading fontSize="16px" fontWeight="600">
          {title}
        </Heading>
        <Text color="muted" fontSize="xs">
          {desc}
        </Text>
      </VStack>
    </Box>
  );
}
