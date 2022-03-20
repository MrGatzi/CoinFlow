import './AccountNode.css';
import React, {memo, useContext, useEffect} from 'react';
import {Handle} from 'react-flow-renderer';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Collapse, Divider, IconButton, MenuItem, Select, TextField, Tooltip} from "@mui/material";
import axios from "axios";
import RecentTransactionContext from "../Context/RecentTransactionContext";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DoneIcon from '@mui/icons-material/Done';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {ethers} from "ethers";


const allowedTokens = ["ETH", "USDT", "BNB", "USDC", "XRP", "LUNA", "ADA", "SOL", "AVAX", "DOT", "BUSD", "DOGE", "UST", "SHIB", "MATIC", "WBTC", "CRO", "DAI", "ATOM", "LTC", "NEAR", "LINK", "UNI", "TRX", "BCH", "FTT", "LEO", "ALGO", "ETC", "XLM", "MANA", "BTCB", "HBAR", "ICP", "WAVES", "EGLD", "XMR", "SAND", "VET", "FTM", "FIL", "AXS", "KLAY", "RUNE", "APE", "THETA", "XTZ", "HNT", "ZEC", "EOS", "FLOW", "MIOTA", "AAVE", "MKR", "GRT", "CAKE", "BTT", "STX", "GALA", "ONE", "NEO", "BSV", "XEC", "KCS", "QNT", "HT", "TUSD", "ENJ", "NEXO", "CELO", "KSM", "BAT", "CHZ", "OKB", "DASH", "AMP", "LRC", "AR", "KDA", "CVX", "CRV", "USDP", "XEM", "TFUEL", "MINA", "ROSE", "CEL", "COMP", "XYM", "HOT", "SCRT", "YFI", "DCR", "BORA", "USDN", "IOTX", "ANC", "SXP", "QTUM", "OMG", "XDC", "1INCH", "WAXP", "AUDIO", "BNT", "RENBTC", "PAXG", "ANKR", "RNDR", "WOO", "GNO", "BTG", "SNX", "ICX", "KNC", "RVN", "KAVA", "LPT", "ZIL", "GLMR", "RLY", "UMA", "GT", "VLX", "XDB", "VGX", "ZEN", "GLM", "SC", "IMX", "ZRX", "IOST", "ONT", "CHSB", "NFT", "FEI", "KEEP", "SUSHI", "STORJ", "SKL", "ELON", "REV", "GUSD", "JST", "GMT", "POLY", "HIVE", "TEL", "ILV", "SRM", "SYS", "REN", "CKB", "FLUX", "DYDX", "UOS", "DGB", "SPELL", "ENS", "PEOPLE", "XPRT", "CSPR", "TWT", "PERP", "NU", "OCEAN", "CEEK", "XNO", "BTRST", "PLA", "YGG", "FXS", "OGN", "LSK", "CELR", "MXC", "MBL", "C98", "WIN", "INJ", "SUPER", "RAY", "FET", "POWR", "XYO", "DENT", "TRIBE", "CHR", "XCH", "PYR", "MED", "ONG", "BOBA", "COTI", "REQ", "FX", "WRX", "ORBS", "MOVR"]

