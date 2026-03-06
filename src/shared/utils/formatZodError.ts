import { ZodError } from 'zod';

/**
 * Formata um erro do Zod em uma mensagem amigável para o usuário.
 * Retorna a primeira mensagem de erro encontrada ou uma mensagem genérica.
 */
export function formatZodError(error: ZodError): string {
  if (!error.errors || error.errors.length === 0) {
    return 'Dados inválidos. Por favor, verifique os campos.';
  }

  // Pega o primeiro erro para exibir de forma simples na UI
  const firstError = error.errors[0];
  
  // Customização de mensagens baseada no tipo de erro
  if (firstError.code === 'invalid_type' && firstError.received === 'undefined') {
    return `O campo "${firstError.path.join('.')}" é obrigatório.`;
  }

  return firstError.message;
}

/**
 * Retorna um objeto mapeando o caminho do campo para a mensagem de erro.
 * Útil para formulários complexos.
 */
export function mapZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  return errors;
}
