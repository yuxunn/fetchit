import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  Textarea,
  Select,
  Checkbox,
  Button,
  Text,
  FileUpload,
  useFileUpload,
  Portal,
  createListCollection,
  Image,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { LuUpload } from "react-icons/lu";

const SIZE_OPTIONS = createListCollection({
  items: [
    { label: "Small", value: "Small" },
    { label: "Medium", value: "Medium" },
    { label: "Large", value: "Large" },
  ],
});

const GENDER_OPTIONS = createListCollection({
  items: [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ],
});

const STATUS_OPTIONS = createListCollection({
  items: [
    { label: "Available", value: "Available" },
    { label: "Foster Care", value: "Foster Care" },
    { label: "Adopted", value: "Adopted" },
    { label: "Urgent", value: "Urgent" },
  ],
});

const STERILIZATION_OPTIONS = createListCollection({
  items: [
    { label: "Sterilized", value: "Sterilized" },
    { label: "Not Sterilized", value: "Not Sterilized" },
    { label: "Pending", value: "Pending" },
  ],
});

const VACCINATION_OPTIONS = createListCollection({
  items: [
    { label: "Up to Date", value: "Up to Date" },
    { label: "Incomplete", value: "Incomplete" },
    { label: "Overdue", value: "Overdue" },
    { label: "Pending", value: "Pending" },
  ],
});

const MEDICAL_PRIORITY_OPTIONS = createListCollection({
  items: [
    { label: "Normal", value: "" },
    { label: "Low", value: "Low" },
    { label: "High", value: "High" },
    { label: "Urgent", value: "Urgent" },
    { label: "Special Needs", value: "Special Needs" },
  ],
});

const MEDICAL_CHECKUP_OPTIONS = createListCollection({
  items: [
    { label: "Completed", value: "Completed" },
    { label: "Incomplete", value: "Incomplete" },
    { label: "Pending", value: "Pending" },
    { label: "Overdue", value: "Overdue" },
  ],
});

