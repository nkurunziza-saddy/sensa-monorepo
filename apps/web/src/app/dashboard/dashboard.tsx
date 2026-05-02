"use client";

import NextLink from "next/link";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import {
  SimpleGrid,
  Box,
  VStack,
  Heading,
  Text,
  HStack,
  Center,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { LayoutDashboard, Hand, Volume2, Mic, Settings, ArrowRight } from "lucide-react";

const QUICK_ACTIONS = [
  {
    href: "/communicate",
    icon: <LayoutDashboard size={28} />,
    title: "The Hub",
    description: "All-in-one communication center",
    color: "indigo",
  },
  {
    href: "/gesture",
    icon: <Hand size={28} />,
    title: "Sign Lab",
    description: "Detect and translate hand gestures",
    color: "purple",
  },
  {
    href: "/reply",
    icon: <Volume2 size={28} />,
    title: "Phrases",
    description: "Quick-speak saved phrases",
    color: "blue",
  },
  {
    href: "/talk",
    icon: <Mic size={28} />,
    title: "Live",
    description: "Real-time speech transcription",
    color: "green",
  },
  {
    href: "/settings/accessibility",
    icon: <Settings size={28} />,
    title: "Settings",
    description: "Customize your experience",
    color: "orange",
  },
];

export default function Dashboard() {
  const privateData = useQuery(trpc.privateData.queryOptions());

  return (
    <VStack gap="8" align="stretch">
      {/* API Status */}
      <Flex
        bg="bg.panel"
        borderWidth="1px"
        rounded="2xl"
        p="4"
        align="center"
        justify="space-between"
        gap="4"
      >
        <Text fontSize="sm" fontWeight="semibold" color="fg.muted">
          API Status
        </Text>
        <Badge
          colorPalette={privateData.isLoading ? "gray" : privateData.data ? "green" : "red"}
          size="md"
          rounded="lg"
          px="3"
        >
          {privateData.isLoading ? "Checking..." : privateData.data ? "Connected" : "Offline"}
        </Badge>
      </Flex>

      {/* Quick Actions */}
      <Box>
        <Heading size="xl" fontWeight="semibold" mb="4" color="fg.muted">
          Quick Actions
        </Heading>
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap="5">
          {QUICK_ACTIONS.map((action) => (
            <NextLink key={action.href} href={action.href} style={{ textDecoration: "none" }}>
              <HStack
                p="5"
                bg="bg.panel"
                borderWidth="1px"
                rounded="2xl"
                gap="4"
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "lg",
                  borderColor: `${action.color}.400`,
                }}
                align="center"
              >
                <Center
                  w="12"
                  h="12"
                  bg={`${action.color}.100`}
                  _dark={{ bg: `${action.color}.900/30` }}
                  rounded="xl"
                  color={`${action.color}.600`}
                  flexShrink="0"
                >
                  {action.icon}
                </Center>
                <VStack align="start" gap="0" flex="1">
                  <Text fontWeight="bold" fontSize="md">
                    {action.title}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    {action.description}
                  </Text>
                </VStack>
                <ArrowRight size={16} color="var(--chakra-colors-fg-muted)" />
              </HStack>
            </NextLink>
          ))}
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
