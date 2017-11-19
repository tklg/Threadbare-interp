import React from 'react';
import FlexContainer from './FlexContainer.jsx';
import TabList from './TabList.jsx';
import TBLang from './../TBLang.js';
import MonacoEditor from 'react-monaco-editor';

export default class Editor extends React.Component {
	constructor() {
		super();
		this.monaco = null;
		this.getFileFromId = this.getFileFromId.bind(this);
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {
		
	}
	editorWillMount(monaco) {
	    monaco.languages.register({id: 'threadbare'});
	    monaco.languages.setMonarchTokensProvider('threadbare', TBLang.getTokensProvider());
	}
	editorDidMount(editor, monaco) {
	    editor.focus();
	}
	onChange(newValue, e) {
	    this.props.onChange(newValue, e);
	}
	getFileFromId(i) {
		for (var f of this.props.tabs) {
			if (f.id === i) return f;
		}
		return this.props.tabs[0];
	}
	render() {
		const current = this.getFileFromId(this.props.currentTab);
		const code = current.content;
	    const options = {
	    	selectOnLineNumbers: true,
	    	//readOnly: current.fake || false,
	    };
	    const tabs = this.props.tabs;
	    const currentTab = this.props.currentTab;

		return (
			<FlexContainer 
				className="view-editor"
				flexDirection="col">
				<TabList 
					currentTab={currentTab}
					tabs={tabs}
					onClick={this.props.onTabClick}
					onCloseClick={this.props.onTabCloseClick} />
				<section className="editor">
					<MonacoEditor
				        // width="800"
				        // height="370"
				        language="threadbare"
				        theme="vs-dark"
				        value={code}
				        options={options}
				        onChange={this.onChange.bind(this)}
				        onMount={this.editorDidMount.bind(this)}
				        editorDidMount={this.editorDidMount.bind(this)}
				        editorWillMount={this.editorWillMount.bind(this)}
				      	/>
				</section>
			</FlexContainer>
		);
	}
}
