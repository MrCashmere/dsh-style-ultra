/* DeepSeek Harness client module. No external client-side dependencies beyond React. */
window.__ModuleLoader__.load({
  id: 'dsh-style-ultra',
  factory: function (require) {
    var React = require('react');
    var h = React.createElement;
    var KEY = 'dsh-appearance.preferences.v1';
    var DB = 'dsh-appearance';
    var MAX_IMAGE = 20 * 1024 * 1024;
    var defaults = { preset: 'default', accent: '#4d6bfe', background: '#ffffff', foreground: '#202123', customColors: false, font: 'system', codeFont: 'system', codeSize: 13, blur: 12, veil: 65, sidebar: true, motion: 'system', liquidGlass: 'off' };
    var presets = {
      default: null,
      catppuccin: { light: { bg: '#eff1f5', fg: '#4c4f69', accent: '#ea76cb' }, dark: { bg: '#1e1e2e', fg: '#cdd6f4', accent: '#f5c2e7' } },
      ocean: { light: { bg: '#f1f7fb', fg: '#18344a', accent: '#1684b5' }, dark: { bg: '#102333', fg: '#d7eaf4', accent: '#66c7e7' } },
      warm: { light: { bg: '#faf6ef', fg: '#40362f', accent: '#be765d' }, dark: { bg: '#29231f', fg: '#f3e7d9', accent: '#e4aa8e' } }
    };
    var fonts = { system: '', sans: 'Arial, "PingFang SC", sans-serif', serif: 'Georgia, "Songti SC", serif', rounded: '"Arial Rounded MT Bold", "PingFang SC", sans-serif' };
    var codeFonts = { system: '', mono: '"SF Mono", Menlo, Consolas, monospace', jetbrains: '"JetBrains Mono", Menlo, monospace', courier: '"Courier New", monospace' };
    var zh = { nav:'外观', title:'视觉风格', mode:'模式', system:'跟随系统', light:'浅色', dark:'深色', theme:'主题', standard:'默认', accent:'强调色', background:'背景色', foreground:'前景色', custom:'自定义颜色', font:'界面字体', systemFont:'系统默认', loadFonts:'读取系统字体', loadingFonts:'正在读取…', fontHint:'从当前设备读取已安装字体，或手动输入字体家族名称。', localFamilies:'本机字体', fontInput:'字体家族名称', applyFont:'应用', fontLoaded:'已读取 {count} 个字体家族', fontUnsupported:'当前环境不支持读取系统字体；可手动输入字体家族名称。', fontDenied:'无法读取系统字体。请检查浏览器的本地字体权限，也可以手动输入。', fontEmpty:'没有读取到系统字体；可手动输入字体家族名称。', image:'背景图片', upload:'选择图片', replace:'更换图片', remove:'移除图片', imageHint:'图片仅保存在当前浏览器或桌面客户端，不会上传。支持最大 20 MB。', blur:'背景模糊', veil:'背景遮罩', veilHint:'提高遮罩可增强文字可读性。', advanced:'高级', reset:'重置为默认设置', contentSize:'内容字号', codeSize:'代码字号', codeFont:'代码字体', sidebar:'半透明侧边栏', motion:'减少动态效果', on:'开启', off:'关闭', liquidGlass:'Liquid Glass', glassSystem:'跟随系统', glassMax:'超透亮', glassHint:'新建会话、输入框和账号菜单。自动适配深浅色与系统减少透明度设置。', storageError:'保存失败，请检查浏览器存储权限或空间。', imageError:'请选择不超过 20 MB 的图片文件。', persistence:'设置保存在当前浏览器或桌面客户端。' };
    var en = { nav:'Appearance', title:'Visual style', mode:'Mode', system:'System', light:'Light', dark:'Dark', theme:'Theme', standard:'Default', accent:'Accent', background:'Background', foreground:'Foreground', custom:'Custom colors', font:'Interface font', systemFont:'System default', loadFonts:'Load system fonts', loadingFonts:'Loading…', fontHint:'Load fonts installed on this device, or enter a font family name.', localFamilies:'Local fonts', fontInput:'Font family name', applyFont:'Apply', fontLoaded:'Loaded {count} font families', fontUnsupported:'This environment cannot list system fonts; enter a font family name instead.', fontDenied:'Could not read system fonts. Check local font permissions or enter a family name.', fontEmpty:'No system fonts were found; enter a font family name instead.', image:'Background image', upload:'Choose image', replace:'Change image', remove:'Remove image', imageHint:'Images stay in this browser or desktop client and are not uploaded. Maximum 20 MB.', blur:'Background blur', veil:'Background overlay', veilHint:'Increase the overlay to make text easier to read.', advanced:'Advanced', reset:'Reset to defaults', contentSize:'Content size', codeSize:'Code size', codeFont:'Code font', sidebar:'Translucent sidebar', motion:'Reduce motion', on:'On', off:'Off', liquidGlass:'Liquid Glass', glassSystem:'Follow system', glassMax:'Crystal clear', glassHint:'New session, composer and account menu. Adapts to system appearance and reduced transparency.', storageError:'Could not save. Check browser storage permissions and available space.', imageError:'Choose an image no larger than 20 MB.', persistence:'Settings are saved in this browser or desktop client.' };
    function validFamily(value) { return typeof value === 'string' && value.trim().length > 0 && value.length <= 200 && !/[\x00-\x1f\x7f]/.test(value); }
    function validFontPreference(value, builtins) { return Object.prototype.hasOwnProperty.call(builtins, value) || (value.indexOf('local:') === 0 && validFamily(value.slice(6))); }
    function fontValue(value, builtins, fallback) { return value.indexOf('local:') === 0 && validFamily(value.slice(6)) ? JSON.stringify(value.slice(6).trim()) + ', ' + fallback : (builtins[value] || ''); }
    function fontFamilies(faces) {
      var names = new Set();
      for (var face of faces) if (face && validFamily(face.family)) names.add(face.family.trim());
      return Array.from(names).sort(function(a, b) { return a.localeCompare(b, undefined, { sensitivity:'base', numeric:true }); });
    }
    function clean(raw) {
      var p = Object.assign({}, defaults);
      if (!raw || typeof raw !== 'object') return p;
      ['preset','font','codeFont','motion'].forEach(function (k) { if (typeof raw[k] === 'string') p[k] = raw[k]; });
      if (!(p.preset in presets)) p.preset = defaults.preset;
      if (!validFontPreference(p.font, fonts)) p.font = defaults.font;
      if (!validFontPreference(p.codeFont, codeFonts)) p.codeFont = defaults.codeFont;
      if (!['system','on','off'].includes(p.motion)) p.motion = defaults.motion;
      p.liquidGlass = raw.liquidGlass === true ? 'system' : (['off','system','max'].includes(raw.liquidGlass) ? raw.liquidGlass : 'off');
      ['accent','background','foreground'].forEach(function (k) { if (/^#[0-9a-f]{6}$/i.test(raw[k])) p[k] = raw[k]; });
      ['customColors','sidebar'].forEach(function (k) { if (typeof raw[k] === 'boolean') p[k] = raw[k]; });
      [['blur',0,40],['veil',0,95],['codeSize',10,22]].forEach(function (v) { if (typeof raw[v[0]] === 'number' && Number.isFinite(raw[v[0]])) p[v[0]] = Math.max(v[1], Math.min(v[2], Math.round(raw[v[0]]))); });
      return p;
    }
    function readPrefs() { try { return clean(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) { return clean({}); } }
    function openDB() { return new Promise(function (resolve, reject) { var request = indexedDB.open(DB, 1); request.onupgradeneeded = function () { request.result.createObjectStore('assets'); }; request.onsuccess = function () { resolve(request.result); }; request.onerror = function () { reject(request.error); }; request.onblocked = function () { reject(new Error('Database blocked')); }; }); }
    async function imageOperation(mode, value) {
      var db = await openDB();
      try { return await new Promise(function (resolve, reject) {
        var tx = db.transaction('assets', mode === 'get' ? 'readonly' : 'readwrite');
        var store = tx.objectStore('assets'); var result;
        var req = mode === 'get' ? store.get('background') : mode === 'put' ? store.put(value, 'background') : store.delete('background');
        req.onsuccess = function () { result = req.result; };
        tx.oncomplete = function () { resolve(result); };
        tx.onerror = tx.onabort = function () { reject(tx.error || new Error('Storage transaction failed')); };
      }); } finally { db.close(); }
    }
    var CSS = `
      .dsha-page{color:var(--dsw-alias-label-primary);font-size:14px;padding:4px 0 32px;max-width:690px}
      .dsha-page *{box-sizing:border-box}.dsha-page h2{font-size:22px;margin:0 0 20px;font-weight:650}.dsha-page h3{font-size:15px;margin:26px 0 10px}
      .dsha-card{border:1px solid var(--dsw-alias-border-l2);border-radius:17px;padding:0 16px;margin:0 0 14px;background:var(--dsw-alias-bg-layer-2)}
      .dsha-row{display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:60px;padding:12px 0}.dsha-row+.dsha-row{border-top:1px solid var(--dsw-alias-border-l1)}
      .dsha-label{font-weight:600;min-width:100px}.dsha-hint{color:var(--dsw-alias-label-secondary);font-weight:400;font-size:12px;line-height:1.5;margin-top:4px;max-width:340px}
      .dsha-controls{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap}.dsha-page button,.dsha-page select,.dsha-page input[type=number]{font:inherit;color:inherit;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:7px 10px;min-height:34px}
      .dsha-font-entry{display:flex;align-items:center;gap:6px;width:100%}.dsha-font-entry input{min-width:0;flex:1;width:150px;font:inherit;color:inherit;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:7px 10px;min-height:34px}.dsha-page button{cursor:pointer}.dsha-page button:hover{background:var(--dsw-alias-interactive-bg-hover)}.dsha-page button[aria-pressed=true]{border-color:var(--dsha-accent,#4d6bfe);box-shadow:0 0 0 1px var(--dsha-accent,#4d6bfe)}
      .dsha-page button:focus-visible,.dsha-page input:focus-visible,.dsha-page select:focus-visible{outline:2px solid var(--dsha-accent,#4d6bfe);outline-offset:2px}.dsha-page input[type=color]{width:36px;height:34px;padding:2px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;cursor:pointer}.dsha-page input[type=range]{width:150px;accent-color:var(--dsha-accent,#4d6bfe)}.dsha-page input[type=checkbox]{width:18px;height:18px;accent-color:var(--dsha-accent,#4d6bfe)}.dsha-page input[type=number]{width:65px}.dsha-value{min-width:38px;text-align:right;font-variant-numeric:tabular-nums}.dsha-header{display:flex;align-items:center;justify-content:space-between}.dsha-error{color:var(--dsw-alias-state-error-primary);font-size:13px}.dsha-image-name{font-size:12px;color:var(--dsw-alias-label-secondary);max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #dsha-background{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;display:none}body[data-dsha-image] #dsha-background{display:block}#dsha-background-image{position:absolute;inset:-50px;background-position:center;background-size:cover;filter:blur(var(--dsha-blur));}#dsha-background::after{content:'';position:absolute;inset:0;background:var(--dsha-veil-color);opacity:var(--dsha-veil)}
      body[data-dsha-motion=on] *,body[data-dsha-motion=on] *::before,body[data-dsha-motion=on] *::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
      body[data-dsha-font] {--dsw-font-family:var(--dsha-font)}
      body[data-dsha-code-font] {--ds-font-family-code:var(--dsha-code-font);--dsw-font-mono:var(--dsha-code-font);--dsw-font-markdown-code:12px/19px var(--dsha-code-font);--dsw-font-markdown-code-font-family:var(--dsha-code-font);--dsw-font-markdown-code-block:11px/19px var(--dsha-code-font);--dsw-font-markdown-code-block-font-family:var(--dsha-code-font);--dsw-font-markdown-code-block-small:11px/16px var(--dsha-code-font);--dsw-font-markdown-code-block-small-font-family:var(--dsha-code-font)}
      body[data-dsha-code-font] pre,body[data-dsha-code-font] code{font-family:var(--dsha-code-font)!important}
      body[data-dsha-code-size] pre,body[data-dsha-code-size] code{font-size:var(--dsha-code-size)}
      /* Desktop sets data-platform on html; ordinary Web on macOS does not. */
      html[data-platform='darwin'] body[data-dsha-glass] {--dsha-glass-fill:rgb(255 255 255 / .48);--dsha-glass-edge:rgb(255 255 255 / .70);--dsha-glass-shadow:0 8px 26px rgb(25 35 60 / .12),inset 0 1px 0 rgb(255 255 255 / .7)}
      html[data-platform='darwin'] body[data-dsha-glass][data-ds-dark-theme] {--dsha-glass-fill:rgb(42 43 51 / .54);--dsha-glass-edge:rgb(255 255 255 / .18);--dsha-glass-shadow:0 8px 26px rgb(0 0 0 / .24),inset 0 1px 0 rgb(255 255 255 / .12)}
      html[data-platform='darwin'] body[data-dsha-glass='max'] {--dsha-glass-fill:rgb(255 255 255 / .17);--dsha-glass-edge:rgb(255 255 255 / .78);--dsha-glass-shadow:0 10px 30px rgb(25 35 60 / .16),inset 0 1px 1px rgb(255 255 255 / .9),inset 0 -1px 2px rgb(255 255 255 / .35)}
      html[data-platform='darwin'] body[data-dsha-glass='max'][data-ds-dark-theme] {--dsha-glass-fill:rgb(40 43 53 / .22);--dsha-glass-edge:rgb(255 255 255 / .32);--dsha-glass-shadow:0 10px 30px rgb(0 0 0 / .30),inset 0 1px 1px rgb(255 255 255 / .28),inset 0 -1px 2px rgb(255 255 255 / .08)}
      html[data-platform='darwin'] body[data-dsha-glass] :is(button[class*='_newSession'],button[data-signed-out][aria-haspopup='menu'],[data-composer-card]) {background:var(--dsha-glass-fill);border:1px solid var(--dsha-glass-edge);box-shadow:var(--dsha-glass-shadow);backdrop-filter:blur(24px) saturate(175%);-webkit-backdrop-filter:blur(24px) saturate(175%)}
      html[data-platform='darwin'] body[data-dsha-glass] :is(button[class*='_newSession'],button[data-signed-out][aria-haspopup='menu']):hover {background:color-mix(in srgb,var(--dsha-glass-fill),white 18%)}
      html[data-platform='darwin'] body[data-dsha-glass]:has(button[data-signed-out][aria-expanded='true']) > [role='menu'] {--dsw-menu-surface-fill:var(--dsha-glass-fill);--dsw-menu-backdrop-filter:blur(28px) saturate(180%);background:var(--dsha-glass-fill);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);border:1px solid var(--dsha-glass-edge);box-shadow:var(--dsha-glass-shadow)}
      @media (prefers-reduced-transparency:reduce) {html[data-platform='darwin'] body[data-dsha-glass] :is(button[class*='_newSession'],button[data-signed-out][aria-haspopup='menu'],[data-composer-card]) {background:var(--dsw-alias-bg-layer-1);backdrop-filter:none;-webkit-backdrop-filter:none} html[data-platform='darwin'] body[data-dsha-glass]:has(button[data-signed-out][aria-expanded='true']) > [role='menu'] {--dsw-menu-surface-fill:var(--dsw-alias-bg-layer-1);--dsw-menu-backdrop-filter:none;background:var(--dsw-alias-bg-layer-1);backdrop-filter:none;-webkit-backdrop-filter:none}}

      @media(max-width:520px){.dsha-row{align-items:flex-start;flex-direction:column;gap:8px}.dsha-controls{justify-content:flex-start}.dsha-page input[type=range]{width:130px}}
    `;
    function palette(p) {
      if (p.customColors) return { light:{bg:p.background,fg:p.foreground,accent:p.accent}, dark:{bg:p.background,fg:p.foreground,accent:p.accent} };
      return presets[p.preset];
    }
    function createController(ctx) {
      var theme = ctx.get('theme') || ctx.theme, prefs = readPrefs(), blob = null, url = null, disposeTokens = function(){}, listeners = new Set(), disposed = false, request = 0;
      var style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
      var layer = document.createElement('div'); layer.id = 'dsha-background'; layer.setAttribute('aria-hidden','true');
      var photo = document.createElement('div'); photo.id = 'dsha-background-image'; layer.appendChild(photo); document.body.insertBefore(layer, document.body.firstChild);
      var families = [], fontStatus = '';
      var snapshot = { prefs:prefs, hasImage:false, imageName:'', error:'', revision:0, families:families, fontStatus:fontStatus };
      function notify(error) { snapshot = { prefs:prefs, hasImage:!!blob, imageName:blob && blob.name || '', error:error || '', revision:snapshot.revision+1, families:families, fontStatus:fontStatus }; listeners.forEach(function(fn){ fn(); }); }
      function apply() {
        var body = document.body, colors = palette(prefs), overrides = {};
        function pair(name, light, dark) { overrides[name] = { light:light, dark:dark }; }
        if (colors) {
          pair('--dsw-alias-label-primary', colors.light.fg, colors.dark.fg);
          pair('--dsw-alias-link', colors.light.accent, colors.dark.accent);
          pair('--dsw-alias-state-business-primary', colors.light.accent, colors.dark.accent);
          pair('--dsw-alias-brand-primary-new-colorprimary-new-color', colors.light.accent, colors.dark.accent);
          pair('--dsw-alias-bg-base', colors.light.bg, colors.dark.bg);
          pair('--dsw-specific-sidebar-fill', colors.light.bg, colors.dark.bg);
        }
        if (blob) {
          pair('--dsw-alias-bg-base', 'transparent', 'transparent');
          if (prefs.sidebar) pair('--dsw-specific-sidebar-fill', 'transparent', 'transparent');
        }
        var previousTokens = disposeTokens; disposeTokens = theme.overrideTokens('dsh-appearance', overrides); previousTokens();
        var dark = theme.getTheme().active.colorScheme === 'dark';
        var shade = colors ? (dark ? colors.dark.bg : colors.light.bg) : (dark ? '#17181b' : '#ffffff');
        var accent = colors ? (dark ? colors.dark.accent : colors.light.accent) : '#4d6bfe';
        body.style.setProperty('--dsha-veil-color', shade); body.style.setProperty('--dsha-veil', String(prefs.veil / 100)); body.style.setProperty('--dsha-blur', prefs.blur + 'px'); body.style.setProperty('--dsha-accent', accent);
        body.toggleAttribute('data-dsha-image', !!blob);
        if (prefs.liquidGlass !== 'off' && document.documentElement.dataset.platform === 'darwin') body.setAttribute('data-dsha-glass', prefs.liquidGlass); else body.removeAttribute('data-dsha-glass');
        if (prefs.motion === 'on') body.setAttribute('data-dsha-motion','on'); else body.removeAttribute('data-dsha-motion');
        var uiFont = fontValue(prefs.font, fonts, 'sans-serif'), codeFont = fontValue(prefs.codeFont, codeFonts, 'monospace');
        if (uiFont) { body.setAttribute('data-dsha-font',''); body.style.setProperty('--dsha-font',uiFont); } else { body.removeAttribute('data-dsha-font'); body.style.removeProperty('--dsha-font'); }
        if (codeFont) { body.setAttribute('data-dsha-code-font',''); body.style.setProperty('--dsha-code-font',codeFont); } else { body.removeAttribute('data-dsha-code-font'); body.style.removeProperty('--dsha-code-font'); }
        body.setAttribute('data-dsha-code-size',''); body.style.setProperty('--dsha-code-size',prefs.codeSize+'px');
        photo.style.backgroundImage = url ? 'url('+JSON.stringify(url)+')' : '';
      }
      function setImage(blobValue) { if (url) URL.revokeObjectURL(url); blob = blobValue || null; url = blob ? URL.createObjectURL(blob) : null; apply(); notify(); }
      function reloadImage() { var serial = ++request; return imageOperation('get').then(function (value) { if (!disposed && serial === request) setImage(value); }).catch(function () { if (!disposed && serial === request) notify('storageError'); }); }
      var change = function () { /* Presenter owns token projection; update only scheme-sensitive layer colors. */ var c = palette(prefs), dark = theme.getTheme().active.colorScheme === 'dark'; document.body.style.setProperty('--dsha-veil-color', c ? (dark ? c.dark.bg : c.light.bg) : (dark ? '#17181b' : '#ffffff')); document.body.style.setProperty('--dsha-accent', c ? (dark ? c.dark.accent : c.light.accent) : '#4d6bfe'); notify(); };
      var offTheme = ctx.on('theme/change', change);
      var onStorage = function(e) { if (e.key === KEY) { prefs = readPrefs(); apply(); notify(); } };
      window.addEventListener('storage', onStorage);
      var channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel(DB) : null;
      if (channel) channel.onmessage = function() { reloadImage(); };
      apply(); reloadImage();
      return {
        getSnapshot:function(){return snapshot;}, subscribe:function(fn){listeners.add(fn);return function(){listeners.delete(fn);};}, theme:theme,
        loadFonts:function(){
          if (typeof window.queryLocalFonts !== 'function') { fontStatus='fontUnsupported'; notify(); return; }
          fontStatus='loadingFonts'; notify();
          try { window.queryLocalFonts().then(function(faces){ if(disposed)return; families=fontFamilies(faces); fontStatus=families.length ? 'fontLoaded' : 'fontEmpty'; notify(); }).catch(function(){if(!disposed){fontStatus='fontDenied';notify();}}); }
          catch (_) { fontStatus='fontDenied'; notify(); }
        },
        update:function(patch){ var next = clean(Object.assign({},prefs,patch)); try { localStorage.setItem(KEY,JSON.stringify(next)); } catch (_) { notify('storageError'); return; } prefs = next; apply(); notify(); },
        image:async function(file){ if (!file || !/^image\/(png|jpeg|gif|webp|avif|bmp)$/i.test(file.type) || file.size > MAX_IMAGE) { notify('imageError'); return; } try { ++request; await imageOperation('put',file); if (!disposed) { setImage(file); if(channel) channel.postMessage('image'); } } catch (_) { if(!disposed) notify('storageError'); } },
        remove:async function(){ try { ++request; await imageOperation('delete'); if (!disposed) { setImage(null); if(channel) channel.postMessage('image'); } } catch (_) { if(!disposed) notify('storageError'); } },
        reset:async function(){ try { ++request; await imageOperation('delete'); localStorage.removeItem(KEY); prefs=clean({}); theme.setTheme('system'); theme.setFontSize(14); if (!disposed) { setImage(null); if(channel) channel.postMessage('image'); } } catch (_) { if(!disposed) notify('storageError'); } },
        dispose:function(){ disposed=true; ++request; if (typeof offTheme === 'function') offTheme(); window.removeEventListener('storage',onStorage); if(channel)channel.close(); disposeTokens(); if(url) URL.revokeObjectURL(url); layer.remove(); style.remove(); ['data-dsha-image','data-dsha-glass','data-dsha-motion','data-dsha-font','data-dsha-code-font','data-dsha-code-size'].forEach(function(k){document.body.removeAttribute(k);}); ['--dsha-veil-color','--dsha-veil','--dsha-blur','--dsha-accent','--dsha-font','--dsha-code-font','--dsha-code-size'].forEach(function(k){document.body.style.removeProperty(k);}); }
      };
    }
    function FontPicker(props) {
      var t=props.t, key=props.field, value=props.value, builtins=props.builtins;
      var current=value.indexOf('local:')===0 ? value.slice(6) : '';
      var draftState=React.useState(current), draft=draftState[0], setDraft=draftState[1];
      React.useEffect(function(){ setDraft(current); }, [current]);
      var choices=props.families;
      if (current && choices.indexOf(current)<0) choices=[current].concat(choices);
      function choose(e) { var v=e.target.value; props.update(key,v); }
      function submit() { var name=draft.trim(); if (validFamily(name)) props.update(key,'local:'+name); }
      return h(React.Fragment,null,
        h('select',{'aria-label':t(key),value:value,onChange:choose},
          h('option',{value:'system'},t('systemFont')),
          builtins.map(function(o){return h('option',{key:o[0],value:o[0]},o[1]);}),
          choices.length ? h('optgroup',{label:t('localFamilies')},choices.map(function(name){return h('option',{key:name,value:'local:'+name},name);})) : null),
        h('div',{className:'dsha-font-entry'},h('input',{type:'text',value:draft,list:'dsha-font-list','aria-label':t('fontInput')+' — '+t(key),placeholder:t('fontInput'),maxLength:200,onChange:function(e){setDraft(e.target.value);},onKeyDown:function(e){if(e.key==='Enter'){e.preventDefault();submit();}}}),
          h('button',{type:'button',disabled:!validFamily(draft.trim()),onClick:submit},t('applyFont'))));
    }
    function Page(props) {
      var c=props.controller, t=props.t, s=React.useSyncExternalStore(c.subscribe,c.getSnapshot,c.getSnapshot), p=s.prefs;
      var theme=c.theme.getTheme();
      var families=s.families, fontStatus=s.fontStatus;
      function loadFonts() { c.loadFonts(); }
      function fontStatusText() { return fontStatus === 'fontLoaded' ? t(fontStatus).replace('{count}',String(families.length)) : (fontStatus ? t(fontStatus) : t('fontHint')); }

      function update(key,value){var patch={};patch[key]=value;c.update(patch);}
      function row(key, label, control, hint){return h('div',{className:'dsha-row',key:key},h('div',{className:'dsha-label'},label,hint?h('div',{className:'dsha-hint'},hint):null),h('div',{className:'dsha-controls'},control));}
      function select(key,value,options){return h('select',{'aria-label':t(key),value:value,onChange:function(e){update(key,e.target.value);}},options.map(function(o){return h('option',{key:o[0],value:o[0]},o[1]);}));}
      function color(key){var active=palette(p), selected=active && active[theme.active.colorScheme], value=selected ? selected[key === 'background' ? 'bg' : key === 'foreground' ? 'fg' : 'accent'] : p[key]; return h(React.Fragment,null,h('input',{type:'color','aria-label':t(key),value:value,onChange:function(e){var patch=selected ? {customColors:true,accent:selected.accent,background:selected.bg,foreground:selected.fg} : {customColors:true};patch[key]=e.target.value;c.update(patch);}}),h('span',{className:'dsha-value'},value.toUpperCase()));}
      function range(key,max,suffix){return h(React.Fragment,null,h('input',{type:'range','aria-label':t(key),min:0,max:max,value:p[key],onChange:function(e){update(key,Number(e.target.value));}}),h('span',{className:'dsha-value'},p[key]+suffix));}
      function toggle(key){return h('input',{type:'checkbox','aria-label':t(key === 'customColors' ? 'custom' : key),checked:p[key],onChange:function(e){if(key === 'customColors' && e.target.checked && palette(p)) { var colors = palette(p)[theme.active.colorScheme]; c.update({customColors:true,accent:colors.accent,background:colors.bg,foreground:colors.fg}); } else update(key,e.target.checked);}});}
      var file=React.useRef(null);
      return h('div',{className:'dsha-page'},
        h('h2',null,t('title')),
        h('div',{className:'dsha-card'},row('mode',t('mode'),['system','light','dark'].map(function(m){return h('button',{type:'button',key:m,'aria-pressed':theme.preference===m,onClick:function(){c.theme.setTheme(m);}},t(m));}))),
        h('div',{className:'dsha-card'},
          row('preset',t('theme'),h('select',{'aria-label':t('theme'),value:p.preset,onChange:function(e){c.update({preset:e.target.value,customColors:false});}},[['default',t('standard')],['catppuccin','Catppuccin'],['ocean','Ocean'],['warm','Warm']].map(function(o){return h('option',{key:o[0],value:o[0]},o[1]);}))),
          row('customColors',t('custom'),toggle('customColors')),
          row('accent',t('accent'),color('accent')),row('background',t('background'),color('background')),row('foreground',t('foreground'),color('foreground')),
          row('fonts',t('loadFonts'),h('button',{type:'button',disabled:fontStatus==='loadingFonts',onClick:loadFonts},t(fontStatus==='loadingFonts'?'loadingFonts':'loadFonts')),fontStatusText()),
          row('font',t('font'),h(FontPicker,{field:'font',value:p.font,builtins:[['sans','Sans'],['serif','Serif'],['rounded','Rounded']],families:families,t:t,update:update}))),
        h('datalist',{id:'dsha-font-list'},families.map(function(name){return h('option',{key:name,value:name});})),
        h('h3',null,t('image')),
        h('div',{className:'dsha-card'},
          row('image',t('image'),h(React.Fragment,null,s.imageName?h('span',{className:'dsha-image-name',title:s.imageName},s.imageName):null,h('input',{type:'file',accept:'image/png,image/jpeg,image/gif,image/webp,image/avif,image/bmp',ref:file,style:{display:'none'},onChange:function(e){var f=e.target.files&&e.target.files[0];if(f)void c.image(f);e.target.value='';}}),h('button',{type:'button',onClick:function(){file.current.click();}},t(s.hasImage?'replace':'upload')),s.hasImage?h('button',{type:'button',onClick:function(){void c.remove();}},t('remove')):null),t('imageHint')),
          row('blur',t('blur'),range('blur',40,' px')),row('veil',t('veil'),range('veil',95,'%'),t('veilHint'))),
        h('div',{className:'dsha-header'},h('h3',null,t('advanced')),h('button',{type:'button',onClick:function(){void c.reset();}},t('reset'))),
        h('div',{className:'dsha-card'},
          row('contentSize',t('contentSize'),h(React.Fragment,null,h('input',{type:'number','aria-label':t('contentSize'),min:10,max:22,step:1,value:theme.fontSize,onChange:function(e){var n=Number(e.target.value);if(Number.isInteger(n)&&n>=10&&n<=22)c.theme.setFontSize(n);}}),'px')),
          row('codeSize',t('codeSize'),h(React.Fragment,null,h('input',{type:'number','aria-label':t('codeSize'),min:10,max:22,step:1,value:p.codeSize,onChange:function(e){var n=Number(e.target.value);if(Number.isInteger(n)&&n>=10&&n<=22)update('codeSize',n);}}),'px')),
          row('codeFont',t('codeFont'),h(React.Fragment,null,h(FontPicker,{field:'codeFont',value:p.codeFont,builtins:[['mono','System Mono'],['jetbrains','JetBrains Mono'],['courier','Courier New']],families:families,t:t,update:update}),h('button',{type:'button',disabled:fontStatus==='loadingFonts',onClick:loadFonts},t(fontStatus==='loadingFonts'?'loadingFonts':'loadFonts'))),fontStatusText()),
          row('sidebar',t('sidebar'),toggle('sidebar')),
          row('motion',t('motion'),select('motion',p.motion,[['system',t('system')],['on',t('on')],['off',t('off')]]))),
        s.error?h('p',{className:'dsha-error',role:'alert'},t(s.error)):null,h('p',{className:'dsha-hint'},t('persistence')),
        document.documentElement.dataset.platform === 'darwin' ? h('div',{className:'dsha-card'},row('liquidGlass',t('liquidGlass'),select('liquidGlass',p.liquidGlass,[['off',t('off')],['system',t('glassSystem')],['max',t('glassMax')]]),t('glassHint'))) : null
      );
    }
    var inject=['slots','locale','theme'];
    function apply(ctx){
      var locale=ctx.get('locale')||ctx.locale, slots=ctx.get('slots')||ctx.slots;
      ctx.effect(function(){return locale.register('dsh-appearance',{zh:zh,en:en});},'dsh-appearance: locale');
      var t=locale.bind('dsh-appearance');
      ctx.effect(function(){
        var controller=createController(ctx);
        var stop=slots.inject('settings.section',function(){return slots.register({name:'settings.section',id:'dsh-appearance',order:5,label:function(){return t('nav');},locale:'dsh-appearance'},function(props){return h(Page,{controller:controller,t:props.t||t});});});
        return function(){if(typeof stop==='function')stop();controller.dispose();};
      },'dsh-appearance: settings and appearance');
    }
    return {name:'dsh-style-ultra',inject:inject,apply:apply,_test:{clean:clean,palette:palette,fontFamilies:fontFamilies,fontValue:fontValue,validFamily:validFamily,createController:createController}};
  }
});
