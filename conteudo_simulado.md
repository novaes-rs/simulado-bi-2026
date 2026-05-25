# Planejamento Pedagógico e Questões de BI (Nível Avançado — Administração 5º Semestre)

As questões abaixo foram desenvolvidas com base nas apostilas técnicas da disciplina, focando em cenários de alta complexidade onde o aluno precisa agir como um gestor estratégico que utiliza o Business Intelligence para solucionar problemas reais de negócios.

---

## Tópicos Abordados (Mapeamento de Gargalos para o Dashboard)
1. **Design de Indicadores (KPIs vs. Métricas de Vaidade)**: Baseado na Hierarquia DIKW, Framework Quem/O Quê/Como e nas lições de Nussbaumer Knaflic [1].
2. **Modelagem Dimensional (Star Schema vs. Transacional)**: Relacionamentos de tabelas, chaves primárias/estrangeiras, tabelas Fato e Dimensão, e granularidade [2].
3. **Cálculos Avançados em DAX (Contexto de Avaliação)**: Diferença entre colunas calculadas e métricas, transição de contexto, funções de iteração (SUMX) e inteligência temporal (CALCULATE) [3].
4. **Visualização de Dados e Wireframes**: Princípios da Gestalt, atributos pré-atentativos, redução de ruído cognitivo e hierarquia visual (Pirâmide de Dashboards) [4].
5. **Qualidade de Dados e Governança**: Processos de ETL/ELT, saneamento de dados nulos ou inconsistentes, e democratização do acesso à informação [5].

---

## Questões Objetivas

### Questão 1: Modelagem Dimensional e Arquitetura de Dados (Caso Distribuidora Silva & Filhos)
* **Tema**: Modelagem de Relacionamentos e Integridade de Dados
* **Contexto**: A Distribuidora Silva & Filhos [1] está reestruturando seu banco de dados analítico para suportar o crescimento das vendas. O analista de BI júnior propôs a criação de um modelo Snowflake para economizar espaço de armazenamento, normalizando as dimensões de Clientes e Produtos até a Terceira Forma Normal (3FN). No entanto, o Diretor de Operações reclama que as consultas de vendas diárias estão demorando mais de 10 minutos para carregar no Power BI Desktop.
* **Enunciado**: Diante desse cenário de gargalo de performance analítica, qual deve ser a decisão do gestor de BI para otimizar o modelo de dados, garantindo a integridade referencial e a velocidade de resposta necessária para a tomada de decisão em tempo hábil?
* **Alternativas**:
  * A) Manter a estrutura Snowflake normalizada e orientar a equipe de TI a realizar backups diários automáticos durante o horário comercial, visando liberar memória cache nos servidores de produção e reduzir o tempo de processamento das consultas analíticas complexas dos gestores.
  * B) Desnormalizar o modelo para a estrutura Star Schema (Esquema Estrela), unificando as tabelas de subcategorias e categorias dentro de suas respectivas tabelas de Dimensão (como Dim_Produto), reduzindo o número de relacionamentos (joins) e otimizando o tempo de processamento.
  * C) Substituir os relacionamentos de um-para-muitos ($1:\infty$) ativos por relacionamentos bidirecionais (ambos) em todas as tabelas do modelo, forçando o Power BI a aplicar filtros automáticos em qualquer direção e eliminando a necessidade de chaves primárias na tabela Fato.
  * D) Migrar todos os dados históricos das tabelas de Dimensão diretamente para dentro da tabela Fato_Vendas, criando uma única tabela plana gigante (flat table), pois a ausência completa de relacionamentos é a prática recomendada para governança de dados.
  * E) Alterar a granularidade da tabela Fato_Vendas para consolidar os registros de forma mensal em vez de diária, eliminando os dados de produtos individuais e mantendo apenas o faturamento agregado por região para evitar gargalos na infraestrutura local.
