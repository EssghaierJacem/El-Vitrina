const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Functions to find all spec files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (filePath.endsWith('.spec.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Fix a spec file
async function fixSpecFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Skip if already fixed
    if (content.includes('test-utils')) {
      console.log(`Skipping ${filePath} (already fixed)`);
      return;
    }

    const needsDialog = content.includes('MatDialog') || content.includes('MatDialogRef');
    const needsActivatedRoute = content.includes('ActivatedRoute');

    // Basic transformation pattern
    let updatedContent = content;
    
    // Add import for test utilities
    const importMatch = updatedContent.match(/import.*from ['"]@angular\/core(\/testing)?['"];/);
    if (importMatch) {
      const importStatement = `${importMatch[0]}\nimport { COMMON_TEST_CONFIG${needsDialog ? ', DIALOG_PROVIDERS' : ''} } from 'src/app/testing/test-utils';`;
      updatedContent = updatedContent.replace(importMatch[0], importStatement);
    }

    // Update TestBed configuration
    const configMatch = updatedContent.match(/TestBed\.configureTestingModule\(\{([^}]*)\}\)/s);
    if (configMatch) {
      const configBlock = configMatch[1];
      
      // Update imports
      let updatedConfig = configBlock;
      const importsMatch = configBlock.match(/imports:\s*\[([^\]]*)\]/s);
      
      if (importsMatch) {
        const imports = importsMatch[1].trim();
        const updatedImports = imports ? `${imports}, ...COMMON_TEST_CONFIG.imports` : '...COMMON_TEST_CONFIG.imports';
        updatedConfig = updatedConfig.replace(/imports:\s*\[([^\]]*)\]/s, `imports: [${updatedImports}]`);
      }
      
      // Add providers if not present, or update existing providers
      if (configBlock.includes('providers:')) {
        const providersMatch = configBlock.match(/providers:\s*\[([^\]]*)\]/s);
        if (providersMatch) {
          const providers = providersMatch[1].trim();
          const updatedProviders = providers 
            ? `${providers}, ...COMMON_TEST_CONFIG.providers${needsDialog ? ', ...DIALOG_PROVIDERS' : ''}`
            : `...COMMON_TEST_CONFIG.providers${needsDialog ? ', ...DIALOG_PROVIDERS' : ''}`;
          updatedConfig = updatedConfig.replace(/providers:\s*\[([^\]]*)\]/s, `providers: [${updatedProviders}]`);
        }
      } else {
        // No providers section, add it
        updatedConfig = updatedConfig.trim();
        if (updatedConfig.endsWith(',')) {
          updatedConfig += `\n      providers: [...COMMON_TEST_CONFIG.providers${needsDialog ? ', ...DIALOG_PROVIDERS' : ''}]`;
        } else {
          updatedConfig += `,\n      providers: [...COMMON_TEST_CONFIG.providers${needsDialog ? ', ...DIALOG_PROVIDERS' : ''}]`;
        }
      }
      
      updatedContent = updatedContent.replace(configMatch[1], updatedConfig);
    }

    await writeFile(filePath, updatedContent, 'utf8');
    console.log(`Fixed ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

// Main function
async function main() {
  // Get all spec files in the src directory
  const srcDir = path.join(__dirname, 'src');
  const specFiles = getAllFiles(srcDir);
  
  console.log(`Found ${specFiles.length} spec files`);
  
  // Fix each file
  let fixedCount = 0;
  for (const file of specFiles) {
    await fixSpecFile(file);
    fixedCount++;
    
    // Log progress
    if (fixedCount % 10 === 0) {
      console.log(`Progress: ${fixedCount}/${specFiles.length}`);
    }
  }
  
  console.log(`Done! Fixed ${fixedCount} spec files.`);
}

main().catch(console.error); 