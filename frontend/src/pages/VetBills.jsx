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
  Grid,
  Card,
  Stat,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";
import { toaster } from "@/components/ui/toaster";
import {
  DialogRoot,
  DialogContent,
  DialogBody,
} from "@/components/ui/dialog";
import { HiPencil, HiPlus } from "react-icons/hi2";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: "Critical", value: "Critical" },
    { label: "Stable", value: "Stable" },
  ],
});

const PAYMENT_STATUS_OPTIONS = createListCollection({
  items: [
    { label: "Paid", value: "Paid" },
    { label: "Unpaid", value: "Unpaid" },
  ],
});

const CATEGORY_OPTIONS = createListCollection({
  items: [
    { label: "Surgery", value: "Surgery" },
    { label: "Vaccination", value: "Vaccination" },
    { label: "Checkup", value: "Checkup" },
    { label: "Emergency", value: "Emergency" },
    { label: "Medication", value: "Medication" },
    { label: "Dental", value: "Dental" },
    { label: "General", value: "General" },
  ],
});

const SORT_OPTIONS = createListCollection({
  items: [
    { label: "Date (Newest)", value: "date_desc" },
    { label: "Date (Oldest)", value: "date_asc" },
    { label: "Cost (Highest)", value: "cost_desc" },
    { label: "Cost (Lowest)", value: "cost_asc" },
    { label: "Dog Name (A-Z)", value: "name_asc" },
    { label: "Dog Name (Z-A)", value: "name_desc" },
  ],
});

const ITEMS_PER_PAGE = 10;

