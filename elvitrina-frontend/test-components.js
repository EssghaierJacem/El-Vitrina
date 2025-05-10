const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get a list of all spec files
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

// Run a single spec file
function runSpecFile(specFile) {
  return new Promise((resolve, reject) => {
    console.log(`Testing: ${specFile}`);
    
    // Use npx to run ng as it's likely installed locally
    const ng = spawn('npx', ['ng', 'test', '--watch=false', `--include=${specFile}`], {
      stdio: 'inherit'
    });
    
    ng.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Test passed: ${specFile}`);
        resolve(true);
      } else {
        console.error(`❌ Test failed: ${specFile}`);
        resolve(false);
      }
    });
    
    ng.on('error', (err) => {
      console.error(`Error running test: ${err}`);
      reject(err);
    });
  });
}

// Main function to run all tests
async function main() {
  try {
    const srcDir = path.join(__dirname, 'src');
    const specFiles = getAllSpecFiles(srcDir);
    
    console.log(`Found ${specFiles.length} spec files`);
    
    let passed = 0;
    let failed = 0;
    
    // Run a subset of tests for demonstration (first 10)
    const testSubset = specFiles.slice(0, 10);
    
    for (const file of testSubset) {
      const relativePath = path.relative(__dirname, file).replace(/\\/g, '/');
      const success = await runSpecFile(relativePath);
      
      if (success) {
        passed++;
      } else {
        failed++;
      }
    }
    
    console.log('\nTest Results:');
    console.log(`- Total Tests: ${testSubset.length}`);
    console.log(`- Passed: ${passed}`);
    console.log(`- Failed: ${failed}`);
    
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

main(); 