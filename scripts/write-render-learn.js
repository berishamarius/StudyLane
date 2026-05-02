const fs = require('fs');
let c = fs.readFileSync('app.js', 'utf8');

// Find the exact range: from "const renderLearn = async () => {" to its closing "};"
const startMarker = 'const renderLearn = async () => {';
const endMarker = '\nconst markLearnTopic =';

const startIdx = c.indexOf(startMarker);
const endIdx = c.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find renderLearn boundaries!', startIdx, endIdx);
  process.exit(1);
}

console.log('Found renderLearn from char', startIdx, 'to', endIdx);
console.log('Lines approx:', c.substring(0, startIdx).split('\n').length, 'to', c.substring(0, endIdx).split('\n').length);

const newRenderLearn = `const renderLearn = async () => {
  const container = document.getElementById('learnContent');
  if (!container) return;

  const mode = state.ui.studyMode;
  const activeLang = getActiveLanguage();
  const model = window.LEARN_SOURCES || { core: {}, school: [], university: [] };
  const subjects = model[mode] || [];

  if (!subjects.length) {
    container.innerHTML = \`<div class="dash-list-placeholder">\${tr('learnEmpty','No content available.')}</div>\`;
    return;
  }

  const SUBJECT_META = {
    mathematics:          { icon: '📐', color: '#e8a020' },
    physics:              { icon: '⚛️',  color: '#4a90d9' },
    chemistry:            { icon: '⚗️',  color: '#9b59b6' },
    biology:              { icon: '🌿', color: '#27ae60' },
    'computer-science':   { icon: '💻', color: '#2980b9' },
    'language-arts':      { icon: '📝', color: '#e67e22' },
    'english-language':   { icon: '🇬🇧', color: '#c0392b' },
    'german-language':    { icon: '🇩🇪', color: '#f39c12' },
    'french-language':    { icon: '🇫🇷', color: '#2980b9' },
    'spanish-language':   { icon: '🇪🇸', color: '#c0392b' },
    history:              { icon: '📜', color: '#8e6b3e' },
    geography:            { icon: '🌍', color: '#16a085' },
    civics:               { icon: '🏛️',  color: '#2c3e50' },
    economics:            { icon: '📊', color: '#2c3e50' },
    'earth-science':      { icon: '🌎', color: '#16a085' },
    arts:                 { icon: '🎨', color: '#c0392b' },
    health:               { icon: '💚', color: '#27ae60' },
    'religion-and-ethics':{ icon: '⚖️',  color: '#7f8c8d' },
    music:                { icon: '🎵', color: '#8e44ad' },
    'physical-education': { icon: '🏃', color: '#2ecc71' },
    'technology-and-design': { icon: '🔧', color: '#34495e' },
    'media-literacy':     { icon: '📱', color: '#3498db' },
  };
  const getMeta = (id) => SUBJECT_META[id] || { icon: '📚', color: 'var(--accent2)' };

  // Ensure a subject is selected
  if (!state.ui.learnSelectedSubject || !subjects.find(s => s.id === state.ui.learnSelectedSubject)) {
    state.ui.learnSelectedSubject = subjects[0].id;
  }
  const selId = state.ui.learnSelectedSubject;
  const subject = subjects.find(s => s.id === selId) || subjects[0];
  const meta = getMeta(subject.id);

  // Translate subject title for the panel header
  const subjectTitle = await localizeLearnText(subject.title, activeLang);

  // Subject pills — show native English titles for speed (language switching retranslates on next render)
  const pillsHtml = subjects.map(s => {
    const m = getMeta(s.id);
    const active = s.id === selId;
    return \`<button class="learn-pill\${active ? ' active' : ''}"
      onclick="selectLearnSubject('\${s.id}')"
      style="\${active ? \`background:\${m.color};color:#fff;border-color:\${m.color}\` : \`border-color:\${m.color}40\`}">
      <span style="font-size:16px;line-height:1">\${m.icon}</span>
      <span>\${s.title}</span>
    </button>\`;
  }).join('');

  // Translate all folder content in parallel
  const localizedFolders = await Promise.all((subject.folders || []).map(async (folder) => {
    const [name, description, miniTask] = await Promise.all([
      localizeLearnText(folder.name, activeLang),
      localizeLearnText(folder.description || '', activeLang),
      localizeLearnText(folder.miniTask || '', activeLang)
    ]);
    const keyPoints = folder.keyPoints
      ? await Promise.all(folder.keyPoints.map(kp => localizeLearnText(kp, activeLang)))
      : [];
    const topics = folder.topics
      ? await Promise.all(folder.topics.map(t => localizeLearnText(t, activeLang)))
      : [];
    const sourceNames = (model.core[folder.sourceGroup] || []).join(', ');
    return { ...folder, name, description, miniTask, keyPoints, topics, sourceNames };
  }));

  // Build folder cards
  const foldersHtml = localizedFolders.map((folder, fi) => {
    const kpHtml = folder.keyPoints.length
      ? \`<ul class="learn-key-points">\${folder.keyPoints.map(kp => \`<li>\${kp}</li>\`).join('')}</ul>\`
      : '';
    const topicsHtml = folder.topics.length
      ? \`<div class="learn-topics-row">\${folder.topics.map(t => \`<span class="learn-topic-chip">\${t}</span>\`).join('')}</div>\`
      : '';
    const miniTaskHtml = folder.miniTask
      ? \`<div class="learn-mini-task"><strong>\${tr('learnTopicTask','Practice task')}:</strong> \${folder.miniTask}</div>\`
      : '';
    const sourcesHtml = folder.sourceNames
      ? \`<p class="learn-sources-line">\${tr('learnTopicSources','Sources')}: \${folder.sourceNames}</p>\`
      : '';
    return \`
      <details class="learn-folder-card" \${fi === 0 ? 'open' : ''}>
        <summary class="learn-folder-header">
          <span class="learn-folder-num">\${fi + 1}</span>
          <span>\${folder.name}</span>
        </summary>
        <div class="learn-folder-body">
          \${folder.description ? \`<p class="learn-folder-desc">\${folder.description}</p>\` : ''}
          \${kpHtml}
          \${topicsHtml}
          \${miniTaskHtml}
          \${sourcesHtml}
        </div>
      </details>\`;
  }).join('');

  container.innerHTML = \`
    <div class="learn-wrap">
      <div class="learn-mode-bar">
        <span>\${tr('studyMode','Mode')}: <strong>\${mode === 'school' ? tr('studyModeSchool','School') : tr('studyModeUniversity','University')}</strong></span>
      </div>
      <div class="learn-subjects-pills">\${pillsHtml}</div>
      <div class="learn-subject-panel">
        <div class="learn-subject-panel-header" style="border-left:4px solid \${meta.color}">
          <span style="font-size:28px;line-height:1">\${meta.icon}</span>
          <span class="learn-subject-panel-title">\${subjectTitle}</span>
        </div>
        <div class="learn-folder-list">\${foldersHtml}</div>
      </div>
    </div>\`;
};

window.selectLearnSubject = (id) => {
  state.ui.learnSelectedSubject = id;
  renderLearn();
};

`;

c = c.substring(0, startIdx) + newRenderLearn + c.substring(endIdx + 1); // +1 to skip the leading newline

fs.writeFileSync('app.js', c, 'utf8');

const lines = c.split('\n');
const newStart = lines.findIndex(l => l.includes('const renderLearn = async'));
const newEnd = lines.findIndex((l, i) => i > newStart && l.includes('const markLearnTopic'));
console.log('New renderLearn: lines', newStart + 1, 'to', newEnd + 1);
console.log('Done!');
