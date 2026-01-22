/**
 * Safely parse JSON from AI response text
 * Handles markdown code blocks and validates structure
 */
export function parseAIJsonResponse<T>(
  text: string,
  defaultValue: T,
  validator?: (obj: unknown) => obj is T
): T {
  try {
    // Try to extract JSON from markdown code blocks first
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonString = codeBlockMatch ? codeBlockMatch[1] : text;

    // Find JSON object in the string
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No JSON object found in AI response');
      return defaultValue;
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // If validator provided, use it
    if (validator && !validator(parsed)) {
      console.warn('AI response failed validation');
      return defaultValue;
    }

    return parsed as T;
  } catch (error) {
    console.error('Failed to parse AI JSON response:', error);
    return defaultValue;
  }
}

/**
 * Escape HTML to prevent XSS in email templates
 */
export function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Create safe email HTML with escaped user content
 */
export function createEmailHtml(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    // Escape all user-provided values
    const safeValue = escapeHtml(value || '');
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), safeValue);
  }
  return result;
}
