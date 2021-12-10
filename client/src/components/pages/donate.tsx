import React, {useEffect,useState} from 'react';
import {
    useParams,
    useHistory
} from 'react-router-dom';
import styled from '@emotion/styled';
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Modal, Typography } from '@mui/material';
import { CurrencyAmountSupport } from '../../utils/currency';
import { ContractTransaction, ethers } from 'ethers';
import DonateJson from '../../contracts/Donate.json';
import JPYCJson from '../../contracts/Token.json';

const DonateBox = styled(Box)`
    width: 1120px;
    height: 700px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;

    @media (max-width: 1160px) {
        width: 860px;
    }

    @media (max-width: 900px) {
        width: 100%;
    }
`;

const LeftBox = styled(Box)`
    width: 750px;
    height: 700px;

    @media (max-width: 1160px) {
        width: 100%;
    }
`;

const SettingBox = styled(Box)`
    width: 100%;
    height: 700px;
    background: #EDEDED;
    border-radius: 15px;
`;

const UsernameBox = styled(Box)`
    height: 60px;
    padding: 20px;
`;

const UsernameInput = styled(TextField)`
    width: 100%;
    margin: 0 auto;
    background: white;
`;

const DonateAmountBox = styled(Box)`
    height: 150px;
    padding: 20px;
`;

const TopContentBox = styled(Box)`
    height: 80px;
    background: white;
    display: flex;
    justify-content: space-between;
    border-radius: 10px 10px 0 0;
`;

const SelectCurrencyBox = styled(Box)`
    width: 20%;
    height: 80px;
`;

const InputAmountBox = styled(Box)`
    width: 80%;
    height: 80px;

    @media (max-width: 680px) {
        width: 60%;
    }
`;

const BottomContentBox = styled(Box)`
    height: 70px;
    background: white;
    border-radius:  0 0 10px 10px;
`;

const SelectAmountAidUl = styled.ul`
    overflow-x: auto;
    white-space: nowrap;
    padding: 0;
    margin: 0 auto;
`;

const SelectAmountAidLi = styled.li`
    display: inline-block;
    width: 170px;
    height: 50px;
    color: white;
    margin: 0 15px;
`;

const AmountButton = styled(Button)`
    width: 100%;
    height: 50px;
`;

const MessageBox = styled(Box)`
    padding: 20px;
    height: 150px;
`;

const DonateButtonBox = styled(Box)`
    padding: 20px;
    height: 150px;
    display: flex;
    align-items: flex-end;
`;

const DonateButton = styled(Button)`
    width: 100%;
    height: 40px;
`;

const RightBox = styled(Box)`
    width: 350px;
    height: 700px;

    @media (max-width: 1160px) {
        display: none;
    }
`;

const PreviewBox = styled(Box)`
    width: 100%;
    height: 320px;
    background: #EDEDED;
    border-radius: 15px;
`;

const HistoryBox = styled(Box)`
    width: 100%;
    height: 360px;
    background: #EDEDED;
    border-radius: 15px;
    margin-top: 20px;
`;

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    height: 100,
    bgcolor: 'background.paper',
    border: '2px solid rgb(22, 68, 154)',
    borderRadius: 5,
    p: 4,
}

interface Window {
    ethereum: any;
}

declare const window: Window;

