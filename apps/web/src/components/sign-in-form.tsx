"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import * as v from "valibot";
import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import { Box, Heading, VStack, Input, Button, Text, Field } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/");
            toaster.create({ title: "Sign in successful", type: "success" });
          },
          onError: (error) => {
            toaster.create({ title: error.error.message || "Sign in failed", type: "error" });
          },
        },
      );
    },
    validators: {
      onSubmit: v.object({
        email: v.pipe(v.string(), v.email("Invalid email address")),
        password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 characters")),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <Box maxW="md" mx="auto" mt="10" p="6" bg="bg.panel" borderWidth="1px" rounded="3xl" boxShadow="xl">
      <Heading size="3xl" textAlign="center" mb="6">Welcome Back</Heading>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <VStack gap="4" align="stretch">
          <form.Field name="email">
            {(field) => (
              <Field.Root invalid={field.state.meta.errors.length > 0}>
                <Field.Label>Email</Field.Label>
                <Input
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rounded="xl"
                />
                {field.state.meta.errors.map((error) => (
                  <Field.ErrorText key={error?.message}>{error?.message}</Field.ErrorText>
                ))}
              </Field.Root>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Field.Root invalid={field.state.meta.errors.length > 0}>
                <Field.Label>Password</Field.Label>
                <Input
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rounded="xl"
                />
                {field.state.meta.errors.map((error) => (
                  <Field.ErrorText key={error?.message}>{error?.message}</Field.ErrorText>
                ))}
              </Field.Root>
            )}
          </form.Field>

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                colorPalette="indigo"
                rounded="xl"
                size="lg"
                loading={state.isSubmitting}
                disabled={!state.canSubmit}
              >
                Sign In
              </Button>
            )}
          </form.Subscribe>
        </VStack>
      </form>

      <Box mt="6" textAlign="center">
        <Button
          variant="ghost"
          onClick={onSwitchToSignUp}
          color="indigo.600"
          _hover={{ bg: "indigo.50" }}
          rounded="xl"
        >
          Need an account? Sign Up
        </Button>
      </Box>
    </Box>
  );
}

