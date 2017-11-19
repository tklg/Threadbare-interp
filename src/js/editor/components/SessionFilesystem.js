import Unique from './../../interpreter/Unique.js';

var files = JSON.parse(window.localStorage.getItem('threadbare_files') || '{}');

class SessionFilesystem {
	static createFile(name) {
		var id = Unique.get()
		var file = {
			name: name,
			content: '',
			hasTab: true,
			fake: false,
			id: id,
		};
		//if (files[name]) throw `cannot create file "${name}": it already exists`;
		files[id] = file;
		SessionFilesystem.persist();
		return id;
	}
	static saveFile(file) {
		if (!file || file.fake) return;
		var id;
		if (!files[file.id]) {
			id = SessionFilesystem.createFile(file.name);
			files[id].content = file.content;
		} else {
			files[file.id].content = file.content;
		}
		SessionFilesystem.persist();
		return files[id || file.id];
	}
	static getFile(id) {
		if (!files[id]) throw `Cannot get file "${id}: it does not exist`;
		return files[id];
	}
	static deleteFile(id) {
		if (!files[id]) return;
		delete files[id];		
		SessionFilesystem.persist();
	}
	static listFiles() {
		return files;
	}
	static persist() {
		window.localStorage.setItem('threadbare_files', JSON.stringify(files));
	}
}

export default SessionFilesystem;