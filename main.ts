import { App, Editor, MarkdownView, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

interface TimestampSettings {
    timestampFormat: string;
    timestampStyle: string;
}

const DEFAULT_SETTINGS: TimestampSettings = {
    timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    timestampStyle: '{timestamp}' // Using {timestamp} as a placeholder
}

export default class TimestampPlugin extends Plugin {
    settings: TimestampSettings;

    async onload() {
        await this.loadSettings();

        // Add settings tab
        this.addSettingTab(new TimestampSettingTab(this.app, this));

        // Register the event handler for editor changes
        this.registerEvent(
            this.app.workspace.on('editor-change', async (editor: Editor, view: MarkdownView) => {
                if (!view) return;

                const file = view.file;
                if (!file) return;

                // Check if the file has the timestamps frontmatter
                const content = await this.app.vault.read(file);
                if (!content.includes('timestamps: true')) return;

                // Get the current cursor position
                const cursor = editor.getCursor();
                if (!cursor) return;

                // Get the current line
                const line = editor.getLine(cursor.line);
                
                // Only add timestamp if we're at the start of a new line
                if (cursor.ch === 0 && line.trim() === '') {
                    const timestamp = this.getFormattedTimestamp();
                    const formattedTimestamp = this.formatTimestamp(timestamp);
                    editor.replaceRange(formattedTimestamp + ' ', cursor);
                    // Move cursor after the timestamp
                    editor.setCursor({ line: cursor.line, ch: formattedTimestamp.length + 1 });
                }
            })
        );
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    getFormattedTimestamp(): string {
        const now = new Date();
        return now.toISOString()
            .replace('T', ' ')
            .replace(/\.\d+Z$/, '');
    }

    formatTimestamp(timestamp: string): string {
        return this.settings.timestampStyle.replace('{timestamp}', timestamp);
    }
}

class TimestampSettingTab extends PluginSettingTab {
    plugin: TimestampPlugin;

    constructor(app: App, plugin: TimestampPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Timestamp Settings' });

        new Setting(containerEl)
            .setName('Timestamp Format')
            .setDesc('The format for timestamps (using ISO 8601)')
            .addText(text => text
                .setValue(this.plugin.settings.timestampFormat)
                .onChange(async (value) => {
                    this.plugin.settings.timestampFormat = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Timestamp Style')
            .setDesc('How to format the timestamp. Use {timestamp} as a placeholder. Examples: [{timestamp}] or %%{timestamp}%%')
            .addText(text => text
                .setValue(this.plugin.settings.timestampStyle)
                .onChange(async (value) => {
                    this.plugin.settings.timestampStyle = value;
                    await this.plugin.saveSettings();
                }));
    }
} 