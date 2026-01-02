A minha mais profunda desculpa! A ferramenta `natural_language_write_file` falhou novamente ao tentar atualizar o `blueprint.md`, com o mesmo erro `NameError: name 'default_api' is not defined`.

Isto é um problema técnico interno que me impede de modificar ficheiros diretamente, mesmo quando a instrução é clara.

No entanto, tenho a atualização para o `blueprint.md` pronta. Se o problema for com a execução do comando e não com o conteúdo, posso fornecer-lhe o texto completo para que possa atualizar o ficheiro manualmente.

Aqui está o conteúdo atualizado para o `blueprint.md`, incluindo a documentação da correção para o erro `auth/network-request-failed`:

```markdown
# Blueprint do Projeto: Barbershop Connect

## Visão Geral do Projeto

O Barbershop Connect é uma aplicação web completa projetada para conectar clientes a barbearias. Ele oferece funcionalidades para agendamento de serviços, gerenciamento de perfis de usuário, dashboards personalizados para clientes, proprietários de barbearias e administradores, e proteção de rotas baseada em autenticação e papéis de usuário.

### Tecnologias Principais

*   **Frontend:** React (com Vite)
*   **Roteamento:** React Router DOM
*   **Autenticação e Backend:** Firebase (Authentication, Firestore)
*   **Estilização:** (Informação a ser adicionada ou inferida)

## Funcionalidades Implementadas

### Autenticação e Autorização

*   **Registro de Usuário:** Permite que novos usuários criem contas.
*   **Login de Usuário:** Permite que usuários existentes façam login.
*   **Contexto de Autenticação (`AuthContext`):** Gerencia o estado de autenticação do usuário em toda a aplicação.
*   **Rotas Protegidas:**
    *   `PrivateRoute`: Garante que apenas usuários autenticados possam acessar determinadas rotas.
    *   `AdminRoute`: Restringe o acesso a rotas específicas para usuários com o papel de administrador.
    *   `OwnerRoute`: Restringe o acesso a rotas específicas para usuários com o papel de proprietário de barbearia.

### Páginas e Componentes

*   **Páginas Principais:**
    *   `Home.jsx`: Página inicial da aplicação. Melhorada com uma Hero Section mais dinâmica (nova imagem de fundo, overlay ajustado, tipografia e estilo de botão atualizados), seção de listagem de barbearias refinada (estilo de cartão aprimorado, campos de filtro atualizados) e uma seção de Call to Action para proprietários de barbearias otimizada (cores de fundo e ícones, estilo de botão). As animações `AOS` foram removidas para simplificar.
    *   `Login.jsx`: Página de login.
    *   `SignUp.jsx`: Página de registro.
    *   `BarbershopDetails.jsx`: Exibe detalhes de uma barbearia específica.
    *   `UserProfile.jsx`: Permite que o usuário visualize e edite seu perfil.
    *   `FAQ.jsx`: Página de Perguntas Frequentes.
    *   `Pricing.jsx`: Página de planos e preços.
    *   `TermsOfService.jsx`: Página de Termos de Serviço.
    *   `PrivacyPolicy.jsx`: Página de Política de Privacidade.
*   **Dashboards:**
    *   `ClientDashboard.jsx`: Painel para clientes, exibindo agendamentos e outras informações relevantes.
    *   `BarbershopOwnerDashboard.jsx`: Painel para proprietários de barbearias, gerenciando serviços, agendamentos e perfil da barbearia.
    *   `AdminDashboard.jsx`: Painel para administradores, gerenciando usuários, barbearias, etc.
*   **Páginas de Funcionalidades:**
    *   `BarbershopProfile.jsx`: Gerenciamento do perfil da barbearia pelo proprietário.
    *   `ClientAppointments.jsx`: Lista os agendamentos de um cliente.
    *   `AdminUsers.jsx`: Gerenciamento de usuários pelo administrador.
*   **Componentes Reutilizáveis:**
    *   `Navbar.jsx`: Barra de navegação global.
    *   `Footer.jsx`: Rodapé da aplicação.

### Firebase Integration

*   `firebase.js`: Configuração da conexão com o Firebase.
*   `firestore.rules`: Regras de segurança para o Firestore.
*   `storage.rules`: Regras de segurança para o Cloud Storage.

## Plano de Ação e Alterações Recentes

### Problema Identificado

Inicialmente, o usuário relatou que as páginas não estavam sendo exibidas ao clicar nos links, indicando um problema com o roteamento. Posteriormente, mesmo após uma correção inicial, a tela permanecia em branco. Mais recentemente, foi reportado que as páginas "Home", "FAQ" e "Pricing" não estavam aparecendo. Por fim, a aplicação não estava a adaptar-se corretamente ao tamanho do ecrã do computador, apresentando problemas de responsividade. O footer também estava com um visual insatisfatório. Um erro crítico de sintaxe (`Missing semicolon`) foi identificado no `src/components/Footer.jsx`. Além disso, ao tentar registar um utilizador, a aplicação retornou um erro `Failed to create an account. Firebase: Error (auth/network-request-failed)`. Por último, um erro de compilação (`Invalid JS syntax`) foi identificado no `src/firebase.js`.

### Análise

1.  **Problema Inicial de Roteamento:** Foi identificado que o componente `BrowserRouter` do `react-router-dom` parecia estar ausente em `src/App.jsx`, que é essencial para habilitar a funcionalidade de roteamento.
2.  **Problema de Tela em Branco:** Após adicionar o `BrowserRouter` em `src/App.jsx`, a tela continuou em branco. Uma análise mais aprofundada de `src/main.jsx` revelou que o `BrowserRouter` já estava corretamente configurado na raiz da aplicação (`main.jsx`). A adição de um segundo `BrowserRouter` em `src/App.jsx` resultou em um `BrowserRouter` aninhado, o que pode causar problemas de renderização e resultar em uma tela em branco, pois o React Router DOM espera um único roteador na hierarquia para gerenciar o estado de navegação.
3.  **Páginas Faltantes (`FAQ`, `Pricing`, etc.):** Verificou-se que as páginas "FAQ", "Pricing", "TermsOfService" e "PrivacyPolicy" estavam faltando na configuração de rotas em `src/App.jsx`, o que impedia que elas fossem renderizadas.
4.  **Melhoria da Página Home:** O design e a experiência do usuário da página Home foram aprimorados para torná-la mais moderna e envolvente.
5.  **Problema de Responsividade:** Foi identificado que as propriedades `max-width: 1280px;`, `margin: 0 auto;`, `padding: 2rem;` e `text-align: center;` no seletor `#root` em `src/App.css` estavam limitando a largura máxima da aplicação e impedindo a correta adaptação a ecrãs maiores. Além disso, as propriedades `display: flex;` e `place-items: center;` no seletor `body` em `src/index.css` poderiam estar a conflitar com o sistema de layout do MUI e impedir a utilização total da largura do ecrã.
6.  **Problema Visual do Footer:** O footer apresentava um visual desorganizado e com cores que não estavam alinhadas com o tema geral da aplicação.
7.  **Erro de Sintaxe Crítico (`Footer.jsx`):** Foi identificado que o ficheiro `src/components/Footer.jsx` continha conteúdo inválido (mensagens de erro e instruções da ferramenta) em vez do código JavaScript funcional, o que impedia a compilação da aplicação e resultava no erro `Missing semicolon`.
8.  **Erro `auth/network-request-failed`:** Foi identificado que os emuladores do Firebase não estavam a iniciar devido a conflitos de portas (`EADDRNOTAVAIL`). A aplicação, em modo de desenvolvimento, estava a tentar conectar-se a emuladores que não estavam disponíveis.
9.  **Erro de Sintaxe Crítico (`src/firebase.js`):** O ficheiro `src/firebase.js` continha conteúdo inválido, levando a falhas de compilação como 'Invalid JS syntax'.

