const fs = require('fs');
const path = require('path');

// Get the configuration file name from the command-line argument or default to "config.json"
const configFile = process.argv[2] || 'config.json';

let config;
try {
    // Read configuration from the specified file
    config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
} catch (error) {
    console.error(`Error loading configuration file: ${configFile}`);
    console.error(error.message);
    process.exit(1);  // Exit if the config file cannot be read or parsed
}

const sourceFolder = config.sourceFolder;
const targetFolder = config.targetFolder;
const folderRegex = new RegExp(config.folderRegex);

function copyFilesSync(source, target) {
    try {
        const folders = fs.readdirSync(source);

        for (const folder of folders) {
            const folderPath = path.join(source, folder);
            const stats = fs.statSync(folderPath);

            // Only process subfolders matching the regex
            if (stats.isDirectory() && folderRegex.test(folder)) {
                const files = fs.readdirSync(folderPath);

                for (const file of files) {
                    const filePath = path.join(folderPath, file);
                    const fileStats = fs.statSync(filePath);

                    if (fileStats.isFile()) {
                        const creationDate = fileStats.birthtime;
                        const year = creationDate.getFullYear();
                        const month = String(creationDate.getMonth() + 1).padStart(2, '0');
                        const day = String(creationDate.getDate()).padStart(2, '0');
                        const yearFolder = path.join(target, `${year}`);
                        const dateFolder = path.join(yearFolder, `${year}-${month}-${day}`);

                        // Create the year-based subfolder if it doesn't exist
                        if (!fs.existsSync(yearFolder)) {
                            fs.mkdirSync(yearFolder, { recursive: true });
                        }

                        // Create the date-based subfolder if it doesn't exist
                        if (!fs.existsSync(dateFolder)) {
                            fs.mkdirSync(dateFolder, { recursive: true });
                        }

                        // Copy the file to the date-based subfolder
                        const targetFilePath = path.join(dateFolder, file);
                        fs.copyFileSync(filePath, targetFilePath);
                        console.log(`Copied ${file} to ${dateFolder}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error copying files:', error);
    }
}

copyFilesSync(sourceFolder, targetFolder);
