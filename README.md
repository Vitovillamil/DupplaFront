# Duppla Frontend – Gestión de Documentos

Frontend del sistema de gestión y procesamiento de documentos.
Enfocada en experiencia de usuario, escalabilidad y mantenibilidad.

---

## Decisiones de Arquitectura

### ¿Por qué Angular?
- Framework robusto y opinionado, ideal para aplicaciones empresariales.
- Excelente soporte para formularios reactivos, tipado fuerte** y arquitectura modular.
- Integración natural con RxJS, útil para polling, estados asíncronos y streams.

### Arquitectura elegida
- **Standalone Components**
  Reduce complejidad, elimina módulos innecesarios y mejora lazy loading.
- **Reactive Forms**
  Control total sobre validaciones, filtros y tipado.
- **Service Layer**
  Toda la comunicación HTTP se centraliza en servicios (`DocumentService`, `JobService`).
- **OnPush Change Detection (parcial)**
  Se apoya en `ChangeDetectorRef` para optimizar renders en procesos asíncronos largos.

### Librerías clave
- **ng-bootstrap**
  Elegido por integración nativa con Angular (sin jQuery).
- **Bootstrap 5**
  UI consistente, simple y profesional sin sobreingeniería.
---

## Patrones Utilizados
- **Observer Pattern** (RxJS)
- **Polling controlado** para seguimiento de jobs
- **Smart filtering** (envío solo de filtros válidos al backend)
---

## Performance & UX
- Paginación server-side
- Filtros enviados solo si tienen valor real
- Polling cancelable (`takeUntil`)
- Estados visuales claros (loading, processing, completed)
- Tooltips descriptivos para acciones críticas
---

## 🔐 Seguridad (Frontend)
- No se exponen secretos ni lógica sensible
- Validación básica de inputs antes de enviar al backend
---

## 🛠️ Setup

### Requisitos
- Node.js 18+
- Angular CLI
---

### Ejecución
```bash
npm install
ng serve -o
```

### Visualizador
```bash
http://localhost:4200
```