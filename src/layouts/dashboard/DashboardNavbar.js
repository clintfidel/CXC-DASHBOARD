import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import { Box, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { MHidden } from '../../components/@material-extend';
//

import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';
import NotificationsPopover from './NotificationsPopover';
import { login } from '../../redux/user/user.actions';

// const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 60;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    // width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
    width: '100%'
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login())
  })
  const user = useSelector((state) => state.user.user);
  return (
    <RootStyle style={{ borderBottom: "1px solid gray"}}>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>
        <Typography sx={{ mr: 1, color: 'primary.dark', fontWeight: 'bolder' }}>
          CXC DASHBOARD
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 4 }}>
          {/* <NotificationsPopover /> */}
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            <AccountPopover />
            <Typography sx={{ color: 'primary.dark' }}>{user?.user?.email !== undefined ? user?.user?.email : "clintfidel@gmail.com"}</Typography>
          </Stack>
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