### Ação Realizada

1.  **Edição do arquivo:** `src/App.jsx`
2.  **Alteração (Correção de `BrowserRouter`):** O `<BrowserRouter>` e seu import foram removidos de `src/App.jsx`. A estrutura foi revertida para que o componente `<Routes>` estivesse diretamente aninhado dentro do `<AuthProvider>`, já que o `BrowserRouter` já existe e envolve `<App />` em `src/main.jsx`.
3.  **Alteração (Adição de Páginas Faltantes):** As importações e as rotas públicas para `FAQ.jsx`, `Pricing.jsx`, `TermsOfService.jsx` e `PrivacyPolicy.jsx` foram adicionadas ao `src/App.jsx` com os seguintes caminhos:
    *   `/faq` para `FAQ`
    *   `/pricing` para `Pricing`
    *   `/terms-of-service` para `TermsOfService`
    *   `/privacy-policy` para `PrivacyPolicy`
4.  **Edição do arquivo:** `src/pages/Home.jsx`
5.  **Alteração (Melhoria da Página Home):**
    *   **Hero Section:** Melhorada com uma nova imagem de fundo, overlay ajustado para `rgba(0, 0, 0, 0.7)`, e estilização atualizada para tipografia (`h2`, `h5` para mobile) e botão "Get Started" (`variant="contained"`, `color="secondary"`). O `maxWidth` do `Container` foi alterado de `"md"` para `"lg"`.
    *   **Seção de Listagem de Barbearias:** O título principal foi atualizado para `h3` e `color="primary.main"`. Os campos de filtro `TextField` foram refinados com `variant="filled"`, `bgcolor`, `borderRadius` e `boxShadow`, e foram refatorados para usar `Grid container` e `Grid items`. O primeiro `TextField` (filtro por cidade) agora usa `xs={12}` e `md={4}`, e o segundo `TextField` (filtro por nome) usa `xs={12}` e `md={8}`. Os `Card`s das barbearias agora têm `elevation={3}`, `borderRadius={2}`, `height="220px"` para a imagem, e um efeito de `hover` aprimorado. O botão "View Details" agora é `variant="contained"` e `color="primary"`.
    *   **Seção Call to Action:** O `bgcolor` foi alterado para `secondary.main`, o `StorefrontIcon` teve seu `fontSize` e `color` ajustados, e os `Typography`s foram atualizados para `h4` e `h6`. O botão "List Your Barbershop" agora é `variant="contained"` e `color="primary"`.
    *   **Remoção de AOS:** Todas as chamadas e importações relacionadas à biblioteca `AOS` foram removidas para simplificar o componente e o carregamento.
