const DAY_ORDER = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

const SUBJECT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "Mathématiques":     { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" },
  "Français":          { bg: "#ffe4e6", border: "#fca5a5", text: "#9f1239" },
  "Histoire-Géographie":{ bg: "#fef3c7", border: "#fcd34d", text: "#92400e" },
  "Anglais":           { bg: "#d1fae5", border: "#6ee7b7", text: "#065f46" },
  "Espagnol":          { bg: "#fce7f3", border: "#f9a8d4", text: "#9d174d" },
  "Allemand":          { bg: "#ede9fe", border: "#c4b5fd", text: "#4c1d95" },
  "SVT":               { bg: "#dcfce7", border: "#86efac", text: "#14532d" },
  "Physique-Chimie":   { bg: "#f3e8ff", border: "#d8b4fe", text: "#581c87" },
  "Technologie":       { bg: "#e0f2fe", border: "#7dd3fc", text: "#0c4a6e" },
  "Arts Plastiques":   { bg: "#fdf2f8", border: "#f0abfc", text: "#701a75" },
  "Musique":           { bg: "#fff7ed", border: "#fdba74", text: "#7c2d12" },
  "EPS":               { bg: "#ffedd5", border: "#fb923c", text: "#9a3412" },
  "Latin":             { bg: "#f0fdf4", border: "#86efac", text: "#166534" },
  "Grec":              { bg: "#fefce8", border: "#fde047", text: "#713f12" },
}

function subjectStyle(subject: string): string {
  const c = SUBJECT_COLORS[subject]
  if (!c) return `background:#f1f5f9;border-left:3px solid #94a3b8;color:#334155;`
  return `background:${c.bg};border-left:3px solid ${c.border};color:${c.text};`
}

interface CalendarSlot {
  subject: string
  start: string
  end: string
  room?: string
  teacher?: string
  class?: string
}

interface CalendarDay {
  [day: string]: CalendarSlot[]
}

interface ExportOptions {
  title: string
  subtitle?: string
  schoolName?: string
  calendar: CalendarDay
  showTeacher?: boolean
  showClass?: boolean
}

function renderSlot(slot: CalendarSlot, showTeacher: boolean, showClass: boolean): string {
  const time = `<span class="time">${slot.start} – ${slot.end}</span>`
  const roomBadge = slot.room ? `<span class="badge room">${slot.room}</span>` : ""
  const classBadge = showClass && slot.class ? `<span class="badge cls">${slot.class}</span>` : ""
  const teacherBadge = showTeacher && slot.teacher ? `<span class="badge teacher">${slot.teacher}</span>` : ""

  if (!slot.subject) {
    return `
      <div class="slot empty">
        ${time}
        <span class="free">Libre</span>
      </div>`
  }

  return `
    <div class="slot filled" style="${subjectStyle(slot.subject)}">
      <div class="slot-header">${time}${roomBadge}${classBadge}</div>
      <div class="subject">${slot.subject}</div>
      ${teacherBadge}
    </div>`
}

export function exportCalendarToPdf(options: ExportOptions): void {
  const { title, subtitle, schoolName, calendar, showTeacher = true, showClass = false } = options

  const sortedDays = Object.keys(calendar).sort(
    (a, b) => (DAY_ORDER.indexOf(a) ?? 99) - (DAY_ORDER.indexOf(b) ?? 99),
  )

  const daysHtml = sortedDays
    .map((day) => {
      const slotsHtml = (calendar[day] as CalendarSlot[])
        .map((slot) => renderSlot(slot, showTeacher, showClass))
        .join("")
      return `
        <div class="day-col">
          <div class="day-header">${day}</div>
          <div class="day-slots">${slotsHtml}</div>
        </div>`
    })
    .join("")

  const now = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>EDT – ${title}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 11px;
      color: #1e293b;
      background: white;
      padding: 20px;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 3px solid #6366f1;
      padding-bottom: 10px;
      margin-bottom: 16px;
    }
    .header-left h1 {
      font-size: 20px;
      font-weight: 700;
      color: #4338ca;
    }
    .header-left p {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .header-right {
      text-align: right;
      font-size: 10px;
      color: #94a3b8;
    }
    .header-right strong {
      display: block;
      font-size: 12px;
      color: #334155;
    }

    /* Grid */
    .grid {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }

    .day-col {
      flex: 1;
      min-width: 0;
    }

    .day-header {
      background: linear-gradient(135deg, #6366f1, #3b82f6);
      color: white;
      text-align: center;
      font-weight: 600;
      font-size: 11px;
      padding: 5px 4px;
      border-radius: 4px 4px 0 0;
    }

    .day-slots {
      border: 1px solid #e2e8f0;
      border-top: none;
      border-radius: 0 0 4px 4px;
      overflow: hidden;
    }

    /* Slots */
    .slot {
      padding: 5px 6px;
      border-bottom: 1px solid #f1f5f9;
    }
    .slot:last-child { border-bottom: none; }

    .slot.empty {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f8fafc;
    }
    .slot.filled {
      padding: 4px 6px 4px 8px;
      border-radius: 0;
    }

    .slot-header {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 2px;
      flex-wrap: wrap;
    }

    .time {
      font-size: 9px;
      font-weight: 600;
      color: #64748b;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .slot.empty .time { color: #94a3b8; }

    .free {
      font-size: 9px;
      color: #cbd5e1;
      font-style: italic;
    }

    .subject {
      font-weight: 700;
      font-size: 10.5px;
      line-height: 1.2;
    }

    .badge {
      font-size: 8px;
      padding: 1px 4px;
      border-radius: 3px;
      white-space: nowrap;
    }
    .badge.room    { background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; }
    .badge.cls     { background: #ede9fe; border: 1px solid #c4b5fd; color: #5b21b6; }
    .badge.teacher { display: block; margin-top: 2px; background: transparent; color: inherit; opacity: 0.75; font-size: 9px; padding: 0; }

    /* Footer */
    .footer {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-size: 9px;
      color: #94a3b8;
      text-align: center;
    }

    @media print {
      body { padding: 10px; }
      @page { margin: 10mm; size: A4 landscape; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>${title}</h1>
      ${subtitle ? `<p>${subtitle}</p>` : ""}
    </div>
    <div class="header-right">
      ${schoolName ? `<strong>${schoolName}</strong>` : ""}
      Généré le ${now}
    </div>
  </div>

  <div class="grid">
    ${daysHtml}
  </div>

  <div class="footer">
    Emploi du temps généré automatiquement — ${title}
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`

  const win = window.open("", "_blank", "width=1200,height=800")
  if (!win) {
    alert("Veuillez autoriser les popups pour exporter en PDF.")
    return
  }
  win.document.write(html)
  win.document.close()
}
