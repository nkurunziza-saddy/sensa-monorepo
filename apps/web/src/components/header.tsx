"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./user-menu";
import { MessageSquare, Hand, Settings, LayoutDashboard, Volume2, Mic, Menu, X } from "lucide-react";
import { Flex, HStack, Box, IconButton, Text, Center, VStack, Drawer } from "@chakra-ui/react";
import { ColorModeButton } from "./ui/color-mode";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/communicate", icon: <LayoutDashboard size={20} />, label: "The Hub" },
  { href: "/gesture", icon: <Hand size={20} />, label: "Sign Lab" },
  { href: "/reply", icon: <Volume2 size={20} />, label: "Phrases" },
  { href: "/talk", icon: <Mic size={20} />, label: "Live" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        {/* Logo */}
        <NextLink
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
        >
          <Center w="10" h="10" bg="indigo.600" rounded="xl" color="white" boxShadow="md">
            <MessageSquare size={24} />
          </Center>
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

        {/* Desktop Nav */}
        <HStack
          as="nav"
          display={{ base: "none", md: "flex" }}
          gap="2"
          fontSize="md"
          fontWeight="semibold"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </HStack>

        {/* Right Actions */}
        <HStack gap="3">
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
          {/* Mobile menu toggle */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            variant="ghost"
            rounded="full"
            size="lg"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </IconButton>
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <Box
          position="fixed"
          inset="0"
          zIndex="100"
          bg="blackAlpha.600"
          onClick={() => setMobileOpen(false)}
        >
          <Box
            position="absolute"
            top="0"
            right="0"
            h="full"
            w="72"
            bg="bg.panel"
            borderLeftWidth="1px"
            p="6"
            onClick={(e) => e.stopPropagation()}
          >
            <Flex justify="space-between" align="center" mb="8">
              <Text fontWeight="bold" fontSize="xl" color="indigo.600">
                Menu
              </Text>
              <IconButton
                variant="ghost"
                rounded="full"
                size="sm"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </IconButton>
            </Flex>
            <VStack align="stretch" gap="2">
              {NAV_LINKS.map((link) => (
                <NextLink
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: "none" }}
                  onClick={() => setMobileOpen(false)}
                >
                  <HStack
                    gap="3"
                    px="4"
                    py="3"
                    rounded="xl"
                    bg={pathname === link.href ? "indigo.50" : "transparent"}
                    color={pathname === link.href ? "indigo.600" : "fg.muted"}
                    _dark={{
                      bg: pathname === link.href ? "indigo.900/30" : "transparent",
                      color: pathname === link.href ? "indigo.300" : "fg.muted",
                    }}
                    fontWeight="semibold"
                  >
                    {link.icon}
                    <Text>{link.label}</Text>
                  </HStack>
                </NextLink>
              ))}
              <NextLink
                href="/settings/accessibility"
                style={{ textDecoration: "none" }}
                onClick={() => setMobileOpen(false)}
              >
                <HStack
                  gap="3"
                  px="4"
                  py="3"
                  rounded="xl"
                  color="fg.muted"
                  fontWeight="semibold"
                >
                  <Settings size={20} />
                  <Text>Settings</Text>
                </HStack>
              </NextLink>
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function NavLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <NextLink href={href as any} style={{ textDecoration: "none" }}>
      <HStack
        gap="2.5"
        px="4"
        py="2"
        rounded="xl"
        color={active ? "indigo.600" : "fg.muted"}
        bg={active ? "indigo.50" : "transparent"}
        borderBottomWidth={active ? "2px" : "0"}
        borderColor="indigo.500"
        _dark={{
          color: active ? "indigo.300" : "fg.muted",
          bg: active ? "indigo.900/30" : "transparent",
        }}
        _hover={{ color: "indigo.600", bg: "indigo.50" }}
        _dark_hover={{ color: "indigo.300", bg: "indigo.900/30" }}
        transition="all 0.2s"
        fontWeight={active ? "bold" : "semibold"}
      >
        {icon}
        <Text>{label}</Text>
      </HStack>
    </NextLink>
  );
}
