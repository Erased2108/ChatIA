const STORAGE_KEY = 'chat_conversations';
const CURRENT_KEY = 'chat_current_id';
const THEME_KEY = 'chat_theme';
const LANG_KEY = 'chat_lang';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_TEXTAREA_HEIGHT = 160;

// ---- Configuración de DeepSeek ----
// Opción A: pega tu clave aquí (créala en https://platform.deepseek.com/api_keys).
// Opción B: deja '' y el chatbot te la pedirá una sola vez y la guarda en el navegador.
const DEEPSEEK_API_KEY = 'sk-c001d4c086284329a53fe9d2493749f0';

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat'; // 'deepseek-reasoner' si quieres el modelo que razona
const API_KEY_STORAGE = 'chat_deepseek_key';
const STREAM_RESPONSE = true;      // false = respuesta completa de golpe
const MAX_HISTORY_MESSAGES = 40;  // cuántos mensajes de contexto se envían

const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const appName = document.getElementById('appName');
const searchInput = document.getElementById('searchInput');
const selectionBar = document.getElementById('selectionBar');
const conversationList = document.getElementById('conversationList');
const chatMessages = document.getElementById('chatMessages');
const chatTitle = document.getElementById('chatTitle');
const chatStatus = document.getElementById('chatStatus');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const sendBtn = chatForm.querySelector('button[type="submit"]');
const newChatBtn = document.getElementById('newChatBtn');
const trashBtn = document.getElementById('trashBtn');
const trashLabel = document.getElementById('trashLabel');
const trashCount = document.getElementById('trashCount');
const trashView = document.getElementById('trashView');
const disclaimer = document.getElementById('disclaimer');

const settingsBtn = document.getElementById('settingsBtn');
const settingsLabel = document.getElementById('settingsLabel');
const settingsBackdrop = document.getElementById('settingsBackdrop');
const settingsClose = document.getElementById('settingsClose');
const settingsTitleText = document.getElementById('settingsTitleText');
const themeLabelText = document.getElementById('themeLabelText');
const languageLabelText = document.getElementById('languageLabelText');
const shortcutsTitleText = document.getElementById('shortcutsTitleText');
const shortcutsList = document.getElementById('shortcutsList');
const themeLightBtn = document.getElementById('themeLightBtn');
const themeDarkBtn = document.getElementById('themeDarkBtn');
const languageSelect = document.getElementById('languageSelect');

// ---- Detección de sistema operativo (para mostrar Cmd o Ctrl) ----

function isMac() {
  const platform =
    (navigator.userAgentData && navigator.userAgentData.platform) ||
    navigator.platform ||
    navigator.userAgent ||
    '';
  return /mac/i.test(platform);
}

const MOD_KEY = isMac() ? '⌘' : 'Ctrl';
const SHIFT_LABEL = isMac() ? '⇧' : 'Shift';

// ---- Traducciones ----

