import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Image,
  Link,
  Field,
  IconButton,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/supabaseClient";
import logo from "@/components/ui/logo.jpeg";

export default function SignIn({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toaster.create({
        title: "Login successful",
        description: "Welcome back!",
        type: "success",
      });

      onSignIn(data.user);
    } catch (error) {
      setErrorMessage("Login details incorrect, please try again.");
      toaster.create({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // Validate email is not empty
    if (!resetEmail || resetEmail.trim() === "") {
      toaster.create({
        title: "Email required",
        description: "Please enter your email address",
        type: "error",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail.trim())) {
      toaster.create({
        title: "Invalid email",
        description: "Please enter a valid email address",
        type: "error",
      });
      return;
    }

    setResettingPassword(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toaster.create({
        title: "Password reset email sent",
        description: "Please check your email for the reset link",
        type: "success",
      });

      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      toaster.create({
        title: "Reset failed",
        description: error.message || "Failed to send reset email",
        type: "error",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg"
      p={4}
    >
      <Box
        maxW="md"
        w="full"
        p={8}
      >
        <VStack gap={6} align="stretch">
          {/* Logo */}
          <Box textAlign="center">
            <Image
              src={logo}
              alt="Action for Singapore Dogs Logo"
              maxH="120px"
              mx="auto"
              objectFit="contain"
            />
          </Box>

          {/* Heading and Subtext */}
          <VStack gap={2} textAlign="center">
            <Heading size="lg" color="orange.500">
              Welcome to Action for Singapore Dogs' Dashboard System
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              Please enter your login details below to access the dashboard
            </Text>
          </VStack>

          {/* Login Form */}
          <Box as="form" onSubmit={handleSubmit}>
            <VStack gap={4} align="stretch">
              {/* Email Field */}
              <Field.Root>
                <Field.Label color="fg.default">Email Address</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                  bg="bg.panel"
                  borderColor="border.default"
                  _focus={{ borderColor: "border.emphasized" }}
                  required
                />
              </Field.Root>

              {/* Password Field */}
              <Field.Root invalid={!!errorMessage}>
                <Field.Label color="fg.default">Password</Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  size="lg"
                  bg="bg.panel"
                  borderColor="border.default"
                  _focus={{ borderColor: "border.emphasized" }}
                  required
                />
                {errorMessage && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {errorMessage}
                  </Text>
                )}
              </Field.Root>

              {/* Forgot Password */}
              <Box textAlign="right">
                <Link
                  href="#"
                  color="blue.500"
                  fontSize="sm"
                  _hover={{ textDecoration: "underline" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              {/* Login Button */}
              <Button
                type="submit"
                colorPalette="orange"
                size="lg"
                w="full"
                mt={2}
                loading={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* Forgot Password Modal */}
      <DialogRoot
        open={showForgotPassword}
        onOpenChange={(e) => setShowForgotPassword(e.open)}
      >
        <DialogContent maxW="md" position="relative">
          <IconButton
            aria-label="Close"
            position="absolute"
            top="12px"
            right="12px"
            size="sm"
            variant="ghost"
            onClick={() => setShowForgotPassword(false)}
          >
            ✕
          </IconButton>
          <DialogBody pt={6} pb={6}>
            <VStack gap={4} align="stretch">
              <VStack gap={1} align="stretch">
                <Heading size="md">Forgot your password?</Heading>
                <Text color="fg.muted" fontSize="sm">
                  Enter your email address to reset your password
                </Text>
              </VStack>
              
              <Field.Root>
                <Field.Label>Email Address</Field.Label>
                <Input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                  bg="bg.panel"
                />
              </Field.Root>
              
              <Button
                colorPalette="orange"
                size="lg"
                w="full"
                loading={resettingPassword}
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
