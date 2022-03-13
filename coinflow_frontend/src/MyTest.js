import React, { useState, useCallback } from 'react';
import ReactFlow from "react-flow-renderer";

const initialElements = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
    { id: 'e1-2', source: '1', target: '2' },
];


const MyTest = () => {
    const [elements, setElements] = useState(initialElements);

    const onAdd = useCallback(() => {
        const newNode = {
            id:0,
            data: { label: 'Added node' },
            position: {
                x: Math.random() * window.innerWidth - 100,
                y: Math.random() * window.innerHeight,
            },
        };
        setElements((els) => els.concat(newNode));
    }, [setElements]);

    return (
        <>
            <ReactFlow elements={elements}>
                <div className="save__controls">
                    <button onClick={onAdd}>add node</button>
                </div>
            </ReactFlow>
            <button onClick={onAdd}>add node</button>
        </>
    );
};

export default MyTest;