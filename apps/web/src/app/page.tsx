"use client";

import NextLink from "next/link";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Box,
  Heading,
  Text,
  Flex,
  Center,
  VStack,
  SimpleGrid,
  HStack,
  Badge,
  Separator,
  Button,
} from "@chakra-ui/react";
import { LayoutDashboard, Mic, Hand, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { LargeButton } from "@/components/ui/large-button";

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <Box bg="bg.panel" overflowY="auto">
      {/* Hero Section */}
      <Box
        pt="16"
        pb="12"
        bgGradient="to-b"
        gradientFrom="indigo.50/50"
        gradientTo="bg.panel"
        _dark={{ gradientFrom: "indigo.950/20", gradientTo: "bg.panel" }}
      >
        <Container maxW="5xl">
          <VStack gap="8" align="center" textAlign="center">
            <Badge
              colorPalette="indigo"
              size="lg"
              rounded="full"
              px="4"
              py="1"
              variant="subtle"
              animation="bounce 3s infinite"
            >
              Hackathon Edition 2026
            </Badge>
            <VStack gap="4">
              <Heading size="6xl" fontWeight="black" letterSpacing="tight" lineHeight="shorter">
                Accessibility Without <br />
                <Text as="span" color="indigo.600">
                  Boundaries.
                </Text>
              </Heading>
              <Text fontSize="xl" color="fg.muted" maxW="2xl">
                The world's first unified translation layer connecting Speech, Sign Language, and
                Text in one seamless experience.
              </Text>
            </VStack>

            <HStack gap="4" pt="4">
              <NextLink href="/communicate">
                <LargeButton size="xl" variant="accent" px="10" gap="3">
                  Open The Hub <ArrowRight size={20} />
                </LargeButton>
              </NextLink>
              <NextLink href="/settings/accessibility">
                <Button variant="outline" size="xl" rounded="2xl" px="8">
                  Configure
                </Button>
              </NextLink>
            </HStack>

            <HStack gap="8" pt="8" color="fg.muted">
              <HStack gap="2">
                <CheckCircle2 size={18} color="var(--chakra-colors-green-500)" />
                <Text fontSize="sm" fontWeight="medium">
                  Real-time Sign Detection
                </Text>
              </HStack>
              <HStack gap="2">
                <CheckCircle2 size={18} color="var(--chakra-colors-green-500)" />
                <Text fontSize="sm" fontWeight="medium">
                  Groq Whisper STT
                </Text>
              </HStack>
              <HStack gap="2">
                <CheckCircle2 size={18} color="var(--chakra-colors-green-500)" />
                <Text fontSize="sm" fontWeight="medium">
                  Drizzle Persistence
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Separator />

      {/* Feature Grid */}
      <Container maxW="6xl" py="20">
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="8">
          <FeatureCard
            icon={<LayoutDashboard size={32} />}
            title="Unified Hub"
            description="The Command Center for all communication. Type, speak, or sign without ever leaving the page."
            href="/communicate"
            color="indigo"
          />
          <FeatureCard
            icon={<Hand size={32} />}
            title="Sign Lab"
            description="Advanced hand-landmark detection powered by MediaPipe. Build sentences using only your gestures."
            href="/gesture"
            color="purple"
          />
          <FeatureCard
            icon={<Mic size={32} />}
            title="Speech Core"
            description="Ultra-low latency transcription using Groq and Whisper, bridged with neural text-to-speech."
            href="/communicate"
            color="blue"
          />
        </SimpleGrid>
      </Container>

      {/* Tech Status */}
      <Box bg="bg.muted" py="12">
        <Container maxW="4xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            bg="bg.panel"
            p="8"
            rounded="3xl"
            borderWidth="1px"
            align="center"
            justify="space-between"
            gap="8"
          >
            <HStack gap="6">
              <Center
                w="16"
                h="16"
                bg="indigo.50"
                _dark={{ bg: "indigo.900/20" }}
                rounded="2xl"
                color="indigo.600"
              >
                <Zap size={32} />
              </Center>
              <VStack align="start" gap="0">
                <Text fontWeight="bold" fontSize="lg">
                  System Integrity
                </Text>
                <Text color="fg.muted">Current status of backend services</Text>
              </VStack>
            </HStack>

            <HStack gap="4">
              <Badge
                colorPalette={healthCheck.data ? "green" : "red"}
                size="lg"
                rounded="lg"
                px="4"
              >
                {healthCheck.isLoading ? "Probing..." : healthCheck.data ? "Connected" : "Offline"}
              </Badge>
              <Text fontSize="sm" fontWeight="bold" color="fg.muted">
                v1.2.0-MVP
              </Text>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <NextLink href={href as any} style={{ textDecoration: "none" }}>
      <VStack
        align="start"
        p="8"
        bg="bg.panel"
        rounded="3xl"
        borderWidth="1px"
        height="full"
        transition="all 0.3s"
        _hover={{
          transform: "translateY(-8px)",
          boxShadow: "2xl",
          borderColor: `${color}.400`,
          bg: `${color}.50/30`,
        }}
        gap="6"
      >
        <Center
          w="14"
          h="14"
          bg={`${color}.100`}
          _dark={{ bg: `${color}.900/30` }}
          rounded="2xl"
          color={`${color}.600`}
        >
          {icon}
        </Center>
        <VStack align="start" gap="3">
          <Heading size="xl" fontWeight="bold">
            {title}
          </Heading>
          <Text color="fg.muted" lineHeight="relaxed">
            {description}
          </Text>
        </VStack>
      </VStack>
    </NextLink>
  );
}
