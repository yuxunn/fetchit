import {
  Table,
  Badge,
  IconButton,
  HStack,
  Box,
  Text,
  VStack,
  Button,
  Textarea,
  createListCollection,
  Select,
  Field,
} from "@chakra-ui/react";
import { HiEye, HiTrash, HiPencil } from "react-icons/hi2";
import {
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineDocument,
  HiDownload,
} from "react-icons/hi";
import { useState } from "react";

const CATEGORY_OPTIONS = createListCollection({
  items: [
    { label: "Medical Records", value: "medical" },
    { label: "Vet Bills", value: "vet-bills" },
    { label: "Adoption Papers", value: "adoption" },
    { label: "Training Certificates", value: "training" },
    { label: "General Documents", value: "general" },
  ],
});

const VISIBILITY_OPTIONS = createListCollection({
  items: [
    { label: "Public", value: "public" },
    { label: "Administrators Only", value: "administrators-only" },
    { label: "Administrators + Volunteers", value: "administrators-volunteers" },
  ],
});

// Helper functions to get display labels
const getCategoryLabel = (value) => {
  const option = CATEGORY_OPTIONS.items.find(item => item.value === value);
  return option ? option.label : value;
};

const getVisibilityLabel = (value) => {
  const option = VISIBILITY_OPTIONS.items.find(item => item.value === value);
  return option ? option.label : value;
};

const FILE_TYPE_ICONS = {
  pdf: HiOutlineDocumentText,
  doc: HiOutlineDocument,
  docx: HiOutlineDocument,
  jpg: HiOutlinePhotograph,
  jpeg: HiOutlinePhotograph,
  png: HiOutlinePhotograph,
  default: HiOutlineDocument,
};

const FILE_TYPE_COLORS = {
  pdf: "red.500",
  doc: "blue.500",
  docx: "blue.500",
  jpg: "green.500",
  jpeg: "green.500",
  png: "green.500",
  default: "fg.muted",
};

function getFileExtension(filename) {
  return filename.split(".").pop().toLowerCase();
}

function FileTypeIcon({ filename }) {
  const ext = getFileExtension(filename);
  const Icon = FILE_TYPE_ICONS[ext] || FILE_TYPE_ICONS.default;
  const color = FILE_TYPE_COLORS[ext] || FILE_TYPE_COLORS.default;

  return <Icon fontSize="1.5rem" color={color} />;
}

