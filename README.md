# Mini Poupança - Sistema de Arrecadação de Fundos

## Objetivo
O objetivo deste sistema é permitir que os usuários depositem fundos para finalidades específicas, semelhante a uma vaquinha. Os usuários podem realizar depósitos através de diferentes métodos de pagamento, como PIX, cartão de crédito ou boleto bancário. O administrador do sistema terá a responsabilidade de gerenciar os fundos, mas não poderá movimentá-los sem a autorização de pelo menos 50% dos usuários envolvidos.

## Funcionalidades Principais
1. **Administração de Fundos**: O administrador pode gerenciar os fundos arrecadados, mas não pode movimentá-los sem a aprovação de pelo menos 50% dos usuários.

2. **Cadastro de Usuários**: Os usuários podem se cadastrar no sistema através de um link de participação. Cada usuário será associado a uma vaquinha específica.

3. **Depósitos**: Os usuários podem realizar depósitos para as vaquinhas através dos métodos de pagamento disponíveis: PIX, boleto bancário ou cartão de crédito.

4. **Aprovação de Saques**: Para que o administrador possa realizar saques, é necessário que pelo menos 50% dos usuários associados à vaquinha aprovem a retirada.

## Fluxo de Funcionamento
1. **Cadastro de Usuários**:
   - Os usuários recebem um link de participação, onde poderão se cadastrar no sistema.
   - O link contém o ID da vaquinha a qual o usuário será associado.

2. **Depósitos**:
   - Os usuários logam no sistema e escolhem a vaquinha para a qual desejam fazer um depósito.
   - Eles selecionam o método de pagamento desejado (PIX, boleto ou cartão de crédito) e informam o valor a ser depositado.
   - Após o pagamento ser processado, o valor é adicionado aos fundos da vaquinha correspondente.

3. **Administração de Fundos**:
   - O administrador pode visualizar o saldo total de cada vaquinha e monitorar os depósitos realizados.
   - Para solicitar um saque, o administrador submete a solicitação no sistema.

4. **Aprovação de Saques**:
   - Quando uma solicitação de saque é feita pelo administrador, é enviada uma notificação aos usuários associados à vaquinha.
   - Cada usuário tem a opção de aprovar ou rejeitar o saque.
   - Se pelo menos 50% dos usuários aprovarem o saque, o administrador pode proceder com a retirada dos fundos.

## Documentação da API
- Swagger - Ferramenta para documentação de APIs. Será utilizado para documentar a API RESTful do sistema.

## Considerações de Segurança
- Implementar medidas de segurança robustas para proteger os dados dos usuários e as transações financeiras.
- Utilizar criptografia para garantir a segurança das informações transmitidas.
- Implementar autenticação e autorização adequadas para garantir que apenas usuários autorizados possam acessar e gerenciar as vaquinhas.

## Passo a Passo para Executar o Projeto

1. **Clonar o Projeto**: 
   - Abra o terminal e execute o seguinte comando para clonar o projeto:
     ```
     git clone https://github.com/rafaelccorrea/poupanca-system.git
     ```

2. **Instalar Dependências**:
   - Após clonar o projeto, navegue até o diretório do projeto no terminal e execute o comando a seguir para instalar as dependências:
     ```
     yarn install
     ```

3. **Executar Migrations**:
   - Com as dependências instaladas, execute o seguinte comando para executar as migrações do banco de dados:
     ```
     yarn migration:run
     ```

4. **Iniciar o Projeto**:
   - Por fim, para iniciar o projeto em ambiente de desenvolvimento, execute o seguinte comando:
     ```
     yarn start:dev
     ```