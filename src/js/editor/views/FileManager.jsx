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
		this.deleteFile = this.deleteFile.bind(this);
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
		var value = e.target.value.trim();
		if (e.key === 'Enter') {
			if (!value.length) {
				this.setState({createFile: false});
				return;
			}
			this.props.onCreateFile(value);
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
	deleteFile(e, id) {
		e.stopPropagation();
		this.props.deleteFile(id);
	}
	getFileItem(f, i) {
		var ext = f.name.substring(f.name.lastIndexOf('.') + 1);
		return (
			<div 
				className={"file" + " ext-" + ext} 
				key={i}
				onClick={(e) => this.props.openFile(f.id)}
				title={f.name}>
				<span>{f.name}</span>
				<button className="btn" onClick={(e) => this.deleteFile(e, f.id)}>
					<svg viewBox="0 0 24 24">
					    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
					</svg>
				</button>
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
							placeholder="new-file.jtb"
							autoFocus
							onChange={this.handleFileNameInput}
							onKeyPress={this.handleFileNameInput} />
					}
				</header>
				<Infinite
					className="infinite-scroller file-manager"
					containerHeight={this.state.height - 30 * 2 || 20}
					elementHeight={24}>
					{files.map(this.getFileItem)}
				</Infinite>
				<footer>
					<button 
						className="btn"
						onClick={this.props.onClickRestoreFiles}>
					Restore default files
					</button>
				</footer>
			</section>
		);
	}
}