const translations = {
  es: {
    appName: 'Mi asistente',
    newChat: '+ Nuevo chat',
    trash: '🗑 Papelera',
    trashTitle: 'Papelera',
    settings: '⚙ Configuración',
    settingsTitle: 'Configuración',
    online: 'En línea',
    disclaimer: 'Este asistente usa IA y puede cometer errores.',
    inputPlaceholder: 'Escribe un mensaje',
    send: 'Enviar',
    emptyPrompt: '¿Por dónde empezamos?',
    suggestion1: '¿Qué puedes hacer?',
    suggestion2: 'Cuéntame sobre este proyecto',
    suggestion3: '¿Cómo te uso?',
    newChatTitle: 'Nuevo chat',
    themeLabel: 'Tema',
    languageLabel: 'Idioma',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    trashEmpty: 'La papelera está vacía.',
    deletedOn: 'Eliminado el ',
    restore: 'Restaurar',
    deleteForever: 'Eliminar para siempre',
    searchPlaceholder: 'Buscar chats',
    noResults: 'No se encontraron chats.',
    shortcutsTitle: 'Atajos de teclado',
    shortcutSearch: 'Buscar chats',
    shortcutNewChat: 'Nuevo chat',
    shortcutHelp: 'Mostrar esta ventana',
    shortcutClose: 'Cerrar menús y ventanas',
    shortcutSend: 'Enviar mensaje',
    shortcutNewline: 'Nueva línea sin enviar',
    selectToggle: '🗑 Eliminar chats',
    selectChats: 'Seleccionar chat',
    selectAll: 'Seleccionar todos',
    deleteSelected: 'Eliminar',
    cancel: 'Cancelar',
    confirmDeleteSelected: '¿Continuar?',
    thinking: 'Pensando…',
    apiKeyPrompt: 'Pega tu API key de DeepSeek (https://platform.deepseek.com/api_keys):',
    errorNoKey: 'Necesito una API key de DeepSeek para poder responder.',
    errorEmpty: 'DeepSeek devolvió una respuesta vacía.',
    error401: 'La API key de DeepSeek no es válida.',
    error402: 'No hay saldo suficiente en tu cuenta de DeepSeek.',
    error429: 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.',
    errorNetwork: 'No se pudo conectar con DeepSeek. Revisa tu conexión a internet.',
    errorGeneric: 'Ocurrió un error al consultar a DeepSeek.',
  },
  en: {
    appName: 'My assistant',
    newChat: '+ New chat',
    trash: '🗑 Trash',
    trashTitle: 'Trash',
    settings: '⚙ Settings',
    settingsTitle: 'Settings',
    online: 'Online',
    disclaimer: 'This assistant uses AI and can make mistakes.',
    inputPlaceholder: 'Type a message',
    send: 'Send',
    emptyPrompt: 'Where should we start?',
    suggestion1: 'What can you do?',
    suggestion2: 'Tell me about this project',
    suggestion3: 'How do I use you?',
    newChatTitle: 'New chat',
    themeLabel: 'Theme',
    languageLabel: 'Language',
    themeLight: 'Light',
    themeDark: 'Dark',
    trashEmpty: 'Trash is empty.',
    deletedOn: 'Deleted on ',
    restore: 'Restore',
    deleteForever: 'Delete forever',
    searchPlaceholder: 'Search chats',
    noResults: 'No chats found.',
    shortcutsTitle: 'Keyboard shortcuts',
    shortcutSearch: 'Search chats',
    shortcutNewChat: 'New chat',
    shortcutHelp: 'Show this panel',
    shortcutClose: 'Close menus and dialogs',
    shortcutSend: 'Send message',
    shortcutNewline: 'New line without sending',
    selectToggle: '🗑 Delete chats',
    selectChats: 'Select chat',
    selectAll: 'Select all',
    deleteSelected: 'Delete',
    cancel: 'Cancel',
    confirmDeleteSelected: 'Continue?',
    thinking: 'Thinking…',
    apiKeyPrompt: 'Paste your DeepSeek API key (https://platform.deepseek.com/api_keys):',
    errorNoKey: 'I need a DeepSeek API key to be able to answer.',
    errorEmpty: 'DeepSeek returned an empty response.',
    error401: 'The DeepSeek API key is not valid.',
    error402: 'Your DeepSeek account does not have enough balance.',
    error429: 'Too many requests. Wait a moment and try again.',
    errorNetwork: 'Could not connect to DeepSeek. Check your internet connection.',
    errorGeneric: 'Something went wrong while asking DeepSeek.',
  },
};

let currentLang = localStorage.getItem(LANG_KEY) || 'es';

function t(key) {
  const dict = translations[currentLang] || translations.es;
  return dict[key] || translations.es[key] || key;
}

// ---- Atajos de teclado ----

