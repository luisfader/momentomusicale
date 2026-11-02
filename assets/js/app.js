(function () {
  const list = window.CANZONI || [];
  const $ = (id) => document.getElementById(id);
  const audio = $("audio");
  let current = -1;

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ":" + String(r).padStart(2, "0");
  };
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Elenco tracce
  $("tracks").innerHTML = list.map((c, i) => `
    <li class="track" data-i="${i}">
      <button class="tplay" type="button" aria-label="Riproduci ${esc(c.titolo)}">▶</button>
      <div class="tmeta">
        <span class="ttitle">${esc(c.titolo)}</span>
        <span class="tscene">${esc(c.scena)} · <span class="tchap">${esc(c.capitolo)}</span></span>
        <span class="tnote">${esc(c.nota)}</span>
      </div>
      <span class="tdur">${esc(c.durata || "")}</span>
    </li>`).join("");

  // Testi (Markdown semplice: righe e strofe)
  async function showLyrics(i) {
    const c = list[i];
    $("lyrics").hidden = false;
    $("lyricsTitle").textContent = c.titolo;
    $("lyricsScene").textContent = c.scena + " · voce: " + c.voce;
    let html = '<p class="muted">Testo in arrivo.</p>';
    try {
      const r = await fetch("testi/" + c.id + ".md");
      if (r.ok) {
        const txt = (await r.text())
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/^#.*$/m, "")
          .trim();
        if (txt) {
          html = txt.split(/\n\s*\n/).map((st) => {
            const lines = st.split("\n").map((l) => esc(l.trim()));
            const m = lines[0].match(/^\[(.+)\]$/);
            const label = m ? lines.shift() && m[1] : "";
            const isChorus = /^rit/i.test(label);
            return `<p class="${isChorus ? "chorus" : ""}">${label ? `<span class="label">${label}</span>` : ""}${lines.join("<br>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>")}</p>`;
          }).join("");
        }
      }
    } catch (e) { /* aperto da file:// */ }
    $("lyricsBody").innerHTML = html;
  }

  function play(i) {
    if (i < 0 || i >= list.length) return;
    if (i !== current) {
      current = i;
      audio.src = "audio/" + list[i].id + ".mp3";
      showLyrics(i);
    }
    audio.play();
    $("player").hidden = false;
    $("nowTitle").textContent = list[i].titolo;
  }

  function sync() {
    const playing = !audio.paused;
    document.body.classList.toggle("is-playing", playing);
    $("toggle").textContent = playing ? "⏸" : "▶";
    document.querySelectorAll(".track").forEach((el) => {
      const on = Number(el.dataset.i) === current;
      el.classList.toggle("active", on);
      el.querySelector(".tplay").textContent = on && playing ? "⏸" : "▶";
    });
  }

  $("tracks").addEventListener("click", (e) => {
    const li = e.target.closest(".track");
    if (!li) return;
    const i = Number(li.dataset.i);
    if (i === current && !audio.paused) audio.pause(); else play(i);
  });
  $("playAll").addEventListener("click", () => play(0));
  $("toggle").addEventListener("click", () => (audio.paused ? play(current < 0 ? 0 : current) : audio.pause()));
  $("prev").addEventListener("click", () => (audio.currentTime > 3 ? (audio.currentTime = 0) : play(Math.max(0, current - 1))));
  $("next").addEventListener("click", () => play(current + 1));

  audio.addEventListener("play", sync);
  audio.addEventListener("pause", sync);
  audio.addEventListener("ended", () => (current + 1 < list.length ? play(current + 1) : sync()));
  audio.addEventListener("timeupdate", () => {
    $("time").textContent = fmt(audio.currentTime);
    if (audio.duration) $("seek").value = (audio.currentTime / audio.duration) * 100;
  });
  $("seek").addEventListener("input", (e) => {
    if (audio.duration) audio.currentTime = (e.target.value / 100) * audio.duration;
  });
})();
