// PROTOTYPE (nemchik/nemchik#387): throwaway theme switcher. Not production code.
// Serves each candidate's built site on 127.0.0.1 and a switcher page that frames them.
// Run: npm run prototype   (from prototype-themes/), then open http://127.0.0.1:4320/
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';

const HOST = '127.0.0.1';
const variants = [
  { key: 'A', name: 'AstroWind', dir: 'a-astrowind', port: 4321 },
  { key: 'B', name: 'Dante', dir: 'b-dante', port: 4322 },
  { key: 'C', name: 'AstroPaper', dir: 'c-astropaper', port: 4323 },
];

for (const v of variants) {
  const opts = { cwd: v.dir, stdio: 'inherit', shell: true };
  if (!existsSync(`${v.dir}/node_modules`)) spawnSync('npm', ['install', '--no-audit', '--no-fund'], opts);
  if (!existsSync(`${v.dir}/dist`)) spawnSync('npx', ['astro', 'build'], opts);
  spawn('npx', ['astro', 'preview', '--host', HOST, '--port', String(v.port)], opts);
}

const page = `<!doctype html><meta charset="utf-8"><title>Theme prototype</title>
<style>
  html,body{margin:0;height:100%;background:#111}
  iframe{border:0;width:100%;height:100%;display:block}
  #bar{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:12px;align-items:center;
       background:#ff0;color:#000;font:600 14px system-ui;padding:8px 14px;border-radius:999px;box-shadow:0 4px 16px #0008;z-index:9}
  #bar button{all:unset;cursor:pointer;padding:0 6px;font-size:18px}
</style>
<iframe id="f"></iframe>
<div id="bar"><button id="prev">&larr;</button><span id="label"></span><button id="next">&rarr;</button></div>
<script>
  const variants = ${JSON.stringify(variants)};
  const f = document.getElementById('f'), label = document.getElementById('label');
  function show(key) {
    const i = Math.max(0, variants.findIndex(v => v.key === key)), v = variants[i];
    f.src = 'http://${HOST}:' + v.port + '/';
    label.textContent = v.key + ' (' + v.name + ')';
    history.replaceState(null, '', '?variant=' + v.key);
    return i;
  }
  let i = show(new URLSearchParams(location.search).get('variant') ?? 'A');
  const step = d => { i = (i + d + variants.length) % variants.length; show(variants[i].key); };
  document.getElementById('prev').onclick = () => step(-1);
  document.getElementById('next').onclick = () => step(1);
  addEventListener('keydown', e => {
    if (e.target.closest?.('input,textarea,[contenteditable]')) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
</script>`;

createServer((_, res) => res.writeHead(200, { 'content-type': 'text/html' }).end(page)).listen(4320, HOST, () =>
  console.log(`\nSwitcher: http://${HOST}:4320/?variant=A  (B = Dante, C = AstroPaper; arrow keys cycle)\n`),
);
