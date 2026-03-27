import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  Container,
  Card,
  Field,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { toaster } from "@/components/ui/toaster";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Check if we have a valid recovery session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        toaster.create({
          title: "Invalid or expired link",
          description: "Please request a new password reset email",
          type: "error",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      toaster.create({
        title: "Password required",
        description: "Please enter a new password",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      toaster.create({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toaster.create({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toaster.create({
        title: "Password updated successfully",
        description: "Redirecting to sign in...",
        type: "success",
      });

      // Sign out and redirect to sign in page
      await supabase.auth.signOut();
      
      // Force reload to clear any auth state
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      toaster.create({
        title: "Failed to update password",
        description: error.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <Container maxW="md" py={20}>
        <Card.Root>
          <Card.Body>
            <VStack gap={4}>
              <Heading size="lg">Validating link...</Heading>
              <Text>Please wait while we verify your reset link.</Text>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Container>
    );
  }

  return (
    <Container maxW="md" py={20}>
      <Card.Root>
        <Card.Header>
          <Heading size="lg">Reset Your Password</Heading>
          <Text color="gray.600" mt={2}>
            Enter your new password below
          </Text>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit}>
            <VStack gap={4} align="stretch">
              <Field.Root>
                <Field.Label>New Password</Field.Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoFocus
                />
                <Field.HelperText>
                  Must be at least 6 characters long
                </Field.HelperText>
              </Field.Root>

              <Field.Root>
                <Field.Label>Confirm Password</Field.Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </Field.Root>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                loading={loading}
                mt={4}
              >
                Update Password
              </Button>
            </VStack>
          </form>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}
