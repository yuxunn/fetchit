import { Box, VStack, Heading, Separator } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import FileUploader from "./FileUploader";
import UploadProgress from "./UploadProgress";
import FileMetadataForm from "./FileMetadataForm";
import FileTable from "./FileTable";

// Dummy data for uploaded files
const DUMMY_FILES = [
  {
    id: 1,
    fileName: "vaccination_record.pdf",
    category: "Vaccination",
    uploadedBy: "John Doe",
    dateUploaded: "2026-01-15",
  },
  {
    id: 2,
    fileName: "training_certificate.jpg",
    category: "Training",
    uploadedBy: "Jane Smith",
    dateUploaded: "2026-01-18",
  },
  {
    id: 3,
    fileName: "medical_report.docx",
    category: "Medical",
    uploadedBy: "Dr. Brown",
    dateUploaded: "2026-01-20",
  },
];

export default function UploadFiles() {
  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [category, setCategory] = useState([]);
  const [visibility, setVisibility] = useState([]);
  const [remarks, setRemarks] = useState("");

  // Files list state
  const [uploadedFiles, setUploadedFiles] = useState(DUMMY_FILES);

  const handleFileSelect = (file, validation) => {
    if (validation && !validation.valid) {
      toaster.create({
        title: "Invalid file",
        description: validation.error,
        type: "error",
      });
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toaster.create({
        title: "No file selected",
        description: "Please select a file to upload",
        type: "error",
      });
      return;
    }

    if (category.length === 0) {
      toaster.create({
        title: "Category required",
        description: "Please select a category",
        type: "error",
      });
      return;
    }

    if (visibility.length === 0) {
      toaster.create({
        title: "Visibility required",
        description: "Please select who can see this document",
        type: "error",
      });
      return;
    }

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Add to uploaded files list
          const newFile = {
            id: uploadedFiles.length + 1,
            fileName: selectedFile.name,
            category: category[0],
            uploadedBy: "Current User", // Replace with actual user
            dateUploaded: new Date().toISOString().split("T")[0],
          };
          setUploadedFiles([newFile, ...uploadedFiles]);

          // Reset form
          setSelectedFile(null);
          setCategory([]);
          setVisibility([]);
          setRemarks("");
          setUploadProgress(0);

          toaster.create({
            title: "File uploaded successfully",
            type: "success",
          });

          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleView = (file) => {
    toaster.create({
      title: "View file",
      description: `Opening ${file.fileName}`,
      type: "info",
    });
  };

  const handleDownload = (file) => {
    toaster.create({
      title: "Download started",
      description: `Downloading ${file.fileName}`,
      type: "info",
    });
  };

  const handleDelete = (file) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.id !== file.id));
    toaster.create({
      title: "File deleted",
      description: `${file.fileName} has been removed`,
      type: "success",
    });
  };

  return (
    <Box p={8} bg="bg" minH="100vh">
      <VStack gap={6} maxW="1200px" mx="auto" align="stretch">
        {/* Header */}
        <Heading size="2xl" color="fg.default">
          Upload Files
        </Heading>

        {/* File Upload Section */}
        <FileUploader
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />

        {/* Upload Progress */}
        {selectedFile && (
          <UploadProgress
            progress={uploadProgress}
            fileName={selectedFile.name}
            isUploading={isUploading}
          />
        )}

        {/* Metadata Form */}
        <FileMetadataForm
          category={category}
          setCategory={setCategory}
          visibility={visibility}
          setVisibility={setVisibility}
          remarks={remarks}
          setRemarks={setRemarks}
          onSubmit={handleSubmit}
          disabled={!selectedFile || isUploading}
        />

        {/* Separator */}
        <Separator my={4} borderColor="border.default" />

        {/* Uploaded Files Table */}
        <Heading size="xl" color="fg.default">
          Uploaded Files
        </Heading>

        <FileTable
          files={uploadedFiles}
          onView={handleView}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </VStack>
    </Box>
  );
}
