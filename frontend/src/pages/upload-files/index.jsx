import { Box, VStack, Heading, Separator } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { supabase } from "@/supabaseClient";
import FileUploader from "./FileUploader";
import UploadProgress from "./UploadProgress";
import FileMetadataForm from "./FileMetadataForm";
import FileTable from "./FileTable";

// TODO: Consider using Chakra UI's native file input for more idiomatic implementation, but this is fine as well.
// https://chakra-ui.com/docs/components/file-upload
export default function UploadFiles() {
  const queryClient = useQueryClient();

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [category, setCategory] = useState([]);
  const [visibility, setVisibility] = useState([]);
  const [remarks, setRemarks] = useState("");

  // Fetch documents from database
  const { data: uploadedFiles = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, metadata }) => {
      // Get current user from session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      const user = session.user;

      // Upload file to storage with unique filename to avoid conflicts
      const timestamp = Date.now();
      const filePath = `${user.id}/${timestamp}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Insert document metadata
      const { data, error: insertError } = await supabase
        .from("documents")
        .insert([
          {
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            category: metadata.category,
            visibility: metadata.visibility,
            remarks: metadata.remarks,
            uploaded_by: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toaster.create({
        title: "File uploaded successfully",
        type: "success",
      });

      // Reset form
      setSelectedFile(null);
      setCategory([]);
      setVisibility([]);
      setRemarks("");
      setUploadProgress(0);
      setIsUploading(false);
    },
    onError: (error) => {
      toaster.create({
        title: "Upload failed",
        description: error.message,
        type: "error",
      });
      setIsUploading(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (file) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("id", file.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toaster.create({
        title: "File deleted",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Delete failed",
        description: error.message,
        type: "error",
      });
    },
  });

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

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress while uploading
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        metadata: {
          category: category[0],
          visibility: visibility[0],
          remarks: remarks,
        },
      });
      setUploadProgress(100);
    } catch (error) {
      // Error handled by mutation
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleView = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(file.file_path, 60);

      if (error) throw error;

      window.open(data.signedUrl, "_blank");
    } catch (error) {
      toaster.create({
        title: "View failed",
        description: error.message,
        type: "error",
      });
    }
  };

  const handleDownload = async (file) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(file.file_path);

      if (error) throw error;

      // Create a blob URL and trigger download
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toaster.create({
        title: "Download started",
        description: `Downloading ${file.file_name}`,
        type: "info",
      });
    } catch (error) {
      toaster.create({
        title: "Download failed",
        description: error.message,
        type: "error",
      });
    }
  };

  const handleDelete = (file) => {
    deleteMutation.mutate(file);
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
