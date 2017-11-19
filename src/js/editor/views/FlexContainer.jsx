import React from 'react';

export default class FlexContainer extends React.Component {
	constructor() {
		super();
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {
		
	}
	render() {
		return (
			<div 
				className={
					"flex-container" 
					+ (this.props.flexDirection ? " " + this.props.flexDirection : "")
					+ (this.props.className ? " " + this.props.className : "")}>
				{this.props.children}
			</div>
		);
	}
}
