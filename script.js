import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBqmTTuImI3XryQ9D2X-eJ1yNrFfKtwvpM",
  authDomain: "cleangrow-8b552.firebaseapp.com",
  databaseURL: "https://cleangrow-8b552-default-rtdb.firebaseio.com",
  projectId: "cleangrow-8b552",
  storageBucket: "cleangrow-8b552.firebasestorage.app",
  messagingSenderId: "823736787199",
  appId: "1:823736787199:web:26c85a9bf702422e186cca"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =======================
// Função para atualizar textos
// =======================

function monitorar(caminho, elementoId, sufixo = "") {

    const elemento = document.getElementById(elementoId);

    if (!elemento) return;

    onValue(ref(db, caminho), (snapshot) => {

        const valor = snapshot.val();

        elemento.textContent =
            valor !== null
            ? valor + sufixo
            : "--";

    });
}

// =======================
// Ambiente
// =======================

monitorar("amb_temp", "amb_temp", "°C");
monitorar("amb_umid", "amb_umid", "%");

onValue(ref(db, "amb_chuva"), (snapshot) => {

    const el = document.getElementById("amb_chuva");

    if (!el) return;

    el.textContent =
        snapshot.val() == 1
        ? "🌧 Chovendo"
        : "☀ Sem chuva";
});

// =======================
// Composteira
// =======================

monitorar("comp_temp", "comp_temp", "°C");
monitorar("comp_umid", "comp_umid", "%");
monitorar("comp_gas", "comp_gas");

// =======================
// Minhocário
// =======================

monitorar("minh_temp", "minh_temp", "°C");
monitorar("minh_umid", "minh_umid", "%");
monitorar("minh_gas", "minh_gas");

// =======================
// Reservatório
// =======================

onValue(ref(db, "res_nivel"), (snapshot) => {

    const nivel = snapshot.val() || 0;

    const texto =
        document.getElementById("res_nivel");

    const barra =
        document.getElementById("nivelBar");

    if (texto)
        texto.textContent = nivel + "%";

    if (barra)
        barra.style.width = nivel + "%";
});

// =======================
// Sistema
// =======================

onValue(ref(db, "stat_irrig"), (snapshot) => {

    const el =
        document.getElementById("stat_irrig");

    if (!el) return;

    el.textContent =
        snapshot.val() == 1
        ? "🟢 Ligada"
        : "🔴 Desligada";
});

onValue(ref(db, "stat_valv"), (snapshot) => {

    const el =
        document.getElementById("stat_valv");

    if (!el) return;

    el.textContent =
        snapshot.val() == 1
        ? "🟢 Aberta"
        : "🔴 Fechada";
});

// =======================
// Botão Irrigar Agora
// =======================

const btn = document.getElementById("btnIrrigar");

if (btn) {

    btn.addEventListener("click", async () => {

        await set(
            ref(db, "cmd_irrig"),
            1
        );

        alert("Irrigação iniciada!");
    });

}