* **Gabarito**: **B**
* **Gabarito Comentado**:
  * **Por que a B está correta?** No contexto analítico (OLAP), o espaço em disco é secundário em relação à performance de leitura. O modelo **Star Schema** é amplamente preferido sobre o Snowflake porque desnormaliza as dimensões (junta tabelas correlacionadas, como Produto, Subcategoria e Categoria, em uma única Dim_Produto). Isso elimina a necessidade de múltiplos *joins* em cascata no momento da consulta, reduzindo drasticamente o tempo de processamento das métricas no Power BI [2].
  * **Análise das Alternativas Incorretas**:
    * *Alternativa A*: Realizar backups durante o horário comercial aumenta o gargalo de rede e processamento, piorando a performance das consultas dos gestores.
    * *Alternativa C*: Filtros bidirecionais ativos em massa criam ambiguidade no modelo, geram caminhos de filtragem circulares e degradam severamente a performance, além de não resolverem a normalização excessiva.
    * *Alternativa D*: Uma tabela única e plana de grande porte consome memória excessiva de forma ineficiente no motor VertiPaq do Power BI, além de violar as melhores práticas de organização e reutilização de dimensões.
    * *Alternativa E*: Reduzir a granularidade para mensal resolve a performance, mas destrói a capacidade do gestor de fazer análises detalhadas por dia ou por produto específico, limitando a tomada de decisão.

---

### Questão 2: Métricas de Performance em DAX (Cálculo de Margem Comercial)
* **Tema**: Contexto de Avaliação em DAX (Métrica vs. Coluna Calculada)
* **Contexto**: O gerente de vendas de uma rede de franquias deseja analisar a rentabilidade real de cada loja. Para isso, ele precisa calcular a **Margem de Contribuição Percentual Média** acumulada. O analista de BI criou uma coluna calculada no Power BI utilizando a seguinte fórmula: `Margem_Calculada = (Fato_Vendas[Faturamento] - Fato_Vendas[Custo]) / Fato_Vendas[Faturamento]`. Em seguida, arrastou essa coluna para um cartão e configurou a agregação para exibir a **Média**. O resultado exibido foi de $42\%$, enquanto o sistema financeiro (ERP) aponta que a margem real consolidada do período foi de $28\%$.
* **Enunciado**: Como gestor analítico de BI, qual diagnóstico você apresenta para explicar a divergência matemática entre os dois sistemas e qual ação corretiva em DAX deve ser adotada para garantir a precisão da informação estratégica?
* **Alternativas**:
  * A) A divergência ocorre porque o Power BI não suporta operações de divisão direta dentro de colunas calculadas, exigindo que o gestor mude a infraestrutura de dados para um banco de dados relacional externo que execute o cálculo de margem de forma prévia.
  * B) O erro decorre do uso de uma coluna calculada agregada pela média aritmética simples, o que ignora os pesos relativos do faturamento de cada transação (efeito mix de vendas); a solução é criar uma Métrica usando a expressão: `Margem_Real = DIVIDE(SUM(Fato_Vendas[Faturamento]) - SUM(Fato_Vendas[Custo]), SUM(Fato_Vendas[Faturamento]))`.
  * C) O Power BI aplicou uma transição de contexto incorreta devido à falta de uma função `USERELATIONSHIP` ativa entre as tabelas; a solução consiste em converter a tabela Fato_Vendas em uma dimensão estática e recalcular a média ponderada utilizando o Excel.
  * D) A diferença de $14\%$ é explicada pela ausência de um filtro de inteligência temporal (Time Intelligence) na coluna calculada; a solução exige a aplicação da função `CALCULATE` combinada com `SAMEPERIODLASTYEAR` para ajustar a inflação do período.
  * E) O cálculo do ERP está incorreto por não considerar os custos fixos indiretos das lojas físicas; a solução gerencial é desconsiderar os relatórios financeiros do ERP e adotar a média simples de $42\%$ exibida no Power BI como a nova meta oficial.
