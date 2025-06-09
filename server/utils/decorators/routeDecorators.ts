/**
 * DEPRECATED - Controller Decorator Pattern
 * 
 * These decorators were initially designed to help minimize code duplication in controllers,
 * but have been replaced by direct try/catch approaches in controllers for better maintainability
 * and simpler debugging.
 *
 * Do not use these decorators in new code. Instead, implement error handling directly in controller methods.
 */

// Empty exports to preserve imports that might still reference this file
export const route = () => {};
export const getByIdRoute = () => () => {};
export const deleteRoute = () => () => {};
export const createRoute = () => {};