function getShortcuts() {
  return [
    { keys: [MOD_KEY, SHIFT_LABEL, 'K'], action: t('shortcutSearch') },
    { keys: [MOD_KEY, SHIFT_LABEL, 'L'], action: t('shortcutNewChat') },
    { keys: [MOD_KEY, '/'], action: t('shortcutHelp') },
    { keys: ['Esc'], action: t('shortcutClose') },
    { keys: ['Enter'], action: t('shortcutSend') },
    { keys: [SHIFT_LABEL, 'Enter'], action: t('shortcutNewline') },
  ];
}

function renderShortcuts() {
  shortcutsList.innerHTML = '';
  getShortcuts().forEach((s) => {
    const li = document.createElement('li');
    li.className = 'shortcut-row';

    const keysWrap = document.createElement('span');
    keysWrap.className = 'shortcut-keys';
    s.keys.forEach((k) => {
      const kbd = document.createElement('kbd');
      kbd.textContent = k;
      keysWrap.appendChild(kbd);
    });

    const label = document.createElement('span');
    label.className = 'shortcut-label';
    label.textContent = s.action;

    li.appendChild(keysWrap);
    li.appendChild(label);
    shortcutsList.appendChild(li);
  });
}

document.addEventListener('keydown', (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if (!mod) return;
  const key = e.key.toLowerCase();

  if (key === 'k' && e.shiftKey) {
    e.preventDefault();
    searchInput.focus();
  } else if (key === 'l' && e.shiftKey) {
    e.preventDefault();
    createConversation();
  } else if (e.key === '/') {
    e.preventDefault();
    openSettings();
  }
});

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  languageSelect.value = lang;
  document.documentElement.lang = lang;

  appName.textContent = t('appName');
  newChatBtn.textContent = t('newChat');
  trashLabel.textContent = t('trash');
  settingsLabel.textContent = t('settings');
  chatStatus.textContent = t('online');
  disclaimer.textContent = t('disclaimer');
  chatInput.placeholder = t('inputPlaceholder');
  sendBtn.textContent = t('send');
  settingsTitleText.textContent = t('settingsTitle');
  themeLabelText.textContent = t('themeLabel');
  languageLabelText.textContent = t('languageLabel');
  themeLightBtn.textContent = t('themeLight');
  themeDarkBtn.textContent = t('themeDark');
  searchInput.placeholder = t('searchPlaceholder');
  searchInput.setAttribute('aria-label', t('searchPlaceholder'));
  shortcutsTitleText.textContent = t('shortcutsTitle');
  renderShortcuts();

  render();
}

// ---- Tema claro/oscuro ----

function applyTheme(theme) {
  document.body.classList.toggle('theme-dark', theme === 'dark');
  themeLightBtn.classList.toggle('active', theme === 'light');
  themeDarkBtn.classList.toggle('active', theme === 'dark');
  localStorage.setItem(THEME_KEY, theme);
}

function openSettings() {
  settingsBackdrop.classList.remove('is-hidden');
  themeLightBtn.focus();
  document.addEventListener('keydown', handleSettingsKeydown);
}

function closeSettings() {
  settingsBackdrop.classList.add('is-hidden');
  document.removeEventListener('keydown', handleSettingsKeydown);
  settingsBtn.focus();
}

function handleSettingsKeydown(e) {
  if (e.key === 'Escape') closeSettings();
}

settingsBtn.addEventListener('click', openSettings);
settingsClose.addEventListener('click', closeSettings);
settingsBackdrop.addEventListener('click', (e) => {
  if (e.target === settingsBackdrop) closeSettings();
});
themeLightBtn.addEventListener('click', () => applyTheme('light'));
themeDarkBtn.addEventListener('click', () => applyTheme('dark'));
languageSelect.addEventListener('change', (e) => applyLanguage(e.target.value));

// ---- Datos de conversaciones ----

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveConversations() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function purgeOldTrash() {
  const before = conversations.length;
  conversations = conversations.filter((c) => !(c.deletedAt && Date.now() - c.deletedAt > THIRTY_DAYS_MS));
  if (conversations.length !== before) saveConversations();
}

