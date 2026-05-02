"use client";

import NextLink from "next/link";
import Image from "next/image";
import UserMenu from "./user-menu";
import { Hand, Settings, LayoutDashboard, Volume2 } from "lucide-react";
import { Flex, HStack, Box, IconButton, Text } from "@chakra-ui/react";
import { ColorModeButton } from "./ui/color-mode";

export default function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="50"
      w="full"
      borderBottomWidth="1px"
      bg="bg.panel"
      backdropFilter="blur(8px)"
      boxShadow="sm"
    >
      <Flex maxW="8xl" mx="auto" h="20" align="center" justify="space-between" px="6">
        <NextLink
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
        >
          <Image src="/logo_sensa0.png" alt="Sensa Logo" width={52} height={52} style={{ objectFit: "contain" }} />
          <Box
            fontWeight="bold"
            fontSize="2xl"
            letterSpacing="tight"
            color="indigo.600"
            _dark={{ color: "indigo.400" }}
          >
            Sensa
          </Box>
        </NextLink>

        <HStack
          as="nav"
          display={{ base: "none", md: "flex" }}
          gap="8"
          fontSize="md"
          fontWeight="semibold"
        >
          <NavLink href="/communicate" icon={<LayoutDashboard size={20} />} label="The Hub" />
          <NavLink href="/gesture" icon={<Hand size={20} />} label="Sign Lab" />
          <NavLink href="/reply" icon={<Volume2 size={20} />} label="Phrases" />
        </HStack>

        <HStack gap="4">
          <NextLink href="/settings/accessibility">
            <IconButton
              variant="ghost"
              rounded="full"
              size="lg"
              aria-label="Accessibility Settings"
              _hover={{ bg: "bg.muted" }}
            >
              <Settings size={22} />
            </IconButton>
          </NextLink>
          <ColorModeButton />
          <UserMenu />
        </HStack>
      </Flex>
    </Box>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <NextLink href={href as any} style={{ textDecoration: "none" }}>
      <HStack
        gap="2.5"
        px="3"
        py="2"
        rounded="xl"
        color="fg.muted"
        _hover={{ color: "indigo.600", bg: "indigo.50" }}
        _dark={{ _hover: { color: "indigo.300", bg: "indigo.900/30" } }}
        transition="all 0.2s"
      >
        {icon}
        <Text>{label}</Text>
      </HStack>
    </NextLink>
  );
}