* **Gabarito**: **B**
* **Gabarito Comentado**:
  * **Por que a B está correta?** Colunas calculadas são calculadas linha a linha durante a carga de dados. Quando calculamos a margem na linha e depois tiramos a média simples dessas margens, tratamos uma venda de R$ 10 e uma de R$ 1.000.000 com o mesmo peso, gerando um erro grave de distorção (média das taxas vs. taxa das médias). Para obter a margem real consolidada, devemos primeiro somar todo o faturamento e todo o custo do contexto de filtro atual e, em seguida, realizar a divisão. Isso é feito por meio de uma **Métrica** com a função `DIVIDE` para garantir tratamento seguro de divisões por zero [3].
  * **Análise das Alternativas Incorretas**:
    * *Alternativa A*: O Power BI suporta qualquer tipo de operação matemática; o problema é a lógica de agregação utilizada (média das margens), não a ferramenta.
    * *Alternativa C*: A transição de contexto ocorre quando transformamos uma linha em filtro (ex: usando `CALCULATE`), o que não é o caso do erro de média simples apresentado. Converter a Fato em Dimensão destruiria a arquitetura do modelo.
    * *Alternativa D*: Funções de inteligência temporal servem para comparações de períodos (ano contra ano, mês contra mês), não para corrigir erros de média aritmética simples de margem.
    * *Alternativa E*: Uma postura gerencial séria nunca deve ignorar divergências com o financeiro ou adotar um dado inflacionado e matematicamente incorreto como meta.

---

### Questão 3: Design de Dashboards e Redução de Ruído Cognitivo (Princípios da Gestalt)
* **Tema**: Visualização de Dados e Storytelling Analítico
* **Contexto**: O Diretor de Supply Chain de uma indústria química relatou que o painel de monitoramento de incidentes ambientais e operacionais é ineficaz. O dashboard exibe um gráfico de barras tridimensional (3D) com 25 categorias de falhas, um mapa com dezenas de pontos vermelhos piscantes de tamanhos idênticos e um fundo escuro com linhas de grade amarelas brilhantes. O gestor leva vários minutos para identificar qual planta industrial precisa de intervenção urgente.
* **Enunciado**: Para reestruturar esse dashboard de forma estratégica, aplicando os **Princípios da Gestalt** e as técnicas de **Storytelling com Dados** de Cole Nussbaumer Knaflic [1], qual conjunto de ações o profissional de BI deve implementar?
* **Alternativas**:
  * A) Manter o gráfico 3D para preservar o apelo estético do painel, mas adicionar rótulos de dados em todas as 25 barras com fontes coloridas de tamanho reduzido para maximizar a quantidade de informação técnica exibida em uma única tela de monitoramento.
  * B) Aplicar o princípio do fechamento e da semelhança, removendo as linhas de grade amarelas e o efeito 3D; utilizar uma paleta de cores neutras (tons de cinza) para o histórico padrão e aplicar uma cor de alto contraste (como vermelho escuro) apenas na planta com incidentes críticos ativos.
  * C) Substituir todos os elementos visuais por uma tabela de dados brutos sem formatação condicional, pois a eliminação completa de cores e formas geométricas é a única maneira comprovada de reduzir o estresse visual de gestores de nível executivo.
  * D) Desenhar múltiplos gráficos de pizza com efeitos de sombra e inclinação para representar cada uma das 25 categorias de falhas de forma isolada, distribuindo esses gráficos em uma grade simétrica sem hierarquia visual definida.
  * E) Implementar um carrossel de slides automáticos que alterne as telas do dashboard a cada três segundos, impedindo que o usuário interaja com os filtros para garantir que nenhuma informação operacional seja omitida durante a tomada de decisão.
