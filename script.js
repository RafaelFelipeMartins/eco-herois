// ===============================
//  Estado & Utilitários
// ===============================
const STORAGE = {
    user: 'eco_user',
    ranking: 'eco_ranking',
    reports: 'eco_reports'
};

const BADGES_MASTER = [
    { id: 'first', name: 'Primeira Coleta', icon: '🌱', goal: 1, desc: 'Sua 1ª coleta!' },
    { id: 'five', name: 'Mão na Massa', icon: '🧤', goal: 5, desc: '5 coletas registradas.' },
    { id: 'ten', name: 'Herói do Bairro', icon: '🛡️', goal: 10, desc: '10 coletas, orgulho da vizinhança.' },
    { id: 'twenty', name: 'Guardião Verde', icon: '🍃', goal: 20, desc: '20 coletas! Você inspira.' }
];

const API_URL = null; // Se quiser enviar para sua API, defina aqui. Ex.: 'http://localhost:3000/reports'

function uid() { return 'u' + Math.random().toString(36).slice(2, 9); }
function nowISO() { return new Date().toISOString(); }
function toast(msg) {
    const $wrap = $('.toast-wrap');
    const $t = $('<div class="toast"></div>').text(msg);
    $wrap.append($t);
    setTimeout(() => $t.fadeOut(200, () => $t.remove()), 2500);
}

