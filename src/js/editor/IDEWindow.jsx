import React from 'react';
import Header from './views/Header.jsx';
import FlexContainer from './views/FlexContainer.jsx';
import FileManager from './views/FileManager.jsx';
import Console from './views/Console.jsx';
import Editor from './views/Editor.jsx';
import ASTViewer from './views/ASTViewer.jsx';
import Threadbare from './../Threadbare.js';
import TBLang from './TBLang.js';
import SFS from './components/SessionFilesystem.js';

import Unique from './../interpreter/Unique.js';

export default class IDEWindow extends React.Component {
	constructor() {
		super();
		this.state = {
			needsToBeParsed: true,
			currentTab: -1,
			consoleLines: [],
			files: [],
			astVisible: false,
			ast: [],
		}
		this.handleOutput = this.handleOutput.bind(this);
		this.collectContent = this.collectContent.bind(this);
		this.onEditorChange = this.onEditorChange.bind(this);
		this.createThreadbare = this.createThreadbare.bind(this);
		this.parse = this.parse.bind(this);
		this.start = this.start.bind(this);
		this.step = this.step.bind(this);
		this.stop = this.stop.bind(this);
		this.changeTab = this.changeTab.bind(this);
		this.closeTab = this.closeTab.bind(this);
		this.createFile = this.createFile.bind(this);
		this.loadFiles = this.loadFiles.bind(this);
		this.openFile = this.openFile.bind(this);
		this.getFileFromId = this.getFileFromId.bind(this);
		this.getCurrentFile = this.getCurrentFile.bind(this);
		this.deleteFile = this.deleteFile.bind(this);
		this.createDefaultFiles = this.createDefaultFiles.bind(this);
		this.showAST = this.showAST.bind(this);
		this.clearConsole = this.clearConsole.bind(this);
		this.threadbareInstance = null;
	}
	componentDidMount() {
		this.createThreadbare();
		this.loadFiles();
	}
	createThreadbare() {
		var tb = new Threadbare();
		tb.on('any', this.handleOutput);
		this.threadbareInstance = tb;
	}
	handleOutput(ev, val) {
		if (ev === 'ast.ready') {
			this.setState({ast: val});
		}
		if (ev.indexOf('error') > -1) {
			ev = 'stderr';
		}
		var line = {};
		switch (ev) {
			case 'stdout':
			case 'stderr':
			case 'info':
			case 'warn':
				line = {
					type: ev,
					text: val
				};
				break;
			default:
				if (typeof val[0] !== 'string') {
					val = ev;
					ev = '';
				} else {
					ev += ': ';
				}
				line = {
					type: 'x',
					text: ev + val
				};
				break;
		}
		var lines = this.state.consoleLines;
		lines.push(line);
		this.setState({consoleLines: lines});

		// hacky but it works and react-infinite doesnt have a better way of doing it
		// scrolls console to the bottom
		var el = document.querySelector('.infinite-scroller.console');
		el.scrollTop = el.scrollHeight;
	}
	// collect header files and prepend them to the current file
	collectContent() {
		var current = this.getCurrentFile();
		if (current.name.substring(current.name.lastIndexOf('.') + 1) === 'jtb') {
			return current.content;
		}
		var content = '';
		var files = this.state.files.filter(x => {
			var ext = x.name.substring(x.name.lastIndexOf('.') + 1);
			return x.id !== this.state.currentTab && ext === 'jtbc';
		});
		for (var f of files) {
			content += f.content;
		}

		return content + current.content;
		//return this.state.files[this.state.currentTab].content;
	}
	onEditorChange(value, e) {
		//console.log('onChange', e);
	    this.getCurrentFile().content = value;
		SFS.saveFile(this.getCurrentFile());
	    //this.state.files[this.state.currentTab].content = value;
		this.setState({needsToBeParsed: true});
	}
	changeTab(i) {
		var current = this.getCurrentFile();
		//var current = this.state.files[this.state.currentTab];
		SFS.saveFile(current);
		this.setState({currentTab: i});
		this.setState({needsToBeParsed: true});
	}
	openFile(i) {
		var files = this.state.files;
		for (var f of files) {
			if (f.id === i) f.hasTab = true;
		}
		if (files.filter(x => !x.fake).length) {
			files = files.filter(x => !x.fake);
		}
		//files = files.filter(x => !x.fake);
		this.setState({files: files}, () => {
			this.changeTab(i);
		});
	}
	closeTab(i) {
		var tabs = this.state.files;
		var fTabs = tabs.filter(x => x.hasTab);
		//var current = this.state.files[i];
		for (var f of tabs) {
			if (f.id === i) {
				f.hasTab = false;
				SFS.saveFile(f);
			}
		}

		//var current = this.getFileFromId(i);
		//tabs = tabs.filter(t => t !== current);
		var ind = 0;
		for (var f of fTabs) {
			if (f.id === i) break;
			ind++;
		}
		if (fTabs.length > 1) {
			this.openFile(fTabs[(ind + 1) % fTabs.length].id);
		} 
		/*
		var nextIndex = (i === this.state.currentTab) ? ind - 1 : ind;
		if (nextIndex < 0) nextIndex = 0;
		console.log(nextIndex);
		console.log(fTabs);
		var nextId = fTabs[nextIndex].id;*/
		this.setState({
			tabs: tabs,
		});
	}
	getFileFromId(i) {
		for (var f of this.state.files) {
			if (f.id === i) return f;
		}
		return this.state.files[0];
	}
	getCurrentFile() {
		return this.getFileFromId(this.state.currentTab);
	}
	parse() {
		this.setState({needsToBeParsed: false});
		var content = this.collectContent();
		this.threadbareInstance.interpret(content, 'random');
	}
	// refactor because its a mess
	start() {
		if (this.threadbareInstance.isDone()) {
			this.threadbareInstance = null;
			this.createThreadbare();
			this.parse();
			setTimeout(() => {
				this.threadbareInstance.start();
			}, 300);
		} else {
			if (this.state.needsToBeParsed) {
				this.parse();
				setTimeout(() => {
					this.threadbareInstance.start();
				}, 300);
			} else {
				this.threadbareInstance.start();
			}
		}
	}
	stop() {
		this.setState({needsToBeParsed: true});
		if (this.threadbareInstance) this.threadbareInstance.stop();
	}
	step() {
		if (this.threadbareInstance.isDone()) {
			this.threadbareInstance = null;
			this.createThreadbare();
		}
		if (this.state.needsToBeParsed) {
			this.parse();
			setTimeout(() => {
				this.threadbareInstance.step(true);
			}, 300);
		} else {
			this.threadbareInstance.step(true);
		}
	}
	createFile(name) {
		if (!name.endsWith('.jtbc') && !name.endsWith('.jtbi') && !name.endsWith('.jtb')) {
			name += '.jtb';
		}
		SFS.createFile(name);

		this.loadFiles();

//		this.changeTab(this.state.files.indexOf(SFS.getFile(name)));
	}
	deleteFile(id) {
		SFS.deleteFile(id);
		this.loadFiles();
	}
	loadFiles() {
		var files = SFS.listFiles();
		var list = [];
		for (var f in files) {
			list.push(files[f]);
		}
		// alphabetical sort
		list.sort((x, y) => {
			if (x.name < y.name) return -1;
			if (x.name > y.name) return 1;
			return 0;
		});
		if (this.state.currentTab === -1 && list.filter(x => x.hasTab).length)  {
			this.setState({currentTab: list.filter(x => x.hasTab)[0].id}, () => {
				this.setState({files: list});
			});
		} else if (list.length) {
			this.setState({files: list});
		}
	}
	createDefaultFiles() {
		var files = TBLang.getDefaultFiles();
		for (var f of files) {
			if (!this.state.files.find(x => {
				return x.name === f.name;
			})) {
				var id = SFS.createFile(f.name);
				f.id = id;
				//f.content = f.content.replace(/  /g, '	');
				f.hasTab = false;
				f.fake = false;
				SFS.saveFile(f);
				this.handleOutput('info', 'Created default file: ' + f.name);
			} else {
				this.handleOutput('warn', 'Skipped creating default file: ' + f.name);
			}
		}
		this.loadFiles();
	}
	showAST() {
		if (this.state.needsToBeParsed) {
			this.parse();
			setTimeout(() => {
				this.setState({astVisible: !this.state.astVisible});
			}, 300);
		} else {
			this.setState({astVisible: !this.state.astVisible});
		}
	}
	clearConsole() {
		this.setState({consoleLines: []});
	}
	render() {
		var numTabs = this.state.files.filter(x => x.hasTab).length;
		if (!numTabs) {
			this.state.files.push({
				name: "No tabs open",
				content: "",
				hasTab: true,
				fake: true,
				id: -1,
			});
		}
		var tabs = this.state.files.filter(x => x.hasTab || x.fake);
		return (
			<FlexContainer flexDirection="col">
				<Header 
					showingAST={this.state.astVisible}
					onClickShowAST={(show) => this.showAST()}
					onClickParse={this.parse}
					onClickStart={this.start}
					onClickStep={this.step}
					onClickStop={this.stop}/>
				<FlexContainer flexDirection="row">
					{!this.state.astVisible && 
						<Editor 
						tabs={tabs}
						currentTab={this.state.currentTab}
						onChange={this.onEditorChange}
						onTabClick={this.changeTab}
						onTabCloseClick={this.closeTab} />
					}
					{!this.state.astVisible && 
						<Console
						lines={this.state.consoleLines}
						onClickClear={this.clearConsole} />
					}
					{!this.state.astVisible && 
						<FileManager 
						files={this.state.files}
						onClickRestoreFiles={this.createDefaultFiles}
						onCreateFile={this.createFile}
						deleteFile={this.deleteFile}
						openFile={this.openFile} />
					}
					{this.state.astVisible &&
						<ASTViewer 
							fileName={this.getCurrentFile().name}
							ast={this.state.ast} />
					}
				</FlexContainer>
			</FlexContainer>
		);
	}
}
