// material
import { Box, Grid, Container, Typography } from '@mui/material';
import CollapsibleTable from 'src/components/Table';

// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function DashboardApp({data}) {
  return (
    <Page title="CXC DASHBOARD">
      <Container maxWidth="xl">
        <CollapsibleTable />
      </Container>
    </Page>
  );
}
