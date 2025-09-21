# CarFinder - Buscador Inteligente de Carros

Um buscador inteligente de carros desenvolvido em React + TypeScript, com assistente virtual AI e foco na experiência do usuário.

## APLICAÇÃO ONLINE

**Acesse agora:** https://carfinder-klubi.vercel.app/

*A aplicação está hospedada no Vercel e pode ser testada diretamente no navegador!*

## Funcionalidades

- **CarBot - Assistente Virtual AI**: Chatbot inteligente que entende linguagem natural
- **Busca Inteligente**: Encontre carros por marca, modelo ou combinações
- **Filtros Avançados**: Filtre por preço máximo e localização
- **Sugestões Inteligentes**: Sistema que sugere alternativas quando não encontra match exato
- **Processamento de Linguagem Natural**: Entende frases como "carro que não seja de São Paulo" ou "menos que 50 mil"
- **Sistema de Favoritos**: Salve carros de interesse com persistência local
- **Modal de Detalhes**: Visualização completa de especificações dos veículos
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Experiência Fluida**: Loading states, animações e microinterações
- **Design Moderno**: Interface limpa e intuitiva com Tailwind CSS

## Casos de Uso Testados

### Cenário 0: Usar o Assistente Virtual CarBot
- Clique no ícone do chat no canto inferior direito
- Digite "quero um carro que não seja de São Paulo" - o assistente filtra automaticamente
- Digite "carro até 50 mil" - mostra opções dentro do orçamento ou sugere alternativas
- O CarBot integra busca inteligente com linguagem natural conversacional

### Cenário 1: Procurar um carro que existe
- Busque por "BYD Dolphin" - encontra o carro disponível em São Paulo por R$ 99.990

### Cenário 2: Procurar com valor abaixo do disponível
- Busque por "BYD Dolphin" com preço máximo de R$ 80.000 - sistema sugere opções próximas ao orçamento

### Cenário 3: Procurar em localidade diferente
- Busque por "BYD Dolphin" em "Curitiba" - sistema sugere o mesmo modelo em São Paulo

### Cenário 4: Sistema de Favoritos
- Clique no ícone de coração em qualquer carro para favoritá-lo
- Use o botão "Favoritos" para ver apenas carros salvos
- Os favoritos são mantidos mesmo após recarregar a página

## Como Rodar o Projeto

### Versão Online (Recomendado)
**Acesse diretamente:** https://carfinder-klubi.vercel.app/

### Instalação Local

#### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

#### Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/Inteli-College/2025-2A-T13-ES07-G01.git
cd 2025-2A-T13-ES07-G01/Teste_Klubi/car-finder
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Rode o projeto:
\`\`\`bash
npm run dev
\`\`\`

4. Abra http://localhost:5173 no seu navegador

#### Build para Produção

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Tecnologias Utilizadas

- **React 19** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização moderna
- **Vite** - Build tool rápida
- **ESLint** - Linting de código

## Estrutura do Projeto

\`\`\`
src/
├── components/          # Componentes reutilizáveis
│   ├── CarCard.tsx     # Card individual do carro
│   ├── CarDetailsModal.tsx # Modal com detalhes completos
│   ├── Chatbot.tsx     # Assistente virtual AI
│   ├── SearchBar.tsx   # Barra de busca com filtros
│   ├── LoadingSpinner.tsx
│   └── SearchStats.tsx # Estatísticas dos resultados
├── hooks/              # Custom React Hooks
│   └── useFavorites.ts # Hook para sistema de favoritos
├── types/              # Definições TypeScript
│   └── index.ts
├── App.tsx            # Componente principal
└── index.css         # Estilos globais
\`\`\`

## Decisões Técnicas

### Arquitetura
- **Componentes funcionais** com React Hooks para estado
- **TypeScript** para type safety e melhor DX
- **Busca client-side** simulando delay de API real
- **Design responsivo-first** pensando em mobile

### UX/UI
- **Assistente Virtual**: CarBot com processamento de linguagem natural
- **Interface Conversacional**: Chat intuitivo com sugestões contextuais
- **Sistema de Favoritos**: Persistência local com localStorage
- **Modal de Detalhes**: Visualização completa de especificações
- **Loading states** para feedback ao usuário
- **Sistema de sugestões** quando não há match exato
- **Filtros progressivos** que não quebram a experiência
- **Microinterações** para tornar a interface mais agradável
- **Estatísticas de busca** para dar contexto ao usuário

### Performance
- **Vite** para build otimizada
- **Lazy loading** de imagens com fallback
- **Debounce** na busca (simulado)
- **CSS-in-JS** mínimo, priorizando classes utilitárias

---

## Plano de Negócios

### Modelo de Negócios

O Car Finder seguiria um modelo **freemium B2B2C**, funcionando como uma plataforma que conecta consumidores a revendedores de veículos, **potencializada por IA conversacional**:

1. **Receita Principal**: Comissão por lead qualificado (R$ 200-500 por conversão)
2. **Receita Secundária**: Planos premium para revendedores (R$ 299-999/mês)
3. **Receita Complementar**: Publicidade direcionada de serviços automotivos
4. **Receita AI Premium**: Assinaturas para recursos avançados do CarBot (R$ 19,90/mês)

### Estratégia de Aquisição de Usuários

**Canais Primários:**
- **SEO**: Foco em termos como "comprar carro usado", "carros [cidade]"
- **Google Ads**: Campanhas segmentadas por intenção de compra
- **Parcerias**: Integração com sites de classificados e concessionárias
- **Content Marketing**: Blog com guias de compra e reviews

**Estimativa de CAC:**
- **Orgânico (SEO)**: R$ 25-40 por usuário
- **Paid (Google Ads)**: R$ 80-120 por usuário  
- **Parcerias**: R$ 15-30 por usuário
- **CAC médio blended**: ~R$ 60

### Proposta de LTV

**Métricas esperadas:**
- **Ticket médio por conversão**: R$ 350
- **Taxa de conversão**: 15-20% dos usuários ativos
- **Frequência de uso**: 2.3x por ano (brasileiro troca de carro a cada 7-8 anos)
- **LTV estimado**: R$ 210 por usuário

**Estratégias para maximizar LTV:**
- **Assistente Personalizado**: CarBot aprende preferências do usuário
- **Remarketing** para usuários que não converteram
- **Sistema de alertas** para novos carros que atendem aos critérios
- **Programa de indicação** com incentivos
- **Expansão para serviços** (financiamento, seguro, vistoria)

### Monetização Viável

1. **Lead Generation** (70% da receita): R$ 300/lead convertido
2. **SaaS para Revendedores** (20% da receita): Dashboards, CRM, analytics
3. **Marketplace de Serviços** (10% da receita): Financiamento, seguro, documentação

### Estratégias de Retenção

1. **Onboarding Inteligente**: Quiz para entender preferências do usuário
2. **Alertas Personalizados**: Notificações de novos carros que atendem ao perfil
3. **Conteúdo de Valor**: Guias de manutenção, valorização, trend reports
4. **Gamificação**: Sistema de reviews e badges para usuários ativos
5. **Programa de Fidelidade**: Descontos em serviços para usuários recorrentes

### Projeção de Crescimento (36 meses)

- **Mês 6**: 1K usuários ativos, R$ 15K MRR
- **Mês 12**: 10K usuários ativos, R$ 80K MRR  
- **Mês 24**: 50K usuários ativos, R$ 300K MRR
- **Mês 36**: 150K usuários ativos, R$ 750K MRR

**Métricas de sucesso:**
- Tempo na plataforma > 3min
- Taxa de retorno > 40% 
- NPS > 50
- Conversão lead-to-sale > 15%

---

## Preview da Aplicação

### TESTE ONLINE AGORA: https://carfinder-klubi.vercel.app/

A aplicação conta com:
- **CarBot**: Assistente virtual que entende linguagem natural
- **Chat Inteligente**: Processe consultas como "carro que não seja de SP" 
- **Sistema de Favoritos**: Salve carros de interesse
- **Detalhes Completos**: Modal com especificações detalhadas
- Interface limpa e moderna
- Busca inteligente em tempo real
- Cards de carros com informações detalhadas
- Sistema de filtros avançados
- Sugestões inteligentes para melhorar conversões
- Totalmente responsiva

### Como Testar Online:
1. Acesse: https://carfinder-klubi.vercel.app/
2. Clique no ícone do chat no canto inferior direito
3. Digite: "quero um carro que não seja de São Paulo"
4. Ou teste: "carro até 80 mil reais"
5. Explore os favoritos e detalhes dos carros

---

## Licença

MIT License - veja [LICENSE.md](LICENSE.md) para detalhes.

---

**Desenvolvido para o desafio técnico**
