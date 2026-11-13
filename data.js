/* ============================================================
   «Помогалка» — демо-данные платформы, авторизация и действия.
   Все ФИО и данные вымышленные (демо-стенд).
   Состояние хранится в localStorage браузера.
   ============================================================ */
window.POM = (function () {
  'use strict';

  var KEY = 'pom_state_v1', SKEY = 'pom_session_v1';

  var DISCIPLINES = ['Анатомия', 'Гистология', 'Биохимия', 'Фармакология', 'Патофизиология',
    'Микробиология', 'Латинский язык', 'Гигиена', 'Физиология', 'Пропедевтика'];

  var FACULTIES = ['Лечебный', 'Педиатрия', 'Медико-профилактический', 'Стоматология', 'Фармация'];

  var ROLE_NAMES = { admin: 'Администратор', moderator: 'Модератор', mentor: 'Наставник', student: 'Студент' };

  /* ---------- пользователи (пароли демо) ---------- */
  var USERS = [
    { id: 'u1', role: 'admin', name: 'Анна Иванова', email: 'anna@agmu.ru', pass: 'admin123', course: '4 курс', faculty: 'Лечебный', points: 120, rating: 4.8, title: 'Руководитель проекта', discs: ['Анатомия'] },
    { id: 'u2', role: 'admin', name: 'Дамир Хаметов', email: 'damir@agmu.ru', pass: 'admin123', course: '5 курс', faculty: 'Педиатрия', points: 215, rating: 4.9, title: 'IT-администратор', discs: ['Биохимия'] },
    { id: 'u3', role: 'admin', name: 'Камила Салихова', email: 'kamila@agmu.ru', pass: 'admin123', course: '4 курс', faculty: 'Медико-профилактический', points: 95, rating: 4.7, title: 'Модератор запросов', discs: ['Гигиена'] },
    { id: 'u4', role: 'mentor', name: 'Артём Кузнецов', email: 'artem@agmu.ru', pass: 'demo123', course: '5 курс', faculty: 'Лечебный', points: 340, rating: 4.9, title: 'Наставник', discs: ['Анатомия', 'Гистология'] },
    { id: 'u5', role: 'mentor', name: 'Марина Осипова', email: 'marina@agmu.ru', pass: 'demo123', course: '6 курс', faculty: 'Лечебный', points: 265, rating: 4.8, title: 'Наставник', discs: ['Фармакология', 'Биохимия'] },
    { id: 'u6', role: 'mentor', name: 'Руслан Джалилов', email: 'ruslan@agmu.ru', pass: 'demo123', course: 'Ординатор, 1 год', faculty: 'Лечебный', points: 190, rating: 4.7, title: 'Наставник', discs: ['Патофизиология', 'Анатомия'] },
    { id: 'u7', role: 'mentor', name: 'Алиса Романова', email: 'alisa@agmu.ru', pass: 'demo123', course: '4 курс', faculty: 'Стоматология', points: 120, rating: 4.6, title: 'Наставник', discs: ['Биохимия', 'Микробиология'] },
    { id: 'u8', role: 'student', name: 'Полина Смирнова', email: 'polina@agmu.ru', pass: 'demo123', course: '2 курс', faculty: 'Лечебный', points: 0, rating: null, title: 'Студент', discs: [] },
    { id: 'u9', role: 'student', name: 'Игорь Васильев', email: 'igor@agmu.ru', pass: 'demo123', course: '1 курс', faculty: 'Лечебный', points: 0, rating: null, title: 'Студент', discs: [] },
    { id: 'u10', role: 'student', name: 'Дина Мухтарова', email: 'dina@agmu.ru', pass: 'demo123', course: '3 курс', faculty: 'Педиатрия', points: 0, rating: null, title: 'Студент', discs: [] },
    { id: 'u11', role: 'student', name: 'Кирилл Соколов', email: 'kirill@agmu.ru', pass: 'demo123', course: '1 курс', faculty: 'Лечебный', points: 0, rating: null, title: 'Студент', discs: [] },
    { id: 'u12', role: 'student', name: 'Софья Гринёва', email: 'sofya@agmu.ru', pass: 'demo123', course: '2 курс', faculty: 'Стоматология', points: 0, rating: null, title: 'Студент', discs: [] },
    { id: 'u13', role: 'student', name: 'Тимур Аббасов', email: 'timur@agmu.ru', pass: 'demo123', course: '3 курс', faculty: 'Лечебный', points: 0, rating: null, title: 'Студент', discs: [] }
  ];

  /* ---------- запросы ---------- */
  /* статусы: new — новый, inwork — в работе, pending — ждёт подтверждения,
     confirmed — подтверждён, rejected — отклонён */
  var REQUESTS = [
    { id: 'r1', disc: 'Гистология', title: 'Схема кроветворения: объяснить по этапам', detail: 'Нужно понять, от чего идут линии дифференцировки и как запомнить порядок.', deadline: '18.11.2026', studentId: 'u8', mentorId: null, status: 'new', points: 40, date: '12.11.2026', flag: null },
    { id: 'r2', disc: 'Анатомия', title: 'Плечевое сплетение: ветви и топография', detail: 'Препод спросит по схеме на доске. Хочу разобраться раз и навсегда.', deadline: '15.11.2026', studentId: 'u9', mentorId: null, status: 'new', points: 40, date: '12.11.2026', flag: null },
    { id: 'r3', disc: 'Биохимия', title: 'Цикл Кребса «на пальцах»', detail: 'Запуталась в интермедиатах. Нужен разбор с логикой, а не зубрёжка.', deadline: '16.11.2026', studentId: 'u12', mentorId: null, status: 'new', points: 35, date: '11.11.2026', flag: null },
    { id: 'r4', disc: 'Фармакология', title: 'Бета-блокаторы: классификация и показания', detail: 'Подготовка к семинару, нужен разбор групп и частых вопросов.', deadline: '20.11.2026', studentId: 'u10', mentorId: null, status: 'new', points: 40, date: '11.11.2026', flag: null },
    { id: 'r5', disc: 'Латинский язык', title: 'Терминологические модели: анатомические термины', detail: 'Не понимаю, как строить фразы с несогласованным определением.', deadline: '14.11.2026', studentId: 'u12', mentorId: null, status: 'new', points: 30, date: '11.11.2026', flag: null },
    { id: 'r6', disc: 'Анатомия', title: 'Черепные нервы: пары и функция', detail: 'Сессия близко, нужен системный разбор всех XII пар.', deadline: '13.11.2026', studentId: 'u13', mentorId: 'u4', status: 'inwork', points: 45, date: '10.11.2026', flag: null },
    { id: 'r7', disc: 'Патофизиология', title: 'Шок: виды, стадии, компенсация', detail: 'Разобрать типовые задачи с семинара.', deadline: '17.11.2026', studentId: 'u9', mentorId: 'u6', status: 'inwork', points: 40, date: '10.11.2026', flag: null },
    { id: 'r8', disc: 'Гистология', title: 'Эпителиальные ткани: классификация', detail: 'Спасибо, разобралась быстрее, чем за месяц сама!', deadline: '09.11.2026', studentId: 'u8', mentorId: 'u5', status: 'confirmed', points: 40, date: '08.11.2026', flag: null },
    { id: 'r9', disc: 'Анатомия', title: 'Кровоснабжение сердца: артерии и зоны', detail: 'Лучший разбор за семестр, теперь помню схему.', deadline: '07.11.2026', studentId: 'u10', mentorId: 'u4', status: 'confirmed', points: 40, date: '06.11.2026', flag: null },
    { id: 'r10', disc: 'Микробиология', title: 'Классификация бактерий по Берги', detail: 'Разложили по полочкам, полгруппы в аудиторию позвал.', deadline: '05.11.2026', studentId: 'u11', mentorId: 'u7', status: 'confirmed', points: 35, date: '04.11.2026', flag: null },
    { id: 'r11', disc: 'Биохимия', title: 'Гликолиз: этапы и выход энергии', detail: 'Разобрали за час, а я месяц не могла.', deadline: '03.11.2026', studentId: 'u12', mentorId: 'u5', status: 'confirmed', points: 40, date: '02.11.2026', flag: null },
    { id: 'r12', disc: 'Анатомия', title: 'Топография средостения', detail: 'Отличное объяснение, всё структурировано.', deadline: '01.11.2026', studentId: 'u13', mentorId: 'u6', status: 'confirmed', points: 45, date: '31.10.2026', flag: null },
    { id: 'r13', disc: 'Фармакология', title: 'НПВС: механизм действия и группы', detail: 'Разбор прошёл, жду подтверждения от студента.', deadline: '12.11.2026', studentId: 'u8', mentorId: 'u5', status: 'pending', points: 40, date: '11.11.2026', flag: null },
    { id: 'r14', disc: 'Гигиена', title: 'Помогите написать реферат целиком', detail: 'Запрос отклонён модератором: написание работ за студентов запрещено правилами. Предложен разбор темы вместо этого.', deadline: '10.11.2026', studentId: 'u9', mentorId: null, status: 'rejected', points: 0, date: '09.11.2026', flag: null },
    { id: 'r15', disc: 'Анатомия', title: 'Разбор темы (повтор 7-й раз)', detail: 'Автоматика антифрода: повторяющаяся пара и одинаковые формулировки.', deadline: '13.11.2026', studentId: 'u11', mentorId: 'u4', status: 'pending', points: 40, date: '12.11.2026', flag: 'f1' },
    { id: 'r16', disc: 'Физиология', title: 'Проводящая система миокарда', detail: 'Прекрасный разбор с клиническим примером.', deadline: '02.11.2026', studentId: 'u10', mentorId: 'u4', status: 'confirmed', points: 40, date: '01.11.2026', flag: null }
  ];

  /* ---------- флаги антифрода ---------- */
  var FLAGS = [
    { id: 'f1', pair: 'Кирилл Соколов ↔ Артём Кузнецов', sev: 'Высокий приоритет', reason: '7 подтверждённых запросов за 5 дней с совпадающими формулировками тем. Признак взаимной накрутки баллов.', meta: ['Запросов в паре за неделю: 7 (при средней нагрузке 1–2)', 'Совпадение тем: 92%', 'Время подтверждений: в течение 5 минут после старта'], action: null },
    { id: 'f2', pair: 'Игорь Васильев (студент)', sev: 'Средний приоритет', reason: '4 запроса за один день, 2 из них отклонены модератором как требующие выполнения работ за студента.', meta: ['Создано запросов за сутки: 4', 'Отклонено: 2 (нарушение правил)', 'Рекомендация: предупредить о правилах'], action: null },
    { id: 'f3', pair: 'Софья Гринёва ↔ Марина Осипова', sev: 'Низкий приоритет', reason: '3 взаимных подтверждения в период 02:00–04:00. Возможна договорная активность, требуется выборочная проверка.', meta: ['Подтверждений в ночные часы: 3', 'Доля ночных подтверждений: 60%', 'Рекомендация: запросить комментарий'], action: null }
  ];

  /* ---------- каталог бонусов ---------- */
  var BONUSES = [
    { id: 'b1', title: 'Волонтёрские часы (1 час)', desc: 'Зачёт волонтёрского часа в личное волонтёрское дело через вуз.', cost: 60 },
    { id: 'b2', title: 'Электронный сертификат наставника', desc: 'Именной сертификат с указанием дисциплин и количества сессий.', cost: 80 },
    { id: 'b3', title: 'Кружка с символикой АГМУ', desc: 'Керамическая кружка «Помогалки» для активных наставников.', cost: 90 },
    { id: 'b4', title: 'Футболка наставника', desc: 'Брендированная футболка из лимитированного тиража семестра.', cost: 150 },
    { id: 'b5', title: 'Скидка 10% на доп. образование', desc: 'Скидка при оплате дополнительного образования в АГМУ.', cost: 200 },
    { id: 'b6', title: 'Приоритет выбора практики', desc: 'Приоритетное право при распределении баз практики.', cost: 250 }
  ];

  /* ---------- аналитика (обезличенная, демо) ---------- */
  var ANALYTICS = {
    byDisc: [
      { disc: 'Анатомия', n: 64 }, { disc: 'Гистология', n: 52 }, { disc: 'Биохимия', n: 45 },
      { disc: 'Фармакология', n: 38 }, { disc: 'Патофизиология', n: 29 }, { disc: 'Латинский язык', n: 24 },
      { disc: 'Микробиология', n: 18 }, { disc: 'Пропедевтика', n: 12 }
    ],
    byCourse: [{ label: '1 курс', n: 46 }, { label: '2 курс', n: 31 }, { label: '3 курс', n: 23 }],
    anxiety: [
      { label: '1 курс', before: 7.2, after: 4.9 }, { label: '2 курс', before: 6.5, after: 4.6 }, { label: '3 курс', before: 6.1, after: 4.4 }
    ],
    risk: [
      { disc: 'Анатомия', share: '34%', trend: '↑ 12% за месяц', note: 'Пик запросов за 2 недели до экзамена. Рекомендация: закрепить 3 наставников по анатомии на декабрь.' },
      { disc: 'Биохимия', share: '22%', trend: '↑ 6% за месяц', note: 'Устойчиво высокий спрос на тему «метаболизм». Нужен цикл групповых разборов.' },
      { disc: 'Гистология', share: '18%', trend: '→ стабильно', note: 'Наибольший объём в первой половине семестра. Активность снижается к сессии.' }
    ]
  };

  /* ---------- хранилище ---------- */
  function state() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
  function mut(fn) { var s = state(); fn(s); save(s); }

  function users() {
    var s = state();
    return USERS.concat(s.newUsers || []).map(function (u) {
      var ov = (s.userOv || {})[u.id] || {};
      var copy = Object.assign({}, u, ov, { pass: undefined, _pass: u.pass, points: (u.points || 0) + (ov.points || 0) });
      copy.blocked = !!ov.blocked;
      return copy;
    });
  }
  function requests() {
    var s = state();
    return REQUESTS.concat(s.newRequests || []).map(function (r) {
      var ov = (s.reqOv || {})[r.id] || {};
      return Object.assign({}, r, ov);
    });
  }
  function bonuses() {
    var s = state();
    return BONUSES.map(function (b) { return Object.assign({}, b, { paused: !!((s.bonusPaused || {})[b.id]) }); });
  }
  function flags() {
    var s = state();
    return FLAGS.map(function (f) { return Object.assign({}, f, { action: (s.fraudDone || {})[f.id] || f.action || null }); });
  }

  /* ---------- сессия ---------- */
  function current() {
    var id = localStorage.getItem(SKEY);
    if (!id) return null;
    var u = users().find(function (x) { return x.id === id; });
    return (u && !u.blocked) ? u : null;
  }
  function login(email, pass) {
    var u = users().find(function (x) { return x.email.toLowerCase() === String(email).toLowerCase().trim(); });
    if (!u) return { ok: false, err: 'Аккаунт с таким email не найден' };
    if (u.blocked) return { ok: false, err: 'Аккаунт заблокирован администратором' };
    if (u._pass !== pass) return { ok: false, err: 'Неверный пароль. Подсказка — на этой странице в демо-карточках' };
    localStorage.setItem(SKEY, u.id);
    return { ok: true, user: u };
  }
  function logout() { localStorage.removeItem(SKEY); }
  function register(d) {
    var s = state();
    s.newUsers = s.newUsers || [];
    if (users().some(function (x) { return x.email.toLowerCase() === d.email.toLowerCase(); }))
      return { ok: false, err: 'Этот email уже зарегистрирован' };
    var id = 'nu' + (s.newUsers.length + 1) + '_' + Math.floor(Math.random() * 9000);
    s.newUsers.push({ id: id, role: d.role, name: d.name, email: d.email, pass: d.pass, course: d.course, faculty: d.faculty, points: 0, rating: null, title: d.role === 'mentor' ? 'Наставник' : 'Студент', discs: [] });
    save(s);
    localStorage.setItem(SKEY, id);
    return { ok: true };
  }

  /* ---------- действия ---------- */
  function genId(prefix, arr) {
    return prefix + (arr.length + 1) + '_' + Math.floor(Math.random() * 9000);
  }
  function addPoints(userId, delta, label, dateStr) {
    mut(function (s) {
      s.userOv = s.userOv || {}; s.userOv[userId] = s.userOv[userId] || {};
      s.userOv[userId].points = (s.userOv[userId].points || 0) + delta;
      s.userOv[userId].history = s.userOv[userId].history || [];
      s.userOv[userId].history.push({ label: label, delta: delta, date: dateStr || today() });
    });
  }
  function createRequest(d) {
    var u = current();
    var s = state();
    s.newRequests = s.newRequests || [];
    var req = { id: genId('nr', s.newRequests), disc: d.disc, title: d.title, detail: d.detail || '', deadline: d.deadline || '', studentId: u.id, mentorId: null, status: 'new', points: 40, date: today(), flag: null };
    s.newRequests.push(req); save(s);
    return req;
  }
  function takeRequest(reqId) {
    var u = current();
    mut(function (s) {
      s.reqOv = s.reqOv || {};
      s.reqOv[reqId] = Object.assign(s.reqOv[reqId] || {}, { status: 'inwork', mentorId: u.id });
    });
  }
  function sendToConfirm(reqId) {
    mut(function (s) {
      s.reqOv = s.reqOv || {};
      s.reqOv[reqId] = Object.assign(s.reqOv[reqId] || {}, { status: 'pending' });
    });
  }
  function confirmRequest(reqId, byAdmin) {
    var req = requests().find(function (r) { return r.id === reqId; });
    if (!req || req.status === 'confirmed') return;
    mut(function (s) {
      s.reqOv = s.reqOv || {};
      s.reqOv[reqId] = Object.assign(s.reqOv[reqId] || {}, { status: 'confirmed' });
    });
    if (req.mentorId) addPoints(req.mentorId, req.points || 40, 'Подтверждён запрос: ' + req.title);
  }
  function rejectRequest(reqId) {
    mut(function (s) {
      s.reqOv = s.reqOv || {};
      s.reqOv[reqId] = Object.assign(s.reqOv[reqId] || {}, { status: 'rejected' });
    });
  }
  function cancelRequest(reqId) {
    mut(function (s) {
      s.reqOv = s.reqOv || {};
      s.reqOv[reqId] = Object.assign(s.reqOv[reqId] || {}, { status: 'rejected' });
    });
  }
  function blockUser(id, blocked) {
    mut(function (s) {
      s.userOv = s.userOv || {};
      s.userOv[id] = Object.assign(s.userOv[id] || {}, { blocked: blocked });
    });
  }
  function setFraud(flagId, action) {
    mut(function (s) {
      s.fraudDone = s.fraudDone || {};
      s.fraudDone[flagId] = action;
    });
  }
  function toggleBonus(bonusId) {
    mut(function (s) {
      s.bonusPaused = s.bonusPaused || {};
      s.bonusPaused[bonusId] = !s.bonusPaused[bonusId];
    });
  }
  function exchangeBonus(bonusId) {
    var u = current();
    var b = bonuses().find(function (x) { return x.id === bonusId; });
    if (!b || b.paused) return { ok: false, err: 'Бонус недоступен' };
    var pts = u.points || 0;
    if (pts < b.cost) return { ok: false, err: 'Не хватает ' + (b.cost - pts) + ' баллов' };
    addPoints(u.id, -b.cost, 'Обмен на бонус: ' + b.title);
    return { ok: true };
  }

  /* история начислений наставника: статические подтверждённые запросы + локальные изменения */
  function dkey(s){ var p = String(s).split('.'); return p[2] ? p[2] + p[1] + p[0] : s; }
  function pointsHistory(userId) {
    var base = requests().filter(function (r) {
      return r.status === 'confirmed' && r.mentorId === userId;
    }).map(function (r) { return { label: 'Подтверждён запрос: ' + r.title, delta: r.points || 40, date: r.date }; });
    var s = state();
    var ov = (s.userOv || {})[userId] || {};
    return base.concat(ov.history || []).sort(function (a, b) { return dkey(b.date) > dkey(a.date) ? 1 : -1; });
  }
  function mentorRequests(mentorId) { return requests().filter(function (r) { return r.mentorId === mentorId; }); }
  function studentRequests(studentId) { return requests().filter(function (r) { return r.studentId === studentId; }); }
  function userName(id) { var u = users().find(function (x) { return x.id === id; }); return u ? u.name : '—'; }

  /* ---------- утилиты ---------- */
  function today() {
    var d = new Date();
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function initials(name) {
    return name.split(/\s+/).map(function (w) { return w[0] || ''; }).join('').slice(0, 2).toUpperCase();
  }
  function avaColor(name) {
    var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    var pal = ['a1', 'a2', 'a3', 'a4', 'a5'];
    return pal[h % pal.length];
  }
  function ava(name) {
    return '<span class="ava-sm ' + avaColor(name) + '">' + esc(initials(name)) + '</span>';
  }
  function greeting() {
    var h = new Date().getHours();
    return h < 11 ? 'Доброе утро' : h < 17 ? 'Добрый день' : 'Добрый вечер';
  }
  function toast(msg, type) {
    var t = document.getElementById('pomToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'pomToast'; t.className = 'toast';
      t.innerHTML = '<span class="tico"></span><span class="tmsg"></span>';
      document.body.appendChild(t);
    }
    t.className = 'toast show ' + (type || 'ok');
    t.querySelector('.tico').textContent = type === 'err' ? '!' : type === 'warn' ? 'i' : '✓';
    t.querySelector('.tmsg').textContent = msg;
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.className = 'toast ' + (type || 'ok'); }, 3400);
  }

  return {
    DISCIPLINES: DISCIPLINES, FACULTIES: FACULTIES, ROLE_NAMES: ROLE_NAMES,
    ANALYTICS: ANALYTICS,
    users: users, requests: requests, bonuses: bonuses, flags: flags,
    current: current, login: login, logout: logout, register: register,
    createRequest: createRequest, takeRequest: takeRequest, sendToConfirm: sendToConfirm,
    confirmRequest: confirmRequest, rejectRequest: rejectRequest, cancelRequest: cancelRequest,
    blockUser: blockUser, setFraud: setFraud, toggleBonus: toggleBonus, exchangeBonus: exchangeBonus,
    addPoints: addPoints,
    pointsHistory: pointsHistory, mentorRequests: mentorRequests, studentRequests: studentRequests,
    userName: userName, today: today, esc: esc, ava: ava, avaColor: avaColor, initials: initials,
    greeting: greeting, toast: toast
  };
})();