* **Gabarito**: **B**
* **Gabarito Comentado**:
  * **Por que a B está correta?** A reestruturação proposta segue as lições fundamentais de eliminação de ruído cognitivo e uso intencional de **atributos pré-atentativos** (como cor e tamanho) para direcionar o foco visual do gestor para onde a ação é necessária. Remover gráficos 3D (que distorcem a percepção das barras) e usar cores neutras para o padrão, destacando apenas os desvios críticos em vermelho, permite que o cérebro identifique o problema em menos de um segundo (Princípio do Ponto Focal) [1].
  * **Análise das Alternativas Incorretas**:
    * *Alternativa A*: Gráficos 3D e excesso de rótulos pequenos aumentam o ruído cognitivo e dificultam a leitura rápida dos dados.
    * *Alternativa C*: Tabelas puras sem formatação condicional exigem esforço de leitura sequencial (análise descritiva lenta), falhando no objetivo de monitoramento rápido.
    * *Alternativa D*: Gráficos de pizza com muitas categorias ou efeitos 3D são inadequados para comparação precisa de valores e geram grande confusão visual.
    * *Alternativa E*: A rotação automática ultra-rápida sem controle de filtros impede a análise aprofundada e gera frustração no tomador de decisão.

---

### Questão 4: Saneamento e Qualidade de Dados (Caso do "Dirty Café")
* **Tema**: ETL, Qualidade de Dados e Governança
* **Contexto**: Durante a carga de dados para o dashboard de vendas da rede de cafeterias "Dirty Café" [5], o analista de BI identificou que a coluna `ID_Cliente` possui $15\%$ de valores nulos (`null`), a coluna `Preco_Unitario` apresenta valores negativos em transações de devolução sem sinalização de tipo de operação, e o campo `Data_Venda` possui registros no formato brasileiro (`DD/MM/AAAA`) e americano (`MM/DD/AAAA`) misturados no mesmo arquivo de origem.
* **Enunciado**: Considerando as boas práticas de **Governança de Dados** e os processos de **ETL (Extract, Transform, Load)**, como o gestor de BI deve tratar essas inconsistências na etapa de preparação de dados para garantir que as análises de faturamento e comportamento do consumidor sejam confiáveis?
* **Alternativas**:
  * A) Ignorar as inconsistências e carregar os dados brutos diretamente no modelo de dados, pois o motor analítico do Power BI possui algoritmos de inteligência artificial que corrigem e deduzem automaticamente o formato correto das datas e valores durante as consultas dos usuários.
  * B) Tratar os dados na etapa de transformação (Power Query/SQL): padronizar o formato de data com base na localidade de origem, converter preços negativos em positivos criando uma coluna de tipo de transação (venda vs. devolução), e substituir os IDs nulos por um código padrão (ex: "Consumidor Não Identificado").
  * C) Excluir permanentemente todas as linhas de vendas que apresentem qualquer valor nulo ou formato de data inconsistente, reduzindo o tamanho da base de dados para garantir que apenas transações perfeitas sejam contabilizadas, mesmo que isso reduza o faturamento reportado em 30%.
  * D) Alterar as configurações regionais do sistema operacional de cada computador dos diretores da empresa para o formato americano, forçando a leitura unificada das datas diretamente na tela de visualização do dashboard.
  * E) Suspender a atualização do dashboard de BI por tempo indeterminado e exigir que a equipe de TI reprojete todo o sistema de frente de caixa (PDV) das cafeterias antes de liberar qualquer relatório analítico para a diretoria.
* **Gabarito**: **B**
* **Gabarito Comentado**:
  * **Por que a B está correta?** O processo de ETL/ELT serve justamente para limpar, padronizar e enriquecer os dados antes de disponibilizá-los para análise. Padronizar as datas evita erros graves de distorção temporal (ex: ler 01 de maio como 05 de janeiro). Tratar valores nulos de ID de cliente com uma categoria padrão ("Não Identificado") mantém a integridade dos totais de vendas sem distorcer as métricas de clientes recorrentes. Separar o sinal do preço em uma coluna de atributo de transação garante a correta contabilidade financeira [5].
  * **Análise das Alternativas Incorretas**:
    * *Alternativa A*: O Power BI não corrige dados inconsistentes por conta própria; carregar dados "sujos" gerará erros de cálculo e relatórios não confiáveis (princípio *Garbage In, Garbage Out*).
    * *Alternativa C*: Excluir 30% da base de dados para simplificar o tratamento destrói a acurácia do faturamento total, tornando o BI inútil para fins fiscais e gerenciais.
    * *Alternativa D*: Mudar a configuração do sistema operacional do usuário não corrige a inconsistência interna do arquivo de dados e gerará novos erros em outros relatórios.
    * *Alternativa E*: Suspender o BI e exigir refazer o ERP operacional é uma decisão desproporcional que paralisa a gestão estratégica por meses; o papel do BI é justamente mitigar essas dores na camada analítica enquanto o operacional se estrutura.

