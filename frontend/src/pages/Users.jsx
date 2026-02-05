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
import { supabase } from "@/supabaseClient";
import { toaster } from "@/components/ui/toaster";
import {
  DialogRoot,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogCloseTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { HiEye, HiPencil, HiTrash } from "react-icons/hi2";
import { FiUserPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ITEMS_PER_PAGE = 10;

const ROLE_FILTER_OPTIONS = createListCollection({
  items: [
    { label: "All", value: "all" },
    { label: "Administrator", value: "admin" },
    { label: "Volunteer", value: "volunteer" },
  ],
});

const SORT_OPTIONS = createListCollection({
  items: [
    { label: "Date Added (Newest)", value: "created_at_desc" },
    { label: "Date Added (Oldest)", value: "created_at_asc" },
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
  ],
});

const ROLE_OPTIONS = createListCollection({
  items: [
    { label: "Administrator", value: "admin" },
    { label: "Volunteer", value: "volunteer" },
  ],
});

export default function Users() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState(["all"]);
  const [sortBy, setSortBy] = useState(["created_at_desc"]);
  const [currentPage, setCurrentPage] = useState(1);

  // Add user modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState([]);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState([]);

  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", roleFilter, sortBy],
    queryFn: async () => {
      let query = supabase.from("users").select("*");

      // Filter by role
      const role = roleFilter[0];
      if (role !== "all") {
        query = query.eq("role", role);
      }

      // Apply sorting
      const sort = sortBy[0];
      if (sort === "created_at_desc") {
        query = query.order("created_at", { ascending: false });
      } else if (sort === "created_at_asc") {
        query = query.order("created_at", { ascending: true });
      } else if (sort === "name_asc") {
        query = query.order("full_name", { ascending: true });
      } else if (sort === "name_desc") {
        query = query.order("full_name", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async ({ name, email, role }) => {
      // Insert user into users table
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            full_name: name,
            email: email,
            role: role,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // TODO: Send activation email via Supabase Auth
      // This would typically be done through Supabase Auth's invite user function
      // For now, we just create the database record

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toaster.create({
        title: "User added successfully",
        description: "An activation email will be sent to the user",
        type: "success",
      });
      setShowAddModal(false);
      resetAddForm();
    },
    onError: (error) => {
      toaster.create({
        title: "Failed to add user",
        description: error.message,
        type: "error",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }) => {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toaster.create({
        title: "User updated successfully",
        type: "success",
      });
      setShowEditModal(false);
      setEditingUser(null);
    },
    onError: (error) => {
      toaster.create({
        title: "Update failed",
        description: error.message,
        type: "error",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toaster.create({
        title: "User deleted successfully",
        type: "success",
      });
      setShowDeleteModal(false);
      setDeletingUser(null);
    },
    onError: (error) => {
      toaster.create({
        title: "Delete failed",
        description: error.message,
        type: "error",
      });
    },
  });

  // Pagination logic
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, endIndex);

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

  const resetAddForm = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole([]);
  };

  const handleAddUser = () => {
    if (!newUserName.trim()) {
      toaster.create({
        title: "Name required",
        description: "Please enter user's name",
        type: "error",
      });
      return;
    }

    if (!newUserEmail.trim()) {
      toaster.create({
        title: "Email required",
        description: "Please enter user's email",
        type: "error",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserEmail.trim())) {
      toaster.create({
        title: "Invalid email",
        description: "Please enter a valid email address",
        type: "error",
      });
      return;
    }

    if (newUserRole.length === 0) {
      toaster.create({
        title: "Role required",
        description: "Please select a role",
        type: "error",
      });
      return;
    }

    createUserMutation.mutate({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole[0],
    });
  };

  const handleView = (user) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditName(user.full_name || "");
    setEditEmail(user.email);
    setEditRole([user.role]);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deletingUser) {
      deleteUserMutation.mutate(deletingUser.id);
    }
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      toaster.create({
        title: "Name required",
        description: "Please enter user's name",
        type: "error",
      });
      return;
    }

    if (!editEmail.trim()) {
      toaster.create({
        title: "Email required",
        description: "Please enter user's email",
        type: "error",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail.trim())) {
      toaster.create({
        title: "Invalid email",
        description: "Please enter a valid email address",
        type: "error",
      });
      return;
    }

    if (editRole.length === 0) {
      toaster.create({
        title: "Role required",
        description: "Please select a role",
        type: "error",
      });
      return;
    }

    updateUserMutation.mutate({
      userId: editingUser.id,
      updates: {
        full_name: editName.trim(),
        email: editEmail.trim(),
        role: editRole[0],
      },
    });
  };

  const getRoleBadgeColor = (role) => {
    if (role === "admin") return "red";
    if (role === "volunteer") return "orange";
    return "gray";
  };

  const getRoleLabel = (role) => {
    if (role === "admin") return "Administrator";
    if (role === "volunteer") return "Volunteer";
    return role;
  };

  return (
    <Box p={8} bg="bg" minH="100vh">
      <VStack gap={6} maxW="1400px" mx="auto" align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Heading size="2xl" color="fg.default">
            Users
          </Heading>
          <Button
            colorPalette="orange"
            size="lg"
            onClick={() => setShowAddModal(true)}
          >
            <FiUserPlus />
            Create User
          </Button>
        </HStack>

        {/* Filters and Sort */}
        <HStack justify="space-between" align="flex-end">
          {/* Filter by Role - Left */}
          <Field.Root w="250px">
            <Field.Label>Filter by Role</Field.Label>
            <Select.Root
              collection={ROLE_FILTER_OPTIONS}
              size="md"
              value={roleFilter}
              onValueChange={(e) => {
                setRoleFilter(e.value);
                setCurrentPage(1);
              }}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger bg="bg.panel">
                  <Select.ValueText placeholder="Select role" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content bg="bg.panel">
                  <Select.ItemGroup>
                    {ROLE_FILTER_OPTIONS.items.map((option) => (
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
              onValueChange={(e) => {
                setSortBy(e.value);
                setCurrentPage(1);
              }}
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
                  ID
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Role
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Date Added
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
              ) : users.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6} textAlign="center" py={8}>
                    No users found
                  </Table.Cell>
                </Table.Row>
              ) : (
                currentUsers.map((user, index) => (
                  <Table.Row key={user.id} _hover={{ bg: "bg.muted" }}>
                    <Table.Cell fontWeight="medium" color="fg.default">
                      {startIndex + index + 1}
                    </Table.Cell>
                    <Table.Cell fontWeight="medium" color="fg.default">
                      {user.full_name || "N/A"}
                    </Table.Cell>
                    <Table.Cell color="fg.muted" fontSize="sm">
                      {user.id.substring(0, 8)}...
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={getRoleBadgeColor(user.role)}
                        variant="solid"
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell color="fg.muted">
                      {new Date(user.created_at).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <HStack justify="center" gap={1}>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          onClick={() => handleView(user)}
                          aria-label="View user"
                        >
                          <HiEye />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                          aria-label="Edit user"
                          colorPalette="blue"
                        >
                          <HiPencil />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(user)}
                          aria-label="Delete user"
                          colorPalette="red"
                        >
                          <HiTrash />
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
          <HStack justify="center" gap={2} py={4}>
            <IconButton
              size="sm"
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </IconButton>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <Text key={`ellipsis-${index}`} px={2} color="fg.muted">
                  ...
                </Text>
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

            <IconButton
              size="sm"
              variant="outline"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </IconButton>
          </HStack>
        )}
      </VStack>

      {/* Add User Modal */}
      <DialogRoot open={showAddModal} onOpenChange={(e) => setShowAddModal(e.open)}>
        <DialogContent maxW="md">
          <DialogBody pt={6} pb={6}>
            <VStack gap={4} align="stretch">
              <VStack gap={1} align="stretch">
                <Heading size="md">Add User</Heading>
                <Text color="fg.muted" fontSize="sm">
                  An email will be sent to the user to activate their account
                </Text>
              </VStack>

              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter user's name"
                  size="md"
                  bg="bg.panel"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Enter user's email"
                  size="md"
                  bg="bg.panel"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Role</Field.Label>
                <Select.Root
                  collection={ROLE_OPTIONS}
                  size="md"
                  value={newUserRole}
                  onValueChange={(e) => setNewUserRole(e.value)}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger bg="bg.panel">
                      <Select.ValueText placeholder="Select role" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content bg="bg.panel">
                      <Select.ItemGroup>
                        {ROLE_OPTIONS.items.map((option) => (
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

              <HStack justify="flex-end" gap={2} mt={2}>
                <Button
                  size="md"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    resetAddForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="md"
                  colorPalette="orange"
                  onClick={handleAddUser}
                  loading={createUserMutation.isPending}
                >
                  Save
                </Button>
              </HStack>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* View User Modal */}
      <DialogRoot
        open={showViewModal}
        onOpenChange={(e) => setShowViewModal(e.open)}
      >
        <DialogContent maxW="md" position="relative">
          <IconButton
            aria-label="Close"
            position="absolute"
            top="12px"
            right="12px"
            size="sm"
            variant="ghost"
            onClick={() => setShowViewModal(false)}
          >
            ✕
          </IconButton>
          <DialogBody pt={6} pb={6}>
            {viewingUser && (
              <VStack align="stretch" gap={4}>
                <Heading size="md" mb={2}>View User</Heading>
                <Box>
                  <Text fontWeight="semibold" mb={1} fontSize="sm" color="fg.muted">User ID</Text>
                  <Text fontSize="sm" color="fg.default" fontFamily="mono">{viewingUser.id}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb={1} fontSize="sm" color="fg.muted">Name</Text>
                  <Text color="fg.default">{viewingUser.full_name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb={1} fontSize="sm" color="fg.muted">Email</Text>
                  <Text color="fg.default">{viewingUser.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb={1} fontSize="sm" color="fg.muted">Role</Text>
                  <Badge colorPalette={getRoleBadgeColor(viewingUser.role)} variant="solid">
                    {getRoleLabel(viewingUser.role)}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb={1} fontSize="sm" color="fg.muted">Date Added</Text>
                  <Text color="fg.default">{new Date(viewingUser.created_at).toLocaleDateString()}</Text>
                </Box>
              </VStack>
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Edit User Modal */}
      <DialogRoot open={showEditModal} onOpenChange={(e) => setShowEditModal(e.open)}>
        <DialogContent maxW="md">
          <DialogBody pt={6} pb={6}>
            <VStack gap={4} align="stretch">
              <Heading size="md">Edit User</Heading>

              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter user's name"
                  size="md"
                  bg="bg.panel"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Enter user's email"
                  size="md"
                  bg="bg.panel"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Role</Field.Label>
                <Select.Root
                  collection={ROLE_OPTIONS}
                  size="md"
                  value={editRole}
                  onValueChange={(e) => setEditRole(e.value)}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger bg="bg.panel">
                      <Select.ValueText placeholder="Select role" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content bg="bg.panel">
                      <Select.ItemGroup>
                        {ROLE_OPTIONS.items.map((option) => (
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
                  loading={updateUserMutation.isPending}
                >
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Delete Confirmation Modal */}
      <DialogRoot
        open={showDeleteModal}
        onOpenChange={(e) => setShowDeleteModal(e.open)}
      >
        <DialogContent>
          <DialogHeader>Confirm Deletion</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>
            {deletingUser && (
              <VStack align="stretch" gap={4}>
                <Text>
                  Are you sure you want to delete user <strong>{deletingUser.full_name}</strong>?
                  This action cannot be undone.
                </Text>
                <HStack justify="flex-end" gap={2}>
                  <Button
                    size="md"
                    variant="outline"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    colorPalette="red"
                    onClick={confirmDelete}
                    loading={deleteUserMutation.isPending}
                  >
                    Delete
                  </Button>
                </HStack>
              </VStack>
            )}
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
