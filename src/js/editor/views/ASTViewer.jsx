import React from 'react';
import Log from './../../logger/Log.js';

export default class ASTViewer extends React.Component {
	constructor() {
		super();
		this.getTreeString = this.getTreeString.bind(this);
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {
		
	}
	getTreeString() {
		var cache = [];
		var str = this.props.ast;
		var html = false;
		return JSON.stringify(str, function(key, value) {
			if (['_hasRun', '_declIndex', '_stepIndex', '_argsIndex', '_raw'].includes(key)) return;
		    if (typeof value === 'object' && value !== null) {
		        if (cache.indexOf(value) !== -1) {
		            // Circular reference found, discard key
		            return html ? '<span style="color:red">[CircularRef]</span>' : 'circular';
		        }
		        // Store value in our collection
		        cache.push(value);
		    }
		    //return `<span style="color:#777777">${value}</span>`;
		    return value;
		}, 2);
	}
	render() {
		return (
			<div className="view-ast">
				<header className="header">
					<span>Abstract syntax tree for {this.props.fileName}</span>
				</header>
				{/*<textarea readOnly value={this.getTreeString()}></textarea>*/}
				<div>{this.getTreeString()}</div>
			</div>
		);
	}
}
