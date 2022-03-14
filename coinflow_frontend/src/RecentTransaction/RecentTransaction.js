import './RecentTransaction.css';
import React from 'react';
import {ListItem, ListItemButton} from "@mui/material";
import axios from "axios";

export class RecentTransaction extends React.Component {
    handleClick = () => {
        var data = JSON.stringify({
            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [
                this.props.transaction.hash
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

    showValue = (value) =>{
        if(value!=null){
            return value.toFixed(5)
        }
    }

    render() {
        return (
            <ListItemButton key={this.props.index} disableGutters divider={true} className="recentTransactionContent"
                            onClick={this.handleClick}>
                {this.props.transaction.direction === "from" ?
                    <span className="recentTransactionDirectionOut">OUT</span> :
                    <span className="recentTransactionDirectionIn">IN</span>}
                <div>{this.showValue(this.props.transaction.value)} ETH</div>
                <div>{this.props.transaction.address}</div>
            </ListItemButton>
        )
    }
}