/**
 * Git Push Script
 * Uses isomorphic-git over HTTPS
 */

const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

const token = process.argv[2] || process.env.GITHUB_TOKEN;

async function push() {
  console.log('[Git Push] Attempting push to origin/main...');
  try {
    const res = await git.push({
      fs,
      http,
      dir: __dirname,
      remote: 'origin',
      ref: 'main',
      onAuth: () => {
        if (!token) {
          console.warn('[Git Push Warning] No GitHub Personal Access Token (PAT) provided.');
        }
        return {
          username: 'Vaishnav123424',
          password: token || '',
        };
      },
    });
    console.log('[Git Push Success]:', res);
  } catch (err) {
    console.error('[Git Push Error]:', err.message);
    if (err.data) console.error(err.data);
    process.exit(1);
  }
}

push();
