# AI Agent Workflow

Bu proje, Claude Sonnet 4 AI kullanarak otomatik kod review yapar.

## Nasıl Çalışır?

Her PR açıldığında veya güncellendiğinde aşağıdaki agent'lar paralel olarak çalışır:

| Agent | Görev |
|-------|-------|
| **Code Review** | React best practices, PropTypes, hook kullanımı kontrolü |
| **Testing** | Test coverage analizi, eksik testlerin belirlenmesi |
| **Security** | npm audit, güvenlik açıkları taraması |

## Kurulum

### 1. GitHub Secret Ekle

Repository Settings → Secrets → Actions → New repository secret:

- **Name**: `ANTHROPIC_API_KEY`
- **Value**: Anthropic API anahtarınız

### 2. Workflow'u Aktifleştir

Workflow PR açıldığında otomatik çalışır. Manuel tetiklemek için:

1. Actions sekmesine git
2. "AI Agent Orchestrator" workflow'unu seç
3. "Run workflow" butonuna tıkla

### 3. Comment ile Tetikleme

PR'a yorum olarak `@ai-review` yazarak agent'ları tetikleyebilirsiniz.

## Agent Prompt'ları

Her agent için prompt dosyaları bu klasördedir:

- `code-review-agent.md` - Kod kalitesi kontrolü
- `testing-agent.md` - Test coverage analizi  
- `security-agent.md` - Güvenlik denetimi

## Çıktı

Agent'lar işini bitirdikten sonra PR'a otomatik bir yorum eklenir:

```
## 🤖 AI Agent Review Summary

### Code Review Agent
[Review sonuçları]

### Testing Agent
[Coverage analizi]

### Security Agent
[Güvenlik raporu]
```

## Maliyet

Her PR için yaklaşık API kullanımı:
- ~3 API call (her agent için 1)
- ~6000 token input + ~2000 token output
- Tahmini maliyet: ~$0.05/PR