let conversations = loadConversations();
let currentId = localStorage.getItem(CURRENT_KEY);
let openMenuEl = null;
let viewMode = 'chat'; // 'chat' | 'trash'
let searchQuery = '';
let selectionMode = false;
let selectedIds = new Set();

purgeOldTrash();

function getCurrentConversation() {
  return conversations.find((c) => c.id === currentId && !c.deletedAt);
}

function getVisibleConversations() {
  let visible = conversations.filter((c) => !c.deletedAt);
  if (searchQuery) {
    visible = visible.filter((c) => c.title.toLowerCase().includes(searchQuery));
  }
  return visible;
}

function exitSelectionMode() {
  selectionMode = false;
  selectedIds.clear();
}

function setViewMode(mode) {
  viewMode = mode;
  const isTrash = mode === 'trash';
  trashView.classList.toggle('is-hidden', !isTrash);
  chatMessages.classList.toggle('is-hidden', isTrash);
  chatForm.classList.toggle('is-hidden', isTrash);
  disclaimer.classList.toggle('is-hidden', isTrash);
  chatStatus.classList.toggle('is-hidden', isTrash);
  trashBtn.classList.toggle('active', isTrash);
  if (isTrash) chatTitle.textContent = t('trashTitle');
}

function createConversation() {
  exitSelectionMode();
  const conv = { id: 'c' + Date.now(), title: t('newChatTitle'), messages: [], pinned: false, group: null, deletedAt: null };
  conversations.unshift(conv);
  currentId = conv.id;
  saveConversations();
  localStorage.setItem(CURRENT_KEY, currentId);
  setViewMode('chat');
  render();
  sidebar.classList.remove('open');
}

function selectConversation(id) {
  currentId = id;
  localStorage.setItem(CURRENT_KEY, currentId);
  setViewMode('chat');
  render();
  sidebar.classList.remove('open');
}

function openTrash() {
  exitSelectionMode();
  setViewMode('trash');
  renderSidebar();
  renderTrash();
  sidebar.classList.remove('open');
}

// ---- Buscador ----

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderSidebar();
});

// ---- Selección múltiple y borrado en lote ----

function deleteSelected() {
  if (selectedIds.size === 0) return;
  const count = selectedIds.size;
  const msg =
    (count === 1
      ? (currentLang === 'en' ? 'This will move 1 chat to trash.' : 'Esto moverá 1 chat a la papelera.')
      : (currentLang === 'en'
          ? 'This will move ' + count + ' chats to trash.'
          : 'Esto moverá ' + count + ' chats a la papelera.')) +
    ' ' +
    t('confirmDeleteSelected');
  const ok = window.confirm(msg);
  if (!ok) return;

  const now = Date.now();
  const currentWasDeleted = selectedIds.has(currentId);
  conversations.forEach((c) => {
    if (selectedIds.has(c.id)) c.deletedAt = now;
  });
  saveConversations();
  exitSelectionMode();

  if (currentWasDeleted) {
    const remaining = conversations.filter((c) => !c.deletedAt);
    if (remaining.length) {
      currentId = remaining[0].id;
      localStorage.setItem(CURRENT_KEY, currentId);
      setViewMode('chat');
      render();
    } else {
      createConversation();
    }
  } else {
    render();
  }
}

