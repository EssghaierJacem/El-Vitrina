const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Get all spec files
function getAllSpecFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllSpecFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith('.spec.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Process one spec file
async function processSpecFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    
    // Only process files that have ToastrService but don't have ToastrModule imports
    if (!content.includes('ToastrService') || content.includes('ToastrModule')) {
      return { skipped: true, file: filePath };
    }
    
    let modified = false;
    
    // 1. Make sure we import ToastrModule
    if (!content.includes('import { ToastrModule }')) {
      const importIndex = content.search(/import.*from.*/);
      if (importIndex !== -1) {
        // Find a good place to insert the ToastrModule import
        const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
        if (importLines.length > 0) {
          const lastImport = importLines[importLines.length - 1];
          const toastrImport = 'import { ToastrModule } from \'ngx-toastr\';';
          content = content.replace(lastImport, `${lastImport}\n${toastrImport}`);
          modified = true;
        }
      }
    }
    
    // 2. Add ToastrModule to imports
    const configRegex = /TestBed\.configureTestingModule\(\{([^}]*)\}\)/s;
    const configMatch = content.match(configRegex);
    
    if (configMatch) {
      let configBlock = configMatch[1];
      
      // Update imports to include ToastrModule.forRoot()
      if (configBlock.includes('imports:')) {
        const importsRegex = /imports:\s*\[([^\]]*)\]/s;
        const importsMatch = configBlock.match(importsRegex);
        
        if (importsMatch && !importsMatch[1].includes('ToastrModule')) {
          const existingImports = importsMatch[1].trim();
          const newImports = `${existingImports}${existingImports ? ', ' : ''}ToastrModule.forRoot()`;
          configBlock = configBlock.replace(importsRegex, `imports: [${newImports}]`);
          modified = true;
        }
      }
      
      // Replace the entire TestBed configuration if modified
      if (modified) {
        content = content.replace(configRegex, `TestBed.configureTestingModule({${configBlock}})`);
      }
    }
    
    // Only save if we made changes
    if (modified) {
      await writeFile(filePath, content, 'utf8');
      return { skipped: false, file: filePath };
    } else {
      return { skipped: true, file: filePath };
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return { error: true, file: filePath };
  }
}

// Main function
async function main() {
  try {
    const srcDir = path.join(__dirname, 'src');
    const specFiles = getAllSpecFiles(srcDir);
    
    console.log(`Found ${specFiles.length} spec files to check for ToastrService issues`);
    
    let processed = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const file of specFiles) {
      const result = await processSpecFile(file);
      
      if (result.error) {
        errors++;
      } else if (result.skipped) {
        skipped++;
      } else {
        processed++;
        console.log(`Updated: ${file}`);
      }
    }
    
    console.log(`\nCompleted processing all files:`);
    console.log(`- Total files: ${specFiles.length}`);
    console.log(`- Updated: ${processed}`);
    console.log(`- Skipped: ${skipped}`);
    console.log(`- Errors: ${errors}`);
    
  } catch (error) {
    console.error('Error running script:', error);
  }
}

main(); 