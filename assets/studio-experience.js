(() => {
  const byId = id => document.getElementById(id);
  const tabs = [...document.querySelectorAll('[data-workspace]')];
  if (!tabs.length) return;
  const views = {
    email: {
      name: 'Business inbox', title: 'An inquiry comes in.',
      copy: 'Sam wants a website for a second location. Capture the request without losing the context in the inbox.', data: 'Sam · New website · Second location',
      html: `<div class="inbox-demo"><div class="inbox-folders" aria-hidden="true"><strong>Mail</strong><span class="is-current">Inbox <small>1</small></span><span>Projects</span><span>Follow-up</span><span>Sent</span></div><div class="inbox-reading"><div class="inbox-search">Project inquiries / New conversation</div><div class="inbox-message"><small>NEW PROJECT INQUIRY</small><h4>A website for our second location</h4><div class="mail-person"><span class="mail-avatar" aria-hidden="true">S</span><div>Sam<small>To: your business · Example email</small></div></div><p>Hi, we’re opening a second location and need a new website. We’re still deciding on a launch date and would like to understand the options.</p><p>Where should we start?<br>Sam</p><div class="workspace-note">Useful context: a new location, a website need, and an open question about timing.</div></div></div></div>`
    },
    sheet: {
      name: 'Shared lead tracker', title: 'The details get a home.',
      copy: 'The inquiry becomes a structured row. Your team can work with the spreadsheet they know, with fewer details to retype.', data: 'Contact → Sam / Need → Website / Stage → Review',
      html: `<div class="sheet-demo"><div class="sheet-heading"><span>New business · Inquiry tracker</span><small>One sample record</small></div><div class="sheet-formula"><span>A2</span><span>ƒx &nbsp; Sam</span></div><div class="sheet-scroll" tabindex="0" role="region" aria-label="Sample spreadsheet, scroll horizontally to see all columns"><table class="sheet-table"><caption class="sr-only">Sam’s inquiry, organised as a lead row</caption><thead><tr><th scope="col"></th><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th><th scope="col">D</th></tr></thead><tbody><tr class="sheet-head"><th scope="row">1</th><td>Contact</td><td>Project</td><td>Stage</td><td>Next step</td></tr><tr class="sheet-active"><th scope="row">2</th><td>Sam</td><td>Second-location website</td><td>Owner review</td><td>Clarify date &amp; budget</td></tr><tr aria-hidden="true"><th>3</th><td>&nbsp;</td><td></td><td></td><td></td></tr><tr aria-hidden="true"><th>4</th><td>&nbsp;</td><td></td><td></td><td></td></tr><tr aria-hidden="true"><th>5</th><td>&nbsp;</td><td></td><td></td><td></td></tr></tbody></table></div><span class="sheet-tab">Inquiries</span></div>`
    },
    crm: {
      name: 'Customer workspace', title: 'The conversation stays attached.',
      copy: 'A useful customer record brings the source, request and next action together. The team has context before following up.', data: 'Original inquiry + project need + owner review',
      html: `<div class="crm-demo"><div class="workspace-breadcrumb">Customers / New inquiries / Sam</div><div class="crm-profile"><span class="mail-avatar" aria-hidden="true">S</span><div><h4>Sam</h4><p>Second-location website</p></div><span class="workspace-pill">Owner review</span></div><dl class="crm-properties"><div><dt>Source</dt><dd>Project inquiry</dd></div><div><dt>Interest</dt><dd>Website &amp; digital presence</dd></div><div><dt>Launch date</dt><dd>To be discussed</dd></div><div><dt>Budget</dt><dd>To be clarified</dd></div></dl><div class="workspace-note">Next step: review the request, clarify timing and budget, then discuss a discovery conversation.</div><div class="crm-foot"><span aria-hidden="true">↳</span> Original inquiry linked to this record</div></div>`
    },
    notes: {
      name: 'Team knowledge & notes', title: 'The team starts informed.',
      copy: 'A readable brief puts the important details in front of the people doing the work. Open questions stay visible.', data: 'Project context / Known needs / Questions to resolve',
      html: `<div class="notes-demo"><div class="workspace-breadcrumb">Team space / Project briefs / New inquiry</div><h4>A second location.<br>A clear place to start.</h4><span class="workspace-pill">Brief for owner review</span><p>Sam is planning a new website for a second business location. The inquiry asks for options before committing to a launch date.</p><h5>What we need to understand</h5><ul><li>Target launch date and current website</li><li>Budget and the most important customer action</li><li>Existing tools the website should connect to</li></ul><div class="note-callout">Owner decision: clarify the brief before proposing the scope.</div></div>`
    },
    projects: {
      name: 'Projects & follow-up', title: 'A next step has an owner.',
      copy: 'The request becomes visible work. Review the brief before sending the reply or booking a customer meeting.', data: 'Review brief → Clarify timing & budget → Offer discovery',
      html: `<div class="board-demo"><div class="board-top"><h4>New business follow-up</h4><span>Sam / Website inquiry</span></div><div class="board-lanes"><div class="board-lane"><h5>Ready to review <span>1</span></h5><div class="board-task"><small>New inquiry</small><strong>Review Sam’s website brief</strong><p>Confirm what’s known and clarify launch date and budget.</p><div class="crm-foot">Owner review</div></div></div><div class="board-lane"><h5>Next, after review <span>1</span></h5><div class="board-task"><small>Draft next step</small><strong>Prepare a discovery invitation</strong><p>Arrange a conversation once the owner has reviewed the request.</p></div></div><div class="board-lane"><h5>Complete <span>0</span></h5><p class="board-empty">No customer meeting is booked in this example.</p></div></div></div>`
    },
    reports: {
      name: 'Business activity', title: 'You can see what needs attention.',
      copy: 'A simple reporting view reflects the actual state of the work. The owner sees the open inquiry and the decision still needed.', data: '1 inquiry / 1 owner review / 0 meetings booked',
      html: `<div class="reports-demo"><h4>From inquiry to next step.</h4><p>One sample inquiry from Sam, reflected across the workflow.</p><div class="report-stats"><div><span>New inquiries</span><strong>1</strong></div><div><span>Need owner review</span><strong>1</strong></div><div><span>Meetings booked</span><strong>0</strong></div></div><div class="report-bars"><h5>Where the work stands</h5><div class="report-bar"><span>Captured</span><i aria-hidden="true"><b style="width:100%"></b></i><strong>1</strong></div><div class="report-bar"><span>For review</span><i aria-hidden="true"><b style="width:100%"></b></i><strong>1</strong></div><div class="report-bar"><span>Booked</span><i aria-hidden="true"><b style="width:0%"></b></i><strong>0</strong></div></div><p style="margin-top:19px">Stages of the same inquiry, not separate leads. Sample data, not business performance claims.</p></div>`
    }
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const trail = [...document.querySelectorAll('[data-handoff-step]')];
  let selected = 0, timer = 0, running = false;
  function stop() { clearTimeout(timer); timer = 0; running = false; byId('workspacePlay').textContent = '▶ Play the handoff'; }
  function select(index, announce = false) {
    selected = index;
    const data = views[tabs[index].dataset.workspace];
    tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(index === i)); tab.tabIndex = index === i ? 0 : -1; });
    byId('workspacePanel').setAttribute('aria-labelledby', tabs[index].id);
    byId('workspaceContent').innerHTML = data.html;
    byId('workspaceName').textContent = data.name;
    byId('handoffTitle').textContent = data.title;
    byId('handoffCopy').textContent = data.copy;
    byId('handoffData').textContent = data.data;
    trail.forEach((item, i) => item.setAttribute('aria-current', i === index ? 'step' : 'false'));
    if (announce) byId('workspaceStatus').textContent = data.title + ' ' + data.copy;
  }
  function motionPaused() { return reduced.matches || document.documentElement.classList.contains('motion-paused'); }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { stop(); select(index, true); });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); stop(); tabs[next].focus(); select(next, true);
    });
  });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('[data-workspace-link]');
    if (!link || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const index = tabs.findIndex(tab => tab.dataset.workspace === link.dataset.workspaceLink);
    if (index >= 0) { stop(); select(index, true); }
  });
  byId('workspacePlay').addEventListener('click', () => {
    if (running) { stop(); return; }
    if (motionPaused()) { byId('workspaceStatus').textContent = 'Motion is paused. Choose a workspace to explore the example at your own pace.'; return; }
    select(0, true); running = true; byId('workspacePlay').textContent = 'Ⅱ Pause the handoff';
    function advance() {
      if (motionPaused() || document.hidden) { stop(); return; }
      select(selected + 1, true);
      if (selected === tabs.length - 1) { stop(); return; }
      timer = setTimeout(advance, 2600);
    }
    timer = setTimeout(advance, 2600);
  });
  function pauseIfNeeded() { if (motionPaused()) stop(); }
  reduced.addEventListener('change', pauseIfNeeded);
  new MutationObserver(pauseIfNeeded).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  document.addEventListener('abacoa-conversation-open', stop);
  byId('elliotFilm')?.addEventListener('play', stop);
  window.addEventListener('pagehide', stop);
  select(0);
})();