function renderSelectionBar() {
  selectionBar.innerHTML = '';

  if (!selectionMode) {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'selection-toggle';
    toggleBtn.textContent = t('selectToggle');
    toggleBtn.addEventListener('click', () => {
      selectionMode = true;
      selectedIds.clear();
      render();
    });
    selectionBar.appendChild(toggleBtn);
    return;
  }

  const toolbar = document.createElement('div');
  toolbar.className = 'selection-toolbar';

  const allLabel = document.createElement('label');
  allLabel.className = 'select-all-label';
  const allCheckbox = document.createElement('input');
  allCheckbox.type = 'checkbox';
  const visibleIds = getVisibleConversations().map((c) => c.id);
  allCheckbox.checked = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  allCheckbox.addEventListener('change', () => {
    if (allCheckbox.checked) {
      visibleIds.forEach((id) => selectedIds.add(id));
    } else {
      visibleIds.forEach((id) => selectedIds.delete(id));
    }
    render();
  });
  const allText = document.createElement('span');
  allText.textContent = t('selectAll');
  allLabel.appendChild(allCheckbox);
  allLabel.appendChild(allText);

  const actions = document.createElement('div');
  actions.className = 'selection-actions';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'selection-delete-btn';
  deleteBtn.textContent = t('deleteSelected') + (selectedIds.size ? ' (' + selectedIds.size + ')' : '');
  deleteBtn.disabled = selectedIds.size === 0;
  deleteBtn.addEventListener('click', deleteSelected);

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'selection-cancel-btn';
  cancelBtn.textContent = t('cancel');
  cancelBtn.addEventListener('click', () => {
    exitSelectionMode();
    render();
  });

  actions.appendChild(deleteBtn);
  actions.appendChild(cancelBtn);

  toolbar.appendChild(allLabel);
  toolbar.appendChild(actions);
  selectionBar.appendChild(toolbar);
}

// ---- Menú de opciones ----

function closeContextMenu() {
  if (openMenuEl) {
    openMenuEl.remove();
    openMenuEl = null;
  }
}

function makeMenuButton(label, onClick, danger) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'context-menu-item' + (danger ? ' danger' : '');
  btn.textContent = label;
  btn.addEventListener('click', () => {
    onClick();
    closeContextMenu();
  });
  return btn;
}

function openContextMenu(conv, anchorEl) {
  closeContextMenu();
  const menu = document.createElement('div');
  menu.className = 'context-menu';

  menu.appendChild(
    makeMenuButton(conv.pinned ? 'Desfijar' : 'Fijar', () => {
      conv.pinned = !conv.pinned;
      saveConversations();
      render();
    })
  );

  menu.appendChild(
    makeMenuButton('Cambiar nombre', () => {
      const name = window.prompt('Nuevo nombre para el chat:', conv.title);
      if (name && name.trim()) {
        conv.title = name.trim();
        saveConversations();
        render();
      }
    })
  );

  menu.appendChild(
    makeMenuButton('Mover al grupo', () => {
      const group = window.prompt(
        'Nombre del grupo (déjalo vacío para quitarlo de cualquier grupo):',
        conv.group || ''
      );
      if (group !== null) {
        conv.group = group.trim() || null;
        saveConversations();
        render();
      }
    })
  );

  menu.appendChild(
    makeMenuButton(
      'Eliminar',
      () => {
        conv.deletedAt = Date.now();
        saveConversations();
        if (currentId === conv.id) {
          const remaining = conversations.filter((c) => !c.deletedAt);
          if (remaining.length) {
            currentId = remaining[0].id;
            localStorage.setItem(CURRENT_KEY, currentId);
          } else {
            createConversation();
            return;
          }
        }
        render();
      },
      true
    )
  );

  document.body.appendChild(menu);
  const rect = anchorEl.getBoundingClientRect();
  menu.style.top = rect.bottom + 4 + 'px';
  menu.style.left = Math.min(rect.left, window.innerWidth - 190) + 'px';
  openMenuEl = menu;

  const firstItem = menu.querySelector('.context-menu-item');
  if (firstItem) firstItem.focus();

  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContextMenu();
      anchorEl.focus();
    }
  });
}

document.addEventListener('click', () => closeContextMenu());

// ---- Barra lateral ----

function makeSectionHeader(label) {
  const h = document.createElement('div');
  h.className = 'section-header';
  h.textContent = label;
  return h;
}

