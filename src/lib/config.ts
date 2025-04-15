/**
 * Configuration utility for environment variables
 */

export const config = {
  get commerceSrcDir(): string {
    const dir = process.env.COMMERCE_SRC_DIR;
    if (!dir) {
      throw new Error('COMMERCE_SRC_DIR environment variable is not set');
    }
    return dir;
  },

  get googleGenAIKey(): string {
    const key = process.env.GOOGLE_GENAI_API_KEY;
    if (!key) {
      throw new Error('GOOGLE_GENAI_API_KEY environment variable is not set');
    }
    return key;
  }
}; 