export default memo(({data, isConnectable, selected}) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(data.label);
    const [url, setUrl] = React.useState(null);
    const [highTokens, setHighTokens] = React.useState([]);
    const [tokens, setTokens] = React.useState([]);
    const [copyTooltip, setCopyTooltip] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const transactionsContext = useContext(RecentTransactionContext)

    // eslint-disable-next-line no-use-before-define
    useEffect(() => {
        accountBalanceRequest()
        urlRequest()
    }, [data]);      // eslint-disable-next-line react-hooks/exhaustive-deps

    function accountTransactionRequest() {
        console.log("Etherscan:");
        var config = {
            method: 'get',
            url: 'https://api.etherscan.io/api'
                + '?module=account'
                + '&action=txlist'
                + '&address=' + data.label + '&startblock=0'
                + '&endblock=99999999'
                + '&page=1'
                + '&offset=30'
                + '&sort=asc'
                + '&apikey=6X4A7RMH7ABXUDH9KV8UTWRYKFTZDWBJH8',
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data.result));
                const transactions = [];
                for (const element of response.data.result) {
                    let direction = "from";
                    let address = element.from;
                    if (data.label === element.from) {
                        direction = "to"
                        address = element.to
                    }
                    transactions.push({
                        address: address,
                        direction: direction,
                        hash: element.hash,
                        value: element.value / 1000000000000000000
                    })
                }
                transactionsContext.update(transactions)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function accountBalanceRequest() {
        console.log("covalenthq:");
        var config = {
            method: 'get',
            url: "https://api.covalenthq.com/v1/1/address/" + data.label + "/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_991b349d7fb744e49eec31a63a7"
        };

        axios(config)
            .then(function (response) {
                setTokens(response.data.data.items.filter(token => token.balance > 0 && token.type !== "dust" && allowedTokens.includes(token.contract_ticker_symbol)));
                setHighTokens([response.data.data.items.find(token => token.contract_ticker_symbol = "ETH")]);
                console.log(tokens)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async function urlRequest() {
        const provider = ethers.getDefaultProvider("homestead", {
            etherscan: "6X4A7RMH7ABXUDH9KV8UTWRYKFTZDWBJH8",
        });
        var ensUrl = await provider.lookupAddress(data.label);
        if (ensUrl !== null) {
            setName(ensUrl)
            setUrl(ensUrl)
        }
    }

    const showMoreAction = (e) => {
        setOpen(!open);
    };

    const showTransactionsAction = (e) => {
        accountTransactionRequest()
    };

    const editAction = () => {
        setEditMode(!editMode);
    };

    const copyAction = async () => {
        navigator.clipboard.writeText(data.label)
        setCopyTooltip(true)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCopyTooltip(false)
    };


    const openAction = () => {
        window.open("https://etherscan.io/address/" + data.label);
    };

    const getAllValue = () => {
        let value = 0;
        highTokens.forEach(token => value += token.quote)
        return value.toFixed(5) + " $"
    };

    const getBalance = (token) => {
        if (token !== null && token.quote_rate !== null) {
            console.log(token)
            return (token.balance / Math.pow(10, token.contract_decimals)).toFixed(5) + " " + token.contract_ticker_symbol
        } else {
            return "0 $ (@  ???)"
        }
    };

    const getTokenValue = (token) => {
        if (token !== null && token.quote_rate !== null) {
            console.log(token)
            return  token.quote + " $ - (@ " + token.quote_rate.toFixed(2) + ")"
        } else {
            return "0 $ (@  ???)"
        }
    };

    const changeToken = (event) => {

        setHighTokens(event.target.value);
    };

    return (<>
        <Handle
            type="target"
            position="left"
            style={{background: '#555'}}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
        />
        <div className={selected ? 'accountNodeContentSelected' : 'accountNodeContent'}
             onClick={showTransactionsAction}>
            <div className="accountNodeHeader">
                <IconButton color="primary" component="span">
                    <AccountBoxIcon/>
                </IconButton>
                {editMode ? <TextField className="accountNodeName" label="Name" variant="standard" value={name}
                                       onChange={(e) => {
                                           setName(e.target.value)
                                       }}/> : <div className="accountNodeName">{name}</div>}
                <IconButton color="primary" component="span" onClick={editAction}>
                    {editMode ? <DoneIcon/> : <ModeEditIcon/>}

                </IconButton>
                <IconButton color="primary" component="span" onClick={showMoreAction}>
                    {open ? <ExpandLess/> : <ExpandMore/>}
                </IconButton>
            </div>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <div>
                    <Divider/>
                    <span> Address: {data.label}</span>

                    <Tooltip open={copyTooltip} leaveDelay={600} title="copied !">
                        <IconButton color="primary" size="small" onClick={copyAction}>
                            <ContentCopyOutlinedIcon fontSize="inherit"/>
                        </IconButton>
                    </Tooltip>
                    <IconButton color="primary" size="small" onClick={openAction}>
                        <OpenInNewIcon fontSize="inherit"/>
                    </IconButton>
                </div>
                {url ? <div>URL: {url}</div> : <></>}
                <div className="accountNodeRow">
                    <div  className="accountNodeValue">Value: {getAllValue()}</div>
                    {tokens.length ?
                        <div>Tokens:
                            <Select
                                onChange={changeToken}
                                multiple
                                value={highTokens}
                                renderValue={(selected) => (
                                    <>
                                        {selected.map((value) => (
                                            <img alt="a" className="tokenImageHigh" src={value.logo_url}/>
                                        ))}
                                    </>
                                )}
                            >
                                {tokens.map((token, index) => (
                                    <MenuItem key={index} value={token}>
                                        <img alt="a" className="tokenImage" src={token.logo_url}/>
                                        {token.contract_ticker_symbol} {"  "}
                                        {(token.balance / Math.pow(10, token.contract_decimals)).toFixed(5)}
                                    </MenuItem>  //TODO maybe use (@{token.quote_rate}) ? and show qoata as well ?
                                ))}
                            </Select>
                        </div> : <></>}

                </div>

                <div className="accountBalanceRegion">
                    {highTokens.map((token) => (
                        <div className="accountBalanceSingeTokenRegion">
                            <img className="tokenImage" src={token.logo_url}/>
                            <span>{getBalance(token)}</span>
                            <span>{getTokenValue(token)}</span>
                        </div>
                    ))}
                </div>
            </Collapse>
        </div>

        <Handle
            type="source"
            position="right"
            style={{background: '#555'}}
            isConnectable={isConnectable}
        />
    </>);
});