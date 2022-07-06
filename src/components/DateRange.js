import * as React from 'react';
import { Box, TextField } from '@mui/material';
import { LocalizationProvider, DateRangePicker } from '@mui/x-date-pickers-pro';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

export default function DateRange() {
  const [value, setValue] = React.useState([null, null]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} localeText={{ start: 'From', end: 'To' }}>
      <DateRangePicker
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      />
    </LocalizationProvider>
  );
}
