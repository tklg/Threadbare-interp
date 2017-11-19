import React from 'react';
import Header from './views/Header.jsx';
import FlexContainer from './views/FlexContainer.jsx';
import FileManager from './views/FileManager.jsx';
import Console from './views/Console.jsx';
import Editor from './views/Editor.jsx';
import Threadbare from './../Threadbare.js';
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
		var line = {};
		switch (ev) {
			case 'stdout':
			case 'stderr':
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
					type: 'info',
					text: ev + val
				};
				break;
		}
		var lines = this.state.consoleLines;
		lines.push(line);
		this.setState({consoleLines: lines});

		// hacky but it works and react-infinite doesnt have a better way of doing it
		// scrolls console to the bottom
		var el = document.querySelector('.infinite-scroller');
		el.scrollTop = el.scrollHeight;
	}
	// collect header files and prepend them to the current file
	collectContent() {
		return this.getCurrentFile().content;
		//return this.state.files[this.state.currentTab].content;
	}
	onEditorChange(value, e) {
		//console.log('onChange', e);
	    this.getCurrentFile().content = value;
	    //this.state.files[this.state.currentTab].content = value;
		this.setState({needsToBeParsed: true});
	}
	changeTab(i) {
		var current = this.getCurrentFile();
		//var current = this.state.files[this.state.currentTab];
		SFS.saveFile(current);
		this.setState({currentTab: i});
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
		//var current = this.state.files[i];
		for (var f of tabs) {
			if (f.id === i) {
				f.hasTab = false;
				SFS.saveFile(f);
			}
		}

		//var current = this.getFileFromId(i);
		//tabs = tabs.filter(t => t !== current);
		var nextIndex = (i === this.state.currentTab) ? this.state.currentTab - 1 : this.state.currentTab;
		if (nextIndex < 0) nextIndex = 0;
		this.setState({
			currentTab: nextIndex,
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
	start() {
		if (this.threadbareInstance.isDone()) {
			this.threadbareInstance = null;
			this.createThreadbare();
		}
		if (this.state.needsToBeParsed) this.parse();
		this.threadbareInstance.start();
	}
	stop() {
		if (this.threadbareInstance) this.threadbareInstance.stop();
	}
	step() {
		if (this.state.needsToBeParsed) this.parse();
		if (this.threadbareInstance) this.threadbareInstance.step();
	}
	createFile(name) {
		SFS.createFile(name);

		this.loadFiles();

//		this.changeTab(this.state.files.indexOf(SFS.getFile(name)));
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
		if (this.state.currentTab === -1 && list.length)  {
			this.setState({currentTab: list[0].id}, () => {
				this.setState({files: list});
			});
		} else if (list.length) {
			this.setState({files: list});
		}
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
					onClickParse={this.parse}
					onClickStart={this.start}
					onClickStep={this.step}
					onClickStop={this.stop}/>
				<FlexContainer flexDirection="row">
					<Editor 
						tabs={tabs}
						currentTab={this.state.currentTab}
						onChange={this.onEditorChange}
						onTabClick={this.changeTab}
						onTabCloseClick={this.closeTab} />
					<Console lines={this.state.consoleLines} />
					<FileManager 
						files={this.state.files}
						onCreateFile={this.createFile}
						openFile={this.openFile} />
				</FlexContainer>
			</FlexContainer>
		);
	}
}
