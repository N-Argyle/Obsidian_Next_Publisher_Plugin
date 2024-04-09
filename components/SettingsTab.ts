import NextSync from "main";
import {
	App,
	Notice,
	PluginSettingTab,
	Setting,
} from "obsidian";

export interface NextSyncPluginSettings {
	masterPassword: string;
	apiKey: string;
	serverUrl: string;
}

export class NextSyncSettings extends PluginSettingTab {
	plugin: NextSync;

	constructor(app: App, plugin: NextSync) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		new Setting(containerEl)
			.setName("Master password")
			.setDesc(
				"Required to set a password on a document. Acts as an encryption key for all other passwords."
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.masterPassword)
					.onChange(async (value) => {
						if (!value || value.length < 8) {
							new Notice(
								"Password must be at least 8 characters long."
							);
							return;
						}
						this.plugin.settings.masterPassword = value;
						await this.plugin.saveSettings();
					}).inputEl.setAttribute("id", "next-sync-master-password")
			);
      const masterPasswordInput = document.getElementById("next-sync-master-password") as HTMLInputElement;
      masterPasswordInput.type = "password";
      const flex = containerEl.createEl("div");
      flex.style.display = "flex";
      flex.style.justifyContent = "flex-end";
      flex.style.marginBottom = "16px";
      const showPassword = flex.createEl("button");
      showPassword.textContent = "Show password";
      showPassword.onclick = () => {
        if (masterPasswordInput.type === "password") {
          masterPasswordInput.type = "text";
        } else {
          masterPasswordInput.type = "password";
        }
      };
		new Setting(containerEl)
			.setName("API Key")
			.setDesc("The API key for your Obsidian Next Sync server.")
			.addText((text) =>
				text
					.setPlaceholder("Enter your api key")
					.setValue(this.plugin.settings.apiKey)
					.onChange(async (value) => {
						this.plugin.settings.apiKey = value;
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Server URL")
			.setDesc("The URL of your Obsidian Next Sync server.")
			.addText((text) =>
				text
					.setPlaceholder("Enter your server url")
					.setValue(this.plugin.settings.serverUrl)
					.onChange(async (value) => {
						this.plugin.settings.serverUrl = value;
						await this.plugin.saveSettings();
					})
			);
	}
}