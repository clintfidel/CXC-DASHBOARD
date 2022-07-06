import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';

export default function SearchInput() {
  return (
    <Paper
      component="form"
      sx={{
        p: '1px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 300,
        backgroundColor: '#DFE3E8'
      }}
    >
      {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
        <MenuIcon />
      </IconButton> */}
      <InputBase
        sx={{ ml: 1, flex: 1, background: 'primary.dark' }}
        placeholder="Search here.."
        inputProps={{ 'aria-label': 'search here' }}
        size="small"
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <Icon icon="akar-icons:search" />
      </IconButton>
    </Paper>
  );
}
