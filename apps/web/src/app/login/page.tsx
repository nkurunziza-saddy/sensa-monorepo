"use client";

import { useState } from "react";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { Container, Center } from "@chakra-ui/react";

export default function LoginPage() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <Container maxW="lg" py="10">
      <Center h="full">
        {showSignIn ? (
          <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
        )}
      </Center>
    </Container>
  );
}

