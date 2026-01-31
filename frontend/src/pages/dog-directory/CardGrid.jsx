import {
  Card as ChakraCard,
  Image,
  HStack,
  SimpleGrid,
  Wrap,
  Badge,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { HiEye, HiPencil, HiArchiveBox } from "react-icons/hi2";

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
  const { data: imageData } = useQuery({
    queryKey: ["dog-image", dog.name],
    queryFn: async () => {
      const response = await fetch(`https://dog.ceo/api/breeds/image/random`);
      if (!response.ok) {
        throw new Error("Failed to fetch dog image");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const imageUrl = imageData?.message;

  return (
    <ChakraCard.Root maxW="sm" overflow="hidden">
      <Image
        src={imageUrl || "https://via.placeholder.com/300x200?text=Loading..."}
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
          <IconButton asChild variant="ghost" size="sm">
            <Link to={`/dog-details`}>
              <HiEye />
            </Link>
          </IconButton>
          <IconButton asChild variant="ghost" size="sm">
            <Link to="/">
              <HiPencil />
            </Link>
          </IconButton>
          <IconButton asChild variant="ghost" size="sm">
            <Link to="/">
              <HiArchiveBox />
            </Link>
          </IconButton>
        </HStack>
      </ChakraCard.Footer>
    </ChakraCard.Root>
  );
}
