import './RecentTransaction.css';
import React from 'react';
import {ListItem, ListItemButton} from "@mui/material";
import axios from "axios";

export class RecentTransaction extends React.Component {

    /**
     * changes and updates the name filter.
     */
    handleClick = () => {
        var data = JSON.stringify({
            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [
                this.props.transaction
            ],
            "id": 1
        });

        var config = {
            method: 'post',
            url: 'https://eth.nownodes.io/7CbTVmgR5sYFrxcHJeS1zh0laIZXiQDN',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(response => {
                console.log(JSON.stringify(response.data));
                this.props.newGraph(response.data.result.from, response.data.result.to, response.data.result.value)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <ListItem key={this.props.index}>
                <ListItemButton className="recentTransactionContent" onClick={this.handleClick}>
                    <div>{this.props.direction}</div>
                    <div>{this.props.address}</div>
                </ListItemButton>
            </ListItem>
        )
    }
}