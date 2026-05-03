"use client";

import { cn, SiriOrb } from "@sensa-monorepo/ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import React from "react";
import { useClickOutside } from "@/components/ui/smoothui/ai-input/use-click-outside";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Text, Box, HStack } from "@chakra-ui/react";

const SPEED = 1;
const SUCCESS_DURATION = 1500;
const DOCK_HEIGHT = 44;
const FEEDBACK_BORDER_RADIUS = 16;
const DOCK_BORDER_RADIUS = 24;
const SPRING_STIFFNESS = 550;
const SPRING_DAMPING = 45;
const SPRING_MASS = 0.7;
const CLOSE_DELAY = 0.08;

interface FooterContext {
  closeFeedback: () => void;
  openFeedback: () => void;
  showFeedback: boolean;
  success: boolean;
}

const FooterContext = React.createContext({} as FooterContext);
const useFooter = () => React.useContext(FooterContext);

interface AIInputProps {
  onMessage?: (msg: { source: "user" | "ai"; message: string }) => void;
}

export function AIInput({ onMessage }: AIInputProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const feedbackRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  const closeFeedback = React.useCallback(() => {
    setShowFeedback(false);
    feedbackRef.current?.blur();
  }, []);

  const openFeedback = React.useCallback(() => {
    setShowFeedback(true);
    setTimeout(() => {
      feedbackRef.current?.focus();
    });
  }, []);

  const onFeedbackSuccess = React.useCallback(() => {
    closeFeedback();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, SUCCESS_DURATION);
  }, [closeFeedback]);

  useClickOutside(rootRef, closeFeedback);

  const context = React.useMemo(
    () => ({
      showFeedback,
      success,
      openFeedback,
      closeFeedback,
    }),
    [showFeedback, success, openFeedback, closeFeedback],
  );

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: FEEDBACK_WIDTH,
        height: showFeedback ? FEEDBACK_HEIGHT : DOCK_HEIGHT,
      }}
    >
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                width: showFeedback ? FEEDBACK_WIDTH : "auto",
                height: showFeedback ? FEEDBACK_HEIGHT : DOCK_HEIGHT,
                borderRadius: showFeedback ? FEEDBACK_BORDER_RADIUS : DOCK_BORDER_RADIUS,
              }
        }
        className={cn(
          "relative z-10 flex flex-col items-center overflow-hidden border border-hairline bg-canvas",
        )}
        data-footer
        initial={false}
        ref={rootRef}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                type: "spring" as const,
                stiffness: SPRING_STIFFNESS / SPEED,
                damping: SPRING_DAMPING,
                mass: SPRING_MASS,
                delay: showFeedback ? 0 : CLOSE_DELAY,
                duration: 0.25,
              }
        }
      >
        <FooterContext.Provider value={context}>
          <Dock />
          <Feedback onSuccess={onFeedbackSuccess} ref={feedbackRef} onMessage={onMessage} />
        </FooterContext.Provider>
      </motion.div>
    </div>
  );
}

function Dock() {
  const { showFeedback, openFeedback } = useFooter();
  const shouldReduceMotion = useReducedMotion();
  return (
    <Box
      as="button"
      onClick={openFeedback}
      w="full"
      h="52px"
      bg="canvas"
      border="1px solid"
      borderColor="hairline"
      rounded="clay-md"
      px={5}
      display="flex"
      alignItems="center"
      gap={4}
      transition="all 0.2s"
      _hover={{ borderColor: "primary", bg: "surface-soft" }}
    >
      <AnimatePresence mode="wait">
        {!showFeedback && (
          <motion.div
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="siri-orb"
          >
            <SiriOrb
              colors={{
                bg: "var(--color-canvas)",
              }}
              size="20px"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Text fontSize="sm" color="muted" fontWeight="500" flex="1" textAlign="left">
        Ask the assistant anything...
      </Text>

      <HStack gap={1} opacity={0.4}>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </HStack>
    </Box>
  );
}

const FEEDBACK_WIDTH = 380;
const FEEDBACK_HEIGHT = 180;

function Feedback({
  ref,
  onSuccess,
  onMessage,
}: {
  ref: React.Ref<HTMLTextAreaElement>;
  onSuccess: () => void;
  onMessage?: (msg: { source: "user" | "ai"; message: string }) => void;
}) {
  const { closeFeedback, showFeedback } = useFooter();
  const submitRef = React.useRef<HTMLButtonElement>(null);
  const [message, setMessage] = React.useState("");

  const assistantMutation = useMutation(
    trpc.communication.assistant.mutationOptions({
      onSuccess: (data) => {
        toast.success("Response received");
        onMessage?.({ source: "ai", message: data });
        onSuccess();
        setMessage("");
      },
      onError: (err) => {
        toast.error("Assistant error: " + err.message);
      },
    }),
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim()) return;
    onMessage?.({ source: "user", message: message });
    assistantMutation.mutate({ message });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      closeFeedback();
    }
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      submitRef.current?.click();
    }
  }

  return (
    <form
      className="absolute bottom-0"
      onSubmit={onSubmit}
      style={{
        width: FEEDBACK_WIDTH,
        height: FEEDBACK_HEIGHT,
        pointerEvents: showFeedback ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex h-full flex-col p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SiriOrb size="18px" />
                <span className="text-xs font-bold uppercase letter-spacing-wider color-primary">
                  Assistant
                </span>
              </div>
              <div className="flex gap-1">
                {assistantMutation.isPending ? (
                  <Text fontSize="10px" color="muted">
                    Processing...
                  </Text>
                ) : (
                  <>
                    <Kbd>⌘</Kbd>
                    <Kbd>Enter</Kbd>
                  </>
                )}
              </div>
            </div>
            <textarea
              className="h-full w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="How can I help you communicate today?"
              ref={ref}
              required
              spellCheck={false}
              disabled={assistantMutation.isPending}
            />
            <button ref={submitRef} type="submit" className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="flex h-5 items-center justify-center rounded border border-hairline bg-surface-soft px-1.5 font-sans text-[10px] font-semibold text-muted">
      {children}
    </kbd>
  );
}

export default AIInput;
