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
    let modified = false;
    
    // Find all TestBed.configureTestingModule calls
    const regex = /TestBed\.configureTestingModule\(\{([^}]*)\}\)/gs;
    const matches = [...content.matchAll(regex)];
    
    for (const match of matches) {
      const fullMatch = match[0];
      const configBlock = match[1];
      
      // If this test is using ActivatedRoute, make sure it uses our improved mock
      if (content.includes('ActivatedRoute') && !content.includes('ROUTE_PROVIDERS')) {
        // 1. Make sure we import the test utilities
        if (!content.includes('test-utils')) {
          const importRegex = /import.*from ['"]@angular\/core(\/testing)?['"];/;
          if (importRegex.test(content)) {
            const importMatch = content.match(importRegex)[0];
            const newImport = `${importMatch}\nimport { COMMON_TEST_CONFIG, ROUTE_PROVIDERS } from 'src/app/testing/test-utils';`;
            content = content.replace(importRegex, newImport);
            modified = true;
          }
        } else if (!content.includes('ROUTE_PROVIDERS')) {
          // Update existing import to include ROUTE_PROVIDERS
          const testUtilsImportRegex = /import\s*\{([^}]*)\}\s*from\s*['"]src\/app\/testing\/test-utils['"];/;
          if (testUtilsImportRegex.test(content)) {
            const importMatch = content.match(testUtilsImportRegex)[0];
            const importsList = content.match(testUtilsImportRegex)[1];
            
            if (!importsList.includes('ROUTE_PROVIDERS')) {
              const newImports = importsList.trim() + ', ROUTE_PROVIDERS';
              const newImport = importMatch.replace(/\{([^}]*)\}/, `{${newImports}}`);
              content = content.replace(testUtilsImportRegex, newImport);
              modified = true;
            }
          }
        }
        
        // 2. Add ROUTE_PROVIDERS to the providers array
        let updatedConfig = configBlock;
        
        if (configBlock.includes('providers:')) {
          const providersRegex = /providers:\s*\[([^\]]*)\]/s;
          const providersMatch = configBlock.match(providersRegex);
          
          if (providersMatch && !providersMatch[1].includes('ROUTE_PROVIDERS')) {
            const existingProviders = providersMatch[1].trim();
            const newProviders = existingProviders ? `${existingProviders}, ...ROUTE_PROVIDERS` : '...ROUTE_PROVIDERS';
            updatedConfig = updatedConfig.replace(providersRegex, `providers: [${newProviders}]`);
            modified = true;
          }
        } else {
          // No providers section, add it
          updatedConfig = updatedConfig.trim();
          if (updatedConfig.endsWith(',')) {
            updatedConfig += `\n      providers: [...ROUTE_PROVIDERS]`;
          } else {
            updatedConfig += `,\n      providers: [...ROUTE_PROVIDERS]`;
          }
          modified = true;
        }
        
        // Replace the TestBed configuration only if modified
        if (modified) {
          content = content.replace(fullMatch, `TestBed.configureTestingModule({${updatedConfig}})`);
        }
      }
    }
    
    // Only write back if modified
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
      
      // Progress reporting
      if ((processed + skipped + errors) % 10 === 0) {
        console.log(`Progress: ${processed + skipped + errors}/${specFiles.length} files processed`);
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