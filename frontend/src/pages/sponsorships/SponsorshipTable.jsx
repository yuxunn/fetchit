import {
  Box,
  Table,
  Badge,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { HiPencil } from "react-icons/hi2";

export default function SponsorshipTable({ sponsorships, isLoading, onSelectSponsor, onEditSponsorship }) {
  const getStatusBadgeColor = (status) => {
    return status === "active" ? "green" : "red";
  };

  return (
    <Box bg="bg.panel" borderRadius="lg" overflow="hidden">
      <Table.Root size="md" variant="line">
        <Table.Header>
          <Table.Row bg="bg.subtle">
            <Table.ColumnHeader color="fg.default" fontWeight="bold">
              #
            </Table.ColumnHeader>
            <Table.ColumnHeader color="fg.default" fontWeight="bold">
              Sponsor
            </Table.ColumnHeader>
            <Table.ColumnHeader color="fg.default" fontWeight="bold">
              Type
            </Table.ColumnHeader>
            <Table.ColumnHeader color="fg.default" fontWeight="bold">
              Amount
            </Table.ColumnHeader>
            <Table.ColumnHeader color="fg.default" fontWeight="bold">
              Started
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
              <Table.Cell colSpan={7} textAlign="center" py={8}>
                Loading...
              </Table.Cell>
            </Table.Row>
          ) : sponsorships.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={7} textAlign="center" py={8}>
                No sponsorships found
              </Table.Cell>
            </Table.Row>
          ) : (
            sponsorships.map((sponsorship, index) => (
              <Table.Row
                key={sponsorship.id}
                _hover={{ bg: "bg.muted" }}
                cursor="pointer"
                onClick={() => onSelectSponsor(sponsorship)}
              >
                <Table.Cell fontWeight="medium" color="fg.default">
                  {index + 1}
                </Table.Cell>
                <Table.Cell fontWeight="medium" color="fg.default">
                  {sponsorship.sponsor_name}
                </Table.Cell>
                <Table.Cell color="fg.default" textTransform="capitalize">
                  {sponsorship.type}
                </Table.Cell>
                <Table.Cell fontWeight="semibold" color="fg.default">
                  ${parseFloat(sponsorship.amount).toFixed(2)}
                </Table.Cell>
                <Table.Cell color="fg.muted">
                  {new Date(sponsorship.start_date).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    colorPalette={getStatusBadgeColor(sponsorship.status)}
                    variant="solid"
                    textTransform="capitalize"
                  >
                    {sponsorship.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSponsorship(sponsorship);
                    }}
                    aria-label="Edit sponsorship"
                    colorPalette="blue"
                  >
                    <HiPencil />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}