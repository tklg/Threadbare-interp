import React from 'react';
import Infinite from 'react-infinite';

export default class Console extends React.Component {
	constructor() {
		super();
		this.state = {
			height: 0,
		}
		this.resize = this.resize.bind(this);
		this.getLine = this.getLine.bind(this);
	}
	componentDidMount() {
		window.addEventListener("resize", this.resize);
		this.resize();
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.resize);
	}
	resize() {
		var height = this.elem.clientHeight;
		this.setState({height});
	}
	getLine(line, i) {
		return (
			<div className={"line" + (" " + line.type)} key={i} title={line.text}>{line.text}</div>
		);
	}
	render() {
		return (
			<section 
				className="view-console"
				ref={elem => this.elem = elem}>
				<header className="header">
					Output
				</header>
				<Infinite
					className="infinite-scroller"
					containerHeight={this.state.height - 30 || 20}
					elementHeight={18}
					//displayBottomUpwards={true} 
					>
					{this.props.lines.map(this.getLine)}
				</Infinite>
			</section>
		);
	}
}
