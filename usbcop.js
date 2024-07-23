const fs = require('fs');
const path = require('path');

// Read configuration from config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
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
                        const folderName = `${year}-${month}-${day}`;
                        const folderPath = path.join(target, folderName);

                        // Create the date-based subfolder if it doesn't exist
                        if (!fs.existsSync(folderPath)) {
                            fs.mkdirSync(folderPath, { recursive: true });
                        }

                        // Copy the file to the date-based subfolder
                        const targetFilePath = path.join(folderPath, file);
                        fs.copyFileSync(filePath, targetFilePath);
                        console.log(`Copied ${file} to ${folderPath}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error copying files:', error);
    }
}

copyFilesSync(sourceFolder, targetFolder);