function makeConversationRow(conv) {
  const row = document.createElement('div');
  const isActive = conv.id === currentId && viewMode === 'chat' && !selectionMode;
  const isSelected = selectionMode && selectedIds.has(conv.id);
  row.className = 'conversation-row' + (isActive ? ' active' : '') + (isSelected ? ' selected' : '');

  if (selectionMode) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'conversation-checkbox';
    checkbox.checked = selectedIds.has(conv.id);
    checkbox.setAttribute('aria-label', t('selectChats'));
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selectedIds.add(conv.id);
      else selectedIds.delete(conv.id);
      render();
    });
    row.appendChild(checkbox);
  }

  const titleBtn = document.createElement('button');
  titleBtn.type = 'button';
  titleBtn.className = 'conversation-item';
  titleBtn.textContent = conv.title;
  titleBtn.addEventListener('click', () => {
    if (selectionMode) {
      if (selectedIds.has(conv.id)) selectedIds.delete(conv.id);
      else selectedIds.add(conv.id);
      render();
    } else {
      selectConversation(conv.id);
    }
  });
  row.appendChild(titleBtn);

  if (!selectionMode) {
    const optionsBtn = document.createElement('button');
    optionsBtn.type = 'button';
    optionsBtn.className = 'conversation-menu-btn';
    optionsBtn.textContent = '⋮';
    optionsBtn.setAttribute('aria-label', 'Más opciones');
    optionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openContextMenu(conv, optionsBtn);
    });
    row.appendChild(optionsBtn);
  }

  return row;
}

function renderSidebar() {
  conversationList.innerHTML = '';
  renderSelectionBar();

  const visible = getVisibleConversations();

  if (searchQuery && visible.length === 0) {
    const noResults = document.createElement('p');
    noResults.className = 'no-results';
    noResults.textContent = t('noResults');
    conversationList.appendChild(noResults);
    updateTrashCount();
    return;
  }

  const pinned = visible.filter((c) => c.pinned);
  const others = visible.filter((c) => !c.pinned);

  if (pinned.length) {
    conversationList.appendChild(makeSectionHeader('Fijados'));
    pinned.forEach((conv) => conversationList.appendChild(makeConversationRow(conv)));
  }

  const groups = {};
  const ungrouped = [];
  others.forEach((conv) => {
    if (conv.group) {
      if (!groups[conv.group]) groups[conv.group] = [];
      groups[conv.group].push(conv);
    } else {
      ungrouped.push(conv);
    }
  });

  Object.keys(groups).forEach((groupName) => {
    conversationList.appendChild(makeSectionHeader(groupName));
    groups[groupName].forEach((conv) => conversationList.appendChild(makeConversationRow(conv)));
  });

  if (ungrouped.length) {
    if (pinned.length || Object.keys(groups).length) {
      conversationList.appendChild(makeSectionHeader('Chats'));
    }
    ungrouped.forEach((conv) => conversationList.appendChild(makeConversationRow(conv)));
  }

  updateTrashCount();
}

function updateTrashCount() {
  const count = conversations.filter((c) => c.deletedAt).length;
  trashCount.textContent = count > 0 ? String(count) : '';
}

// ---- Papelera ----

