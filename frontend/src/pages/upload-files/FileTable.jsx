import {
  Table,
  Badge,
  IconButton,
  HStack,
  Box,
  Text,
} from "@chakra-ui/react";
import { HiEye, HiTrash } from "react-icons/hi2";
import {
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineDocument,
  HiDownload,
} from "react-icons/hi";

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

export default function FileTable({ files, onView, onDownload, onDelete }) {
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

  return (
    <Box
      border="1px solid"
      borderColor="border.default"
      borderRadius="md"
      overflow="hidden"
      bg="bg.panel"
    >
      <Table.Root size="md" variant="outline">
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
              Uploaded By
            </Table.ColumnHeader>
            <Table.ColumnHeader color="fg.default" fontWeight="bold">
              Date Uploaded
            </Table.ColumnHeader>
            <Table.ColumnHeader color="fg.default" fontWeight="bold" textAlign="center">
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {files.map((file) => (
            <Table.Row key={file.id} _hover={{ bg: "bg.muted" }}>
              <Table.Cell>
                <FileTypeIcon filename={file.fileName} />
              </Table.Cell>
              <Table.Cell>
                <Text fontWeight="medium" color="fg.default">
                  {file.fileName}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  colorPalette="gray"
                  variant="solid"
                >
                  {file.category}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text color="fg.muted">{file.uploadedBy}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text color="fg.muted">{file.dateUploaded}</Text>
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
                    onClick={() => onDelete?.(file)}
                    aria-label="Delete file"
                    colorPalette="red"
                  >
                    <HiTrash />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