export default function NewDog() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const showToast = ({ title, description }) => {
    if (typeof window !== "undefined") {
      window.alert(`${title}${description ? ` - ${description}` : ""}`);
    }
  };

  // Basic dog fields
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("Medium");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("Male");
  const [status, setStatus] = useState("Available");
  const [isHdbApproved, setIsHdbApproved] = useState(false);
  const [kennel, setKennel] = useState("");
  const [description, setDescription] = useState("");
  const [sterilizationStatus, setSterilizationStatus] = useState("Pending");
  const [vaccinationStatus, setVaccinationStatus] = useState("Pending");
  const [medicalCheckupStatus, setMedicalCheckupStatus] = useState("Pending");
  const [medicalPriority, setMedicalPriority] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Track which existing images to remove
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const fileUpload = useFileUpload({ maxFiles: 10, accept: "image/*" });

  // Function to remove an existing image
  const removeExistingImage = (imageUrl) => {
    setImagesToRemove(prev => [...prev, imageUrl]);
  };

  // Fetch dog data if editing
  const { data: dog, isLoading } = useQuery({
    queryKey: ["dog", id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from("dogs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  // Populate form when dog data loads
  useEffect(() => {
    if (dog) {
      setName(dog.name || "");
      setBreed(dog.breed || "");
      setAge(dog.age?.toString() || "");
      setSize(dog.size || "Medium");
      setWeight(dog.weight?.toString() || "");
      setGender(dog.gender || "Male");
      setStatus(dog.status || "Available");
      setIsHdbApproved(dog.is_hdb_approved || false);
      setKennel(dog.kennel || "");
      setDescription(dog.description || "");
      setSterilizationStatus(dog.sterilization_status || "Pending");
      setVaccinationStatus(dog.vaccination_status || "Pending");
      setMedicalCheckupStatus(dog.medical_checkup_status || "Pending");
      setMedicalPriority(dog.medical_priority || "");
    }
  }, [dog]);

  // Create dog mutation
  const createDogMutation = useMutation({
    mutationFn: async (dogData) => {
      const { data, error } = await supabase.from("dogs").insert([dogData]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
      showToast({ title: "Dog created", description: `${data.name} created` });
      navigate(`/dogs/${data.id}`);
    },
    onError: (error) => {
      showToast({ title: "Error", description: error.message || "Failed to create dog" });
    },
  });

  // Update dog mutation
  const updateDogMutation = useMutation({
    mutationFn: async (dogData) => {
      const { data, error } = await supabase
        .from("dogs")
        .update(dogData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
      queryClient.invalidateQueries({ queryKey: ["dog", id] });
      showToast({ title: "Dog updated", description: `${data.name} updated` });
      navigate(`/dogs/${data.id}`);
    },
    onError: (error) => {
      showToast({ title: "Error", description: error.message || "Failed to update dog" });
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload images first (if any)
      const accepted = fileUpload.acceptedFiles || [];
      const uploadedUrls = [];

      for (const file of accepted) {
        // Create a unique path
        const path = `dogs/${Date.now()}_${file.name}`;
        // upload
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("documents")
          .upload(path, file, { upsert: true });

        if (uploadError) {
          console.error("upload error", uploadError);
          throw uploadError;
        }

        // Try to create a signed url (useful for private buckets)
        const { data: signedData, error: signedErr } = await supabase.storage
          .from("documents")
          .createSignedUrl(uploadData.path, 60 * 60 * 24); // 24 hours

        if (signedErr) {
          // fallback to public url
          const { data: pubData } = supabase.storage.from("documents").getPublicUrl(uploadData.path);
          uploadedUrls.push(pubData?.publicUrl);
        } else {
          uploadedUrls.push(signedData.signedUrl);
        }
      }

      // Remove images from storage if any are marked for removal
      if (isEditing && imagesToRemove.length > 0) {
        for (const imageUrl of imagesToRemove) {
          try {
            // Extract the path from the URL
            const url = new URL(imageUrl);
            const path = url.pathname.split('/').slice(-2).join('/'); // Get the last two parts of the path
            
            const { error: deleteError } = await supabase.storage
              .from("documents")
              .remove([path]);
              
            if (deleteError) {
              console.error("Error deleting image:", deleteError);
              // Don't throw here - continue with the update even if deletion fails
            }
          } catch (err) {
            console.error("Error parsing image URL for deletion:", err);
            // Continue with update even if URL parsing fails
          }
        }
      }

      // Prepare dog data
      const dogData = {
        name,
        breed,
        age: age ? Number(age) : null,
        size,
        weight: weight ? Number(weight) : null,
        gender,
        status,
        is_hdb_approved: isHdbApproved,
        kennel,
        description,
        sterilization_status: sterilizationStatus,
        vaccination_status: vaccinationStatus,
        medical_checkup_status: medicalCheckupStatus,
        medical_priority: medicalPriority || null,
      };

      // Add images if any were uploaded or if editing with image changes
      if (uploadedUrls.length > 0 || (isEditing && imagesToRemove.length > 0)) {
        // Start with existing images (or empty array if creating)
        let currentImages = isEditing ? (dog?.images || []) : [];
        
        // Remove images marked for removal
        currentImages = currentImages.filter(image => !imagesToRemove.includes(image));
        
        // Add new uploaded images
        dogData.images = [...currentImages, ...uploadedUrls];
      }

      if (isEditing) {
        updateDogMutation.mutate(dogData);
      } else {
        createDogMutation.mutate(dogData);
      }
    } catch (err) {
      console.error(err);
      showToast({ title: "Error", description: err.message || `Failed to ${isEditing ? 'update' : 'create'} dog` });
      setSubmitting(false);
    }
  }

  if (isEditing && isLoading) {
    return <div>Loading dog...</div>;
  }

  return (
    <Box p={6} maxW="800px">
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <Box>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>
              {isEditing ? "Edit Dog" : "Add New Dog"}
            </Text>
            <VStack spacing={4} align="stretch">
              <HStack gap={4}>
                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Name</Text>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Breed</Text>
                  <Input value={breed} onChange={(e) => setBreed(e.target.value)} />
                </Box>
              </HStack>

              <HStack gap={4}>
                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Age</Text>
                  <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={0} />
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Weight (kg)</Text>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min={0} />
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Size</Text>
                  <Select.Root
                    collection={SIZE_OPTIONS}
                    size="sm"
                    width="full"
                    value={size ? [size] : []}
                    onValueChange={(e) => setSize(e.value?.[0] || "Medium")}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select size" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {SIZE_OPTIONS.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>
              </HStack>

              <HStack gap={4}>
                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Gender</Text>
                  <Select.Root
                    collection={GENDER_OPTIONS}
                    size="sm"
                    width="full"
                    value={gender ? [gender] : []}
                    onValueChange={(e) => setGender(e.value?.[0] || "Male")}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select gender" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {GENDER_OPTIONS.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Status</Text>
                  <Select.Root
                    collection={STATUS_OPTIONS}
                    size="sm"
                    width="full"
                    value={status ? [status] : []}
                    onValueChange={(e) => setStatus(e.value?.[0] || "Available")}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select status" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {STATUS_OPTIONS.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">HDB Approved</Text>
                  <Checkbox.Root
                    checked={isHdbApproved}
                    onCheckedChange={(e) => setIsHdbApproved(e.checked)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Yes</Checkbox.Label>
                  </Checkbox.Root>
                </Box>
              </HStack>

              <Box>
                <Text fontSize="sm" mb={2} fontWeight="medium">Kennel</Text>
                <Input value={kennel} onChange={(e) => setKennel(e.target.value)} />
              </Box>

              <Box>
                <Text fontSize="sm" mb={2} fontWeight="medium">Description</Text>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </Box>

              <HStack gap={4}>
                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Sterilization Status</Text>
                  <Select.Root
                    collection={STERILIZATION_OPTIONS}
                    size="sm"
                    width="full"
                    value={sterilizationStatus ? [sterilizationStatus] : []}
                    onValueChange={(e) => setSterilizationStatus(e.value?.[0] || "Pending")}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select sterilization status" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {STERILIZATION_OPTIONS.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Vaccination Status</Text>
                  <Select.Root
                    collection={VACCINATION_OPTIONS}
                    size="sm"
                    width="full"
                    value={vaccinationStatus ? [vaccinationStatus] : []}
                    onValueChange={(e) => setVaccinationStatus(e.value?.[0] || "Pending")}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select vaccination status" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {VACCINATION_OPTIONS.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Medical Priority</Text>
                  <Select.Root
                    collection={MEDICAL_PRIORITY_OPTIONS}
                    size="sm"
                    width="full"
                    value={medicalPriority ? [medicalPriority] : []}
                    onValueChange={(e) => setMedicalPriority(e.value?.[0] || "")}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select medical priority" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {MEDICAL_PRIORITY_OPTIONS.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>

                <Box flex={1}>
                  <Text fontSize="sm" mb={2} fontWeight="medium">Medical Checkup Status</Text>
                  <Select.Root
                    collection={MEDICAL_CHECKUP_OPTIONS}
                    size="sm"
                    width="full"
                    value={medicalCheckupStatus ? [medicalCheckupStatus] : []}
                    onValueChange={(e) => setMedicalCheckupStatus(e.value?.[0] || "Pending")}
                  >
                    <Select.HiddenSelect />
                    <Select.Control>
                      <Select.Trigger>
                        <Select.ValueText placeholder="Select medical checkup status" />
                      </Select.Trigger>
                      <Select.IndicatorGroup>
                        <Select.Indicator />
                      </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                      <Select.Positioner>
                        <Select.Content>
                          {MEDICAL_CHECKUP_OPTIONS.items.map((item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Positioner>
                    </Portal>
                  </Select.Root>
                </Box>
              </HStack>

              <Box>
                {/* Existing Images Section */}
                {isEditing && dog?.images && dog.images.length > 0 && (
                  <Box mb={6} p={4} border="subtle" borderRadius="md" bg="subtle">
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="fg">
                      📸 Existing Photos ({dog.images.length})
                    </Text>
                    <VStack spacing={2} align="stretch">
                      {dog.images
                        .filter(imageUrl => !imagesToRemove.includes(imageUrl))
                        .map((imageUrl, index) => {
                          // Extract filename from URL
                          const filename = imageUrl.split('/').pop()?.split('?')[0] || `Image ${index + 1}`;
                          return (
                            <Box
                              key={index}
                              p={3}
                              bg="surface"
                              borderRadius="md"
                              border="subtle"
                              _hover={{ bg: "surface", borderColor: "border" }}
                              transition="all 0.2s"
                            >
                              <HStack justify="space-between" align="center">
                                <HStack spacing={3}>
                                  <Box
                                    w="40px"
                                    h="40px"
                                    borderRadius="md"
                                    overflow="hidden"
                                    flexShrink={0}
                                  >
                                    <Image
                                      src={imageUrl}
                                      alt={filename}
                                      w="full"
                                      h="full"
                                      objectFit="cover"
                                    />
                                  </Box>
                                  <Text fontSize="sm" fontWeight="medium" color="fg" noOfLines={1}>
                                    {filename}
                                  </Text>
                                </HStack>
                                <IconButton
                                  size="sm"
                                  colorScheme="red"
                                  variant="ghost"
                                  onClick={() => removeExistingImage(imageUrl)}
                                  aria-label="Remove image"
                                  _hover={{ bg: "bg.error.subtle" }}
                                >
                                  ✕
                                </IconButton>
                              </HStack>
                            </Box>
                          );
                        })}
                    </VStack>
                    {imagesToRemove.length > 0 && (
                      <Text fontSize="xs" color="fg.error" mt={3} fontWeight="medium">
                        🗑️ {imagesToRemove.length} image(s) marked for removal
                      </Text>
                    )}
                  </Box>
                )}

                {/* Upload New Images Section */}
                <Box p={4} border="subtle" borderRadius="md" bg="muted">
                  <Text fontSize="md" fontWeight="semibold" mb={3} color="fg">
                    📤 Upload New Photos
                  </Text>
                  <FileUpload.RootProvider value={fileUpload}>
                    <FileUpload.HiddenInput />
                    <FileUpload.Dropzone w="full">
                      <Icon size="lg" color="fg.muted">
                        <LuUpload />
                      </Icon>
                      <FileUpload.DropzoneContent>
                        <Box fontWeight="medium">Drag and drop images here</Box>
                        <Box color="fg.muted" fontSize="sm">
                          or click to browse files (.png, .jpg, .jpeg up to 10MB each)
                        </Box>
                      </FileUpload.DropzoneContent>
                    </FileUpload.Dropzone>
                    <FileUpload.List clearable showSize mt={4} />
                  </FileUpload.RootProvider>
                </Box>
              </Box>

              <HStack justify="flex-end">
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={submitting || createDogMutation.isPending || updateDogMutation.isPending}
                >
                  {isEditing ? "Update Dog" : "Create Dog"}
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </form>
    </Box>
  );
}