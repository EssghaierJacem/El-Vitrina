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
    
    // Skip files that are already fixed
    if (content.includes('COMMON_TEST_CONFIG')) {
      return { skipped: true, file: filePath };
    }
    
    // 1. Import our test utilities
    const coreImportRegex = /import.*from ['"]@angular\/core(\/testing)?['"];/;
    const hasCore = coreImportRegex.test(content);
    
    if (hasCore) {
      const coreImport = content.match(coreImportRegex)[0];
      const utilsImport = `${coreImport}\nimport { COMMON_TEST_CONFIG, DIALOG_PROVIDERS } from 'src/app/testing/test-utils';`;
      content = content.replace(coreImportRegex, utilsImport);
    } else {
      // Add import at the top if no @angular/core import exists
      content = `import { COMMON_TEST_CONFIG, DIALOG_PROVIDERS } from 'src/app/testing/test-utils';\n${content}`;
    }
    
    // 2. Update TestBed configuration
    const configRegex = /TestBed\.configureTestingModule\(\{([^}]*)\}\)/s;
    const configMatch = content.match(configRegex);
    
    if (configMatch) {
      let configBlock = configMatch[1];
      
      // 2.1 Update imports
      if (configBlock.includes('imports:')) {
        const importsRegex = /imports:\s*\[([^\]]*)\]/s;
        const importsMatch = configBlock.match(importsRegex);
        
        if (importsMatch) {
          const existingImports = importsMatch[1].trim();
          const newImports = existingImports ? `${existingImports}, ...COMMON_TEST_CONFIG.imports` : '...COMMON_TEST_CONFIG.imports';
          configBlock = configBlock.replace(importsRegex, `imports: [${newImports}]`);
        }
      } else {
        // Add imports if not present
        configBlock = configBlock.trim();
        if (configBlock.endsWith(',')) {
          configBlock += `\n      imports: [...COMMON_TEST_CONFIG.imports]`;
        } else {
          configBlock += `,\n      imports: [...COMMON_TEST_CONFIG.imports]`;
        }
      }
      
      // 2.2 Update providers
      if (configBlock.includes('providers:')) {
        const providersRegex = /providers:\s*\[([^\]]*)\]/s;
        const providersMatch = configBlock.match(providersRegex);
        
        if (providersMatch) {
          const existingProviders = providersMatch[1].trim();
          const newProviders = existingProviders ? `${existingProviders}, ...COMMON_TEST_CONFIG.providers` : '...COMMON_TEST_CONFIG.providers';
          configBlock = configBlock.replace(providersRegex, `providers: [${newProviders}]`);
        }
      } else {
        // Add providers if not present
        configBlock = configBlock.trim();
        if (configBlock.endsWith(',')) {
          configBlock += `\n      providers: [...COMMON_TEST_CONFIG.providers]`;
        } else {
          configBlock += `,\n      providers: [...COMMON_TEST_CONFIG.providers]`;
        }
      }
      
      // Replace the entire TestBed configuration
      content = content.replace(configRegex, `TestBed.configureTestingModule({${configBlock}})`);
    }
    
    // 3. Write back to file
    await writeFile(filePath, content, 'utf8');
    return { skipped: false, file: filePath };
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
    
    console.log(`Found ${specFiles.length} spec files to process`);
    
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
      
      // Show progress
      if ((processed + skipped + errors) % 10 === 0) {
        console.log(`Progress: ${processed + skipped + errors}/${specFiles.length} (Updated: ${processed}, Skipped: ${skipped}, Errors: ${errors})`);
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