(() => {
  const byId = id => document.getElementById(id);
  const dialog = byId('studioChat');
  if (!dialog) return;
  const topics = {
    calls: { prompt: 'We miss customer calls while we’re busy.', reply: 'An AI receptionist could answer common questions and capture the caller’s need. We would work with your team on the business knowledge, escalation rules and next steps it should use.', route: ['Customer call', 'Lead brief', 'Team follow-up'] },
    followup: { prompt: 'Our leads don’t always get followed up.', reply: 'A useful first step could be a shared customer record and a clear follow-up task. Approved reminders or draft replies can help the team keep the conversation moving.', route: ['New inquiry', 'CRM record', 'Next action'] },
    operations: { prompt: 'Our tools feel disconnected.', reply: 'We could start with one handoff your team repeats: moving an inquiry from email to a tracker, a customer record or a project task. The first conversation is about which tools you use and what gets lost between them.', route: ['Email or form', 'Shared information', 'Owner visibility'] },
    website: { prompt: 'We need a better website.', reply: 'Your website could explain the value, guide a visitor and connect their inquiry to the way you work. We would start with your customers, the action they need to take and what should happen after they reach out.', route: ['Website visit', 'Helpful conversation', 'Project inquiry'] },
    pricing: { prompt: 'What would a project cost?', reply: 'The right starting point depends on the scope, your existing tools and the work you want handled. The pricing section shows starting options; our team can help define a specific project before you commit.', route: ['Business need', 'Defined scope', 'Agreed proposal'] },
    client: { prompt: 'I need help with an existing project.', reply: 'For an existing project, tell the team your business name, which system is involved and what changed. This demo cannot access your account or resolve a support request, but you can prepare those details to share with Abacoa Digital.', route: ['Your project', 'Issue & impact', 'Team review'] },
    general: { prompt: 'I would like to explore an idea.', reply: 'This guided example covers websites, customer calls, lead follow-up and connected business tools. Try one of those situations, or prepare a short brief for the Abacoa Digital team to discuss with you.', route: ['Your situation', 'A useful first step', 'Team conversation'] }
  };
  let opener = null, topic = 'general', latest = '', requests = [], handoff = null;
  const messages = byId('chatMessages');
  function classify(value) {
    const text = value.toLowerCase();
    if (/existing|already.*client|support|not working|bug|broken system/.test(text)) return 'client';
    if (/price|pricing|cost|budget|plan|how much/.test(text)) return 'pricing';
    if (/phone|call|reception|voicemail/.test(text)) return 'calls';
    if (/follow.?up|lead|inquir/.test(text)) return 'followup';
    if (/website|web site|landing|brand|online/.test(text)) return 'website';
    if (/tool|spreadsheet|crm|email|calendar|automat|workflow|data|system|connect|excel|airtable|notion/.test(text)) return 'operations';
    return 'general';
  }
  function bubble(value, role, route = []) {
    const el = document.createElement('div'); el.className = 'chat-bubble ' + role; el.textContent = value;
    if (route.length) {
      const tags = document.createElement('div'); tags.className = 'chat-message-route';
      for (const label of route) { const tag = document.createElement('span'); tag.textContent = label; tags.append(tag); }
      el.append(tags);
    }
    messages.append(el);
    while (messages.children.length > 10) messages.firstElementChild.remove();
    messages.scrollTop = messages.scrollHeight;
  }
  function reset() {
    messages.replaceChildren(); topic = 'general'; latest = ''; requests = []; handoff = null;
    bubble('What would you like to make easier in your business?', 'assistant');
    byId('chatNext').hidden = true; byId('chatInput').value = '';
  }
  function respond(value, preset) {
    const text = value.trim().slice(0, 600); if (!text) return;
    topic = Object.hasOwn(topics, preset) ? preset : classify(text);
    latest = text; requests.push(text); requests = requests.slice(-5);
    bubble(text, 'visitor'); bubble(topics[topic].reply, 'assistant', topics[topic].route);
    byId('chatInput').value = ''; byId('chatNext').hidden = false; byId('chatInput').focus();
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest?.('[data-chat-open]');
    if (!trigger || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof dialog.showModal !== 'function') return;
    event.preventDefault(); opener = trigger; dialog.showModal(); document.documentElement.classList.add('agent-dialog-open');
    byId('elliotFilm')?.pause(); document.dispatchEvent(new Event('abacoa-conversation-open')); byId('chatClose').focus();
  });
  byId('chatClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (!byId('elliotDialog')?.open) document.documentElement.classList.remove('agent-dialog-open');
    if (handoff) {
      const detail = handoff; handoff = null;
      document.dispatchEvent(new CustomEvent('abacoa-prepare-brief', { detail }));
    } else opener?.focus();
  });
  byId('chatForm').addEventListener('submit', event => { event.preventDefault(); respond(byId('chatInput').value); });
  document.querySelectorAll('[data-chat-prompt]').forEach(button => button.addEventListener('click', () => { const key = button.dataset.chatPrompt; if (topics[key]) respond(topics[key].prompt, key); }));
  byId('chatReset').addEventListener('click', () => { reset(); byId('chatInput').focus(); });
  byId('chatPrepare').addEventListener('click', () => {
    if (!latest) return;
    handoff = { topic, brief: ('I would like to discuss the following with Abacoa Digital:\n\n' + requests.join('\n\n')).slice(0, 2500) };
    dialog.close();
  });
  reset();
})();
