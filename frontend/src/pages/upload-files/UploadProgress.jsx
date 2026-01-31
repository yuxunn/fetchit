import { Box, HStack, Text, VStack } from "@chakra-ui/react";

export default function UploadProgress({ progress, fileName, isUploading }) {
  if (!isUploading && progress === 0) {
    return null;
  }

  return (
    <Box
      border="1px solid"
      borderColor="border.default"
      borderRadius="md"
      p={4}
      bg="bg.panel"
    >
      <VStack align="stretch" gap={2}>
        <HStack justify="space-between">
          <Text fontWeight="medium" color="fg.default" fontSize="sm">
            {fileName}
          </Text>
          <Text fontSize="sm" color="fg.muted">
            {progress}%
          </Text>
        </HStack>
        {/* Progress bar */}
        <Box position="relative" h="6px" bg="bg.muted" borderRadius="full" overflow="hidden">
          <Box
            position="absolute"
            top="0"
            left="0"
            h="full"
            bg="fg.default"
            borderRadius="full"
            width={`${progress}%`}
            transition="width 0.3s ease"
          />
        </Box>
        <Text fontSize="xs" color="fg.subtle">
          {isUploading ? "Uploading..." : progress === 100 ? "Upload complete" : "Ready to upload"}
        </Text>
      </VStack>
    </Box>
  );
}
