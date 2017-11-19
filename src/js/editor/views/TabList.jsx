import React from 'react';

export default class TabList extends React.Component {
	constructor() {
		super();
		this.getTab = this.getTab.bind(this);
		this.onCloseClick = this.onCloseClick.bind(this);
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {
		
	}
	onCloseClick(e, i) {
		e.stopPropagation();
		this.props.onCloseClick(i);
	}
	getTab(tab, i) {
		return (
			<div className={"tab" + (tab.id === this.props.currentTab ? " active" : "")}
				key={i}
				onClick={(e) => this.props.onClick(tab.id)}>
				<span>{tab.name}</span>
				{!tab.fake 
				 && <div className="icon" onClick={(e) => this.onCloseClick(e, tab.id)}>
					<svg viewBox="0 0 24 24">
					    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
					</svg>
				</div>}
			</div>
		);
	}
	render() {
		return (
			<nav className="tabs">
				{this.props.tabs.map(this.getTab)}
			</nav>
		);
	}
}
