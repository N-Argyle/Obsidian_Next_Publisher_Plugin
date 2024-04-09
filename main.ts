import { NextModal } from "components/NextModal";
import {
	type NextSyncPluginSettings,
	NextSyncSettings,
} from "components/SettingsTab";
import { MarkdownView, Plugin } from "obsidian";

const DEFAULT_SETTINGS: NextSyncPluginSettings = {
	masterPassword: "",
	apiKey: "",
	serverUrl: "",
};

export default class NextSync extends Plugin {
	settings: NextSyncPluginSettings;
	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: "publish-next-sync",
			name: "Publish",
			editorCallback: ( editor, ctx) => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					const modal = new NextModal(this.app, editor);
					modal.open();
					modal.init(this.settings);
					return true;
				}
			},
		});

		this.addSettingTab(new NextSyncSettings(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