export default function FileTable({ 
  files, 
  onView, 
  onDownload, 
  onDelete, 
  onEdit,
  editingFile,
  onSaveEdit,
  onCancelEdit,
}) {
  const [editCategory, setEditCategory] = useState([]);
  const [editVisibility, setEditVisibility] = useState([]);
  const [editRemarks, setEditRemarks] = useState("");

  const handleEditClick = (file) => {
    setEditCategory([file.category]);
    setEditVisibility([file.visibility]);
    setEditRemarks(file.remarks || "");
    onEdit?.(file);
  };

  const handleSave = (fileId) => {
    onSaveEdit?.(fileId, {
      category: editCategory[0],
      visibility: editVisibility[0],
      remarks: editRemarks,
    });
  };

  if (!files || files.length === 0) {
    return (
      <Box
        border="1px solid"
        borderColor="border.default"
        borderRadius="md"
        p={8}
        textAlign="center"
        bg="bg.panel"
      >
        <Text color="fg.muted">No files uploaded yet</Text>
      </Box>
    );
  }

  const isAnyFileBeingEdited = editingFile !== null;

  return (
    <Box
      border="1px solid"
      borderColor="border.default"
      borderRadius="md"
      overflow="hidden"
      bg="bg.panel"
    >
      <Table.Root size="md" variant="outline">
        {!isAnyFileBeingEdited && (
          <Table.Header bg="bg.muted">
            <Table.Row>
              <Table.ColumnHeader color="fg.default" fontWeight="bold" w="50px">
                Type
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.default" fontWeight="bold">
                File Name
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.default" fontWeight="bold">
                Category
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.default" fontWeight="bold">
                Visibility
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.default" fontWeight="bold">
                Size
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.default" fontWeight="bold">
                Date Uploaded
              </Table.ColumnHeader>
              <Table.ColumnHeader color="fg.default" fontWeight="bold" textAlign="center">
                Actions
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
        )}
        <Table.Body>
          {files.map((file) => (
            <Table.Row key={file.id} _hover={{ bg: "bg.muted" }}>
              {editingFile?.id === file.id ? (
                // Edit mode
                <Table.Cell colSpan={7}>
                  <VStack gap={4} align="stretch" p={4}>
                    <Box>
                      <Text fontWeight="bold" color="fg.default" fontSize="lg">
                        Editing: {file.file_name}
                      </Text>
                    </Box>
                    
                    <HStack gap={4}>
                      <Field.Root flex="1">
                        <Field.Label>Category</Field.Label>
                        <Select.Root
                          collection={CATEGORY_OPTIONS}
                          size="sm"
                          value={editCategory}
                          onValueChange={(e) => setEditCategory(e.value)}
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger bg="bg.panel">
                              <Select.ValueText placeholder="Select category" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Select.Positioner>
                            <Select.Content bg="bg.panel">
                              <Select.ItemGroup>
                                {CATEGORY_OPTIONS.items.map((option) => (
                                  <Select.Item key={option.value} item={option}>
                                    <Select.ItemText>{option.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.ItemGroup>
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </Field.Root>

                      <Field.Root flex="1">
                        <Field.Label>Visibility</Field.Label>
                        <Select.Root
                          collection={VISIBILITY_OPTIONS}
                          size="sm"
                          value={editVisibility}
                          onValueChange={(e) => setEditVisibility(e.value)}
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger bg="bg.panel">
                              <Select.ValueText placeholder="Select visibility" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Select.Positioner>
                            <Select.Content bg="bg.panel">
                              <Select.ItemGroup>
                                {VISIBILITY_OPTIONS.items.map((option) => (
                                  <Select.Item key={option.value} item={option}>
                                    <Select.ItemText>{option.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.ItemGroup>
                            </Select.Content>
                          </Select.Positioner>
                        </Select.Root>
                      </Field.Root>
                    </HStack>

                    <Field.Root>
                      <Field.Label>Remarks</Field.Label>
                      <Textarea
                        value={editRemarks}
                        onChange={(e) => setEditRemarks(e.target.value)}
                        size="sm"
                        rows={3}
                        bg="bg.panel"
                      />
                    </Field.Root>

                    <HStack justify="flex-end" gap={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        colorPalette="orange"
                        onClick={() => handleSave(file.id)}
                      >
                        Save
                      </Button>
                    </HStack>
                  </VStack>
                </Table.Cell>
              ) : (
                // View mode
                <>
                  <Table.Cell>
                    <FileTypeIcon filename={file.file_name} />
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontWeight="medium" color="fg.default">
                      {file.file_name}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="fg.default">
                      {getCategoryLabel(file.category)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={file.visibility === 'public' ? 'yellow' : file.visibility === 'administrators-only' ? 'red' : 'orange'}
                      variant="solid"
                    >
                      {getVisibilityLabel(file.visibility)}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="fg.muted">{(file.file_size / 1024).toFixed(2)} KB</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text color="fg.muted">{new Date(file.created_at).toLocaleDateString()}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <HStack justify="center" gap={1}>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        onClick={() => onView?.(file)}
                        aria-label="View file"
                      >
                        <HiEye />
                      </IconButton>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        onClick={() => onDownload?.(file)}
                        aria-label="Download file"
                      >
                        <HiDownload />
                      </IconButton>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditClick(file)}
                        aria-label="Edit file"
                        colorPalette="blue"
                      >
                        <HiPencil />
                      </IconButton>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete?.(file)}
                        aria-label="Delete file"
                        colorPalette="red"
                      >
                        <HiTrash />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
