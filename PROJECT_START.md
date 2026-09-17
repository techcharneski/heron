# Heron Charneski — Site Acadêmico/Profissional

## Objetivo do projeto

Site pessoal para posicionar Heron Charneski como referência acadêmica e técnica em
direito tributário com interface contábil. Públicos: advogados buscando pareceristas,
empresas buscando consultoria especializada, pesquisadores da área.

**Não é** um site de escritório de advocacia. **É** um site no registro acadêmico
(modelo: Schoueri, Posner-era U. Chicago page, IBDT institucional).

## Tom de conteúdo (regra fixa, não negociável)

- Acadêmico e técnico, sem hermetismo. Frases curtas.
- Sem juridiquês desnecessário.
- **Zero superlativo**: nunca "renomado", "premiado", "referência nacional".
  Prêmios e reconhecimentos aparecem como dado factual (nome do guia + ano),
  nunca como adjetivo.
- Autoridade emerge da obra (produção acadêmica), não da adjetivação.

## Stack técnico

- Next.js 14+ (App Router), TypeScript
- Tailwind CSS
- Conteúdo de publicações em JSON/MDX local (sem banco — atualização manual simples)
- Formulário de contato: API route + Resend (ou similar) para envio de e-mail
- Deploy: Vercel
- Sem Supabase, sem auth, sem CMS externo — site institucional estático (SSG)

## Design system

### Cores

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#FAFAF8` | fundo base de todas as páginas |
| `--navy` | `#00214D` | títulos (Lora), header, rodapé, linha de destaque, links — cor de identidade, extraída do site charneski.com.br |
| `--text` | `#1A1A1A` | corpo de texto |
| `--muted` | `#6B7280` | metadados, datas, categorias, legendas |
| `--border` | `#D9D6CC` | divisórias, bordas de card |

**Não usar**: o laranja (`#F48E53`) do CTA do site do escritório — é acento comercial,
não combina com o registro acadêmico deste site. Se precisar de um acento de ação
(ex: botão de contato), usar um tom dentro da família do próprio azul.

### Tipografia

- Títulos: **Lora** (serifada), peso 500/600
- Corpo: **Inter**, peso 400/500
- Coluna de leitura: largura máxima ~680px, muito espaço em branco lateral
- Sem imagem decorativa. Única foto permitida: retrato profissional do autor.

### Princípios de layout

- Sem slider, sem contador de "anos de experiência" ou "cases atendidos"
- Sem ícones animados
- Grid de coluna única para conteúdo de leitura; grid de 3 colunas apenas para
  cards de publicações/áreas de especialidade
- Header simples: nome + nav em texto, sem fundo colorido
- Rodapé: único bloco com fundo `--navy` cheio, texto claro, contato institucional

## Arquitetura de informação

```
/                    → Home
/sobre               → Sobre (formação completa + atuação profissional/acadêmica + idiomas)
/producao-academica  → Livros + artigos, organizados por tema (não por data)
/temas-de-pesquisa   → 5 eixos de pesquisa (cards curtos, linkam para produção filtrada)
/pareceres           → Área de atuação em texto — sem casos específicos
/contato             → Formulário de qualificação (nome, e-mail, descrição da demanda)
```

### Conteúdo por seção

**Home**
1. Hero — formação condensada em 1 frase + LL.M./graduações em 1 parágrafo
2. Áreas de especialidade — 3 blocos (Direito Tributário, Direito Societário,
   Direito Internacional Privado)
3. Produção recente — 2-3 livros mais recentes + link "ver produção completa"
4. Reconhecimentos — 1 linha factual (Chambers Latin America 2018–2025,
   Best Lawyer in Brazil 2019/2020)
5. Rodapé — endereço, telefone, Lattes, link charneski.com.br

**Sobre**
- Texto curto: qual problema Heron resolve + por que está qualificado
- Formação completa (USP doutorado 2023, mestrado 2017; LL.M. UC Davis 2009;
  PUCRS Direito 2005; UFRGS Ciências Contábeis 2007)
- Atuação profissional e acadêmica (timeline):
  - Charneski Advogados — Sócio Diretor (2009–atual)
  - IGET — Professor Visitante e Coordenador (2023–atual)
  - Charneski Consultoria e Assessoria — Sócio Consultor (2005–2015)
  - Revisor, periódico Direito Tributário Atual (2019–atual)
- Idiomas: Português, Inglês, Francês (compreensão/leitura)

**Produção acadêmica**
- Lista completa de livros/artigos organizados por tema
- Temas iniciais: contabilidade como linguagem do direito tributário, tributação
  de intangíveis, preços de transferência, normas contábeis internacionais,
  reforma tributária
- Link para Lattes completo: http://lattes.cnpq.br/6393905469333944

**Temas de pesquisa**
- 5 cards curtos, cada um linkando para produção acadêmica filtrada por tema

**Pareceres**
- Texto único de área de atuação, sem casos, sem tabela de honorários

**Contato**
- Formulário: nome, e-mail, descrição da demanda
- Dados institucionais: Charneski Advogados, Rua Antônio Carlos Berta, 475,
  conjs. 1807/1808, Jardim Europa, Porto Alegre, RS — (51) 3333-8276

## SEO — termos prioritários

parecerista tributário, contabilidade e direito tributário, tributação e normas
contábeis, IRPJ e CSLL, preços de transferência pareceres, reforma tributária
IBS CBS.

## Pendências antes de codar conteúdo final

- [ ] Lista completa de livros/artigos com tema de cada um (para organizar
      `/producao-academica` por tópico)
- [ ] Foto profissional do Heron
- [ ] Texto final de "Sobre" (reaproveitar rascunho anterior ou reescrever)
- [ ] Confirmar domínio: manter charneski.com.br como referência ou registrar
      domínio próprio (heroncharneski.com.br)
- [ ] Conteúdo anonimizado de pareceres, se/quando disponível

## Estrutura de pastas sugerida

```
/app
  /page.tsx                → Home
  /sobre/page.tsx
  /producao-academica/page.tsx
  /temas-de-pesquisa/page.tsx
  /pareceres/page.tsx
  /contato/page.tsx
  /api/contato/route.ts    → envio de e-mail via Resend
/components
  Header.tsx
  Footer.tsx
  PublicationCard.tsx
  AreaBlock.tsx
/content
  publications.json        → livros e artigos com metadados (título, ano, tema, tipo)
  temas.json                → 5 eixos de pesquisa
/lib
  resend.ts
/public
  /images
    heron-charneski.jpg     → retrato profissional
```
