import {
  Grid,
  Card,
  Stat,
} from "@chakra-ui/react";

export default function Stats({ stats }) {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
      <Card.Root bg="green.50" borderColor="green.500" borderWidth="2px">
        <Card.Body>
          <Stat.Root>
            <Stat.Label color="green.700" fontWeight="semibold">Total Sponsorship Amount</Stat.Label>
            <Stat.ValueText fontSize="2xl" fontWeight="bold" color="green.600">
              ${stats.totalAmount.toFixed(2)}
            </Stat.ValueText>
          </Stat.Root>
        </Card.Body>
      </Card.Root>

      <Card.Root bg="blue.50" borderColor="blue.500" borderWidth="2px">
        <Card.Body>
          <Stat.Root>
            <Stat.Label color="blue.700" fontWeight="semibold">Dogs Sponsored</Stat.Label>
            <Stat.ValueText fontSize="2xl" fontWeight="bold" color="blue.600">
              {stats.dogsSponsored}
            </Stat.ValueText>
          </Stat.Root>
        </Card.Body>
      </Card.Root>

      <Card.Root bg="orange.50" borderColor="orange.500" borderWidth="2px">
        <Card.Body>
          <Stat.Root>
            <Stat.Label color="orange.700" fontWeight="semibold">Dogs Without Sponsorship</Stat.Label>
            <Stat.ValueText fontSize="2xl" fontWeight="bold" color="orange.600">
              {stats.dogsWithoutSponsorship}
            </Stat.ValueText>
          </Stat.Root>
        </Card.Body>
      </Card.Root>

      <Card.Root bg="red.50" borderColor="red.500" borderWidth="2px">
        <Card.Body>
          <Stat.Root>
            <Stat.Label color="red.700" fontWeight="semibold">Sponsorships Expiring Soon</Stat.Label>
            <Stat.ValueText fontSize="2xl" fontWeight="bold" color="red.600">
              {stats.expiringSoon}
            </Stat.ValueText>
          </Stat.Root>
        </Card.Body>
      </Card.Root>
    </Grid>
  );
}