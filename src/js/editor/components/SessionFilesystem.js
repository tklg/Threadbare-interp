import Unique from './../../interpreter/Unique.js';

var files = JSON.parse(window.localStorage.getItem('threadbare_files') || '{}');

class SessionFilesystem {
	static createFile(name) {
		var file = {
			name: name,
			content: '',
			hasTab: true,
			fake: false,
			id: Unique.get(),
		};
		if (files[name]) throw `cannot create file "${name}": it already exists`;
		files[name] = file;
		SessionFilesystem.persist();
	}
	static saveFile(file) {
		if (!file || file.fake) return;
		if (!files[file.name]) SessionFilesystem.createFile(file.name);
		files[file.name].content = file.content;
		SessionFilesystem.persist();
		return files[name];
	}
	static getFile(name) {
		if (!files[name]) throw `Cannot get file "${name}: it does not exist`;
		return files[name];
	}
	deleteFile(name) {
		if (!files[name]) return;
		delete files[name];		
	}
	static listFiles() {
		return files;
	}
	static persist() {
		window.localStorage.setItem('threadbare_files', JSON.stringify(files));
	}
}

export default SessionFilesystem;