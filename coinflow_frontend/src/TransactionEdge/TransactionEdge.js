import './TransactionEdge.css';
import React from 'react';
import {getBezierPath, getEdgeCenter, getMarkerEnd,} from 'react-flow-renderer';

export default function TransactionEdge({id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data, arrowHeadType, markerEndId, label}) {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const calculateValue = () =>{
        return label.toFixed(5) + " eth";
    }

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <foreignObject
                width={100}
                height={100}
                x={edgeCenterX}
                y={edgeCenterY}
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <div className="transactionEdgeContent">
                    {calculateValue()}
                </div>
            </foreignObject>
        </>
    );
}