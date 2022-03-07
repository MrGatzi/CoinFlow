import './App.css';
import React, {useCallback, useState} from 'react';
import ReactFlow from 'react-flow-renderer';
import Button from '@mui/material/Button';
import axios from 'axios';
import {TextField} from "@mui/material";
import AccountNode from './AccountNode/AccountNode';
import TransactionEdge from './TransactionEdge/TransactionEdge';

const elements=[];

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
let id=0;

const getNodeId = () =>{
    id++;
    return id;
}

const nodeTypes = {
    accountNode: AccountNode,
};
const edgeTypes = {
    transactionEdge: TransactionEdge,
};

function App() {
    const [myElements, setElements] = useState(elements);
    const [searchInput, setSearchInput] = useState("");

    const onAdd = useCallback(() => {
        loadInitialData()

    });


    function addNewNode( labelInput ) {
        let newId=getNodeId();
        const newNode = {
            id: newId,
            sourcePosition: 'right',
            targetPosition: 'left',
            type:'accountNode',
            data: {label: labelInput},
            position: {
                x: getRandomArbitrary(10,200),
                y: getRandomArbitrary(10,200),
            },
        };
        setElements((els) => els.concat(newNode));
        return newId;
    }

    function addNewEdge( from, to, value ) {
        let newId=getNodeId();
        const newNode =  {id: from+"-"+to, source: from, target: to, label:value, animated: true, arrowHeadType: 'arrowclosed', type: 'transactionEdge'};
        setElements((els) => els.concat(newNode));
        return newId;
    }


    function loadInitialData() {
        console.log("NOWNodes:");
        var data = JSON.stringify({
            "jsonrpc": "2.0",
            "method": "eth_getTransactionByHash",
            "params": [
                searchInput
            ],
            "id": 1
        });

        var config = {
            method: 'post',
            url: 'https://eth.nownodes.io/7CbTVmgR5sYFrxcHJeS1zh0laIZXiQDN',
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                let from =addNewNode(response.data.result.from);
                let to = addNewNode(response.data.result.to);
                addNewEdge(from, to, response.data.result.value/1000000000000000000 );
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /**
     * changes and updates the name filter.
     */
    function changeNameFilter(e){
        setSearchInput(e.target.value);
    }



    return (
        <div className="app">
            <TextField
                className="transactionInput"
                variant="standard"
                type="search"
                label="Enter a ETH transaction"
                value={searchInput}
                onChange={changeNameFilter}
            />
            <Button  onClick={onAdd}>
                Gooo!
            </Button >
            <div className="graphRegion">
                <ReactFlow
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    elements={myElements}/>
            </div>
        </div>
    );
}

export default App;
