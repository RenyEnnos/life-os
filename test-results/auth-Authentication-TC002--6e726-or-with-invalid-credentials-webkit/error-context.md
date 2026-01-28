# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - heading "LIFE OS" [level=1] [ref=e8]
    - heading "Acesso ao Sistema" [level=3] [ref=e10]
  - generic [ref=e11]:
    - generic [ref=e12]:
      - img [ref=e13]
      - generic [ref=e16]:
        - generic [ref=e17]: Erro no acesso
        - generic [ref=e18]: "Ocorreu um problema inesperado: Erro na requisição"
    - generic [ref=e19]:
      - generic [ref=e20]:
        - text: Email
        - generic [ref=e21]:
          - img [ref=e22]
          - textbox "Email" [ref=e25]:
            - /placeholder: seu@email.com
            - text: wrong@example.com
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]: Senha
          - button "Esqueci minha senha" [ref=e29] [cursor=pointer]
        - generic [ref=e30]:
          - img [ref=e31]
          - textbox "Senha" [ref=e34]:
            - /placeholder: ••••••••
            - text: wrongpass
          - button "exibir senha" [ref=e35] [cursor=pointer]:
            - img [ref=e36]
      - button "ENTRAR" [ref=e40] [cursor=pointer]: ENTRAR
    - generic [ref=e41]:
      - text: Não tem conta?
      - link "Registrar" [ref=e42]:
        - /url: /register
```