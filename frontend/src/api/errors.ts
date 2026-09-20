// The backend documents only its success responses in the OpenAPI schema
// (springdoc has no @ApiResponse annotations for error cases), so generated
// mutation error types don't know about the RFC 7807 ProblemDetail body the
// backend actually returns. This reads the "detail" field defensively at
// runtime instead of relying on a generated error type.
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'detail' in error) {
    const { detail } = error as { detail?: unknown }
    if (typeof detail === 'string' && detail.length > 0) {
      return detail
    }
  }
  return fallback
}
