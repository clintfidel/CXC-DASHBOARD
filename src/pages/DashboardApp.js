// material
import { LoadingButton } from '@mui/lab';
import { Box, Grid, Container, Typography } from '@mui/material';
import DateRange from 'src/components/DateRange';
import CollapsibleTable from 'src/components/Table';
import Button from 'src/theme/overrides/Button';

// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="CXC DASHBOARD">
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <DateRange />
          </Box>
          <Box width={150}>
            <LoadingButton fullWidth size="large" variant="outlined">
              Export
            </LoadingButton>
          </Box>
        </Box>
        <CollapsibleTable />
      </Container>
    </Page>
  );
}
