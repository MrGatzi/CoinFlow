import './AccountNode.css';
import React, { memo } from 'react';
import { Handle } from 'react-flow-renderer';

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position="left"
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <div className="accountNodeContent">
                {data.label}
            </div>
            <Handle
                type="source"
                position="right"
                style={{ background: '#555' }}
                isConnectable={isConnectable}
            />
        </>
    );
});