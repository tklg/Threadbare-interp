import React from 'react';

export default class Header extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {
		
	}
	render() {
		return (
			<header className="page-header">
				<h1>Threadbare</h1>
				<nav className="controls">
					<button 
						className="btn parse"
						onClick={this.props.onClickParse}>
						Parse
					</button>
					<button 
						className="btn start"
						onClick={this.props.onClickStart}>
						Start
					</button>
					<button 
						className="btn step"
						onClick={this.props.onClickStep}>
						Step
					</button>
					{/*<button 
						className="btn stop"
						onClick={this.props.onClickStop}>
						Stop
					</button>*/}
				</nav>
			</header>
		);
	}
}