export default function VetBills() {
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState(["date_desc"]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDogId, setNewDogId] = useState("");
  const [newTreatment, setNewTreatment] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newStatus, setNewStatus] = useState(["Stable"]);
  const [newPaymentStatus, setNewPaymentStatus] = useState(["Unpaid"]);
  const [newCategory, setNewCategory] = useState(["General"]);
  const [newDescription, setNewDescription] = useState("");

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [editDogId, setEditDogId] = useState("");
  const [editTreatment, setEditTreatment] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStatus, setEditStatus] = useState([]);
  const [editPaymentStatus, setEditPaymentStatus] = useState([]);
  const [editCategory, setEditCategory] = useState([]);
  const [editDescription, setEditDescription] = useState("");

  // Status popup state
  const [showStatusPopup, setShowStatusPopup] = useState(false);
  const [statusType, setStatusType] = useState("success");
  const [statusMessage, setStatusMessage] = useState("");

  // Fetch vet bills with dog names
  const { data: vetBills = [], isLoading } = useQuery({
    queryKey: ["vetBills", sortBy],
    queryFn: async () => {
      let query = supabase
        .from("vet_bills")
        .select(`
          *,
          dogs (
            name,
            id
          )
        `);

      // Apply sorting
      const sort = sortBy[0];
      if (sort === "date_desc") {
        query = query.order("bill_date", { ascending: false });
      } else if (sort === "date_asc") {
        query = query.order("bill_date", { ascending: true });
      } else if (sort === "cost_desc") {
        query = query.order("amount", { ascending: false });
      } else if (sort === "cost_asc") {
        query = query.order("amount", { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all dogs for dropdown
  const { data: dogs = [] } = useQuery({
    queryKey: ["dogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dogs")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Create vet bill mutation
  const createBillMutation = useMutation({
    mutationFn: async (billData) => {
      const { data, error } = await supabase
        .from("vet_bills")
        .insert([billData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vetBills"] });
      setShowAddModal(false);
      resetAddForm();
      setStatusType("success");
      setStatusMessage("Vet bill added successfully!");
      setShowStatusPopup(true);
    },
    onError: (error) => {
      setStatusType("error");
      setStatusMessage(error.message || "Failed to add vet bill. Please try again.");
      setShowStatusPopup(true);
    },
  });

  // Update vet bill mutation
  const updateBillMutation = useMutation({
    mutationFn: async ({ billId, updates }) => {
      const { error } = await supabase
        .from("vet_bills")
        .update(updates)
        .eq("id", billId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vetBills"] });
      setShowEditModal(false);
      setEditingBill(null);
      setStatusType("success");
      setStatusMessage("Vet bill updated successfully!");
      setShowStatusPopup(true);
    },
    onError: (error) => {
      setStatusType("error");
      setStatusMessage(error.message || "Failed to update vet bill. Please try again.");
      setShowStatusPopup(true);
    },
  });

  // Filter by search keyword
  const filteredBills = useMemo(() => {
    if (!searchKeyword.trim()) return vetBills;
    
    const keyword = searchKeyword.toLowerCase();
    return vetBills.filter(
      (bill) =>
        bill.dogs?.name?.toLowerCase().includes(keyword) ||
        bill.treatment_name?.toLowerCase().includes(keyword) ||
        bill.dog_id?.toString().includes(keyword)
    );
  }, [vetBills, searchKeyword]);

  // Sort by name if needed (since Supabase can't sort by joined table)
  const sortedBills = useMemo(() => {
    const sort = sortBy[0];
    if (sort === "name_asc") {
      return [...filteredBills].sort((a, b) =>
        (a.dogs?.name || "").localeCompare(b.dogs?.name || "")
      );
    } else if (sort === "name_desc") {
      return [...filteredBills].sort((a, b) =>
        (b.dogs?.name || "").localeCompare(a.dogs?.name || "")
      );
    }
    return filteredBills;
  }, [filteredBills, sortBy]);

  // Calculate overview statistics
  const stats = useMemo(() => {
    const total = sortedBills.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
    const outstanding = sortedBills
      .filter((bill) => bill.payment_status === "Unpaid")
      .reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
    const criticalDogs = new Set(
      sortedBills.filter((bill) => bill.status === "Critical").map((bill) => bill.dog_id)
    ).size;
    const uniqueDogs = new Set(sortedBills.map((bill) => bill.dog_id)).size;
    const avgCost = uniqueDogs > 0 ? total / uniqueDogs : 0;

    return { total, outstanding, criticalDogs, avgCost };
  }, [sortedBills]);

  // Calculate quarterly expenses
  const quarterlyData = useMemo(() => {
    const quarters = {};
    sortedBills.forEach((bill) => {
      const date = new Date(bill.bill_date);
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const key = `${year} Q${quarter}`;
      
      if (!quarters[key]) {
        quarters[key] = 0;
      }
      quarters[key] += parseFloat(bill.amount || 0);
    });
    
    return Object.entries(quarters)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8); // Last 8 quarters
  }, [sortedBills]);

  // Calculate category breakdown for selected quarter
  const categoryBreakdown = useMemo(() => {
    if (!selectedQuarter) return [];
    
    const categories = {};
    sortedBills.forEach((bill) => {
      const date = new Date(bill.bill_date);
      const year = date.getFullYear();
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const key = `${year} Q${quarter}`;
      
      if (key === selectedQuarter) {
        const category = bill.category || "General";
        if (!categories[category]) {
          categories[category] = 0;
        }
        categories[category] += parseFloat(bill.amount || 0);
      }
    });
    
    return Object.entries(categories)
      .filter(([, amount]) => amount > 0)
      .sort(([, a], [, b]) => b - a);
  }, [sortedBills, selectedQuarter]);

  // Pagination logic
  const totalPages = Math.ceil(sortedBills.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBills = sortedBills.slice(startIndex, endIndex);

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
    setNewDogId("");
    setNewTreatment("");
    setNewAmount("");
    setNewDate("");
    setNewStatus(["Stable"]);
    setNewPaymentStatus(["Unpaid"]);
    setNewCategory(["General"]);
    setNewDescription("");
  };

  const handleAddBill = () => {
    if (!newDogId) {
      toaster.create({
        title: "Dog required",
        description: "Please select a dog",
        type: "error",
      });
      return;
    }

    if (!newTreatment.trim()) {
      toaster.create({
        title: "Treatment name required",
        description: "Please enter treatment name",
        type: "error",
      });
      return;
    }

    if (!newAmount || parseFloat(newAmount) <= 0) {
      toaster.create({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    if (!newDate) {
      toaster.create({
        title: "Date required",
        description: "Please select a date",
        type: "error",
      });
      return;
    }

    createBillMutation.mutate({
      dog_id: parseInt(newDogId),
      treatment_name: newTreatment.trim(),
      amount: parseFloat(newAmount),
      bill_date: newDate,
      status: newStatus[0],
      payment_status: newPaymentStatus[0],
      category: newCategory[0],
      description: newDescription.trim() || null,
    });
  };

  const handleEdit = (bill) => {
    setEditingBill(bill);
    setEditDogId(bill.dog_id.toString());
    setEditTreatment(bill.treatment_name || "");
    setEditAmount(bill.amount.toString());
    setEditDate(bill.bill_date);
    setEditStatus([bill.status || "Stable"]);
    setEditPaymentStatus([bill.payment_status || "Unpaid"]);
    setEditCategory([bill.category || "General"]);
    setEditDescription(bill.description || "");
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editDogId) {
      toaster.create({
        title: "Dog required",
        description: "Please select a dog",
        type: "error",
      });
      return;
    }

    if (!editTreatment.trim()) {
      toaster.create({
        title: "Treatment name required",
        description: "Please enter treatment name",
        type: "error",
      });
      return;
    }

    if (!editAmount || parseFloat(editAmount) <= 0) {
      toaster.create({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        type: "error",
      });
      return;
    }

    if (!editDate) {
      toaster.create({
        title: "Date required",
        description: "Please select a date",
        type: "error",
      });
      return;
    }

    updateBillMutation.mutate({
      billId: editingBill.id,
      updates: {
        dog_id: parseInt(editDogId),
        treatment_name: editTreatment.trim(),
        amount: parseFloat(editAmount),
        bill_date: editDate,
        status: editStatus[0],
        payment_status: editPaymentStatus[0],
        category: editCategory[0],
        description: editDescription.trim() || null,
      },
    });
  };

  const getStatusBadgeColor = (status) => {
    return status === "Critical" ? "red" : "green";
  };

  const getPaymentBadgeColor = (paymentStatus) => {
    return paymentStatus === "Paid" ? "green" : "orange";
  };

  return (
    <Box p={8} bg="bg" minH="100vh">
      <VStack gap={6} maxW="1400px" mx="auto" align="stretch">
        {/* Header */}
        <Heading size="2xl" color="fg.default">
          Vet Bills Management
        </Heading>

        {/* Overview Cards */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <Card.Root bg="green.50" borderColor="green.500" borderWidth="2px">
            <Card.Body>
              <Stat.Root>
                <Stat.Label color="green.700" fontWeight="semibold">Total Vet Bills</Stat.Label>
                <Stat.ValueText fontSize="2xl" fontWeight="bold" color="green.600">
                  ${stats.total.toFixed(2)}
                </Stat.ValueText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg="yellow.50" borderColor="yellow.500" borderWidth="2px">
            <Card.Body>
              <Stat.Root>
                <Stat.Label color="yellow.800" fontWeight="semibold">Outstanding Bills</Stat.Label>
                <Stat.ValueText fontSize="2xl" fontWeight="bold" color="yellow.700">
                  ${stats.outstanding.toFixed(2)}
                </Stat.ValueText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg="red.50" borderColor="red.500" borderWidth="2px">
            <Card.Body>
              <Stat.Root>
                <Stat.Label color="red.700" fontWeight="semibold">Critical Dogs</Stat.Label>
                <Stat.ValueText fontSize="2xl" fontWeight="bold" color="red.600">
                  {stats.criticalDogs}
                </Stat.ValueText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root bg="orange.50" borderColor="orange.400" borderWidth="2px">
            <Card.Body>
              <Stat.Root>
                <Stat.Label color="orange.700" fontWeight="semibold">Average Cost / Dog</Stat.Label>
                <Stat.ValueText fontSize="2xl" fontWeight="bold" color="orange.600">
                  ${stats.avgCost.toFixed(2)}
                </Stat.ValueText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>
        </Grid>

        {/* Graphs */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {/* Quarterly Vet Expense */}
          <Card.Root bg="bg.panel">
            <Card.Body>
              <VStack align="stretch" gap={4}>
                <Heading size="md">Quarterly Vet Expense</Heading>
                <Box h="300px" position="relative">
                  {quarterlyData.length === 0 ? (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                      <Text color="fg.muted">No data available</Text>
                    </Box>
                  ) : (
                    <HStack h="100%" align="flex-end" gap={2} pb={8}>
                      {quarterlyData.map(([quarter, amount]) => {
                        const maxAmount = Math.max(...quarterlyData.map(([, amt]) => amt));
                        const heightPercent = maxAmount > 0 ? Math.max(10, (amount / maxAmount) * 100) : 10;
                        const isSelected = quarter === selectedQuarter;
                        
                        return (
                          <VStack
                            key={quarter}
                            flex={1}
                            gap={1}
                            cursor="pointer"
                            onClick={() => setSelectedQuarter(quarter)}
                            _hover={{ opacity: 0.8 }}
                            h="100%"
                            justify="flex-end"
                          >
                            <Box
                              bg={isSelected ? "orange.500" : "blue.500"}
                              h={`${heightPercent}%`}
                              minH="40px"
                              w="100%"
                              borderRadius="md"
                              transition="all 0.2s"
                            />
                            <Text fontSize="xs" color="fg.muted" textAlign="center">
                              {quarter}
                            </Text>
                            <Text fontSize="xs" fontWeight="semibold" color="fg.default">
                              ${amount.toFixed(0)}
                            </Text>
                          </VStack>
                        );
                      })}
                    </HStack>
                  )}
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>

          {/* Category Breakdown */}
          <Card.Root bg="bg.panel">
            <Card.Body>
              <VStack align="stretch" gap={4}>
                <Heading size="md">
                  Expense Breakdown by Category
                  {selectedQuarter && (
                    <Text as="span" fontSize="sm" color="fg.muted" ml={2}>
                      ({selectedQuarter})
                    </Text>
                  )}
                </Heading>
                <Box h="300px" position="relative">
                  {!selectedQuarter ? (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                      <Text color="fg.muted">Click on a quarter to view breakdown</Text>
                    </Box>
                  ) : categoryBreakdown.length === 0 ? (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                      <Text color="fg.muted">No data for selected quarter</Text>
                    </Box>
                  ) : (
                    <HStack h="100%" align="center" gap={8}>
                      {/* Pie Chart */}
                      <Box position="relative" w="200px" h="200px" flexShrink={0}>
                        <svg width="200" height="200" viewBox="0 0 200 200">
                          {(() => {
                            const total = categoryBreakdown.reduce((sum, [, amt]) => sum + amt, 0);
                            const colors = ["#E68B2F", "#D84343", "#EBC44F", "#38A169", "#3182CE", "#805AD5", "#DD6B20"];
                            let currentAngle = -90; // Start from top
                            
                            return categoryBreakdown.map(([category, amount], index) => {
                              const percentage = (amount / total) * 100;
                              const angle = (percentage / 100) * 360;
                              const startAngle = currentAngle;
                              const endAngle = currentAngle + angle;
                              
                              // Convert to radians
                              const startRad = (startAngle * Math.PI) / 180;
                              const endRad = (endAngle * Math.PI) / 180;
                              
                              // Calculate arc path
                              const x1 = 100 + 90 * Math.cos(startRad);
                              const y1 = 100 + 90 * Math.sin(startRad);
                              const x2 = 100 + 90 * Math.cos(endRad);
                              const y2 = 100 + 90 * Math.sin(endRad);
                              
                              const largeArc = angle > 180 ? 1 : 0;
                              
                              const pathData = [
                                `M 100 100`,
                                `L ${x1} ${y1}`,
                                `A 90 90 0 ${largeArc} 1 ${x2} ${y2}`,
                                `Z`
                              ].join(' ');
                              
                              currentAngle = endAngle;
                              
                              return (
                                <path
                                  key={category}
                                  d={pathData}
                                  fill={colors[index % colors.length]}
                                  stroke="white"
                                  strokeWidth="2"
                                />
                              );
                            });
                          })()}
                        </svg>
                      </Box>
                      
                      {/* Legend */}
                      <VStack align="stretch" gap={2} flex={1}>
                        {categoryBreakdown.map(([category, amount], index) => {
                          const colors = ["#E68B2F", "#D84343", "#EBC44F", "#38A169", "#3182CE", "#805AD5", "#DD6B20"];
                          const total = categoryBreakdown.reduce((sum, [, amt]) => sum + amt, 0);
                          const percentage = ((amount / total) * 100).toFixed(1);
                          
                          return (
                            <HStack key={category} gap={3}>
                              <Box
                                w="16px"
                                h="16px"
                                bg={colors[index % colors.length]}
                                borderRadius="sm"
                                flexShrink={0}
                              />
                              <VStack align="stretch" gap={0} flex={1}>
                                <Text fontSize="sm" fontWeight="medium">{category}</Text>
                                <Text fontSize="xs" color="fg.muted">
                                  ${amount.toFixed(2)} ({percentage}%)
                                </Text>
                              </VStack>
                            </HStack>
                          );
                        })}
                      </VStack>
                    </HStack>
                  )}
                </Box>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Grid>

        {/* Filters and Search */}
        <HStack justify="space-between" align="flex-end">
          <Field.Root w="300px">
            <Field.Label>Search</Field.Label>
            <Input
              placeholder="Search by dog name, treatment, or dog ID..."
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              size="md"
              bg="bg.panel"
            />
          </Field.Root>

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
        <Box bg="bg.panel" borderRadius="lg" overflow="hidden">
          <Table.Root size="md" variant="line">
            <Table.Header>
              <Table.Row bg="bg.subtle">
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  #
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Dog Name
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Dog ID
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Treatment Name
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Status
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Cost
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold">
                  Payment
                </Table.ColumnHeader>
                <Table.ColumnHeader color="fg.default" fontWeight="bold" textAlign="center">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading ? (
                <Table.Row>
                  <Table.Cell colSpan={8} textAlign="center" py={8}>
                    Loading...
                  </Table.Cell>
                </Table.Row>
              ) : currentBills.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8} textAlign="center" py={8}>
                    No vet bills found
                  </Table.Cell>
                </Table.Row>
              ) : (
                currentBills.map((bill, index) => (
                  <Table.Row key={bill.id} _hover={{ bg: "bg.muted" }}>
                    <Table.Cell fontWeight="medium" color="fg.default">
                      {startIndex + index + 1}
                    </Table.Cell>
                    <Table.Cell fontWeight="medium" color="fg.default">
                      {bill.dogs?.name || "Unknown"}
                    </Table.Cell>
                    <Table.Cell color="fg.muted" fontSize="sm">
                      {bill.dog_id}
                    </Table.Cell>
                    <Table.Cell color="fg.default">
                      {bill.treatment_name}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={getStatusBadgeColor(bill.status)}
                        variant="solid"
                      >
                        {bill.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell fontWeight="semibold" color="fg.default">
                      ${parseFloat(bill.amount).toFixed(2)}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        colorPalette={getPaymentBadgeColor(bill.payment_status)}
                        variant="solid"
                      >
                        {bill.payment_status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <HStack justify="center">
                        <IconButton
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(bill)}
                          aria-label="Edit bill"
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

        {/* Add Button */}
        <Box position="fixed" bottom="40px" right="40px">
          <IconButton
            size="lg"
            colorPalette="orange"
            onClick={() => setShowAddModal(true)}
            borderRadius="full"
            boxShadow="lg"
          >
            <HiPlus />
          </IconButton>
        </Box>
      </VStack>

      {/* Add Bill Modal */}
      <DialogRoot open={showAddModal} onOpenChange={(e) => setShowAddModal(e.open)}>
        <DialogContent maxW="lg" position="relative">
          <IconButton
            aria-label="Close"
            position="absolute"
            top="12px"
            right="12px"
            size="sm"
            variant="ghost"
            onClick={() => setShowAddModal(false)}
          >
            ✕
          </IconButton>
          <DialogBody pt={6} pb={6}>
            <VStack gap={4} align="stretch">
              <Heading size="md" mb={2}>Add Vet Bill</Heading>

              <Field.Root>
                <Field.Label>Dog</Field.Label>
                <Select.Root
                  collection={createListCollection({
                    items: dogs.map((dog) => ({
                      label: `${dog.name} (ID: ${dog.id})`,
                      value: dog.id.toString(),
                    })),
                  })}
                  size="md"
                  value={[newDogId]}
                  onValueChange={(e) => setNewDogId(e.value[0])}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger bg="bg.panel">
                      <Select.ValueText placeholder="Select dog" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content bg="bg.panel" maxH="200px" overflowY="auto">
                      <Select.ItemGroup>
                        {dogs.map((dog) => (
                          <Select.Item
                            key={dog.id}
                            item={{
                              label: `${dog.name} (ID: ${dog.id})`,
                              value: dog.id.toString(),
                            }}
                          >
                            <Select.ItemText>
                              {dog.name} (ID: {dog.id})
                            </Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Treatment Name</Field.Label>
                <Input
                  value={newTreatment}
                  onChange={(e) => setNewTreatment(e.target.value)}
                  placeholder="Enter treatment name"
                  size="md"
                  bg="bg.panel"
                />
              </Field.Root>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Field.Root>
                  <Field.Label>Amount ($)</Field.Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="0.00"
                    size="md"
                    bg="bg.panel"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Date</Field.Label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    size="md"
                    bg="bg.panel"
                  />
                </Field.Root>
              </Grid>

              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <Field.Root>
                  <Field.Label>Status</Field.Label>
                  <Select.Root
                    collection={STATUS_OPTIONS}
                    size="md"
                    value={newStatus}
                    onValueChange={(e) => setNewStatus(e.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger bg="bg.panel">
                        <Select.ValueText placeholder="Select" />
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

                <Field.Root>
                  <Field.Label>Payment</Field.Label>
                  <Select.Root
                    collection={PAYMENT_STATUS_OPTIONS}
                    size="md"
                    value={newPaymentStatus}
                    onValueChange={(e) => setNewPaymentStatus(e.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger bg="bg.panel">
                        <Select.ValueText placeholder="Select" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content bg="bg.panel">
                        <Select.ItemGroup>
                          {PAYMENT_STATUS_OPTIONS.items.map((option) => (
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

                <Field.Root>
                  <Field.Label>Category</Field.Label>
                  <Select.Root
                    collection={CATEGORY_OPTIONS}
                    size="md"
                    value={newCategory}
                    onValueChange={(e) => setNewCategory(e.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger bg="bg.panel">
                        <Select.ValueText placeholder="Select" />
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
              </Grid>

              <Field.Root>
                <Field.Label>Description (Optional)</Field.Label>
                <Input
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Additional notes..."
                  size="md"
                  bg="bg.panel"
                />
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
                  onClick={handleAddBill}
                  loading={createBillMutation.isPending}
                >
                  Add Bill
                </Button>
              </HStack>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Edit Bill Modal */}
      <DialogRoot open={showEditModal} onOpenChange={(e) => setShowEditModal(e.open)}>
        <DialogContent maxW="lg" position="relative">
          <IconButton
            aria-label="Close"
            position="absolute"
            top="12px"
            right="12px"
            size="sm"
            variant="ghost"
            onClick={() => setShowEditModal(false)}
          >
            ✕
          </IconButton>
          <DialogBody pt={6} pb={6}>
            <VStack gap={4} align="stretch">
              <Heading size="md" mb={2}>Edit Vet Bill</Heading>

              <Field.Root>
                <Field.Label>Dog</Field.Label>
                <Select.Root
                  collection={createListCollection({
                    items: dogs.map((dog) => ({
                      label: `${dog.name} (ID: ${dog.id})`,
                      value: dog.id.toString(),
                    })),
                  })}
                  size="md"
                  value={[editDogId]}
                  onValueChange={(e) => setEditDogId(e.value[0])}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger bg="bg.panel">
                      <Select.ValueText placeholder="Select dog" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content bg="bg.panel" maxH="200px" overflowY="auto">
                      <Select.ItemGroup>
                        {dogs.map((dog) => (
                          <Select.Item
                            key={dog.id}
                            item={{
                              label: `${dog.name} (ID: ${dog.id})`,
                              value: dog.id.toString(),
                            }}
                          >
                            <Select.ItemText>
                              {dog.name} (ID: {dog.id})
                            </Select.ItemText>
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.ItemGroup>
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Treatment Name</Field.Label>
                <Input
                  value={editTreatment}
                  onChange={(e) => setEditTreatment(e.target.value)}
                  placeholder="Enter treatment name"
                  size="md"
                  bg="bg.panel"
                />
              </Field.Root>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Field.Root>
                  <Field.Label>Amount ($)</Field.Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="0.00"
                    size="md"
                    bg="bg.panel"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label>Date</Field.Label>
                  <Input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    size="md"
                    bg="bg.panel"
                  />
                </Field.Root>
              </Grid>

              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <Field.Root>
                  <Field.Label>Status</Field.Label>
                  <Select.Root
                    collection={STATUS_OPTIONS}
                    size="md"
                    value={editStatus}
                    onValueChange={(e) => setEditStatus(e.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger bg="bg.panel">
                        <Select.ValueText placeholder="Select" />
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

                <Field.Root>
                  <Field.Label>Payment</Field.Label>
                  <Select.Root
                    collection={PAYMENT_STATUS_OPTIONS}
                    size="md"
                    value={editPaymentStatus}
                    onValueChange={(e) => setEditPaymentStatus(e.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger bg="bg.panel">
                        <Select.ValueText placeholder="Select" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                      <Select.Content bg="bg.panel">
                        <Select.ItemGroup>
                          {PAYMENT_STATUS_OPTIONS.items.map((option) => (
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

                <Field.Root>
                  <Field.Label>Category</Field.Label>
                  <Select.Root
                    collection={CATEGORY_OPTIONS}
                    size="md"
                    value={editCategory}
                    onValueChange={(e) => setEditCategory(e.value)}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger bg="bg.panel">
                        <Select.ValueText placeholder="Select" />
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
              </Grid>

              <Field.Root>
                <Field.Label>Description (Optional)</Field.Label>
                <Input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Additional notes..."
                  size="md"
                  bg="bg.panel"
                />
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
                  loading={updateBillMutation.isPending}
                >
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>

      {/* Status Popup */}
      <DialogRoot
        open={showStatusPopup}
        onOpenChange={(e) => setShowStatusPopup(e.open)}
      >
        <DialogContent maxW="sm" position="relative">
          <IconButton
            aria-label="Close"
            position="absolute"
            top="12px"
            right="12px"
            size="sm"
            variant="ghost"
            onClick={() => setShowStatusPopup(false)}
          >
            ✕
          </IconButton>
          <DialogBody pt={6} pb={6}>
            <VStack gap={4} align="center">
              <Box
                fontSize="4xl"
                color={statusType === "success" ? "green.500" : "red.500"}
              >
                {statusType === "success" ? "✓" : "✕"}
              </Box>
              <VStack gap={2} textAlign="center">
                <Heading size="md">
                  {statusType === "success" ? "Success!" : "Error"}
                </Heading>
                <Text color="fg.muted">{statusMessage}</Text>
              </VStack>
              <Button
                size="md"
                colorPalette={statusType === "success" ? "green" : "red"}
                onClick={() => setShowStatusPopup(false)}
                w="full"
              >
                OK
              </Button>
            </VStack>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </Box>
  );
}
