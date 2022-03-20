import './App.css';
import React from 'react';
import ReactFlow, {Background, Controls} from 'react-flow-renderer';
import Button from '@mui/material/Button';
import axios from 'axios';
import { List, TextField} from "@mui/material";
import AccountNode from './AccountNode/AccountNode';
import TransactionEdge from './TransactionEdge/TransactionEdge';
import {RecentTransactionProvider} from "./Context/RecentTransactionContext";
import {RecentTransaction} from "./RecentTransaction/RecentTransaction";
import {SideBar} from "./Sidebar/SideBar";


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

let id = 0;

const getNodeId = () => {
    id++;
    return id;
}

const nodeTypes = {
    accountNode: AccountNode,
};
const edgeTypes = {
    transactionEdge: TransactionEdge,
};

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flowInstance: null,
            elements: [],
            searchInput: "0x2eb0df6debc4b7f13801bc2c28ef23bdd3ed326e096de71a4bd8eb185c1aa263",
            transactions: [],
        };
    }

    addNewNode = (labelInput) => {
        let newId = getNodeId();
        const newNode = {
            id: newId,
            sourcePosition: 'right',
            targetPosition: 'left',
            type: 'accountNode',
            data: {label: labelInput},
            position: {
                x: getRandomArbitrary(10, 200), y: getRandomArbitrary(10, 200),
            },
        };
        return newNode;
    }

    addNewEdge = (from, to, value) => {
        const newEdge = {
            id: from + "-" + to,
            source: from,
            target: to,
            label: value,
            animated: true,
            arrowHeadType: 'arrowclosed',
            type: 'transactionEdge'
        };
        return newEdge;
    }


    loadInitialData = () => {
        console.log("NOWNodes:");
        var data = JSON.stringify({
            "jsonrpc": "2.0", "method": "eth_getTransactionByHash", "params": [this.state.searchInput], "id": 1
        });

        var config = {
            method: 'post', url: 'https://eth.nownodes.io/7CbTVmgR5sYFrxcHJeS1zh0laIZXiQDN', headers: {
                'Content-Type': 'application/json'
            }, data: data
        };

        axios(config)
            .then(response => {
                console.log(JSON.stringify(response.data));
                this.createNewGraphEntry(response.data.result.from, response.data.result.to, response.data.result.value)
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    newState;

    createNewGraphEntry = (from, to, value) => {
        console.log(this.state.elements);
        let newNodes = [];
        let fromNode = this.state.elements.find(e => e.type === 'accountNode' && e.data.label === from);
        if (typeof fromNode === 'undefined') {
            fromNode = this.addNewNode(from);
            newNodes.push(fromNode)
        }
        let toNode = this.state.elements.find(e => e.type === 'accountNode' && e.data.label === to);
        if (typeof toNode === 'undefined') {
            toNode = this.addNewNode(to);
            newNodes.push(toNode)
        }
        let edge = this.addNewEdge(fromNode.id, toNode.id, value / 1000000000000000000);
        newNodes.push(edge)
        let newState = this.state.flowInstance.getElements().concat(newNodes)
        //TODO: Find out WHY !
        this.setState({elements: []}, function () {
            this.setState({elements: newState});
        });
        console.log(this.state.elements)
    }

    changeSearchInput = (e) => {
        this.setState({searchInput: e.target.value});
    }


    changeTransactions = (e) => {
        this.setState({transactions: e});
    }


    onLoad = (reactFlowInstance) => {
        this.setState({flowInstance: reactFlowInstance})
    };

    onPaneClick = () => {
        this.setState({transactions: []})
    };

    render() {
        return (<RecentTransactionProvider value={{value: this.state.transactions, update: this.changeTransactions}}>
            <div className="app">
                <div className="appBar">
                    <TextField
                        className="transactionInput"
                        variant="standard"
                        type="search"
                        label="Enter a ETH transaction"
                        value={this.state.searchInput}
                        onChange={this.changeSearchInput}
                    />
                    <Button onClick={this.loadInitialData}>
                        Gooo!
                    </Button>
                </div>
                <div className="mainContent">
                    <div className="graphRegion">
                        <ReactFlow
                            onLoad={this.onLoad}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            onPaneClick={this.onPaneClick}
                            elements={this.state.elements}>
                            <Controls/>
                            <Background/>
                        </ReactFlow>
                    </div>
                    <SideBar className="sideBarRegion" open={this.state.transactions.length}>
                        <List>
                            {this.state.transactions.map((item, index) => (
                                <RecentTransaction key={index} transaction={item} index={index}
                                                   newGraph={this.createNewGraphEntry}/>))}
                        </List>
                    </SideBar>
                </div>
            </div>
        </RecentTransactionProvider>);
    }
}
