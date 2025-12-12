const serverless = require('serverless-http');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

let secretsPromise;
let handlerPromise;

function parseSecretPayload(secretString) {
  try {
    return JSON.parse(secretString);
  } catch (jsonErr) {
    const fallback = {};
    const lines = secretString.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const equalsIndex = trimmed.indexOf('=');
      if (equalsIndex === -1) continue;
      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim();
      if (key) fallback[key] = value;
    }
    if (Object.keys(fallback).length > 0) {
      return fallback;
    }
    throw jsonErr;
  }
}

async function loadSecrets() {
  try {
    if (process.env.IS_OFFLINE) {
      require('dotenv').config();
      return;
    }

    const secretId = process.env.SECRETS_ID;

    if (!secretId) {
      console.warn('SECRETS_ID is not set. Skipping AWS Secrets Manager lookup.');
      return;
    }

    const client = new SecretsManagerClient();
    const result = await client.send(new GetSecretValueCommand({ SecretId: secretId }));

    const secretString =
      result.SecretString ??
      (result.SecretBinary ? Buffer.from(result.SecretBinary, 'base64').toString('utf-8') : null);

    if (!secretString) {
      console.warn(`Secret ${secretId} did not return a usable payload.`);
      return;
    }

    const parsedSecrets = parseSecretPayload(secretString);
    Object.assign(process.env, parsedSecrets);
  } catch (err) {
    console.error('Failed to load secrets during cold start:', err);
  }
}

async function getHandler() {
  if (!handlerPromise) {
    handlerPromise = (async () => {
      await loadSecrets();
      const app = require('./app');
      return serverless(app);
    })();
  }

  return handlerPromise;
}

module.exports.handler = async (event, context) => {
  const lambdaHandler = await getHandler();
  return lambdaHandler(event, context);
};