---

### Questão 5: Análise Prescritiva e Estratégia de Negócios (Benchmarking e CHAF)
* **Tema**: Tipos de Análise e Competências do Líder de BI (CHAF)
* **Contexto**: A rede de varejo "SuperMercados Popular" realizou um estudo de benchmarking interno [6] e identificou que as lojas que utilizam análises preditivas de ruptura de estoque apresentam uma margem operacional $8\%$ superior às demais. O Diretor Comercial deseja evoluir o BI da empresa do nível descritivo (relatórios de perdas passadas) para o nível **prescritivo** para mitigar a falta de produtos nas gôndolas.
* **Enunciado**: Para que a rede de supermercados implemente com sucesso uma solução de **BI Prescritivo** alinhada ao desenvolvimento de liderança (Framework CHAF), qual deve ser o foco da solução analítica desenvolvida?
* **Alternativas**:
  * A) Gerar relatórios em formato PDF ao final de cada mês detalhando quais produtos faltaram nas gôndolas de cada filial, permitindo que a diretoria aplique advertências administrativas aos gerentes das lojas com pior desempenho histórico.
  * B) Desenvolver um algoritmo integrado ao modelo de dados que, além de prever a probabilidade de ruptura de um produto nos próximos 5 dias, sugira automaticamente a quantidade exata de compra e dispare um alerta de reabastecimento emergencial para o fornecedor homologado.
  * C) Criar um painel de controle visual com gráficos tridimensionais complexos que exiba a cotação em tempo real das ações das principais redes de supermercados concorrentes na Bolsa de Valores (B3), visando motivar os funcionários do estoque.
  * D) Centralizar todas as decisões de compras na intuição do Diretor Comercial experiente, utilizando as ferramentas de BI apenas como um repositório estático para armazenar as notas fiscais digitalizadas dos últimos dez anos.
  * E) Automatizar o processo de demissão de funcionários do setor de compras que não atingirem as metas semanais de redução de custos, utilizando modelos de regressão linear simples baseados na avaliação de desempenho individual.
* **Gabarito**: **B**
* **Gabarito Comentado**:
  * **Por que a B está correta?** A análise **prescritiva** vai além de apontar o que aconteceu (descritiva) ou o que vai acontecer (preditiva); ela **recomenda a melhor linha de ação** e, quando possível, automatiza a decisão ou fornece opções claras para o tomador de decisão agir rapidamente. No caso de ruptura de estoque, a recomendação automática de compra e o alerta ao fornecedor são exemplos clássicos de inteligência prescritiva aplicada ao negócio, gerando valor real e agilidade operacional [6].
  * **Análise das Alternativas Incorretas**:
    * *Alternativa A*: Relatórios mensais de perdas passadas pertencem ao nível analítico descritivo, incapaz de evitar a ruptura em tempo real.
    * *Alternativa C*: Cotações de ações de concorrentes não possuem relação direta com a operação logística de ruptura de estoque das lojas físicas.
    * *Alternativa D*: Ignora o valor da tomada de decisão orientada a dados (Data-Driven), mantendo a empresa dependente de processos puramente intuitivos e analógicos.
    * *Alternativa E*: Automatizar punições sem contexto humano e baseando-se em modelos simples viola os princípios de liderança, ética e desenvolvimento de pessoas do framework CHAF.

---

## Questões Subjetivas

