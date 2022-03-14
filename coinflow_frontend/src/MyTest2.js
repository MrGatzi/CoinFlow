import React from 'react';
import ReactFlow from "react-flow-renderer";

const initialElements = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 100, y: 100 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
    { id: 'e1-2', source: '1', target: '2' },
];


export class MyTest2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            elements: initialElements,
        };
    }
    onAdd = () => {
        const newNode = {
            id:0,
            data: { label: 'Added node' },
            position: {
                x: Math.random() * window.innerWidth - 100,
                y: Math.random() * window.innerHeight,
            },
        };
        this.setState({elements: this.state.elements.concat(newNode)});
    };


    render() {
        return (
            <>
                <ReactFlow elements={this.state.elements}>
                    <div className="save__controls">
                        <button onClick={this.onAdd}>add node</button>
                    </div>
                </ReactFlow>
                <button onClick={this.onAdd}>add node</button>
            </>
        );
    }
};

export default MyTest2;