function readLS(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function writeLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function seedRanking() {
    let r = readLS(STORAGE.ranking);
    if (!r || !Array.isArray(r) || r.length === 0) {
        r = [
            { id: uid(), name: 'EcoNinja', avatar: '🐝', points: 420 },
            { id: uid(), name: 'Tartarugo', avatar: '🐢', points: 360 },
            { id: uid(), name: 'Corujito', avatar: '🦉', points: 290 },
            { id: uid(), name: 'SapoZap', avatar: '🐸', points: 250 },
            { id: uid(), name: 'VerdeTech', avatar: '🤖', points: 200 },
            { id: uid(), name: 'Folhinha', avatar: '🌱', points: 180 }
        ];
        writeLS(STORAGE.ranking, r);
    }
    return r;
}

function ensureUserExists() {
    const u = readLS(STORAGE.user);
    return u && u.id ? u : null;
}

function saveUser(u) { writeLS(STORAGE.user, u); }

function upsertRankingForUser(u) {
    const r = readLS(STORAGE.ranking, []);
    const i = r.findIndex(x => x.id === u.id);
    const item = { id: u.id, name: u.name, avatar: u.avatar, points: u.points };
    if (i >= 0) { r[i] = item; } else { r.push(item); }
    r.sort((a, b) => b.points - a.points);
    writeLS(STORAGE.ranking, r);
}

// ===============================
//  Navegação
// ===============================
function showView(sel) {
    $('.view').removeClass('active');
    $(sel).addClass('active');
    $('.tab').removeClass('active');
    $('.tab[data-target="' + sel + '"]').addClass('active');

    if (sel === '#view-ranking') updateRankingUI();
    if (sel === '#view-profile') updateProfileUI();
    if (sel === '#view-map') { ensureMap(); setTimeout(() => map.invalidateSize(), 100); renderReportsOnMap(); }
}

$('#tabbar').on('click', '.tab', function () { showView($(this).data('target')); });

// ===============================
//  Login
// ===============================
$('.avatar-grid').on('click', '.avatar-option', function () {
    $('.avatar-option').removeClass('selected');
    $(this).addClass('selected').find('input').prop('checked', true);
});

$('#btnGuest').on('click', function () {
    const guest = { id: uid(), name: 'Convidado', city: '', avatar: '🌱', xp: 0, level: 1, points: 0, collects: 0, badges: [], missions: 0 };
    saveUser(guest); upsertRankingForUser(guest);
    enterApp();
});

$('#loginForm').on('submit', function (e) {
    e.preventDefault();
    const name = $('#heroName').val().toString().trim();
    const city = $('#heroCity').val().toString().trim();
    const avatar = $('input[name="avatar"]:checked').val();
    if (!name || !avatar) { toast('Preencha seu nome e escolha um avatar 🙂'); return; }
    const user = { id: uid(), name, city, avatar, xp: 0, level: 1, points: 0, collects: 0, badges: [], missions: 0 };
    saveUser(user); upsertRankingForUser(user);
    enterApp();
});

function enterApp() {
    $('#appbar, #tabbar').removeClass('hidden');
    showView('#view-profile');
}

// ===============================
//  Perfil & Gamificação
// ===============================
function computeLevel(xp) { return Math.floor(xp / 100) + 1; }

function checkBadges(u) {
    u.badges = u.badges || [];
    const owned = new Set(u.badges.map(b => b.id));
    let unlocked = [];
    BADGES_MASTER.forEach(b => {
        if (!owned.has(b.id) && u.collects >= b.goal) {
            u.badges.push({ id: b.id, when: nowISO() });
            unlocked.push(b);
        }
    });
    if (unlocked.length) { toast('🏅 Nova insígnia: ' + unlocked.map(x => x.icon + ' ' + x.name).join(', ')); }
}

function updateProfileUI() {
    const u = ensureUserExists(); if (!u) return;
    $('#profileAvatar').text(u.avatar);
    $('#profileName').text(u.name);
    $('#profileLevel').text(computeLevel(u.xp));
    const xpInLevel = u.xp % 100; const pct = Math.min(100, Math.round(xpInLevel));
    $('#xpBar').css('width', pct + '%');
    $('#xpText').text(xpInLevel + ' / 100 XP');
    $('#statCollects').text(u.collects);
    $('#statPoints').text(u.points);
    $('#statMissions').text(u.missions || 0);

    // Badges grid
    const owned = new Set((u.badges || []).map(b => b.id));
    const $grid = $('#badgesGrid').empty();
    BADGES_MASTER.forEach(b => {
        const lock = owned.has(b.id) ? '' : ' locked';
        const when = (u.badges || []).find(x => x.id === b.id)?.when;
        const label = owned.has(b.id) ? `<small>${new Date(when).toLocaleDateString()}</small>` : `<small>${b.goal} coletas</small>`;
        $grid.append(
            `<div class="badge${lock}" title="${b.desc}">
            <div class="icon">${b.icon}</div>
            <div class="name"><strong>${b.name}</strong></div>
            ${label}
          </div>`
        );
    });
}

$('#btnEditProfile').on('click', function () {
    const u = ensureUserExists(); if (!u) return;
    const name = prompt('Qual seu novo nome de herói?', u.name) || u.name;
    u.name = name.slice(0, 18);
    saveUser(u); upsertRankingForUser(u); updateProfileUI(); updateRankingUI();
});

$('#btnLogout').on('click', function () {
    localStorage.removeItem(STORAGE.user);
    toast('Até logo! 👋');
    location.reload();
});

// Registrar coleta (botões top/perfil)
$('#btnRegisterCollect, #btnRegisterCollectTop').on('click', registerCollect);

function registerCollect() {
    const u = ensureUserExists(); if (!u) { toast('Entre primeiro para registrar 😊'); return; }
    const success = (coords) => {
        const report = {
            id: 'r' + uid(),
            userId: u.id,
            name: u.name,
            avatar: u.avatar,
            when: nowISO(),
            lat: coords?.latitude ?? null,
            lng: coords?.longitude ?? null
        };
        const list = readLS(STORAGE.reports, []); list.push(report); writeLS(STORAGE.reports, list);
        addMarkerToLayer(report);
        // Gamificação
        u.collects += 1; u.xp += 20; u.points += 20; u.level = computeLevel(u.xp);
        checkBadges(u); saveUser(u); upsertRankingForUser(u);
        updateProfileUI(); updateRankingUI();
        toast('Coleta registrada! +20 XP ✨');
        // API opcional
        if (API_URL) { sendReportToAPI(report, u); }
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            p => success(p.coords),
            _err => { toast('Sem localização — registrando assim mesmo'); success(null); },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    } else { success(null); }
}

function sendReportToAPI(report, user) {
    $.ajax({
        url: API_URL,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ report, user })
    })
        .done(() => console.log('Enviado para API'))
        .fail((e) => console.warn('Falha ao enviar para API', e));
}

// ===============================
//  Ranking
// ===============================
function updateRankingUI() {
    const r = readLS(STORAGE.ranking, []);
    $('#rankingTotal').text(r.length + ' participantes');
    // Podium (top 3)
    const top3 = r.slice(0, 3);
    const podiumHTML = top3.map((u, idx) => {
        const medal = idx === 0 ? 'gold' : idx === 1 ? 'silver' : 'bronze';
        return `<div class="slot">
          <div class="medal ${medal}">${idx + 1}</div>
          <div class="avatar">${u.avatar}</div>
          <div class="name"><strong>${u.name}</strong></div>
          <div class="points">${u.points} pts</div>
        </div>`;
    }).join('');
    $('#podium').html(podiumHTML);

    // Lista completa
    const listHTML = r.map((u, idx) =>
        `<div class="user-row">
          <div class="rank">#${idx + 1}</div>
          <div class="row" style="gap:10px">
            <div class="avatar">${u.avatar}</div>
            <div class="name">${u.name}</div>
          </div>
          <div class="points">${u.points}</div>
        </div>`
    ).join('');
    $('#rankingList').html(listHTML);
}

