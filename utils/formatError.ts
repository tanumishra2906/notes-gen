export function formatErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    if (error === '429' || error.includes('429') || error.toLowerCase().includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
    if (error === '503' || error.includes('503') || error.toLowerCase().includes('high demand')) {
      return 'The AI service is currently experiencing high demand. Please try again in a few seconds.';
    }
    return error;
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (
      msg === '429' ||
      msg.includes('429') ||
      msg.includes('rate limit') ||
      msg.includes('resource_exhausted') ||
      msg.includes('quota')
    ) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (msg === '503' || msg.includes('503') || msg.includes('high demand') || msg.includes('service unavailable')) {
      return 'The AI service is currently experiencing high demand. Please try again in a few seconds.';
    }

    if (msg.includes('scanned/image-only') || msg.includes('readable text')) {
      return "This PDF doesn't appear to contain readable text. Scanned/image-only PDFs aren't supported yet.";
    }

    // Strip raw SDK prefix if present
    if (error.message.includes('[GoogleGenerativeAI Error]')) {
      if (error.message.includes('404')) {
        return 'The requested AI model is temporarily unavailable. Please try again.';
      }
      return 'An error occurred while communicating with the AI service. Please try again.';
    }

    return error.message;
  }

  return 'An unexpected error occurred while processing your document. Please try again.';
}
