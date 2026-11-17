import fs from 'fs';

export function getAuthToken() {
  const path = './auth-token.json';

  if (!fs.existsSync(path)) {
    throw new Error(`Token file not found: ${path}`);
  }

  const data = fs.readFileSync(path);
  return JSON.parse(data);
}