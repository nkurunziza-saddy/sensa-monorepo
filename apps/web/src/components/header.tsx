"use client";

import NextLink from "next/link";
import UserMenu from "./user-menu";
import { MessageSquare, Mic, Hand, Settings } from "lucide-react";
import { Flex, HStack, Box, IconButton, Link as ChakraLink } from "@chakra-ui/react";
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
    >
      <Flex 
        maxW="8xl"
        mx="auto" 
        h="20" 
        align="center" 
        justify="space-between" 
        px="4"
      >
        <NextLink href="/" style={{ display: "flex", alignItems: "center", gap: "3", textDecoration: "none" }}>
          <Box 
            display="flex" 
            alignItems="center" 
            gap="3" 
            fontWeight="bold" 
            fontSize="2xl" 
            letterSpacing="tight" 
            color="indigo.600" 
            _dark={{ color: "indigo.400" }}
          >
            <MessageSquare size={32} />
            Sensa
          </Box>
        </NextLink>

        <HStack as="nav" display={{ base: "none", md: "flex" }} gap="6" fontSize="lg" fontWeight="medium">
          <NavLink href="/talk" icon={<Mic size={20}/>} label="Talk" />
          <NavLink href="/reply" icon={<MessageSquare size={20}/>} label="Reply" />
          <NavLink href="/gesture" icon={<Hand size={20}/>} label="Gesture" />
        </HStack>

        <HStack gap="4">
          <NextLink href="/settings/accessibility">
            <IconButton 
              variant="ghost" 
              rounded="full" 
              size="lg"
              aria-label="Accessibility Settings"
            >
              <Settings size={24} />
            </IconButton>
          </NextLink>
          <ColorModeButton />
          <UserMenu />
        </HStack>
      </Flex>
    </Box>
  );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <NextLink href={href as any} style={{ textDecoration: "none" }}>
      <Box 
        display="flex" 
        alignItems="center" 
        gap="2" 
        p="2"
        _hover={{ color: "indigo.600" }}
        transition="colors"
      >
        {icon}
        {label}
      </Box>
    </NextLink>
  );
}
