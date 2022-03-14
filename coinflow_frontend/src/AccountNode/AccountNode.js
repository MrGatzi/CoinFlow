import './AccountNode.css';
import React, {memo, useContext} from 'react';
import {Handle} from 'react-flow-renderer';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Collapse} from "@mui/material";
import axios from "axios";
import RecentTransactionContext from "../Context/RecentTransactionContext";

export default memo(({data, isConnectable, selected}) => {
    const [open, setOpen] = React.useState(false);

    const transactionsContext = useContext(RecentTransactionContext)

    const handleClick = () => {
        setOpen(!open);
        testRequest()
    };

    function testRequest() {
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
                    transactions.push({address: address, direction: direction, hash: element.hash, value:element.value/ 1000000000000000000})
                }
                transactionsContext.update(transactions)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            <Handle
                type="target"
                position="left"
                style={{background: '#555'}}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <div className={selected ? 'accountNodeContentSelected' : 'accountNodeContent'} onClick={handleClick}>
                <AccountBoxIcon/>
                {data.label}
                {open ? <ExpandLess/> : <ExpandMore/>}
                <Collapse in={open} timeout="auto" unmountOnExit></Collapse>
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