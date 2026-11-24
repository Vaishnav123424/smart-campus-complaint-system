/**
 * Git Repository Initialization & Commit Script
 * Uses isomorphic-git (Pure JavaScript Git implementation)
 */

const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const repoDir = __dirname;
const remoteUrl = 'https://github.com/Vaishnav123424/smart-campus-complaint-system.git';

async function initAndCommit() {
  console.log(`[Git] Initializing Git repository in: ${repoDir}`);
  await git.init({ fs, dir: repoDir, defaultBranch: 'main' });

  // Add remote
  console.log(`[Git] Setting remote origin: ${remoteUrl}`);
  try {
    await git.addRemote({
      fs,
      dir: repoDir,
      remote: 'origin',
      url: remoteUrl,
      force: true,
    });
  } catch (e) {
    console.log('[Git Remote]', e.message);
  }

  // Get all files excluding ignored ones
  console.log('[Git] Scanning repository files...');
  const ignoredPatterns = [
    'node_modules',
    '.git',
    'dist',
    '.env',
    'npm-cache',
    '.DS_Store',
    'Thumbs.db',
  ];

  function getAllFiles(dir, baseDir = repoDir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (ignoredPatterns.includes(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getAllFiles(fullPath, baseDir));
      } else {
        const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        files.push(relPath);
      }
    }
    return files;
  }

  const filesToAdd = getAllFiles(repoDir);
  console.log(`[Git] Staging ${filesToAdd.length} files...`);

  for (const file of filesToAdd) {
    await git.add({ fs, dir: repoDir, filepath: file });
  }

  console.log('[Git] Creating initial commit...');
  const sha = await git.commit({
    fs,
    dir: repoDir,
    message: 'Initial commit: Complete Smart Campus Complaint & Maintenance Management System for MITAOE',
    author: {
      name: 'Vaishnav',
      email: 'Vaishnav123424@users.noreply.github.com',
    },
  });

  console.log(`[Git] Commit created successfully! Hash: ${sha}`);
  console.log('[Git] Repository is fully initialized on branch "main" with remote origin.');
}

initAndCommit().catch((err) => {
  console.error('[Git Error]:', err);
  process.exit(1);
});
