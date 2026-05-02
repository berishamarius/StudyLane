registerPageModule('calendar', function calendarPage() {
  const _t = (key, fb) => { try { const v = t(key); return (v && v !== key) ? v : fb; } catch(_){return fb;} };
  return `
    <section class="page" id="page-calendar">
      <div class="page-header">
        <h1 data-i18n="pageCalendar">${_t('pageCalendar','Calendar')}</h1>
      </div>
      <div id="calendarContainer"></div>
    </section>
  `;
});
