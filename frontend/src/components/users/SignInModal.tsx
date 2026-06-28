import { Alert, Button, Modal, Stack, Text } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { isSupabaseConfigured } from "../../api/supabaseClient";
import { signInWithProvider } from "../../auth/authApi";
import type { AuthProviderName } from "../../auth/types";
import MagicHoverSurface from "../layout/MagicHoverSurface";
import PrivacyPolicy from "./PrivacyPolicy";

const MotionPresence = AnimatePresence as unknown as ComponentType<{
  children: ReactNode;
  initial?: boolean;
  mode?: "sync" | "popLayout" | "wait";
}>;

type Props = {
  opened: boolean;
  onClose: () => void;
};

const providers: Array<{
  provider: AuthProviderName;
  label: string;
  icon: ReactNode;
  className: string;
}> = [
  { provider: "google", label: "Continue with Google", icon: <FaGoogle />, className: "auth-provider-google" },
  { provider: "discord", label: "Continue with Discord", icon: <FaDiscord />, className: "auth-provider-discord" },
  { provider: "github", label: "Continue with GitHub", icon: <FaGithub />, className: "auth-provider-github" },
];

export default function SignInModal({ opened, onClose }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<AuthProviderName | null>(null);
  const [view, setView] = useState<"signin" | "privacy">("signin");

  // Always reopen on the sign-in view.
  useEffect(() => {
    if (opened) {
      setView("signin");
    }
  }, [opened]);

  const handleSignIn = async (provider: AuthProviderName) => {
    setError(null);
    setLoadingProvider(provider);
    try {
      await signInWithProvider(provider);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to start sign in.");
      setLoadingProvider(null);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      className="auth-modal"
      withCloseButton={false}
      padding={0}
      radius="sm"
      overlayProps={{ backgroundOpacity: 0.5, blur: 8 }}
      transitionProps={{ transition: "pop", duration: 180 }}
    >
      <MagicHoverSurface className="auth-modal-surface">
      <button type="button" className="auth-modal-close" aria-label="Close sign in modal" onClick={onClose}>
        <FiX />
      </button>
      <MotionPresence mode="wait" initial={false}>
        {view === "signin" ? (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Stack gap="md" className="auth-modal-body">
              <Text className="auth-modal-label">Sign in to make predictions and compete with others!</Text>
              {!isSupabaseConfigured ? (
                <Alert color="yellow" icon={<FiAlertTriangle />}>
                  Supabase auth is not configured for this build.
                </Alert>
              ) : null}
              {error ? (
                <Alert color="red" icon={<FiAlertTriangle />}>
                  {error}
                </Alert>
              ) : null}
              <Stack gap="sm">
                {providers.map((item) => (
                  <Button
                    key={item.provider}
                    variant="filled"
                    leftSection={item.icon}
                    className={`auth-provider-button ${item.className}`}
                    disabled={!isSupabaseConfigured}
                    loading={loadingProvider === item.provider}
                    onClick={() => void handleSignIn(item.provider)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
              <button
                type="button"
                className="auth-modal-privacy-link"
                onClick={() => setView("privacy")}
              >
                Privacy policy
              </button>
            </Stack>
          </motion.div>
        ) : (
          <motion.div
            key="privacy"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <PrivacyPolicy onBack={() => setView("signin")} />
          </motion.div>
        )}
      </MotionPresence>
      </MagicHoverSurface>
    </Modal>
  );
}
