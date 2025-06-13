interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
}

const getEnvVariable = (name: keyof ImportMetaEnv): string => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing or empty environment variable: ${name}`);
  }
  return value;
};

export const SERVER_URL = getEnvVariable("VITE_SERVER_URL");
