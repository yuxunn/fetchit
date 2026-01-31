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
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { supabase } from "@/supabaseClient";
import logo from "@/components/ui/logo.jpeg";

export default function SignIn({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
      toaster.create({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        type: "error",
      });
    } finally {
      setLoading(false);
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
              <Field.Root>
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
              </Field.Root>

              {/* Forgot Password */}
              <Box textAlign="right">
                <Link
                  href="#"
                  color="blue.500"
                  fontSize="sm"
                  _hover={{ textDecoration: "underline" }}
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
    </Box>
  );
}
