import {
  VStack,
  Box,
  Heading,
  Text,
  Select,
  HStack,
  IconButton,
  Button,
  createListCollection,
} from "@chakra-ui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabaseClient";
import { toaster } from "@/components/ui/toaster";
import { HiTrash, HiPlus } from "react-icons/hi2";
import { useState } from "react";

export default function SponsorSidebar({ selectedSponsor, sponsorshipsWithDogs }) {
  const [selectedDogId, setSelectedDogId] = useState("");
  const queryClient = useQueryClient();

  // Get the full sponsor data with sponsored dogs
  const fullSponsorData = sponsorshipsWithDogs.find(s => s.id === selectedSponsor?.id) || selectedSponsor;

  // Fetch all dogs
  const { data: allDogs = [] } = useQuery({
    queryKey: ["dogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dogs")
        .select("id, name, kennel")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  // Get sponsored dogs for this sponsor
  const sponsoredDogs = fullSponsorData?.sponsored_dogs || [];
  const sponsoredDogIds = sponsoredDogs.map(sd => sd.dog_id);

  // Filter available dogs (not already sponsored by this sponsor)
  const availableDogs = allDogs.filter(dog => !sponsoredDogIds.includes(dog.id));

  // Create collection for the select dropdown
  const dogOptions = createListCollection({
    items: availableDogs.map(dog => ({
      label: `${dog.name} (${dog.kennel})`,
      value: dog.id.toString(),
    })),
  });

  // Mutation to add a dog to sponsorship
  const addDogMutation = useMutation({
    mutationFn: async ({ sponsorshipId, dogId }) => {
      const { data, error } = await supabase
        .from("sponsored_dogs")
        .insert({
          sponsorship_id: sponsorshipId,
          dog_id: dogId,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
      queryClient.invalidateQueries({ queryKey: ["sponsoredDogs"] });
      setSelectedDogId("");
      toaster.create({
        title: "Dog added successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Failed to add dog",
        description: error.message,
        type: "error",
      });
    },
  });

  // Mutation to remove a dog from sponsorship
  const removeDogMutation = useMutation({
    mutationFn: async ({ sponsorshipId, dogId }) => {
      const { data, error } = await supabase
        .from("sponsored_dogs")
        .delete()
        .eq("sponsorship_id", sponsorshipId)
        .eq("dog_id", dogId);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
      queryClient.invalidateQueries({ queryKey: ["sponsoredDogs"] });
      toaster.create({
        title: "Dog removed successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toaster.create({
        title: "Failed to remove dog",
        description: error.message,
        type: "error",
      });
    },
  });

  if (!fullSponsorData) {
    return (
      <Box
        bg="bg.panel"
        borderRadius="lg"
        p={6}
        h="fit-content"
        minH="400px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="fg.muted">Select a sponsorship to view details</Text>
      </Box>
    );
  }

  const handleRemoveDog = (dogId) => {
    if (fullSponsorData?.id) {
      removeDogMutation.mutate({
        sponsorshipId: fullSponsorData.id,
        dogId: dogId,
      });
    }
  };

  const handleAddDog = () => {
    if (fullSponsorData?.id && selectedDogId) {
      addDogMutation.mutate({
        sponsorshipId: fullSponsorData.id,
        dogId: parseInt(selectedDogId),
      });
    }
  };

  return (
    <VStack
      bg="bg.panel"
      borderRadius="lg"
      p={6}
      gap={6}
      align="stretch"
      h="fit-content"
      minH="400px"
    >
      {/* Sponsor Name */}
      <Heading size="md" color="fg.default">
        {fullSponsorData.sponsor_name}
      </Heading>

      {/* Sponsor Details */}
      <VStack align="stretch" gap={2}>
        <Text fontSize="sm" color="fg.muted">
          <Text as="span" fontWeight="semibold">Amount:</Text> ${parseFloat(fullSponsorData.amount).toFixed(2)}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          <Text as="span" fontWeight="semibold">Started:</Text> {new Date(fullSponsorData.start_date).toLocaleDateString()}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          <Text as="span" fontWeight="semibold">Contact:</Text> {fullSponsorData.sponsor_contact}
        </Text>
      </VStack>

      {/* Sponsored Dogs */}
      <VStack align="stretch" gap={3}>
        <Heading size="sm" color="fg.default">
          Sponsored Dogs
        </Heading>

        {/* Add Dog Section */}
        {availableDogs.length > 0 && (
          <VStack align="stretch" gap={2}>
            <HStack gap={2}>
              <Select.Root
                collection={dogOptions}
                value={selectedDogId ? [selectedDogId] : []}
                onValueChange={(details) => setSelectedDogId(details.value[0] || "")}
                size="sm"
              >
                <Select.HiddenSelect />
                <Select.Control flex={1}>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select a dog to add" />
                  </Select.Trigger>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content>
                    {dogOptions.items.map((option) => (
                      <Select.Item key={option.value} item={option}>
                        {option.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
              <IconButton
                size="sm"
                colorPalette="blue"
                onClick={handleAddDog}
                disabled={!selectedDogId || addDogMutation.isPending}
                loading={addDogMutation.isPending}
                aria-label="Add dog"
              >
                <HiPlus />
              </IconButton>
            </HStack>
          </VStack>
        )}

        {sponsoredDogs.length === 0 ? (
          <Text fontSize="sm" color="fg.muted">
            No dogs sponsored yet
          </Text>
        ) : (
          sponsoredDogs.map((sd) => (
            <HStack key={sd.dog_id} justify="space-between" align="center">
              <VStack align="start" gap={0}>
                <Text fontSize="sm" fontWeight="medium" color="fg.default">
                  {sd.dogs?.name}
                </Text>
                <Text fontSize="xs" color="fg.muted">
                  {sd.dogs?.kennel}
                </Text>
              </VStack>
              <IconButton
                size="xs"
                variant="ghost"
                colorPalette="red"
                onClick={() => handleRemoveDog(sd.dog_id)}
                aria-label="Remove dog"
              >
                <HiTrash />
              </IconButton>
            </HStack>
          ))
        )}
      </VStack>
    </VStack>
  );
}