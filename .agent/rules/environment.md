---
trigger: always_on
---

# Verificação de Ambiente (.env)

Antes de solicitar ao usuário que configure variáveis de ambiente ou afirmar que credenciais estão faltando:
1. Verifique explicitamente se o arquivo `.env` existe na raiz.
2. Tente ler as variáveis usando `dotenv` ou inspecionando o arquivo (sem expor segredos nos logs).
3. Assuma que o ambiente pode estar configurado corretamente e que erros de conexão podem ser devido a outros fatores (rede, código), não apenas falta de credenciais.
4. NUNCA peça para configurar algo que já está no `.env` sem antes provar que a leitura falhou.
