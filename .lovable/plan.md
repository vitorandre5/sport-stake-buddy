# 🎯 Planilhador de Apostas Esportivas

Um app completo de gestão e análise de apostas esportivas, inspirado no Bet Analytix, com tema escuro profissional e suporte multi-usuário.

---

## 1. Autenticação e Perfil de Usuário

- Cadastro e login por email/senha
- Perfil do usuário com nome, avatar e configurações
- Recuperação de senha
- Backend com Mysql para autenticação e banco de dados (apenas deixe claro como eu vou implantar, irei usar wordpress com mysql)

## 2. Gerenciamento de Bancas

- Criar múltiplas bancas (ex: "Banca Principal", "Banca Futebol")
- Definir saldo inicial de cada banca
- Registrar depósitos e saques
- Visualizar saldo atual e evolução do saldo ao longo do tempo

## 3. Registro de Apostas

- Cadastrar apostas **simples** e **combinadas/múltiplas**
- Campos: esporte, competição, evento, tipo de aposta, odd, stake (valor apostado), resultado (ganhou/perdeu/pendente/cashout)
- Campos opcionais: casa de apostas, tipster, categoria, aposta ao vivo, freebet
- Associar aposta a uma banca específica
- Editar e excluir apostas

## 4. Dashboard com Estatísticas

- **Resumo geral**: lucro/prejuízo total, ROI, taxa de acerto, total de apostas
- **Gráfico de evolução da banca** ao longo do tempo (linha)
- **Distribuição por esporte/competição** (gráfico de pizza/barras)
- **Filtros**: por período, esporte, casa de apostas, tipster, tipo de aposta
- **Indicadores-chave**: streak de vitórias/derrotas, odd média, stake médio

## 5. Histórico e Filtros

- Lista completa de todas as apostas com busca e filtros avançados
- Ordenação por data, lucro, odd, stake
- Exportar dados em CSV

## 6. Design e Experiência

- **Tema escuro** com acentos em verde neon (inspirado no Bet Analytix)
- Layout responsivo (desktop e mobile)
- Sidebar de navegação com ícones
- Navegação fluida entre bancas, apostas e estatísticas