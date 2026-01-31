import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import { useRef } from "react";
import { HiCloudUpload } from "react-icons/hi";

const ALLOWED_FILE_TYPES = [
  'pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'gif', 'txt', 'xls', 'xlsx'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUploader({ onFileSelect, selectedFile }) {
  const inputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`
      };
    }

    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      return {
        valid: false,
        error: `File type .${fileExtension} is not supported. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
      };
    }

    return { valid: true };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const validation = validateFile(files[0]);
      if (validation.valid) {
        onFileSelect(files[0], validation);
      } else {
        onFileSelect(null, validation);
      }
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const validation = validateFile(files[0]);
      if (validation.valid) {
        onFileSelect(files[0], validation);
      } else {
        onFileSelect(null, validation);
      }
    }
    // Reset input value so the same file can trigger onChange again
    e.target.value = '';
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <Box
      border="2px dashed"
      borderColor={selectedFile ? "border.emphasized" : "border.default"}
      borderRadius="md"
      p={8}
      textAlign="center"
      cursor="pointer"
      bg={selectedFile ? "bg.muted" : "bg.panel"}
      _hover={{ bg: "bg.muted", borderColor: "border.emphasized" }}
      transition="all 0.2s"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
      <VStack gap={3}>
        <Icon fontSize="4xl" color="fg.muted">
          <HiCloudUpload />
        </Icon>
        {selectedFile ? (
          <>
            <Text fontWeight="semibold" color="fg.default">
              {selectedFile.name}
            </Text>
            <Text fontSize="sm" color="fg.muted">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Text>
            <Text fontSize="sm" color="fg.subtle">
              Click to change file
            </Text>
          </>
        ) : (
          <>
            <Text fontWeight="semibold" color="fg.default">
              Drop files here or click to browse
            </Text>
            <Text fontSize="sm" color="fg.muted">
              Supported: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, XLS, XLSX (Max 10MB)
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}