function renderTrash() {
  trashView.innerHTML = '';
  const deleted = conversations.filter((c) => c.deletedAt).sort((a, b) => b.deletedAt - a.deletedAt);

  if (deleted.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'trash-empty';
    empty.textContent = t('trashEmpty');
    trashView.appendChild(empty);
    return;
  }

  deleted.forEach((conv) => {
    const row = document.createElement('div');
    row.className = 'trash-row';

    const info = document.createElement('div');
    info.className = 'trash-info';
    const title = document.createElement('span');
    title.className = 'trash-title';
    title.textContent = conv.title;
    const date = document.createElement('span');
    date.className = 'trash-date';
    date.textContent = t('deletedOn') + new Date(conv.deletedAt).toLocaleDateString();
    info.appendChild(title);
    info.appendChild(date);

    const actions = document.createElement('div');
    actions.className = 'trash-actions';

    const restoreBtn = document.createElement('button');
    restoreBtn.type = 'button';
    restoreBtn.className = 'trash-action-btn';
    restoreBtn.textContent = t('restore');
    restoreBtn.addEventListener('click', () => {
      conv.deletedAt = null;
      saveConversations();
      renderTrash();
      renderSidebar();
    });

    const permBtn = document.createElement('button');
    permBtn.type = 'button';
    permBtn.className = 'trash-action-btn danger';
    permBtn.textContent = t('deleteForever');
    permBtn.addEventListener('click', () => {
      const ok = window.confirm('Esto elimina el chat para siempre y no se puede deshacer. ¿Continuar?');
      if (!ok) return;
      conversations = conversations.filter((c) => c.id !== conv.id);
      saveConversations();
      renderTrash();
      updateTrashCount();
    });

    actions.appendChild(restoreBtn);
    actions.appendChild(permBtn);
    row.appendChild(info);
    row.appendChild(actions);
    trashView.appendChild(row);
  });
}

// ---- Campo de texto que crece ----

function autoResizeTextarea() {
  chatInput.style.height = 'auto';
  chatInput.style.height = Math.min(chatInput.scrollHeight, MAX_TEXTAREA_HEIGHT) + 'px';
}

chatInput.addEventListener('input', autoResizeTextarea);

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleMessage(chatInput.value);
  }
});

// ---- Mensajes ----

function createBubbleEl(sender) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + sender;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

function addBubbleEl(text, sender) {
  const bubble = createBubbleEl(sender);
  bubble.textContent = text;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendBubbleText(bubble, text) {
  bubble.textContent += text;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const el = document.createElement('div');
  el.className = 'typing';
  el.textContent = '···';
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return el;
}

function showErrorBubble(message) {
  const bubble = createBubbleEl('bot');
  bubble.classList.add('error');
  bubble.textContent = message;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function streamBubbleText(fullText, sender) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + sender;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  let i = 0;
  const step = 3;
  const intervalId = setInterval(() => {
    i += step;
    bubble.textContent = fullText.slice(0, i);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (i >= fullText.length) clearInterval(intervalId);
  }, 18);
}

function renderEmptyState() {
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.innerHTML =
    '<p>' + t('emptyPrompt') + '</p>' +
    '<div class="suggestions">' +
    '<button type="button" class="chip" data-msg="' + t('suggestion1') + '">' + t('suggestion1') + '</button>' +
    '<button type="button" class="chip" data-msg="' + t('suggestion2') + '">' + t('suggestion2') + '</button>' +
    '<button type="button" class="chip" data-msg="' + t('suggestion3') + '">' + t('suggestion3') + '</button>' +
    '</div>';
  chatMessages.appendChild(emptyState);
  emptyState.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => handleMessage(chip.dataset.msg));
  });
}

function renderMessages() {
  chatMessages.innerHTML = '';
  const conv = getCurrentConversation();
  chatTitle.textContent = conv ? conv.title : t('newChatTitle');

  if (!conv || conv.messages.length === 0) {
    renderEmptyState();
    return;
  }
  conv.messages.forEach((m) => addBubbleEl(m.text, m.sender));
}

// ---- DeepSeek API ----

let isBusy = false;

function getApiKey() {
  const fromCode = (DEEPSEEK_API_KEY || '').trim();
  if (fromCode) return fromCode;
  return (localStorage.getItem(API_KEY_STORAGE) || '').trim();
}

function ensureApiKey() {
  const existing = getApiKey();
  if (existing) return existing;
  const entered = window.prompt(t('apiKeyPrompt'));
  const key = (entered || '').trim();
  if (key) localStorage.setItem(API_KEY_STORAGE, key);
  return key;
}

