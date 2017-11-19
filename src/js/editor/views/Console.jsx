import React from 'react';
import Infinite from 'react-infinite';

export default class Console extends React.Component {
	constructor() {
		super();
		this.state = {
			height: 0,
			displayAll: false
		}
		this.resize = this.resize.bind(this);
		this.getLine = this.getLine.bind(this);
		this.setCheckValue = this.setCheckValue.bind(this);
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
	setCheckValue(e) {
		e.stopPropagation();
		this.setState({displayAll: e.target.checked});
	}
	render() {
		var lines = this.props.lines;
		if (!this.state.displayAll) {
			lines = lines.filter(line => {
				return line.type === 'stdout' || line.type === 'stderr';
			});
		}
		return (
			<section 
				className="view-console"
				ref={elem => this.elem = elem}>
				<header className="header">
					<span>Output</span>
					<label>
						<span>Display all output</span>
						<input 
							type="checkbox" 
							onChange={this.setCheckValue}
							checked={this.state.displayAll} />
					</label>
				</header>
				<Infinite
					className="infinite-scroller"
					containerHeight={this.state.height - 30 || 20}
					elementHeight={18}
					//displayBottomUpwards={true} 
					>
					{lines.map(this.getLine)}
				</Infinite>
			</section>
		);
	}
}
