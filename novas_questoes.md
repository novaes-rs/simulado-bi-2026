# NOVAS QUESTÕES DE BI — ADM 5º SEMESTRE (CONTEXTOS INÉDITOS)

---

## QUESTÃO 6 (Objetiva - Nova): Problemas de Negócio que o Dashboard deve responder
**Tema:** Design de Dashboards e Perguntas de Negócio (BING)  
**Contexto Gerencial:** A rede de clínicas veterinárias e pet shops de alto padrão **PetLuxe** (15 unidades) possui um dashboard de BI que apresenta: (1) Faturamento bruto mensal; (2) Ticket médio por serviço; (3) Quantidade de banhos e tosas realizados. O Diretor de Operações percebeu que, apesar do faturamento bater as metas globais, 4 unidades estão operando no prejuízo devido ao aumento silencioso do custo de insumos (shampoos especiais, medicamentos e rações premium) e à ociosidade da equipe médica em horários de pico. Ele reclamou que o dashboard atual "é bonito, mas não responde por que estamos perdendo margem nas unidades deficitárias".

**Visual (Gráfico ASCII):**
```
  Análise de Margem de Contribuição por Unidade (PetLuxe)
  ▲
  │ [Unid. Centro]   ████████████████████████████ 32% (Margem Saudável)
  │ [Unid. Jardins]   █████████████████████████ 28% (Margem Saudável)
  │ [Unid. Alphaville] ██████████ 11% (Meta: 20%) ⚠️
  │ [Unid. Barra]     █████ 4% (Meta: 20%) ⚠️
  └────────────────────────────────────────────────────────▶ Margem (%)
```

**Enunciado:** Para transformar o dashboard da PetLuxe em uma ferramenta de suporte à decisão que resolva o problema gerencial apontado pelo Diretor, o gestor de BI deve reestruturar as perguntas de negócio (padrão BING) e os indicadores do painel. Qual deve ser a alteração prioritária?
- **A)** Adicionar um gráfico de linha mostrando a variação do preço do dólar e do PIB brasileiro no último ano, pois fatores macroeconômicos são as causas primárias de perda de margem em serviços de luxo.
- **B)** Substituir os indicadores de faturamento bruto por um painel de "Análise de Margem de Contribuição por Categoria de Serviço" cruzado com a "Taxa de Ocupação da Capacidade Instalada" (médicos e esteticistas) por hora, permitindo identificar onde os custos fixos estão asfixiando o lucro. *(Correta)*
- **C)** Criar uma tabela dinâmica no dashboard que liste individualmente todos os 45.000 clientes da rede com seus respectivos e-mails e telefones, para que os gerentes das unidades deficitárias possam ligar oferecendo descontos.
- **D)** Mudar a paleta de cores do dashboard para tons de azul e verde neon, pois cores vibrantes aumentam o engajamento dos gerentes de loja e reduzem a resistência ao uso do sistema analítico.
- **E)** Desativar os filtros por unidade no dashboard, centralizando a visualização apenas nos dados consolidados da rede para evitar conflitos políticos e comparações de desempenho entre os gerentes das clínicas.

---

## QUESTÃO 7 (Objetiva - Nova): Atributos Pré-Atentativos Errados (Uso Incorreto de Cores)
**Tema:** Atributos Pré-Atentativos e Semântica de Cores  
**Contexto Gerencial:** O analista de BI da incorporadora imobiliária **ViverBem** desenvolveu um painel para monitorar o andamento de 12 canteiros de obras. No visual de mapa e na tabela de status, ele utilizou a cor **vermelha** para destacar as obras que estão "Adiantadas" (pois, segundo ele, vermelho chama a atenção para o sucesso da equipe), a cor **verde** para as obras que estão "Atrasadas" (pois verde acalma e evita o pânico da diretoria) e a cor **cinza** para as obras "No Prazo". Durante a apresentação executiva, o Diretor de Incorporação quase demitiu o gerente da obra mais lucrativa da empresa ao ver o painel, gerando um mal-entendido grave que durou duas horas.

**Visual (Tabela Infográfica):**
```
  Tabela de Status da ViverBem (Configuração Original do Analista)
  ┌────────────────────────────────────────────────────────┐
  │  Empreendimento     Status Real      Cor no Painel     │
  ├────────────────────────────────────────────────────────┤
  │  Residencial Sol    Adiantado (Bom)  [ Vermelho ] ⚠️   │
  │  Bella Vista        Atrasado (Ruim)  [ Verde ] ⚠️      │
  │  Torre Corporate    No Prazo (OK)    [ Cinza ]         │
  └────────────────────────────────────────────────────────┘
```

