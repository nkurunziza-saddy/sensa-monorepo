"use client";

import { useAccessibilitySettings } from "@/hooks/use-accessibility-settings";
import { Check, Settings, Monitor, EyeOff, MessageSquare } from "lucide-react";
import { Container, VStack, Heading, Text, Box, Flex, SimpleGrid, Separator, Center } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";

export default function AccessibilitySettingsPage() {
  const { userMode, fontSize, highContrast, autoReadMessages, hapticFeedback, updateSettings } = useAccessibilitySettings();

  return (
    <Container maxW="3xl" py="8">
      <VStack gap="8" align="stretch">
        <Flex align="center" gap="4" mb="4">
          <Center 
            w="16" h="16" rounded="2xl" 
            bg="indigo.100" color="indigo.600"
            _dark={{ bg: "indigo.900/50", color: "indigo.400" }} 
          >
            <Settings size={32} />
          </Center>
          <Box>
            <Heading size="4xl" fontWeight="bold" letterSpacing="tight">Accessibility</Heading>
            <Text fontSize="xl" color="fg.muted">Customize your communication experience</Text>
          </Box>
        </Flex>

        <VStack gap="8" align="stretch">
          {/* User Mode */}
          <Box bg="bg.panel" borderWidth="1px" rounded="3xl" p={{ base: "6", md: "8" }} boxShadow="sm">
            <Heading size="2xl" fontWeight="semibold" mb="6">Primary Mode</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
              <ModeCard 
                title="Blind User" 
                icon={<EyeOff size={32} />}
                description="Optimized for screen readers, audio output, and haptics."
                active={userMode === "blind"}
                onClick={() => updateSettings({ userMode: "blind", autoReadMessages: true, hapticFeedback: true })}
              />
              <ModeCard 
                title="Non-Verbal" 
                icon={<MessageSquare size={32} />}
                description="Optimized for large touch targets and text-to-speech."
                active={userMode === "nonverbal"}
                onClick={() => updateSettings({ userMode: "nonverbal", highContrast: true })}
              />
              <ModeCard 
                title="Sighted" 
                icon={<Monitor size={32} />}
                description="Standard visual interface with chat transcripts."
                active={userMode === "sighted"}
                onClick={() => updateSettings({ userMode: "sighted" })}
              />
            </SimpleGrid>
          </Box>

          {/* Display Settings */}
          <Box bg="bg.panel" borderWidth="1px" rounded="3xl" p={{ base: "6", md: "8" }} boxShadow="sm">
            <Heading size="2xl" fontWeight="semibold" mb="8">Display & Feedback</Heading>
            
            <VStack gap="6" align="stretch">
              <ToggleRow 
                title="High Contrast Mode"
                description="Increase visual contrast across the app"
                checked={highContrast}
                onChange={(v) => updateSettings({ highContrast: v })}
              />
              <Separator />
              <ToggleRow 
                title="Auto-read Messages"
                description="Automatically play text-to-speech for incoming messages"
                checked={autoReadMessages}
                onChange={(v) => updateSettings({ autoReadMessages: v })}
              />
              <Separator />
              <ToggleRow 
                title="Haptic Feedback"
                description="Vibrate on button taps and successful actions"
                checked={hapticFeedback}
                onChange={(v) => updateSettings({ hapticFeedback: v })}
              />
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </Container>
  );
}

function ModeCard({ title, icon, description, active, onClick }: { title: string, icon: React.ReactNode, description: string, active: boolean, onClick: () => void }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      textAlign="left"
      p="6"
      rounded="2xl"
      borderWidth="2px"
      transition="all"
      display="flex"
      flexDirection="column"
      gap="4"
      _focusVisible={{ outline: "none", ring: "4", ringColor: "indigo.500" }}
      borderColor={active ? "indigo.600" : "border"}
      bg={active ? "indigo.50" : "transparent"}
      _dark={{ 
        bg: active ? "indigo.950/50" : "transparent",
        borderColor: active ? "indigo.500" : "border"
      }}
      position="relative"
    >
      <Flex align="center" justify="space-between" w="full">
        <Box 
          p="3" rounded="xl" 
          bg={active ? "indigo.600" : "bg.muted"} 
          color={active ? "white" : "inherit"}
        >
          {icon}
        </Box>
        {active && (
          <Center w="8" h="8" rounded="full" bg="indigo.600" color="white">
            <Check size={20} />
          </Center>
        )}
      </Flex>
      <Box>
        <Heading size="xl" fontWeight="bold" mb="2">{title}</Heading>
        <Text color="fg.muted" lineHeight="relaxed">{description}</Text>
      </Box>
    </Box>
  );
}

function ToggleRow({ title, description, checked, onChange }: { title: string, description: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <Flex align="center" justify="space-between" gap="8">
      <Box>
        <Text fontSize="xl" fontWeight="medium">{title}</Text>
        <Text color="fg.muted" fontSize="lg">{description}</Text>
      </Box>
      <Switch 
        size="lg" 
        checked={checked} 
        onCheckedChange={(e) => onChange(e.checked)}
        colorPalette="indigo"
      />
    </Flex>
  );
}