### Questão Subjetiva 1: O Desafio da Transição de Cultura Analítica na "MetalForte"
* **Contexto**: A "MetalForte", uma tradicional fabricante de autopeças, opera há 40 anos com base na intuição de seus fundadores e em relatórios operacionais estáticos em papel. Com a pressão competitiva, o estoque de produtos acabados subiu $35\%$ no último ano, enquanto o nível de serviço de entrega (OTIF - *On-Time In-Full*) caiu para $78\%$. O CEO iniciou a implantação de uma plataforma de Self-Service BI (Power BI) para descentralizar as decisões. Contudo, os gerentes de produção resistem ativamente, alegando que "os dados do sistema não refletem a realidade dinâmica da fábrica" e continuam utilizando suas planilhas paralelas de controle pessoal.
* **Enunciado**: Na posição de Diretor de BI e Governança de Dados, elabore um parecer executivo estruturado respondendo aos seguintes pontos:
  1. Apresente **duas ações práticas de Gestão de Mudança e Governança** para desmantelar os "silos de informação" (planilhas paralelas) e engajar os gerentes na adoção da nova ferramenta de BI, justificando sua escolha com base no Framework CHAF (Conhecimento, Habilidade, Atitude e Foco no Resultado) [6].
  2. Defina **um KPI estratégico de Estoque** e **um KPI de Nível de Serviço (OTIF)** que devem constar no dashboard principal. Para cada indicador, apresente: a **fórmula matemática**, um **exemplo prático de cálculo** com números hipotéticos e a **interpreção gerencial do resultado** (o que o número diz para o gestor tomar decisão).

* **Gabarito e Critérios de Avaliação (Para a Professora)**:
  * **Item 1 (Gestão de Mudança e Cultura)**:
    * *Esperado*: O aluno deve evitar soluções genéricas como "mandar usar o sistema". Deve propor:
      * **Co-criação de Wireframes**: Envolver os gerentes de fábrica no desenho do painel (fase de wireframe) para garantir que suas dores reais sejam mapeadas (Atitude/Habilidade).
      * **Programa de Data Champions**: Identificar líderes informais na fábrica para apoiar os colegas no uso da ferramenta (Conhecimento/Multiplicação).
      * **Homologação e Desativação Gradual**: Criar uma única fonte da verdade e, após treinamento, desativar os acessos diretos que alimentam as planilhas paralelas para forçar o uso do modelo oficial.
  * **Item 2 (KPIs de Negócio)**:
    * *Esperado para o KPI de Estoque*:
      * **Giro de Estoque**: $Giro = \frac{\text{Custo das Mercadorias Vendidas (CMV)}}{\text{Estoque Médio}}$.
      * *Exemplo*: CMV anual de R$ 12.000.000 com Estoque Médio de R$ 3.000.000 = Giro de 4 vezes ao ano.
      * *Interpretação*: O estoque se renova a cada 90 dias. Um giro baixo (como este) indica capital de giro imobilizado e alto risco de obsolescência, exigindo revisão do plano de produção.
    * *Esperado para o KPI de Nível de Serviço*:
      * **OTIF (On-Time In-Full)**: $OTIF = \% \text{ Entregas no Prazo} \times \% \text{ Entregas Completas (sem erros)}$.
      * *Exemplo*: 90% das entregas foram no prazo e 85% foram completas. $OTIF = 0,90 \times 0,85 = 76,5\%$.
      * *Interpretação*: Apenas 76,5% dos pedidos atenderam perfeitamente aos critérios de prazo e conformidade. O gestor deve cruzar este dado com a ruptura de estoque para identificar se o atraso ocorre por falta de produto ou falha logística de transporte.

---

