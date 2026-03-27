import {
  Box,
  VStack,
  HStack,
  Heading,
  Table,
  Badge,
  IconButton,
  Button,
  Select,
  Field,
  createListCollection,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { toaster } from "@/components/ui/toaster";
import {
  DialogRoot,
  DialogContent,
  DialogBody,
} from "@/components/ui/dialog";
import { HiEye, HiPencil } from "react-icons/hi2";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: "All", value: "all" },
    { label: "Deceased", value: "deceased" },
    { label: "Adopted", value: "adopted" },
  ],
});

const SORT_OPTIONS = createListCollection({
  items: [
    { label: "Date Archived (Newest)", value: "date_archived_desc" },
    { label: "Date Archived (Oldest)", value: "date_archived_asc" },
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
  ],
});

const EDIT_STATUS_OPTIONS = createListCollection({
  items: [
    { label: "Adopted", value: "Adopted" },
    { label: "Deceased", value: "Deceased" },
  ],
});

const UNARCHIVE_OPTIONS = createListCollection({
  items: [
    { label: "Available", value: "Available" },
    { label: "Foster Care", value: "Foster Care" },
    { label: "Urgent", value: "Urgent" },
  ],
});

const ITEMS_PER_PAGE = 10;

export default function ArchivedDogs() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState(["all"]);
  const [sortBy, setSortBy] = useState(["date_archived_desc"]);
  const [currentPage, setCurrentPage] = useState(1);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDog, setEditingDog] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDogId, setEditDogId] = useState("");
  const [editStatus, setEditStatus] = useState([]);
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const [unarchiveStatus, setUnarchiveStatus] = useState([]);

  // Fetch archived dogs
  const { data: archivedDogs = [], isLoading } = useQuery({
    queryKey: ["archivedDogs", statusFilter, sortBy],
    queryFn: async () => {
      let query = supabase.from("dogs").select("*");

      // Filter by status
      const status = statusFilter[0];
      if (status === "deceased") {
        query = query.eq("status", "Deceased");
      } else if (status === "adopted") {
        query = query.eq("status", "Adopted");
      } else {
        query = query.in("status", ["Deceased", "Adopted"]);
      }

      // Apply sorting
      const sort = sortBy[0];
      if (sort === "date_archived_desc") {
        query = query.order("adopted_at", { ascending: false });
      } else if (sort === "date_archived_asc") {
        query = query.order("adopted_at", { ascending: true });
      } else if (sort === "name_asc") {
        query = query.order("name", { ascending: true });
      } else if (sort === "name_desc") {
        query = query.order("name", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Pagination logic
  const totalPages = Math.ceil(archivedDogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDogs = archivedDogs.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  const handleView = (dog) => {
    // Navigate to dog details page using React Router
    navigate(`/dogs/${dog.id}`);
  };

  const handleEdit = (dog) => {
    setEditingDog(dog);
    setEditName(dog.name);
    setEditDogId(dog.id.toString());
    setEditStatus([dog.status]);
    setIsUnarchiving(false);
    setUnarchiveStatus([]);
    setShowEditModal(true);
  };

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ dogId, updates }) => {
      const { error } = await supabase
        .from("dogs")
        .update(updates)
        .eq("id", dogId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archivedDogs"] });
      toaster.create({
        title: "Dog updated successfully",
        type: "success",
      });
      setShowEditModal(false);
      setEditingDog(null);
    },
    onError: (error) => {
      toaster.create({
        title: "Update failed",
        description: error.message,
        type: "error",
      });
    },
  });

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toaster.create({
        title: "Name required",
        description: "Please enter a dog name",
        type: "error",
      });
      return;
    }

    const updates = {
      name: editName.trim(),
      status: isUnarchiving ? unarchiveStatus[0] : editStatus[0],
    };

    // If unarchiving, clear adopted_at
    if (isUnarchiving) {
      updates.adopted_at = null;
    }

    updateMutation.mutate({ dogId: editingDog.id, updates });
  };

  return (
    <Box p={8} bg="bg" minH="100vh">
      <VStack gap={6} maxW="1400px" mx="auto" align="stretch">
        {/* Header */}
        <Heading size="2xl" color="fg.default">
          Archived Dogs
        </Heading>

        {/* Filters and Sort */}
        <HStack justify="space-between" align="flex-end">
          {/* Filter by Status - Left */}
          <Field.Root w="250px">
            <Field.Label>Filter by Status</Field.Label>
            <Select.Root
              collection={STATUS_OPTIONS}
              size="md"
              value={statusFilter}
              onValueChange={(e) => {
                setStatusFilter(e.value);
                setCurrentPage(1); // Reset to page 1 on filter change
              }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger bg="bg.panel">
                  <Select.ValueText placeholder="Select status" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content bg="bg.panel">
                  <Select.ItemGroup>
                    {STATUS_OPTIONS.items.map((option) => (
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

          {/* Sort By - Right */}
          <Field.Root w="250px">
            <Field.Label>Sort By</Field.Label>
            <Select.Root
              collection={SORT_OPTIONS}
              size="md"
              value={sortBy}
              onValueChange={(e) => setSortBy(e.value)}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger bg="bg.panel">
                  <Select.ValueText placeholder="Select sort" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content bg="bg.panel">
                  <Select.ItemGroup>
                    {SORT_OPTIONS.items.map((option) => (
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

        {/* Table */}
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
                <Table.ColumnHeader color="fg.default" fontWeight="bold" w="60px">
                  #
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Name
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Dog ID
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Date Archived
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold" textAlign="center">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={6} textAlign="center" py={8}>
                    Loading...
                  </Table.Cell>
                </Table.Row>
              ) : currentDogs.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} textAlign="center" py={8}>
                    No archived dogs found
                  </Table.Cell>
                </Table.Row>
              ) : (
                currentDogs.map((dog, index) => (
                  <Table.Row key={dog.id} _hover={{ bg: "bg.muted" }}>
                    <Table.Cell fontWeight="medium" color="fg.default">
                      {startIndex + index + 1}
                    </Table.Cell>
                    <Table.Cell fontWeight="medium" color="fg.default">
                      {dog.name}
                    </Table.Cell>
                    <Table.Cell color="fg.muted">
                      DOG-{dog.id.toString().padStart(4, "0")}
                    </Table.Cell>
                    <Table.Cell color="fg.muted">
                      {dog.adopted_at
                        ? new Date(dog.adopted_at).toLocaleDateString()
                        : "N/A"}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={dog.status === "Adopted" ? "orange" : "gray"}
                        variant="solid"
                      >
                        {dog.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack justify="center" gap={1}>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          onClick={() => handleView(dog)}
                          aria-label="View dog"
                        >
                          <HiEye />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(dog)}
                          aria-label="Edit dog"
                          colorPalette="blue"
                        >
                          <HiPencil />
                        </IconButton>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <HStack justify="center" gap={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
              Previous
            </Button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <Box key={`ellipsis-${index}`} px={2} color="fg.muted">
                  ...
                </Box>
              ) : (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "solid" : "outline"}
                  colorPalette={currentPage === page ? "orange" : "gray"}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <FiChevronRight />
            </Button>
          </HStack>
        )}
      </VStack>

      {/* Edit Modal */}
      <DialogRoot open={showEditModal} onOpenChange={(e) => setShowEditModal(e.open)}>
        <DialogContent maxW="md">
          <DialogBody pt={6} pb={6}>
            <VStack gap={4} align="stretch">
              <Heading size="md" color="fg.default">
                Edit Dog Information
              </Heading>

              {/* Name */}
              <Field.Root>
                <Field.Label>Dog Name</Field.Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter dog name"
                  size="md"
                  bg="bg.panel"
                />
              </Field.Root>

              {/* Dog ID - Read Only */}
              <Field.Root>
                <Field.Label>Dog ID</Field.Label>
                <Input
                  value={`DOG-${editDogId.padStart(4, "0")}`}
                  readOnly
                  size="md"
                  bg="bg.muted"
                  color="fg.muted"
                />
                <Text fontSize="xs" color="fg.muted" mt={1}>
                  Dog ID cannot be changed
                </Text>
              </Field.Root>

              {/* Unarchive Toggle */}
              <Field.Root>
                <HStack gap={2}>
                  <input
                    type="checkbox"
                    checked={isUnarchiving}
                    onChange={(e) => setIsUnarchiving(e.target.checked)}
                  />
                  <Field.Label mb={0}>Unarchive this dog</Field.Label>
                </HStack>
              </Field.Root>

              {/* Status Selection */}
              <Field.Root>
                <Field.Label>Status</Field.Label>
                {isUnarchiving ? (
                  <Select.Root
                    collection={UNARCHIVE_OPTIONS}
                    size="md"
                    value={unarchiveStatus}
                    onValueChange={(e) => setUnarchiveStatus(e.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger bg="bg.panel">
                        <Select.ValueText placeholder="Select status" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content bg="bg.panel">
                        <Select.ItemGroup>
                          {UNARCHIVE_OPTIONS.items.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              <Select.ItemText>{option.label}</Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.ItemGroup>
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                ) : (
                  <Select.Root
                    collection={EDIT_STATUS_OPTIONS}
                    size="md"
                    value={editStatus}
                    onValueChange={(e) => setEditStatus(e.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger bg="bg.panel">
                        <Select.ValueText placeholder="Select status" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content bg="bg.panel">
                        <Select.ItemGroup>
                          {EDIT_STATUS_OPTIONS.items.map((option) => (
                            <Select.Item key={option.value} item={option}>
                              <Select.ItemText>{option.label}</Select.ItemText>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.ItemGroup>
                      </Select.Content>
                    </Select.Positioner>
                  </Select.Root>
                )}
              </Field.Root>

              {/* Action Buttons */}
              <HStack justify="flex-end" gap={2} mt={2}>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="md"
                  colorPalette="orange"
                  onClick={handleSaveEdit}
                  loading={updateMutation.isPending}
                >
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
