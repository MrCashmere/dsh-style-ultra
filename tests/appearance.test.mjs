import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8');
function load() {
  let module;
  const sandbox = { window: { __ModuleLoader__: { load(spec) { module = spec.factory(() => ({})); } } }, console };
  vm.runInNewContext(source, sandbox);
  return module;
}

test('registers as the DSH web client and depends on the theme and settings services', () => {
  const mod = load();
  assert.equal(mod.name, 'dsh-style-ultra');
  assert.deepEqual(Array.from(mod.inject), ['slots', 'locale', 'theme']);
  assert.equal(typeof mod.apply, 'function');
});

test('validates persisted settings and clamps numerical controls', () => {
  const { clean } = load()._test;
  const result = clean({ preset:'unknown', font:'unknown', accent:'red', background:'#AABBCC', blur:999, veil:-2, codeSize:14.8, pointer:true, liquidGlass:true, customColors:'true' });
  assert.equal(result.preset, 'default');
  assert.equal(result.font, 'system');
  assert.equal(result.accent, '#4d6bfe');
  assert.equal(result.background, '#AABBCC');
  assert.equal(result.blur, 40);
  assert.equal(result.veil, 0);
  assert.equal(result.codeSize, 15);
  assert.equal(result.pointer, undefined);
  assert.equal(result.liquidGlass, 'system');
  assert.equal(result.customColors, false);
});

test('presets resolve colors for each mode and custom colors replace them', () => {
  const { clean, palette } = load()._test;
  const preset = palette(clean({ preset:'catppuccin' }));
  assert.equal(preset.light.bg, '#eff1f5');
  assert.equal(preset.dark.bg, '#1e1e2e');
  const custom = palette(clean({ preset:'catppuccin', customColors:true, background:'#123456', foreground:'#abcdef', accent:'#445566' }));
  assert.equal(custom.light.bg, '#123456');
  assert.equal(custom.dark.fg, '#abcdef');
  assert.equal(custom.dark.accent, '#445566');
  assert.equal(palette(clean({})), null);
});

test('system font families are deduplicated, sorted, and reject invalid names', () => {
  const { fontFamilies } = load()._test;
  const families = fontFamilies([{family:' Zeta '}, {family:'Arial'}, {family:'Arial'}, {family:'\ninvalid'}, {family:''}, null]);
  assert.deepEqual(Array.from(families), ['Arial', 'Zeta']);
});

test('selected local fonts survive settings validation and are escaped for CSS', () => {
  const { clean, fontValue } = load()._test;
  const prefs = clean({font:'local:Google Sans Flex', codeFont:'local:Menlo'});
  assert.equal(prefs.font, 'local:Google Sans Flex');
  assert.equal(prefs.codeFont, 'local:Menlo');
  assert.equal(fontValue(prefs.font, {}, 'sans-serif'), '"Google Sans Flex", sans-serif');
  assert.equal(fontValue('local:Font "Name"', {}, 'monospace'), '"Font \\"Name\\"", monospace');
  assert.equal(clean({font:'local:\ninvalid'}).font, 'system');
  assert.equal(clean({font:'local:'}).font, 'system');
});

function controllerHarness(platform = 'darwin', queryLocalFonts = () => Promise.resolve([{family:'Menlo'}, {family:'PingFang SC'}, {family:'Menlo'}])) {
  let mod;
  const elements = [];
  const element = () => {
    const attrs = new Map(), props = new Map();
    const el = { attrs, children: [], style: { setProperty(k,v){props.set(k,v)}, removeProperty(k){props.delete(k)}, getPropertyValue(k){return props.get(k) || ''} },
      setAttribute(k,v){attrs.set(k,v)}, removeAttribute(k){attrs.delete(k)}, toggleAttribute(k,on){if(on)attrs.set(k,'');else attrs.delete(k)},
      appendChild(child){this.children.push(child)}, insertBefore(child){this.children.unshift(child)}, remove(){this.removed=true} };
    elements.push(el); return el;
  };
  const document = { body:element(), head:element(), documentElement:{dataset:{platform}}, createElement:element };
  const storage = new Map();
  const listeners = new Map();
  const window = { __ModuleLoader__:{load(spec){mod=spec.factory(() => ({}))}}, queryLocalFonts,
    addEventListener(k,fn){listeners.set(k,fn)}, removeEventListener(k){listeners.delete(k)} };
  const localStorage = { getItem:k=>storage.get(k) || null, setItem:(k,v)=>storage.set(k,v), removeItem:k=>storage.delete(k) };
  const indexedDB = {open(){const r={};queueMicrotask(()=>r.onerror?.());return r}};
  const sandbox = {window, document, localStorage, indexedDB, console, URL, queueMicrotask};
  vm.runInNewContext(source, sandbox);
  const theme = { getTheme:()=>({active:{colorScheme:'light'}}), overrideTokens:()=>()=>{}, setTheme(){}, setFontSize(){} };
  const ctx = { get:()=>theme, on:()=>()=>{} };
  return { controller:mod._test.createController(ctx), document, storage };
}

test('font list remains available across preference changes and code font is applied', async () => {
  const {controller, document} = controllerHarness();
  controller.loadFonts();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(controller.getSnapshot().fontStatus, 'fontLoaded');
  assert.deepEqual(Array.from(controller.getSnapshot().families), ['Menlo','PingFang SC']);
  controller.update({codeFont:'local:Menlo'});
  assert.deepEqual(Array.from(controller.getSnapshot().families), ['Menlo','PingFang SC']);
  assert.equal(document.body.style.getPropertyValue('--dsha-code-font'), '"Menlo", monospace');
  assert.equal(document.body.attrs.has('data-dsha-code-font'), true);
  controller.dispose();
  assert.equal(document.body.attrs.has('data-dsha-code-font'), false);
});

test('glass preference only activates on macOS desktop and is removed on disposal', () => {
  const mac = controllerHarness('darwin');
  mac.controller.update({liquidGlass:true});
  assert.equal(mac.document.body.attrs.get('data-dsha-glass'),'system');
  mac.controller.update({liquidGlass:'max'});
  assert.equal(mac.document.body.attrs.get('data-dsha-glass'),'max');
  mac.controller.update({liquidGlass:'off'});
  assert.equal(mac.document.body.attrs.has('data-dsha-glass'),false);
  mac.controller.update({liquidGlass:'max'});
  mac.controller.dispose();
  assert.equal(mac.document.body.attrs.has('data-dsha-glass'),false);
  const web = controllerHarness('web');
  web.controller.update({liquidGlass:true});
  assert.equal(web.document.body.attrs.has('data-dsha-glass'),false);
  web.controller.dispose();
});