function buildRequestMessages(conv) {
  return conv.messages
    .filter((m) => m.sender === 'user' || m.sender === 'bot')
    .filter((m) => typeof m.text === 'string' && m.text.trim() !== '')
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));
}

async function readDeepSeekError(response) {
  let detail = '';
  try {
    const data = await response.json();
    detail = (data && data.error && data.error.message) || data.message || '';
  } catch (e) {
    detail = '';
  }
  if (response.status === 401) return t('error401') + (detail ? ' ' + detail : '');
  if (response.status === 402) return t('error402');
  if (response.status === 429) return t('error429');
  return t('errorGeneric') + ' (' + response.status + ')' + (detail ? ' ' + detail : '');
}

// Lee la respuesta en streaming (SSE) y entrega cada fragmento de texto.
async function readSseStream(response, onDelta) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const chunk = line.trim();
      if (!chunk || chunk.indexOf('data:') !== 0) continue;
      const payloadText = chunk.slice(5).trim();
      if (payloadText === '[DONE]') return;
      try {
        const parsed = JSON.parse(payloadText);
        const delta = parsed.choices && parsed.choices[0] && parsed.choices[0].delta;
        const content = delta && delta.content;
        if (content) onDelta(content);
      } catch (e) {
        // fragmento ilegible: se ignora y seguimos con el siguiente
      }
    }
  }
}

async function handleMessage(rawText) {
  const text = (rawText || '').trim();
  if (!text || isBusy) return;

  const conv = getCurrentConversation();
  if (!conv) return;

  const apiKey = ensureApiKey();
  if (!apiKey) {
    showErrorBubble(t('errorNoKey'));
    return;
  }

  const isFirstMessage = conv.messages.length === 0;
  conv.messages.push({ sender: 'user', text });
  if (isFirstMessage) {
    conv.title = text.length > 42 ? text.slice(0, 42).trim() + '…' : text;
  }
  saveConversations();

  chatInput.value = '';
  autoResizeTextarea();
  isBusy = true;
  chatInput.disabled = true;
  sendBtn.disabled = true;
  chatStatus.textContent = t('thinking');
  render();

  const typingEl = showTypingIndicator();
  let answer = '';

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: buildRequestMessages(conv),
        stream: STREAM_RESPONSE,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(await readDeepSeekError(response));
    }

    if (STREAM_RESPONSE) {
      const bubble = createBubbleEl('bot');
      typingEl.remove();
      await readSseStream(response, (delta) => {
        answer += delta;
        appendBubbleText(bubble, delta);
      });
    } else {
      const data = await response.json();
      answer = (data.choices && data.choices[0] && data.choices[0].message.content) || '';
      typingEl.remove();
      streamBubbleText(answer, 'bot');
    }

    if (!answer.trim()) {
      showErrorBubble(t('errorEmpty'));
      return;
    }

    conv.messages.push({ sender: 'bot', text: answer });
    saveConversations();
    render();
  } catch (err) {
    if (typingEl.parentNode) typingEl.remove();
    const message =
      err instanceof TypeError
        ? t('errorNetwork')
        : (err && err.message) || t('errorGeneric');
    showErrorBubble(message);
  } finally {
    isBusy = false;
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatStatus.textContent = t('online');
  }
}

function render() {
  renderSidebar();
  if (viewMode === 'chat') {
    renderMessages();
  } else {
    renderTrash();
  }
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleMessage(chatInput.value);
});

newChatBtn.addEventListener('click', createConversation);
menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
trashBtn.addEventListener('click', openTrash);

// ---- Arranque ----

applyTheme(localStorage.getItem(THEME_KEY) || 'light');
applyLanguage(currentLang);
autoResizeTextarea();

if (conversations.filter((c) => !c.deletedAt).length === 0) {
  createConversation();
} else {
  if (!currentId || !getCurrentConversation()) {
    const first = conversations.find((c) => !c.deletedAt);
    currentId = first ? first.id : null;
  }
  render();
}