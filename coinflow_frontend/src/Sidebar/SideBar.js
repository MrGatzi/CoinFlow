import './Sidebar.css';
import React from 'react';

export class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
            {this.props.open ? <div className="sideBarContent">{this.props.children}</div> : <div className="sideBarContentGone">{this.props.children}</div>}
            </>
        );
    }
}

