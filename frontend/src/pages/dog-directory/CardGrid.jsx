import {
  Card as ChakraCard,
  Image,
  HStack,
  SimpleGrid,
  Wrap,
  Badge,
  Text,
  IconButton,
  Menu,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HiEye, HiPencil, HiArchiveBox } from "react-icons/hi2";
import supabase from "../../supabaseClient";

const ARCHIVE_STATUS_OPTIONS = ["Adopted", "Deceased"];

export default function CardGrid({ dogs }) {
  return (
    <SimpleGrid minChildWidth="300px" gap={6}>
      {dogs.map((dog) => (
        <Card key={dog.id} dog={dog} />
      ))}
    </SimpleGrid>
  );
}

function Card({ dog }) {
  const queryClient = useQueryClient();

  // Use the first image from the dog's images array, or fallback to placeholder
  const imageUrl = dog.images && dog.images.length > 0 ? dog.images[0] : null;

  const statusMutation = useMutation({
    mutationFn: async (newStatus) => {
      const { error } = await supabase
        .from("dogs")
        .update({ status: newStatus })
        .eq("id", dog.id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate the dogs query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["dogs"] });
    },
  });

  const handleStatusChange = (newStatus) => {
    statusMutation.mutate(newStatus);
  };

  return (
    <ChakraCard.Root maxW="sm" overflow="hidden">
      <Image
        src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
        alt={dog.name}
        fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
        aspectRatio={4 / 3}
      />
      <ChakraCard.Body gap="2">
        <ChakraCard.Title>{dog.name}</ChakraCard.Title>
        <HStack justify="space-between">
          <Text>{dog.breed}</Text>
          <Text>Age: {dog.age}</Text>
        </HStack>
        <Wrap gap={2}>
          <Badge variant="outline">{dog.kennel}</Badge>
          <Badge variant="solid">{dog.status}</Badge>
          {dog.is_hdb_approved && (
            <Badge variant="subtle" colorPalette="teal">
              HDB Approved
            </Badge>
          )}
          {dog.medical_priority && (
            <Badge variant="solid" colorPalette="orange">
              {dog.medical_priority}
            </Badge>
          )}
        </Wrap>
      </ChakraCard.Body>
      <ChakraCard.Footer justifyContent="flex-end">
        <HStack gap={2}>
          <Tooltip content="View details">
            <IconButton asChild variant="ghost" size="sm">
              <Link to={`/dogs/${dog.id}`}>
                <HiEye />
              </Link>
            </IconButton>
          </Tooltip>
          <Tooltip content="Edit dog">
            <IconButton asChild variant="ghost" size="sm">
              <Link to={`/dogs/${dog.id}/edit`}>
                <HiPencil />
              </Link>
            </IconButton>
          </Tooltip>
          <Tooltip content="Change status">
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton variant="ghost" size="sm">
                  <HiArchiveBox />
                </IconButton>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  {ARCHIVE_STATUS_OPTIONS.map((status) => (
                    <Menu.Item
                      key={status}
                      value={status}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          </Tooltip>
        </HStack>
      </ChakraCard.Footer>
    </ChakraCard.Root>
  );
}
