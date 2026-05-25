// ═══════════════════════════════════════════════════════════════════════
// GOOGLE APPS SCRIPT — Registro de Alunos do Simulado de BI 2026
// Instruções de deploy:
// 1. Acesse script.google.com → Novo projeto
// 2. Cole este código
// 3. Clique em Implantar → Nova implantação → Tipo: App da Web
// 4. Executar como: Eu mesmo | Quem pode acessar: Qualquer pessoa
// 5. Copie a URL gerada e substitua APPS_SCRIPT_URL no index.html
// ═══════════════════════════════════════════════════════════════════════

const SHEET_NAME = 'Simulado_BI_2026';
const PLANILHA_ID = ''; // Deixe vazio para criar automaticamente

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Criar aba se não existir
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Cabeçalhos
      sheet.getRange(1, 1, 1, 12).setValues([[
        'Nome do Aluno', 'E-mail', 'Data/Hora', 'Acertos (Obj)',
        'Erros (Obj)', 'Total Obj', '% Aproveitamento', 'Nota Estimada',
        'Gargalos Identificados', 'Temas com Acerto', 'Tempo (min)', 'Tentativa Nº'
      ]]);
      sheet.getRange(1, 1, 1, 12).setFontWeight('bold')
           .setBackground('#0d233a').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    // Contar tentativas anteriores do mesmo aluno
    const dados_existentes = sheet.getDataRange().getValues();
    const tentativas = dados_existentes.filter(row => row[1] === dados.email).length;
    
    // Inserir nova linha
    sheet.appendRow([
      dados.nome,
      dados.email,
      new Date(dados.dataHora),
      dados.acertos,
      dados.erros,
      dados.totalObj,
      dados.percentual + '%',
      dados.nota,
      dados.gargalos || 'Nenhum',
      dados.acertosNomes || 'Todos',
      dados.tempo || '-',
      tentativas + 1
    ]);
    
    // Formatar coluna de data
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 3).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    
    // Colorir linha conforme desempenho
    const perc = parseFloat(dados.percentual);
    let cor = '#ffffff';
    if (perc >= 80) cor = '#e2f0d9';
    else if (perc >= 60) cor = '#fdf5e6';
    else cor = '#fceade';
    sheet.getRange(lastRow, 1, 1, 12).setBackground(cor);
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', mensagem: 'Registro salvo com sucesso.' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'erro', mensagem: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', mensagem: 'Simulado BI 2026 - Endpoint ativo.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
