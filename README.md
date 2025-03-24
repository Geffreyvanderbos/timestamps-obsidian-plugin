# Obsidian Timestamp Plugin

This plugin automatically adds timestamps to new lines in your Obsidian notes when you enable it using frontmatter.

## Features

- Automatically adds timestamps to new lines in notes with `timestamps: true` frontmatter
- Customizable timestamp format and style
- Timestamps appear automatically on new lines
- Non-intrusive - only affects notes where you explicitly enable it

## Installation

1. Download the latest release from the releases page
2. Extract the zip file into your Obsidian plugins folder
3. Enable the plugin in Obsidian settings

## Usage

To enable timestamps in a note, add the following frontmatter at the top of your note:

```markdown
---
timestamps: true
---
```

Now, whenever you add a new line in this note, it will automatically be prefixed with a timestamp.

## Settings

You can customize the plugin in two ways:

1. **Timestamp Format**: Set how the date and time are displayed (using ISO 8601 format)
2. **Timestamp Style**: Choose how to wrap/format the timestamp using the `{timestamp}` placeholder

Example styles:
- `[{timestamp}]` → [2024-03-14 15:30:45]
- `%%{timestamp}%%` → %%2024-03-14 15:30:45%%
- `<time>{timestamp}</time>` → <time>2024-03-14 15:30:45</time>
- `{timestamp}` → 2024-03-14 15:30:45

## Development

To build the plugin:

```bash
npm install
npm run build
```

For development:

```bash
npm run dev
```

## License

MIT 