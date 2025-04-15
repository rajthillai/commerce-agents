import fs from 'fs';
import path from 'path';

const COMMERCE_SRC_DIR = '/Users/trajendran/Desktop/Projects/corecommerce/src/app/code';

export interface FileContent {
  filePath: string;
  code: string;
}

export async function writeFilesToCommerceDir(files: FileContent[]): Promise<{ success: boolean; message: string }> {
  try {
    for (const file of files) {
      // Split the file path to get the directory structure
      const pathParts = file.filePath.split('/');
      const fileName = pathParts.pop()!;
      const dirPath = path.join(COMMERCE_SRC_DIR, ...pathParts);

      // Create directories if they don't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write the file
      const fullPath = path.join(dirPath, fileName);
      fs.writeFileSync(fullPath, file.code);
    }

    return {
      success: true,
      message: 'Files written successfully to Commerce directory',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error writing files: ${error.message}`,
    };
  }
} 