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
						className="btn show-ast"
						onClick={(e) => this.props.onClickShowAST()}>
						{this.props.showingAST ? "View editor" : "View AST"}
					</button> 
					{!this.props.showingAST &&
						<button 
							className="btn parse"
							onClick={this.props.onClickParse}>
							Parse
						</button>
					}
					{!this.props.showingAST &&
						<button 
							className="btn start"
							onClick={this.props.onClickStart}>
							Start
						</button>
					}
					{!this.props.showingAST &&
						<button 
							className="btn step"
							onClick={this.props.onClickStep}>
							Step
						</button>
					}
					{!this.props.showingAST && 
						<button 
						className="btn stop"
						onClick={this.props.onClickStop}>
						Stop
					</button>}
				</nav>
			</header>
		);
	}
}
