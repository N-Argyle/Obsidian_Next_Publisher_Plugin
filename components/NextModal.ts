import { NextSyncPluginSettings } from "components/SettingsTab";
import {
	App,
	CachedMetadata,
	Editor,
	Modal,
	Notice,
	RequestUrlParam,
	RequestUrlResponse,
	requestUrl,
} from "obsidian";
import { decryptString, encryptString } from "utils";

export class NextModal extends Modal {
	constructor(app: App, public editor: Editor) {
		super(app);
		this.editor = editor;
	}

	metadata = {} as CachedMetadata | null;
	data = {} as { file: string; content: string; path: string };
	settings = {} as NextSyncPluginSettings;

	async handleSubmit() {
		const file = this.app.workspace.getActiveFile();
		if (!file) return;

		const input = document.getElementById(
			"next-sync-password-input"
		) as HTMLInputElement;
		const password = input.value;
		const masterPassword = this.settings.masterPassword;
		const encryptedPassword = encryptString(password, masterPassword);

		this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			frontmatter["encrypted_next_sync_password"] = encryptedPassword;
		});
		const options: RequestUrlParam = {
			url: `${this.settings.serverUrl}/api/putDoc`,
			method: "POST",
			headers: {
				Authorization: `${this.settings.apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				path: this.data.path,
				content: this.data.content,
				password: encryptedPassword,
        file: this.data.file,
        uuid: this.metadata?.frontmatter?.next_publisher_uuid ?? "",
			}),
		};

		let response: RequestUrlResponse;

		try {
			response = await requestUrl(options);
			const json = response.json;
      if (!json.uuid) {
        new Notice("Error publishing document.");
        return;
      }
      new Notice("Document published successfully.");
      this.app.fileManager.processFrontMatter(file, (frontmatter) => {
        frontmatter["next_publisher_uuid"] = json.uuid;
        frontmatter["next_publisher_url"] = `${this.settings.serverUrl}/docs/${json.uuid}`;
      });
		} catch (e) {
			console.log(JSON.stringify(e));
		}


		this.onClose();
		this.close();
	}

	init(settings: NextSyncPluginSettings) {
		this.settings = settings;
		const { contentEl } = this;
		const file = this.app.workspace.getActiveFile();
		this.data = {
			file: file?.name ?? "",
			content: this.editor.getValue(),
			path: file?.path ?? "",
		};

		this.setTitle("Next Sync | Publish");

		const fileDiv = contentEl.createDiv();
		fileDiv.textContent = `Document: ${this.data.path}`;
		contentEl.createEl("br");

		this.metadata = this.app.metadataCache.getCache(this.data.path);

		const label = contentEl.createEl("label");
		label.textContent = "Set an optional password for this document: ";
		contentEl.createEl("br");

		const separator = contentEl.createDiv();
		separator.style.height = "8px";

		const passwordInput = contentEl.createEl("input");
		passwordInput.type = "password";
		passwordInput.placeholder = "Password";
		passwordInput.id = "next-sync-password-input";

		const masterPassword = this.settings.masterPassword;
		const currentPW = this.app.metadataCache.getCache(this.data.path)
			?.frontmatter?.encrypted_next_sync_password;
		if (currentPW) {
			passwordInput.value = decryptString(currentPW, masterPassword);
		}

		const revealButton = contentEl.createEl("button");
		revealButton.textContent = "Reveal password";
		revealButton.style.marginLeft = "8px";
		revealButton.onclick = () => {
			passwordInput.type =
				passwordInput.type === "password" ? "text" : "password";
		};

		contentEl.createEl("br");

		const separator2 = contentEl.createDiv();
		separator2.style.height = "16px";

		const button = contentEl.createEl("button");
		button.textContent = "Publish";
		button.onclick = () => {
			this.handleSubmit();
		};
	}

	onOpen() {}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
