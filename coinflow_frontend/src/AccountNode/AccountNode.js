import './AccountNode.css';
import React, {memo, useContext, useEffect} from 'react';
import {Handle} from 'react-flow-renderer';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Collapse, Divider, IconButton, TextField, Tooltip} from "@mui/material";
import axios from "axios";
import RecentTransactionContext from "../Context/RecentTransactionContext";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DoneIcon from '@mui/icons-material/Done';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';

export default memo(({data, isConnectable, selected}) => {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState(data.label);
    const [tokens, setTokens] = React.useState([]);
    const [ethValue, setEthValue] = React.useState(null);
    const [copyTooltip, setCopyTooltip] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const transactionsContext = useContext(RecentTransactionContext)

    useEffect(() => {
        accountBalanceRequest()
    },[data]);

    function accountTransactionRequest() {
        console.log("Etherscan:");
        var config = {
            method: 'get',
            url: 'https://api.etherscan.io/api' +
                '?module=account' +
                '&action=txlist' +
                '&address=' + data.label +
                '&startblock=0' +
                '&endblock=99999999' +
                '&page=1' +
                '&offset=30' +
                '&sort=asc' +
                '&apikey=6X4A7RMH7ABXUDH9KV8UTWRYKFTZDWBJH8',
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
            url: "https://api.covalenthq.com/v1/1/address/" + data.label +
                "/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=false&key=ckey_991b349d7fb744e49eec31a63a7"
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data.data.items));
                let tokens=response.data.data.items;

                console.log(tokens.find(token=>token.contract_name==="Ether"))
                setEthValue(tokens.find(token=>token.contract_name==="Ether"))
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const showMoreAction = (e) => {
        setOpen(!open);
    };

    const showTransactionsAction = (e) => {
        accountTransactionRequest()
    };

    const editAction = (e) => {
        setEditMode(!editMode);
    };

    const copyAction = async (e) => {
        navigator.clipboard.writeText(data.label)
        setCopyTooltip(true)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCopyTooltip(false)
    };

    const getValue = () => {
       if(ethValue!==null){
           return ethValue.quote + " $ (@ "+ ethValue.quote_rate.toFixed(2) +"/ETH)"
       }else{
           return "0 $"
       }
    };
    const getBalance = () => {
        if(ethValue!==null){
            return (ethValue.balance/ 1000000000000000000).toFixed(5) + " ETH"
        }else{
            return "0 ETH"
        }
    };

    return (
        <>
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
                                           }}/> :
                        <div className="accountNodeName">{name}</div>}
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
                        <IconButton color="primary" size="small" onClick={copyAction}>
                            <QrCode2OutlinedIcon fontSize="inherit"/>
                        </IconButton>
                    </div>
                    <div>URL:</div>
                    <div>Balance: {getBalance()}</div>
                    <div>Value: {getValue()}</div>
                    <div>Tokens:</div>
                </Collapse>
            </div>

            <Handle
                type="source"
                position="right"
                style={{background: '#555'}}
                isConnectable={isConnectable}
            />
        </>
    );
});