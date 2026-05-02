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
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  LayoutDashboard,
  Mic,
  Hand,
  ArrowRight,
  CheckCircle2,
  Zap,
  MessageSquare,
  Volume2,
  Users,
  Globe,
  Shield,
} from "lucide-react";
import { LargeButton } from "@/components/ui/large-button";

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <Box bg="bg.panel" overflowY="auto">
      {/* Hero Section */}
      <Box
        pt="20"
        pb="16"
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

            <HStack gap="8" pt="8" color="fg.muted" flexWrap="wrap" justify="center">
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

      {/* Stats Bar */}
      <Box bg="indigo.600" py="8">
        <Container maxW="5xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} gap="8">
            {[
              { value: "3", label: "Input Modalities" },
              { value: "< 200ms", label: "Avg. Latency" },
              { value: "20+", label: "Sign Gestures" },
              { value: "100%", label: "Open Source" },
            ].map((stat) => (
              <VStack key={stat.label} gap="1" textAlign="center" color="white">
                <Text fontSize="3xl" fontWeight="black">
                  {stat.value}
                </Text>
                <Text fontSize="sm" opacity={0.8}>
                  {stat.label}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Separator />

      {/* Feature Grid */}
      <Container maxW="6xl" py="20">
        <VStack gap="4" textAlign="center" mb="12">
          <Heading size="4xl" fontWeight="bold">
            Everything You Need
          </Heading>
          <Text fontSize="lg" color="fg.muted" maxW="xl">
            Three powerful tools, one unified platform — built for everyone.
          </Text>
        </VStack>
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
            href="/talk"
            color="blue"
          />
        </SimpleGrid>
      </Container>

      <Separator />

      {/* How It Works */}
      <Box bg="bg.muted" py="20">
        <Container maxW="5xl">
          <VStack gap="4" textAlign="center" mb="14">
            <Heading size="4xl" fontWeight="bold">
              How It Works
            </Heading>
            <Text fontSize="lg" color="fg.muted">
              Three steps to seamless accessible communication.
            </Text>
          </VStack>
          <Grid templateColumns={{ base: "1fr", md: "1fr auto 1fr auto 1fr" }} gap="4" alignItems="center">
            <StepCard
              step="1"
              icon={<MessageSquare size={28} />}
              title="Choose Your Input"
              description="Type text, speak into your mic, or use hand gestures — whatever works best for you."
              color="indigo"
            />
            <Center display={{ base: "none", md: "flex" }}>
              <ArrowRight size={28} color="var(--chakra-colors-fg-muted)" />
            </Center>
            <StepCard
              step="2"
              icon={<Zap size={28} />}
              title="Instant Processing"
              description="Sensa translates your input in real-time using AI-powered speech and gesture recognition."
              color="purple"
            />
            <Center display={{ base: "none", md: "flex" }}>
              <ArrowRight size={28} color="var(--chakra-colors-fg-muted)" />
            </Center>
            <StepCard
              step="3"
              icon={<Volume2 size={28} />}
              title="Output & Reply"
              description="Receive spoken audio, text transcripts, or sign language visuals — all in one place."
              color="blue"
            />
          </Grid>
        </Container>
      </Box>

      <Separator />

      {/* Why Sensa */}
      <Container maxW="6xl" py="20">
        <VStack gap="4" textAlign="center" mb="12">
          <Heading size="4xl" fontWeight="bold">
            Why Sensa?
          </Heading>
          <Text fontSize="lg" color="fg.muted" maxW="xl">
            Built with accessibility as a first-class citizen, not an afterthought.
          </Text>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
          <WhyCard
            icon={<Users size={24} />}
            title="Inclusive by Design"
            description="Every feature is built for users with visual, auditory, or motor impairments — not retrofitted."
            color="indigo"
          />
          <WhyCard
            icon={<Globe size={24} />}
            title="Universal Access"
            description="Works across devices and browsers. No app install required — just open and communicate."
            color="green"
          />
          <WhyCard
            icon={<Shield size={24} />}
            title="Privacy First"
            description="Your conversations stay yours. No third-party tracking, no data selling, ever."
            color="orange"
          />
        </SimpleGrid>
      </Container>

      <Separator />

      {/* CTA Banner */}
      <Box
        bgGradient="to-r"
        gradientFrom="indigo.600"
        gradientTo="purple.600"
        py="16"
      >
        <Container maxW="3xl">
          <VStack gap="6" textAlign="center" color="white">
            <Heading size="4xl" fontWeight="black">
              Ready to break barriers?
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Join thousands of users communicating without limits.
            </Text>
            <HStack gap="4">
              <NextLink href="/communicate">
                <Button size="xl" bg="white" color="indigo.600" rounded="2xl" px="10" _hover={{ bg: "indigo.50" }}>
                  Get Started Free
                </Button>
              </NextLink>
              <NextLink href="/login">
                <Button size="xl" variant="outline" rounded="2xl" px="10" borderColor="white/40" color="white" _hover={{ bg: "white/10" }}>
                  Sign In
                </Button>
              </NextLink>
            </HStack>
          </VStack>
        </Container>
      </Box>

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
  icon: React.ReactNode;
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
        <HStack color={`${color}.600`} fontSize="sm" fontWeight="semibold" mt="auto">
          <Text>Explore</Text>
          <ArrowRight size={16} />
        </HStack>
      </VStack>
    </NextLink>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
  color,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <VStack
      align="center"
      textAlign="center"
      p="8"
      bg="bg.panel"
      rounded="3xl"
      borderWidth="1px"
      gap="4"
    >
      <Center
        w="14"
        h="14"
        bg={`${color}.100`}
        _dark={{ bg: `${color}.900/30` }}
        rounded="2xl"
        color={`${color}.600`}
        position="relative"
      >
        {icon}
        <Badge
          position="absolute"
          top="-2"
          right="-2"
          colorPalette={color}
          rounded="full"
          w="6"
          h="6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="xs"
          fontWeight="black"
        >
          {step}
        </Badge>
      </Center>
      <Heading size="lg" fontWeight="bold">
        {title}
      </Heading>
      <Text color="fg.muted" fontSize="sm" lineHeight="relaxed">
        {description}
      </Text>
    </VStack>
  );
}

function WhyCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <HStack
      align="start"
      p="6"
      bg="bg.panel"
      rounded="2xl"
      borderWidth="1px"
      gap="4"
    >
      <Center
        w="12"
        h="12"
        bg={`${color}.100`}
        _dark={{ bg: `${color}.900/30` }}
        rounded="xl"
        color={`${color}.600`}
        flexShrink="0"
      >
        {icon}
      </Center>
      <VStack align="start" gap="1">
        <Heading size="md" fontWeight="bold">
          {title}
        </Heading>
        <Text color="fg.muted" fontSize="sm" lineHeight="relaxed">
          {description}
        </Text>
      </VStack>
    </HStack>
  );
}
