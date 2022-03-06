import './App.css';
import React, {useCallback, useState} from 'react';
import ReactFlow from 'react-flow-renderer';

const elements = [
    {
        id: '1',
        type: 'input', // input node
        data: {label: 'Input Node'},
        position: {x: 250, y: 25},
    },
    // default node
    {
        id: '2',
        // you can also pass a React component as a label
        data: {label: <div>Default Node</div>},
        position: {x: 100, y: 125},
    },
    {
        id: '3',
        type: 'output', // output node
        data: {label: 'Output Node'},
        position: {x: 250, y: 250},
    },
    // animated edge
    {id: 'e1-2', source: '1', target: '2', animated: true},
    {id: 'e2-3', source: '2', target: '3'},
];
const getNodeId = () => `randomnode_${+new Date()}`;

function App() {
    const [myElements, setElements] = useState(elements);

    const onAdd = useCallback(() => {
        const newNode = {
            id: getNodeId(),
            data: { label: 'Added node' },
            position: {
                x: 250,
                y: 250,
            },
        };
        setElements((els) => els.concat(newNode));
        console.log(myElements)
    }, [setElements]);

    return (
        <div className="App">
            <div style={{height: 1000}}>
                <ReactFlow elements={myElements}/>
            </div>
            <button onClick={onAdd}>
                Activate Lasers
            </button>
        </div>
    );
}

export default App;
