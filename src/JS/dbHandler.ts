// TODO: Make this entire file more generic and handle specifics from where it is used instead

import { ConnectionVisibility } from "discord.js";
import loki from "lokijs";

let db = new loki("database");

let groupCollection: Collection<Group>;

db.loadDatabase({}, (err) => {
	if (err) {
		console.log(`Error loading DB: ${err}`);
	} else {
		groupCollection = db.getCollection("groups") ?? db.addCollection("groups", { unique: ["name"] });
		console.log("Loaded db");
	}
});

export interface Group {
	name: string;
	items: GroupItem[];
	columns: GroupColumnName[];
}

export interface GroupItem {
	index: number;
	columns: GroupColumnItem[];
}

export interface GroupColumnName {
	name: string;
}

export interface GroupColumnItem {
	name: string;
	data: string;
}

export function shutdown() {
	db.saveDatabase();
	db.close();
}

export function groupCreate(groupName: string): boolean {
	// If that group already exists
	if (groupCollection.by("name", groupName) !== undefined) {
		return false;
	}

	groupCollection.insert({ name: groupName, items: [], columns: [] });

	db.saveDatabase();

	return true;
}

export function groupRemove(groupName: string): boolean {
	if (groupCollection.by("name", groupName) === undefined) {
		return false;
	}

	groupCollection.removeWhere({ name: groupName });

	db.saveDatabase();

	return true;
}

export function groupShow(groupName: string): Group | undefined {
	return groupCollection.by("name", groupName);
}

export function groupRename(currentGroupName: string, newGroupName: string): boolean {
	if (groupCollection.by("name", newGroupName) !== undefined || groupCollection.by("name", currentGroupName) === undefined) {
		return false;
	}

	groupCollection.findAndUpdate({ name: currentGroupName }, (group) => {
		group.name = newGroupName;

		return group;
	});

	db.saveDatabase();

	return true;
}

export function groupList(): string[] {
	return groupCollection.where(() => true).map((group) => group.name);
}

export function columnAdd(groupName: string, columnName: string): boolean {
	if (groupCollection.by("name", groupName) === undefined || groupCollection.by("name", groupName)?.columns.filter(column => column.name == columnName).length !== 0) {
		return false;
	}

	groupCollection.findAndUpdate({ name: groupName }, (group) => {
		group.columns.push({ name: columnName });

		return group;
	});

	db.saveDatabase();

	return true;
}

export function columnRemove(groupName: string, columnName: string): boolean {
	if (groupCollection.by("name", groupName) === undefined || groupCollection.by("name", groupName)?.columns.filter(column => column.name == columnName).length === 0) {
		return false;
	}

	groupCollection.findAndUpdate({ name: groupName }, (group) => {
		group.columns.splice(group.columns.indexOf({ name: columnName }), 1);

		group.items.forEach((item) => {
			item.columns = item.columns.filter((value) => value.name != columnName);
		});

		return group;
	});

	db.saveDatabase();

	return true;
}

export function columnRename(groupName: string, currentColumnName: string, newColumnName: string): boolean {
	if (groupCollection.by("name", groupName) === undefined || (groupCollection.by("name", groupName)?.columns.filter(column => column.name == currentColumnName).length === 0) || (groupCollection.by("name", groupName)?.columns.filter(column => column.name == newColumnName).length !== 0)) {
		return false;
	}

	groupCollection.findAndUpdate({ name: groupName }, (group) => {
		group.columns.forEach((column) => {
			column.name = column.name == currentColumnName ? newColumnName : column.name;
		});

		group.items.forEach((item) => {
			item.columns.forEach((column) => {
				column.name = column.name == currentColumnName ? newColumnName : column.name;
			});
		});

		return group;
	});

	db.saveDatabase();

	return true;
}

export function itemAdd(groupName: string): number | null {
	if (groupCollection.by("name", groupName) === undefined) {
		return null;
	}

	let item: GroupItem = { index: -1, columns: [] };

	groupCollection.findAndUpdate({ name: groupName }, (group) => {
		item.index = group.items.push(item)-1;

		return group;
	});

	db.saveDatabase();

	return item.index;
}

export function itemRemove(groupName: string, itemIndex: number): boolean {
	if (groupCollection.by("name", groupName) === undefined || groupCollection.by("name", groupName)?.items[itemIndex] === undefined) {
		return false;
	}

	groupCollection.findAndUpdate({ name: groupName }, (group) => {
		group.items.splice(itemIndex, 1);

		return group;
	});

	db.saveDatabase();

	return true;
}

export function itemUpdate(groupName: string, itemIndex: number, columnName: string, itemData: string): boolean {
	if (groupCollection.by("name", groupName) === undefined || groupCollection.by("name", groupName)?.items[itemIndex] === undefined || groupCollection.by("name", groupName)?.columns.filter(column => column.name == columnName).length === 0) {
		return false;
	}

	groupCollection.findAndUpdate({name: groupName}, (group) => {
		let columnIndex = group.items[itemIndex].columns.findIndex((column) => column.name == columnName);
		if (columnIndex !== -1) {
			group.items[itemIndex].columns[columnIndex].data = itemData;
		} else {
			group.items[itemIndex].columns.push({name: columnName, data: itemData});
		}

		return group;
	});

	db.saveDatabase();

	return true;
}
