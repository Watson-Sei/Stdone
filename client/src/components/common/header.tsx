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
import PersonIcon from '@mui/icons-material/Person';
import styled from '@emotion/styled';
import { useWindowSize } from '../../hooks/use-window';
import { useCookies } from 'react-cookie';
import { useAuthContext } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';

const RighteousFont = styled(Typography)`
    color: black;
    font-size: 24px;
    font-weight: bold;
    margin-left: 20px;
`;

const LoginButton = styled(Button)`
    background: #16449A;
`;

const ButtonDisableStyle = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    appearance: none;
`;

export const Header: React.VFC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {width, height} = useWindowSize();
    const [drawerState, setDrawerState] = useState<boolean>(false);
    const [,, removeCookie] = useCookies();
    const { user, setUser } = useAuthContext();
    const history = useHistory();

    const handleLogout = async () => {
        removeCookie('access_token');
        setUser(undefined);
        window.location.href = '/signin';
    }

    const move = (path: string) => {
        history.push(path);
    };

    return (
        <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
                    <Toolbar>
                        <RighteousFont>
                            Stdone
                        </RighteousFont>
                        <div style={{ flexGrow: 1 }}></div>
                        {Number(width) >= 700 ? (
                            <>
                                <ButtonDisableStyle onClick={() => move('/')}>
                                    <Typography style={{ color: 'black', margin: '0 20px' }}>
                                        使い方
                                    </Typography>
                                </ButtonDisableStyle>
                                <ButtonDisableStyle onClick={() => move('/')}>
                                    <Typography style={{ color: 'black', margin: '0 20px' }}>
                                        対応通貨
                                    </Typography>
                                </ButtonDisableStyle>
                                {user ? (
                                    <>
                                        <ButtonDisableStyle onClick={() => move('/profile')}>
                                            <Typography style={{ color: 'black', margin: '0 20px' }}>
                                                プロフィール
                                            </Typography>
                                        </ButtonDisableStyle>
                                        <LoginButton 
                                            variant="contained" 
                                            style={{ margin: '0 20px' }}
                                            onClick={() => handleLogout()}
                                        >
                                            ログアウト
                                        </LoginButton>
                                    </>
                                ) : (
                                    <>
                                        <LoginButton 
                                            variant="contained" 
                                            style={{ margin: '0 20px' }}
                                            onClick={() => move('/signin')}
                                        >
                                            ログイン
                                        </LoginButton>
                                    </>
                                )}
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
                                    <Box sx={{ width: 250 }} role="presentation">
                                        {/* 使い方 */}
                                        <List>
                                            <ListItem button onClick={() => move('/')}>
                                                <ListItemIcon>
                                                    <InfoIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'使い方'} />
                                            </ListItem>
                                        </List>
                                        {/* 対応通貨 */}
                                        <List>
                                            <ListItem button onClick={() => move('/')}>
                                                <ListItemIcon>
                                                    <LocalAtmIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={'対応通貨'} />
                                            </ListItem>
                                        </List>
                                        <List>
                                        {user ? (
                                            <>
                                                <ListItem button onClick={() => move('/profile')}>
                                                    <ListItemIcon>
                                                        <PersonIcon />
                                                    </ListItemIcon>
                                                    <Typography style={{ color: 'black' }}>
                                                        プロフィール
                                                    </Typography>
                                                </ListItem>
                                                <LoginButton 
                                                    variant="contained" 
                                                    style={{ margin: '20px 45px' }}
                                                    onClick={() => handleLogout()}
                                                >
                                                    ログアウト
                                                </LoginButton>
                                            </>
                                        ) : (
                                            <>
                                                <LoginButton 
                                                    variant="contained" 
                                                    style={{ margin: '0 50px' }}
                                                    onClick={() => move('/signin')}
                                                >
                                                    ログイン
                                                </LoginButton>
                                            </>
                                        )}
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