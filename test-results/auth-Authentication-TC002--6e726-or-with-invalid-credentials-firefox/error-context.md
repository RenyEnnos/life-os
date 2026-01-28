# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - heading "LIFE OS" [level=1] [ref=e8]
    - heading "Acesso ao Sistema" [level=3] [ref=e10]
  - generic [ref=e11]:
    - generic [ref=e12]:
      - img [ref=e13]
      - generic [ref=e18]:
        - generic [ref=e19]: Erro no acesso
        - generic [ref=e20]: "Ocorreu um problema inesperado: Erro na requisição"
    - generic [ref=e21]:
      - generic [ref=e22]:
        - text: Email
        - generic [ref=e23]:
          - img [ref=e24]
          - textbox "Email" [ref=e27]:
            - /placeholder: seu@email.com
            - text: wrong@example.com
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]: Senha
          - button "Esqueci minha senha" [ref=e31] [cursor=pointer]
        - generic [ref=e32]:
          - img [ref=e33]
          - textbox "Senha" [ref=e36]:
            - /placeholder: ••••••••
            - text: wrongpass
          - button "exibir senha" [ref=e37] [cursor=pointer]:
            - img [ref=e38]
      - button "ENTRAR" [ref=e42] [cursor=pointer]: ENTRAR
    - generic [ref=e43]:
      - text: Não tem conta?
      - link "Registrar" [ref=e44] [cursor=pointer]:
        - /url: /register
```