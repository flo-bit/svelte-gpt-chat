import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = join(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

async function renameFiles() {
  console.log('Renaming files for static build...');
  try {
    const files = await getFiles(join(__dirname, 'src', 'routes', 'api'));
    const serverFiles = files.filter((file) => file.endsWith('_server.ts'));
    console.log('Files to rename:', serverFiles);
    await Promise.all(
      serverFiles.map(async (file) => {
        const newFile = file.replace('_server.ts', '+server.ts');
        await fs.rename(file, newFile);
        console.log(`Renamed ${file} to ${newFile}`);
      })
    );
  } catch (error) {
    console.error('Error:', error);
  }
}

renameFiles();
