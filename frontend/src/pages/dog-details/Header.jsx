import {
  HStack,
  VStack,
  Text,
  Badge,
  SimpleGrid,
  Card,
  Icon,
  Carousel,
  Image,
} from "@chakra-ui/react";
import { LuHeart, LuCalendar, LuUser, LuScale, LuMapPin, LuCircleCheck } from "react-icons/lu";

export default function Header({ dog }) {
  return (
    <VStack align="stretch" gap={6}>
      <HStack align="start" gap={8}>
        {/* Carousel on the left */}
        <Carousel.Root slideCount={dog.images?.length || 0} maxW="400px">
          <Carousel.ItemGroup>
            {(dog.images || []).map((image, index) => (
              <Carousel.Item key={index} index={index}>
                <Image
                  src={image}
                  alt={`${dog.name} - Image ${index + 1}`}
                  aspectRatio={4 / 3}
                  rounded="lg"
                  objectFit="cover"
                />
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>
          <Carousel.Control justifyContent="center" gap="4" mt={4}>
            <Carousel.IndicatorGroup>
              {(dog.images || []).map((image, index) => (
                <Carousel.Indicator
                  key={index}
                  index={index}
                  unstyled
                  _current={{
                    outline: "2px solid currentColor",
                    outlineOffset: "2px",
                  }}
                >
                  <Image
                    w="16"
                    aspectRatio={4 / 3}
                    src={image}
                    alt={`${dog.name} - Thumbnail ${index + 1}`}
                    objectFit="cover"
                    rounded="sm"
                  />
                </Carousel.Indicator>
              ))}
            </Carousel.IndicatorGroup>
          </Carousel.Control>
        </Carousel.Root>

        {/* VStack on the right */}
        <VStack align="stretch" flex={1} gap={4}>
          {/* Dog name and availability badge */}
          <HStack justify="space-between">
            <Text fontSize="3xl" fontWeight="bold">
              {dog.name}
            </Text>
            {dog.status === "Available" && (
              <Badge colorPalette="green" variant="solid" size="lg">
                Available for adoption
              </Badge>
            )}
          </HStack>

          {/* 2x3 grid of detail cards */}
          <SimpleGrid columns={2} gap={4}>
            <DetailCard
              icon={<LuHeart />}
              label="Breed"
              value={dog.breed}
            />
            <DetailCard
              icon={<LuCalendar />}
              label="Age"
              value={`${dog.age} Years old`}
            />
            <DetailCard
              icon={<LuUser />}
              label="Gender"
              value={dog.gender}
            />
            <DetailCard
              icon={<LuScale />}
              label="Size"
              value={`${dog.size} (${dog.weight} kg)`}
            />
            <DetailCard
              icon={<LuMapPin />}
              label="Location"
              value={dog.kennel}
            />
            <DetailCard
              icon={<LuCircleCheck />}
              label="HDB Approved"
              value={dog.hdbApproved ? "Yes" : "No"}
            />
          </SimpleGrid>
        </VStack>
      </HStack>

      {/* Three status cards below */}
      <SimpleGrid columns={3} gap={4}>
        <StatusCard
          icon={<LuCircleCheck />}
          label="Sterilization"
          status={dog.sterilizationStatus}
        />
        <StatusCard
          icon={<LuCircleCheck />}
          label="Vaccination"
          status={dog.vaccinationStatus}
        />
        <StatusCard
          icon={<LuCircleCheck />}
          label="Medical Checkup"
          status={dog.medicalCheckupStatus}
        />
      </SimpleGrid>
    </VStack>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <VStack align="start" gap={1}>
      <HStack gap={2}>
        <Icon size="lg">
          {icon}
        </Icon>
        <VStack align="start" gap={0} spacing={0}>
          <Text fontSize="sm" color="gray.600">
            {label}
          </Text>
          <Text fontWeight="medium">
            {value}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}

function StatusCard({ icon, label, status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Pending":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Card.Root>
      <Card.Body>
        <VStack align="center" gap={2}>
          <Icon size="lg">
            {icon}
          </Icon>
          <Text fontWeight="medium" textAlign="center">
            {label}
          </Text>
          <Text color={`${getStatusColor(status)}.600`} fontWeight="medium">
            {status}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}