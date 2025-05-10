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
    
    // Only process files that have both ROUTE_PROVIDERS and a custom ActivatedRoute provider
    if (!content.includes('ROUTE_PROVIDERS') || !content.includes('provide: ActivatedRoute')) {
      return { skipped: true, file: filePath };
    }
    
    // Remove the custom ActivatedRoute provider
    const providersRegex = /providers:\s*\[([\s\S]*?)\]/g;
    const matches = [...content.matchAll(providersRegex)];
    
    let modified = false;
    
    for (const match of matches) {
      const fullMatch = match[0];
      const providersBlock = match[1];
      
      // Remove the ActivatedRoute provider if we have ROUTE_PROVIDERS
      if (providersBlock.includes('provide: ActivatedRoute') && providersBlock.includes('ROUTE_PROVIDERS')) {
        // Parse the providers into individual items
        const providerItems = providersBlock.split(',').filter(item => item.trim() !== '');
        
        // Find the start and end indices of the ActivatedRoute provider
        let startIndex = -1;
        let endIndex = -1;
        let braceCount = 0;
        
        for (let i = 0; i < providerItems.length; i++) {
          const item = providerItems[i].trim();
          
          if (item.includes('provide: ActivatedRoute') && startIndex === -1) {
            startIndex = i;
            braceCount = (item.match(/{/g) || []).length - (item.match(/}/g) || []).length;
          } else if (startIndex !== -1 && braceCount > 0) {
            braceCount += (item.match(/{/g) || []).length - (item.match(/}/g) || []).length;
            if (braceCount === 0) {
              endIndex = i;
              break;
            }
          }
        }
        
        // Remove the ActivatedRoute provider if found
        if (startIndex !== -1 && endIndex !== -1) {
          const newProviders = [
            ...providerItems.slice(0, startIndex),
            ...providerItems.slice(endIndex + 1)
          ].join(',');
          
          const newProvidersBlock = `providers: [${newProviders}]`;
          content = content.replace(fullMatch, newProvidersBlock);
          modified = true;
        } else if (startIndex !== -1) {
          // Simple case - just one item in array
          const activatedRouteRegex = /\{\s*provide:\s*ActivatedRoute,[\s\S]*?\}/g;
          const newProvidersBlock = providersBlock.replace(activatedRouteRegex, '').replace(/,\s*,/g, ',').replace(/\[\s*,/g, '[').replace(/,\s*\]/g, ']');
          content = content.replace(fullMatch, `providers: [${newProvidersBlock}]`);
          modified = true;
        }
      }
    }
    
    // Only write changes if modified
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
        console.log(`Fixed duplicate providers in: ${file}`);
      }
    }
    
    console.log(`\nCompleted processing all files:`);
    console.log(`- Total files: ${specFiles.length}`);
    console.log(`- Fixed: ${processed}`);
    console.log(`- Skipped: ${skipped}`);
    console.log(`- Errors: ${errors}`);
    
  } catch (error) {
    console.error('Error running script:', error);
  }
}

main(); 