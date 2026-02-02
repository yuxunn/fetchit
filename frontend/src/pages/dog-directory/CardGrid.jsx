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
  // Use the first image from the dog's images array, or fallback to placeholder
  const imageUrl = dog.images && dog.images.length > 0 ? dog.images[0] : null;

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
          <IconButton asChild variant="ghost" size="sm">
            <Link to={`/dogs/${dog.id}`}>
              <HiEye />
            </Link>
          </IconButton>
          <IconButton asChild variant="ghost" size="sm">
            <Link to={`/dogs/${dog.id}/edit`}>
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