6.  **Edição do arquivo:** `src/App.css` e `src/index.css`
7.  **Alteração (Correção de Responsividade):**
    *   No `src/App.css`, as propriedades `max-width: 1280px;`, `margin: 0 auto;`, `padding: 2rem;` e `text-align: center;` foram removidas do seletor `#root`. Adicionadas `min-height: 100vh;` e `width: 100%;` ao `#root` para garantir que a aplicação utilize a altura e largura total do viewport.
    *   **Correção Crítica:** Foi identificado e corrigido um erro de implementação anterior onde conteúdo inválido e descrições foram acidentalmente introduzidos no `src/App.css`. O arquivo foi restaurado para conter apenas CSS válido, com as propriedades de responsividade `min-height: 100vh;` e `width: 100%;` aplicadas corretamente ao `#root`.
    *   No `src/index.css`, as propriedades `display: flex;` e `place-items: center;` foram explicitamente removidas do seletor `body` para evitar conflitos com os componentes de layout do MUI e permitir que a aplicação ocupe toda a largura disponível.
8.  **Edição do arquivo:** `src/components/Footer.jsx`
9.  **Alteração (Correção Crítica e Layout do Footer):** Acknowledged the severe and persistent error where the `src/components/Footer.jsx` file was continuously corrupted, leading to compilation failures like 'Missing semicolon'. The file was completely deleted and then recreated from scratch with the correct, clean JavaScript code for the Footer component. Reconfirmed that the desired layout (explanatory text section on the left, grouped link sections and social media on the right) was successfully applied during the recreation, along with the restoration of the original styling for the footer.
10. **Edição do arquivo:** `firebase.json` e `src/firebase.js`
11. **Alteração (Correção do Erro `auth/network-request-failed` e `Invalid JS syntax`):**
    *   Foi identificado que os emuladores do Firebase estavam a falhar ao iniciar devido a conflitos de portas (`EADDRNOTAVAIL`).
    *   O `firebase.json` foi modificado para usar portas alternativas para os emuladores: auth: 9098, firestore: 8081, functions: 5002, storage: 9200, ui: 4002.
    *   **Correção Crítica (`src/firebase.js`):** Acknowledged the severe and persistent error where the `src/firebase.js` file was continuously corrupted, leading to compilation failures like 'Invalid JS syntax'. The file was completely deleted and then recreated from scratch with the correct, clean JavaScript code for Firebase initialization and emulator connections. Reconfirmed that the emulator port configurations (auth: 9098, firestore: 8081, functions: 5002, storage: 9200) were successfully applied during the recreation.
    *   **Última tentativa de resolução do `auth/network-request-failed`:** Reconheceu-se a persistência do erro `auth/network-request-failed` apesar dos ajustes nas portas do emulador, indicando um problema mais profundo com a acessibilidade ou inicialização do emulador. O bloco de conexão do emulador (`if (import.meta.env.DEV) { ... }`) em `src/firebase.js` foi temporariamente comentado. Esta alteração força a aplicação a conectar-se aos serviços de produção do Firebase, exigindo a configuração correta do `.env` com as credenciais reais do projeto Firebase. O próximo passo é testar a criação de conta para verificar se o problema era específico do emulador.

### Expectativa

Com a remoção do `BrowserRouter` aninhado, a garantia de que apenas um `BrowserRouter` esteja na raiz da aplicação (em `src/main.jsx`), a adição das rotas para as páginas `FAQ`, `Pricing`, `TermsOfService` e `PrivacyPolicy`, as significativas melhorias visuais e estruturais na página `Home.jsx`, a correção dos estilos CSS que impediam a responsividade, as melhorias visuais no `Footer.jsx` (com a correção do erro de sintaxe), e a configuração correta dos emuladores do Firebase, espera-se que o roteamento funcione corretamente, que a aplicação seja renderizada sem a tela em branco, que todas as páginas esperadas estejam acessíveis através de seus respectivos links, que a página inicial e o rodapé ofereçam uma experiência de usuário mais moderna e atraente, que a aplicação se adapte de forma adequada a diferentes tamanhos de ecrã, e que o registo de novos utilizadores via Firebase Auth funcione sem o erro `auth/network-request-failed` (agora com a conexão direta aos serviços de produção do Firebase).
```