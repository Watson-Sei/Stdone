import React, { useState } from 'react';
import { 
    Typography,
    Box,
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import styled from '@emotion/styled';
import { useWindowSize } from '../../hooks/use-window';

const RighteousFont = styled(Typography)`
    color: black;
    font-size: 24px;
    font-weight: bold;
    margin-left: 20px;
`;

const LoginButton = styled(Button)`
    background: #16449A;
`;

export const Header: React.VFC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {width, height} = useWindowSize();
    const [drawerState, setDrawerState] = useState<boolean>(false);

    return (
        <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <Toolbar>
                        <RighteousFont>
                            Stdone
                        </RighteousFont>
                        <div style={{ flexGrow: 1 }}></div>
                        {Number(width) >= 500 ? (
                            <>
                                <Typography style={{ color: 'black', margin: '0 20px' }}>
                                    使い方
                                </Typography>
                                <Typography style={{ color: 'black', margin: '0 20px' }}>
                                    対応通貨
                                </Typography>
                                <LoginButton variant="contained" style={{ margin: '0 20px' }}>
                                    ログイン
                                </LoginButton>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="default"
                                    aria-label="open drawer"
                                    sx={{ mr: 2 }}
                                    onClick={() => setDrawerState(true)}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Drawer
                                    anchor="right"
                                    open={drawerState}
                                    onClose={() => setDrawerState(false)}
                                >
                                    <Box sx={{ width: 200 }} role="presentation">
                                        {/* 使い方 */}
                                        <List>
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <InfoIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'使い方'} />
                                            </ListItem>
                                        </List>
                                        {/* 対応通貨 */}
                                        <List>
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <LocalAtmIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'対応通貨'} />
                                            </ListItem>
                                        </List>
                                        <List>
                                            <LoginButton variant="contained" style={{ margin: '0 50px' }}>
                                                ログイン
                                            </LoginButton>
                                        </List>
                                    </Box>
                                </Drawer>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
        </React.Fragment>
    );
}