// ===============================
//  Mapa (Leaflet)
// ===============================
let map = null; let layer = null;

function ensureMap() {
    if (map) return;
    const fallback = { lat: -25.4284, lng: -49.2733, zoom: 12 }; // Curitiba (fallback)
    map = L.map('map', { zoomControl: true, preferCanvas: true }).setView([fallback.lat, fallback.lng], fallback.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
    layer = L.layerGroup().addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((p) => {
            map.setView([p.coords.latitude, p.coords.longitude], 14);
        });
    }

    // Adicionar marcador manual pelo botão
    $('#btnAddMap').on('click', function () {
        toast('Toque no mapa para escolher o local');
        const once = (e) => {
            const latlng = e.latlng; map.off('click', once);
            addReportAt(latlng.lat, latlng.lng);
        };
        map.once('click', once);
    });
}

function addReportAt(lat, lng) {
    const u = ensureUserExists(); if (!u) { toast('Entre primeiro 🙂'); return; }
    const report = { id: 'r' + uid(), userId: u.id, name: u.name, avatar: u.avatar, when: nowISO(), lat, lng };
    const list = readLS(STORAGE.reports, []); list.push(report); writeLS(STORAGE.reports, list);
    addMarkerToLayer(report); toast('Ponto adicionado no mapa 📍');
}

function addMarkerToLayer(r) {
    if (!layer) return;
    const marker = L.marker([r.lat, r.lng], { title: r.name });
    marker.bindPopup(`<strong>${r.name}</strong> ${r.avatar}<br/><small>${new Date(r.when).toLocaleString()}</small>`);
    marker.addTo(layer);
}

function renderReportsOnMap() {
    const locations = [
        { id: "r1", userId: "u1", name: "EcoNinja",  avatar: "🐝", when: new Date().toISOString(), lat: -25.4494, lng: -49.2711 },
        { id: "r2", userId: "u2", name: "Tartarugo", avatar: "🐢", when: new Date().toISOString(), lat: -25.4222, lng: -49.3256 },
        { id: "r3", userId: "u3", name: "Folhinha",  avatar: "🌱", when: new Date().toISOString(), lat: -25.4111, lng: -49.2232 },
        { id: "r4", userId: "u4", name: "Corujito",  avatar: "🦉", when: new Date().toISOString(), lat: -20.4317, lng: -49.2760 },
        { id: "r5", userId: "u5", name: "VerdeTech", avatar: "🤖", when: new Date().toISOString(), lat: -25.4324, lng: -49.2912 },
        { id: "r6", userId: "u6", name: "SapoZap",   avatar: "🐸", when: new Date().toISOString(), lat: -25.4191, lng: -49.2728 },
        { id: "r7", userId: "u7", name: "Limpinha",  avatar: "🧤", when: new Date().toISOString(), lat: -24.4283, lng: -49.2689 },
        { id: "r8", userId: "u8", name: "EcoGirl",   avatar: "🦸‍♀️", when: new Date().toISOString(), lat: -25.4335, lng: -49.2774 },
        { id: "r9", userId: "u9", name: "RecicLéo",  avatar: "🦁", when: new Date().toISOString(), lat: -25.4040, lng: -49.3018 },
        { id: "r10", userId: "u10", name: "Guardião Verde", avatar: "🍃", when: new Date().toISOString(), lat: -25.4265, lng: -49.2749 },
        { id: "r11", userId: "u11", name: "Folhinha", avatar: "🌱", when: new Date().toISOString(), lat: -25.516837, lng: -49.2731 }
    ];
    if (!layer) return;
    layer.clearLayers();
    const list = readLS(STORAGE.reports, locations);
    list.filter(r => r.lat && r.lng).forEach(addMarkerToLayer);
}

$('#btnLocate').on('click', function () {
    if (!map) { ensureMap(); }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(p => {
            map.flyTo([p.coords.latitude, p.coords.longitude], 15);
        }, _ => toast('Não foi possível obter sua localização'));
    }
});

// ===============================
//  Boot
// ===============================
$(function () {
    seedRanking();
    const u = ensureUserExists();
    if (u) { $('#appbar, #tabbar').removeClass('hidden'); updateProfileUI(); updateRankingUI(); showView('#view-profile'); }
    else { showView('#view-login'); }
});
/*  */