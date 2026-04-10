(function() {
  if (document.getElementById('boss-key-container')) return;

  const container = document.createElement('div');
  container.id = 'boss-key-container';
  container.style.cssText = "position: fixed; top: 10px; right: 10px; z-index: 2147483647; font-family: 'Comic Sans MS', cursive, sans-serif;";
  
  container.innerHTML = `
    <div id="boss-key-icon" style="cursor: pointer; font-size: 18px; background: rgba(0,0,0,0.3); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white;">⚙️</div>
    <div id="boss-key-menu" style="display: none; margin-top: 5px; background: rgba(255,255,255,0.92); backdrop-filter: blur(4px); padding: 10px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); border: 2px solid #ff5fa2; width: 170px;">
      <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px; color: #111; text-align: center;">Panic Settings</div>
      <input type="text" id="boss-url" placeholder="Redirect URL..." style="width: 100% !important; box-sizing: border-box !important; padding: 6px !important; font-size: 11px !important; margin-bottom: 8px !important; border: 2px dashed #999 !important; border-radius: 8px !important; outline: none !important; color: #111 !important;" autocomplete="off">
      <button id="boss-key-btn" style="width: 100% !important; box-sizing: border-box !important; padding: 6px !important; font-size: 11px !important; border: 2px solid #555 !important; border-radius: 8px !important; cursor: pointer !important; background: #f0f0f0 !important; color: #111 !important; transform: none !important; box-shadow: none !important; margin: 0 !important;">Set Key: None</button>
    </div>
  `;

  document.body.appendChild(container);

  const bossKeyIcon = document.getElementById('boss-key-icon');
  const bossKeyMenu = document.getElementById('boss-key-menu');
  const bossUrlInput = document.getElementById('boss-url');
  const bossKeyBtn = document.getElementById('boss-key-btn');

  let bossKey = localStorage.getItem('bossKey') || '';
  let bossUrl = localStorage.getItem('bossUrl') || 'https://classroom.google.com';

  if (bossKey) bossKeyBtn.textContent = `Key: ${bossKey === ' ' ? 'Space' : bossKey}`;
  bossUrlInput.value = bossUrl;

  bossKeyIcon.addEventListener('click', () => {
    bossKeyMenu.style.display = bossKeyMenu.style.display === 'none' ? 'block' : 'none';
  });

  bossUrlInput.addEventListener('input', (e) => {
    bossUrl = e.target.value.trim();
    localStorage.setItem('bossUrl', bossUrl);
  });

  let waitingForKey = false;
  bossKeyBtn.addEventListener('click', () => {
    waitingForKey = true;
    bossKeyBtn.textContent = 'Press any key...';
    bossKeyBtn.style.color = '#ff5fa2';
    bossKeyBtn.style.borderColor = '#ff5fa2';
  });

  window.addEventListener('keydown', (e) => {
    if (waitingForKey) {
      bossKey = e.key;
      localStorage.setItem('bossKey', bossKey);
      bossKeyBtn.textContent = `Key: ${bossKey === ' ' ? 'Space' : bossKey}`;
      bossKeyBtn.style.color = '#111';
      bossKeyBtn.style.borderColor = '#555';
      waitingForKey = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA') && ae !== bossUrlInput) {
       // Inputting text somewhere else, ignore panic key to not disrupt typing
    } else {
       if (bossKey && e.key === bossKey && e.target !== bossUrlInput) {
         let finalUrl = bossUrl;
         if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
           finalUrl = 'https://' + finalUrl;
         }
         window.location.href = finalUrl;
       }
    }
  }, true);
})();