**Enunciado:** Com base nos conceitos de Storytelling com Dados e Psicologia da Gestalt aplicada à visualização, qual foi o erro conceitual cometido pelo analista de BI e como ele deve corrigi-lo para alinhar o dashboard à tomada de decisão gerencial intuitiva?
- **A)** O analista errou ao não utilizar gráficos 3D com texturas realistas de tijolo e concreto, o que teria evitado a confusão de leitura por parte do Diretor de Incorporação.
- **B)** O erro foi puramente de comunicação interpessoal antes da reunião; a semântica das cores é subjetiva e o Diretor deveria ter lido a legenda com mais atenção antes de tomar qualquer decisão.
- **C)** O analista violou a semântica universal das cores (atributos pré-atentativos), onde o vermelho é associado a perigo/alerta (atraso) e o verde a sucesso/segurança (adiantado). Ele deve inverter a lógica de cores, aplicando cinza para o status "No Prazo" (padrão) e reservando o vermelho apenas para "Atrasado" e o verde para "Adiantado". *(Correta)*
- **D)** A solução é eliminar todas as cores do dashboard e utilizar apenas variações de tamanho de fonte para indicar o status das obras, pois cores sempre geram viés cognitivo em tomadores de decisão seniores.
- **E)** O analista deveria ter utilizado um degradê de cores do amarelo ao laranja para todos os status, pois a ausência de contraste de matiz reduz o cansaço visual em reuniões de longa duração.

---

## QUESTÃO 8 (Objetiva - Nova): Criação de KPI e Disposição dos Elementos Visuais (Storytelling)
**Tema:** Criação de KPIs e Grid de Disposição Visual (Storytelling com Dados)  
**Contexto Gerencial:** A startup de tecnologia em educação **EduTech** quer monitorar a eficiência de seu time de suporte ao aluno. O Diretor de Customer Success solicitou a criação de um KPI de "Tempo Médio de Resolução (TMR)" de chamados. O analista de BI desenhou a tela colocando o TMR em um gráfico de dispersão complexo no canto inferior direito do painel, enquanto o centro da tela foi ocupado por uma lista detalhada com o nome de todos os atendentes e o número do protocolo de cada chamado aberto no mês.

**Visual (Grid de Disposição Visual - Storytelling):**
```
  Disposição Visual Incorreta (Foco no Detalhe) vs. Correta (Foco na Decisão)
  
  [ INCORRETA - Operacional ]          [ CORRETA - Estratégica (F-Layout) ]
  ┌─────────────────────────┐          ┌─────────────────────────┐
  │ Detalhes dos Chamados   │          │  KPI TMR (Topo Esquerdo)│
  │ (Tabela enorme no       │          │  R$ Meta vs Real        │
  │  centro da tela)        │          ├─────────────────────────┤
  ├────────────┬────────────┤          │ Gráfico de Tendência    │
  │ Atendentes │  KPI TMR   │          │ (Análise Temporal)      │
  └────────────┴────────────┘          └─────────────────────────┘
```

**Enunciado:** Aplicando os conceitos de design estratégico de dashboards (F-Layout, hierarquia visual e storytelling), como o gestor de BI deve estruturar a criação do KPI e a disposição dos elementos visuais para garantir que o Diretor identifique gargalos operacionais em menos de 5 segundos?
- **A)** Colocar a tabela detalhada de chamados no topo esquerdo da tela com fonte tamanho 24, pois o olho humano sempre inicia a leitura pelo detalhe operacional para depois consolidar a visão geral.
- **B)** Definir o KPI de TMR como: `TMR = SUM(Tempo_Resolucao) / COUNT(Chamados_Resolvidos)`. Posicionar este indicador em um cartão de destaque no topo esquerdo do dashboard (ponto de maior atenção no F-Layout), acompanhado de uma linha de tendência temporal de TMR e relegando a tabela detalhada para uma aba secundária de detalhamento (drill-down). *(Correta)*
- **C)** Exibir o TMR como uma média simples das médias diárias de cada atendente em um gráfico de pizza de 30 fatias posicionado no centro do dashboard, utilizando uma cor diferente para cada atendente.
- **D)** Posicionar o KPI de TMR no canto inferior esquerdo e ocultar as metas de desempenho para evitar que os atendentes se sintam pressionados pelas métricas de tempo de resposta.
- **E)** Criar um dashboard dinâmico onde os elementos visuais mudam de posição aleatoriamente a cada 10 segundos, forçando o tomador de decisão a explorar ativamente todas as áreas da tela para encontrar o indicador de TMR.
