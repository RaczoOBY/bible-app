# 🎨 Cores Customizadas - Tailwind CSS v4

## ⚠️ Problema Resolvido

O erro `Cannot apply unknown utility class` foi corrigido ajustando o `globals.css` para usar a sintaxe correta do Tailwind CSS v4.

## 📋 Como Usar as Cores

### Opção 1: Classes Tailwind (se configuradas)

Se o Tailwind reconhecer as cores do `@theme`, você pode usar:

```tsx
<div className="text-neutral-dark-gray bg-primary-teal">
```

### Opção 2: Variáveis CSS (Sempre Funciona)

Se as classes não funcionarem, use variáveis CSS diretamente:

```tsx
<div style={{ color: 'var(--neutral-dark-gray)', backgroundColor: 'var(--primary-teal)' }}>
```

### Opção 3: Classes Arbitrárias do Tailwind

```tsx
<div className="text-[var(--neutral-dark-gray)] bg-[var(--primary-teal)]">
```

## 🎨 Cores Disponíveis

### Primárias
- `--primary-mint` / `--color-primary-mint`
- `--primary-sage` / `--color-primary-sage`
- `--primary-teal` / `--color-primary-teal`

### Secundárias
- `--secondary-lavender` / `--color-secondary-lavender`
- `--secondary-lilac` / `--color-secondary-lilac`
- `--secondary-purple` / `--color-secondary-purple`

### Destaque
- `--accent-peach` / `--color-accent-peach`
- `--accent-coral` / `--color-accent-coral`
- `--accent-salmon` / `--color-accent-salmon`

### Neutras
- `--neutral-white`
- `--neutral-off-white`
- `--neutral-light-gray`
- `--neutral-medium-gray`
- `--neutral-dark-gray`
- `--neutral-black`

### Semânticas
- `--success`
- `--warning`
- `--info`
- `--highlight`

## 🔧 Se Classes Não Funcionarem

Se você ainda receber erros sobre classes desconhecidas, substitua nos componentes:

**Antes:**
```tsx
className="text-neutral-dark-gray"
```

**Depois:**
```tsx
className="text-[var(--neutral-dark-gray)]"
```

Ou use estilo inline:
```tsx
style={{ color: 'var(--neutral-dark-gray)' }}
```

## ✅ Status

- ✅ `globals.css` corrigido
- ✅ Cores definidas em `@theme`
- ✅ Variáveis CSS disponíveis
- ⚠️ Pode precisar ajustar componentes se classes não funcionarem