export const Donate: React.VFC = () => {
    const history = useHistory();
    let {username} =  useParams<{username: string}>();
    const [donateUserInfo, setDonateUserInfo] = useState<{username: string; address: string} | undefined>(undefined);
    const [currency, setCurrency] = useState<string>("JPYC");
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [modal, setModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    // 初回のみ
    useEffect(() => {
        fetch(`http://localhost:5000/user/donateUser/${username}`, {
            method: 'GET',
            mode: 'cors',
        })
        .then(response => {
            if (response.status === 204) {
                history.push('/404')
                return;
            }
            return response.json()
        })
        .then(data => {
            setDonateUserInfo(data.donateUser)
        })
        .catch(error => {
            history.push('/404');
        })
    }, [history, username]);

    const handleChangeSelectCurrency = (event: SelectChangeEvent) => {
        setCurrency(event.target.value as string);
    };

    const DonateHandle = async () => {
        if (currency === "JPYC" && amount >= 1000 && username !== "") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner(0);
            const tokenContract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", JPYCJson.abi, signer);
            const donateContract = new ethers.Contract("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", DonateJson.abi, signer);
            const sendAmount = ethers.utils.parseEther(String(amount));
            try {
                let tx: ContractTransaction = await tokenContract.approve("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", "0x" + (amount * 10 ** 18).toString(16))
                setModal(true);
                setModalMessage("Approve中です...")
                await tx.wait();
                setModal(false);
                setModalMessage("");
                tx = await donateContract.Transfers(donateUserInfo?.address, sendAmount)
                setModal(true);
                setModalMessage("送金中です...");
                await tx.wait();
                setModal(false);
                setModalMessage("");
            } catch (error: any) {
                console.log(error.message);
            }
        }
    }

    const placeholderDefaultAmount = () => {
        if (currency === "JPYC") {
            return "1000";
        } else if (currency === "USDC") {
            return "0.111688";
        } else if (currency === "ETH") {
            return "0.0000265733";
        } else {
            return "通貨をしていしてください"
        }
    }

    return (
        <React.Fragment>
            <DonateBox>
                <LeftBox>
                    <SettingBox>
                        <UsernameBox>
                            <UsernameInput label="username" variant="outlined" />
                        </UsernameBox>
                        <DonateAmountBox>
                            <TopContentBox>
                                <SelectCurrencyBox>
                                    <FormControl style={{ marginTop: 10, marginLeft: 16}}>
                                        <InputLabel id="select-currency">通貨</InputLabel>
                                        <Select
                                            labelId="select-currency"
                                            value={currency}
                                            label="通貨"
                                            onChange={handleChangeSelectCurrency}
                                        >
                                            <MenuItem value={"JPYC"}>JPYC</MenuItem>
                                            <MenuItem value={"USDC"}>USDC</MenuItem>
                                            <MenuItem value={"ETH"}>ETH</MenuItem>
                                        </Select>
                                    </FormControl>
                                </SelectCurrencyBox>
                                <InputAmountBox>
                                    <TextField
                                        id="input-amount"
                                        label="Amount"
                                        type="number"
                                        InputProps={{
                                            style: {fontSize: 30},
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <img src={`${process.env.PUBLIC_URL}/jpyc.png`} alt="" style={{ width: "25px"}} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        value={amount}
                                        variant="standard"
                                        style={{ width: "98%" }}
                                        placeholder={`${placeholderDefaultAmount()}`}
                                        onChange={(event) => setAmount(Number(event.target.value))}
                                    />
                                </InputAmountBox>
                            </TopContentBox>
                            <BottomContentBox>
                                <SelectAmountAidUl>
                                    {CurrencyAmountSupport(currency).map((supportAmount, index) => (
                                        <SelectAmountAidLi key={index}>
                                            <AmountButton variant="outlined" onClick={() => setAmount(supportAmount)}>
                                                {supportAmount}
                                            </AmountButton>
                                        </SelectAmountAidLi>
                                    ))}                                
                                </SelectAmountAidUl>
                            </BottomContentBox>
                        </DonateAmountBox>
                        <MessageBox>
                            <TextField
                                id="donate-message"
                                label="Donation Message"
                                multiline
                                rows={4}
                                style={{ background: 'white', width: '100%' }}
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                            />
                        </MessageBox>
                        <DonateButtonBox>
                            <DonateButton onClick={() => DonateHandle()} variant="contained" style={{ background: '#16449A'}}>
                                Donate
                            </DonateButton>
                        </DonateButtonBox>
                    </SettingBox>
                </LeftBox>
                <RightBox>
                    <PreviewBox></PreviewBox>
                    <HistoryBox />
                </RightBox>
            </DonateBox>
            <Modal
                open={modal}
                onClose={() => setModal(false)}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h5" style={{ textAlign: 'center' }}>
                        {modalMessage}
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    )
}