### Questão Subjetiva 2: Análise de Cenário Gerencial — Elasticidade e Margem na "SuperMercados Popular"
* **Contexto**: O dashboard comercial da rede "SuperMercados Popular" apresenta o gráfico de dispersão abaixo, que cruza a **Taxa de Desconto Oferecida (%)** no eixo X com o **Volume de Vendas (Unidades)** no eixo Y para a categoria de Vinhos Importados. Adicionalmente, o painel exibe uma linha de tendência da **Margem de Contribuição Total (R$)** da categoria.
  
  ```
  Volume de Vendas (Unidades)
  ▲
  │         *   *   *   * (Platô de Vendas a partir de 15% de desconto)
  │       *
  │     *
  │   *
  └───┴───┴───┴───┴───┴───┴───▶ Taxa de Desconto (%)
  0%  5%  10% 15% 20% 25% 30%
  
  Margem de Contribuição Total (R$)
  ▲
  │     /‾\
  │    /   \
  │   /     \
  │  /       \
  └─┴───┴───┴─\─┴───┴───┴───▶ Taxa de Desconto (%)
  0%  5%  10% 15% 20% 25% 30%
              (Margem despenca e fica negativa após 15%)
  ```

* **Enunciado**: Analise criticamente o cenário apresentado no dashboard comercial e responda:
  1. Qual é o **diagnóstico analítico** desse comportamento de vendas e margem? Explique o fenômeno econômico-comercial que ocorre quando a taxa de desconto ultrapassa o limite de $15\%$, utilizando os conceitos de **elasticidade-preço da demanda** e **saturação de mercado**.
  2. Na posição de Gestor de BI, formule **duas recomendações prescritivas** (decisões práticas de negócios) para serem apresentadas ao Diretor Comercial, visando maximizar a rentabilidade da categoria de vinhos sem perder volume de clientes.

* **Gabarito e Critérios de Avaliação (Para a Professora)**:
  * **Item 1 (Diagnóstico Analítico)**:
    * *Esperado*: O aluno deve demonstrar capacidade de ler gráficos e correlacionar conceitos de economia/administração com dados de BI. Deve explicar que até 15% de desconto, a demanda é altamente **elástica** (pequenas reduções de preço geram grandes aumentos de volume, compensando a perda de margem unitária e elevando a margem total). Acima de 15%, ocorre a **saturação da demanda** (a elasticidade diminui, pois o público-alvo da promoção já foi totalmente atingido). Descontos maiores apenas transferem margem para clientes que já comprariam o produto de qualquer forma, resultando em destruição de valor financeiro (margem total despenca).
  * **Item 2 (Recomendações Prescritivas)**:
    * *Esperado*: O aluno deve sugerir ações baseadas em dados, como:
      * **Teto Promocional**: Fixar a política de desconto máximo para vinhos importados em 15% no sistema de precificação (bloqueio de margem negativa).
      * **Promoções Cruzadas (Cross-Selling)**: Em vez de dar desconto direto no vinho acima de 15%, associar a venda a itens de alta margem e menor elasticidade (ex: queijos finos ou taças de cristal), preservando a rentabilidade do ticket médio.
      * **Fidelização Segmentada**: Direcionar descontos exclusivos (via CRM/App) apenas para clientes com perfil de compra recorrente de vinhos, evitando a concessão de descontos generalizados na gôndola física.

---

## Referências Bibliográficas (Para Consulta dos Alunos)
* [1] KNAFLIC, Cole Nussbaumer. **Storytelling com Dados**: um guia de visualização de dados para profissionais de negócios. Rio de Janeiro: Alta Books, 2019.
* [2] KIMBALL, Ralph; ROSS, Margy. **The Data Warehouse Toolkit**: the definitive guide to dimensional modeling. 3. ed. Indianapolis: John Wiley & Sons, 2013.
* [3] RUSSO, Marco; FERRARI, Alberto. **Definitive Guide to DAX, The**: business intelligence with Microsoft Power BI, SQL Server Analysis Services, and Excel. 2. ed. Boston: Microsoft Press, 2019.
* [4] FEW, Stephen. **Information Dashboard Design**: displaying data for at-a-glance monitoring. 2. ed. Burlingame: Analytics Press, 2013.
* [5] REDMAN, Thomas C. **Data Quality**: the field guide. Boston: Harvard Business Press, 2001.
* [6] DAVENPORT, Thomas H.; HARRIS, Jeanne G. **Competição Analítica**: vencendo através da análise de dados. Rio de Janeiro: Elsevier, 2007.
