import React from 'react';
import Infinite from 'react-infinite';

export default class FileManager extends React.Component {
	constructor() {
		super();
		this.state = {
			height: 0,
			creatingFile: false,
			newFileName: '',
		}
		this.resize = this.resize.bind(this);
		this.createFile = this.createFile.bind(this);
		this.getFileItem = this.getFileItem.bind(this);
		this.handleFileNameInput = this.handleFileNameInput.bind(this);
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
	createFile(e) {
		e.stopPropagation();
		this.setState({createFile: true});
	}
	handleFileNameInput(e) {
		if (e.key === 'Enter') {
			this.props.onCreateFile(e.target.value);
			this.setState({
				createFile: false,
				newFileName: '',
			});
			return;
		}
		this.setState({
			newFileName: e.target.value,
		})

	}
	getFileItem(f, i) {
		return (
			<div 
				className="file" 
				key={i}
				onClick={(e) => this.props.openFile(f.id)}>
				{f.name}
			</div>
		);
	}
	render() {
		var files = this.props.files.filter(x => !x.fake);
		return (
			<section 
				className="view-file-manager"
				ref={elem => this.elem = elem}>
				<header className="header">
					{!this.state.createFile && 
						<div>
							<span>Files</span>
							<button className="btn" onClick={(e) => this.createFile(e)}>
								<svg viewBox="0 0 24 24">
								    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
								</svg>
							</button>
						</div>
					}
					{this.state.createFile &&
						<input 
							value={this.state.newFileName}
							type="text" 
							className="input"  
							placeholder="New file name"
							autoFocus
							onChange={this.handleFileNameInput}
							onKeyPress={this.handleFileNameInput} />
					}
				</header>
				<Infinite
					className="infinite-scroller"
					containerHeight={this.state.height - 30 || 20}
					elementHeight={24}>
					{files.map(this.getFileItem)}
				</Infinite>
			</section>
		);
	}
}
