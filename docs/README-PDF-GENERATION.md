# Come generare Relazione.pdf

Il file Relazione.pdf deve essere generato manualmente dal file Relazione.md.

## Opzioni per la generazione:

### Opzione 1: Usando Pandoc (Raccomandato)
```bash
pandoc Relazione.md -o Relazione.pdf --pdf-engine=xelatex
```

### Opzione 2: Usando un editor Markdown
- Aprire Relazione.md in un editor che supporta l'esportazione PDF (es. Visual Studio Code con estensioni Markdown)
- Esportare come PDF

### Opzione 3: Online
- Caricare Relazione.md su servizi come:
  - https://www.markdowntopdf.com/
  - https://dillinger.io/
- Scaricare il PDF generato

### Opzione 4: Google Docs/Microsoft Word
- Copiare il contenuto di Relazione.md
- Incollare in Google Docs o Word
- Salvare/Esportare come PDF

Una volta generato il PDF, salvarlo come `Relazione.pdf` in questa cartella docs/.
