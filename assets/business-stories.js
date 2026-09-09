(() => {
  const byId = id => document.getElementById(id);
  const tabs = [...document.querySelectorAll('[data-story]')];
  const deskTabs = [...document.querySelectorAll('[data-desk-view]')];
  const steps = [...document.querySelectorAll('[data-story-step]')];
  if (!tabs.length || !byId('deskContent')) return;
  const film = byId('elliotFilm');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 820px)');
  const deskTablist = document.querySelector('.owner-sidebar');
  const orientTabs = () => deskTablist?.setAttribute('aria-orientation', compact.matches ? 'horizontal' : 'vertical');
  compact.addEventListener('change', orientTabs);
  orientTabs();
  const stories = {
    home: {
      label: 'Home services', title: 'A busy shop.\nA call that matters.',
      description: 'The owner is juggling staff and deliveries. Maya is at home with a broken AC and two hot, restless children. She needs help today.',
      name: 'Maya', initials: 'M', channel: 'Incoming call · Jupiter, FL', source: 'Elliot · Voice assistant',
      quote: 'Our AC is broken. Can someone come today?',
      outcome: 'A booked job. A ready team.', value: 'Elliot captures the urgency and confirms 3 PM. The owner gets the details needed to send the crew.',
      request: 'AC not cooling', location: 'Jupiter, FL', priority: 'Urgent · Children at home', slot: '3:00 PM', day: 'Today', duration: 'Service visit',
      summary: 'Maya needs help with a broken AC. Children are at home. She accepted the available 3 PM appointment. The job is flagged urgent for the owner to review and dispatch.',
      tags: ['Appointment confirmed', 'Urgency flagged', 'Customer details captured'],
      next: 'Review the urgent job and send the service team the brief.',
      conversation: [['Maya', 'Our AC is broken. We need help today.'], ['Elliot', 'Three PM is available. Shall I book it?'], ['Maya', 'Yes, please.'], ['Elliot', 'You’re booked for three. I’ve flagged this urgent and notified the owner.']],
      action: 'Preview team alert', actionDone: 'Team alert previewed',
      teamTitle: 'Ready for the service crew', teamBrief: 'Urgent AC request — Maya in Jupiter. No cooling, children at home. Confirmed appointment: 3 PM. Please review the job details and get rolling as soon as possible.',
      tasks: [['Review urgency', 'No cooling; children at home.'], ['Confirm crew availability', 'Keep the accepted 3 PM appointment in view.'], ['Send the job brief', 'Customer context and appointment travel together.']],
      stages: ['Call received', 'Details captured', '3 PM confirmed', 'Ready for the team'],
      steps: [['The call comes in', 'Maya needs urgent AC help.'], ['Elliot captures the details', 'The need, location and urgency.'], ['The appointment is booked', '3 PM, accepted by Maya.'], ['The owner has the next step', 'An urgent brief, ready for the crew.']]
    },
    appointments: {
      label: 'Appointments', title: 'A full salon.\nAnother customer, booked.',
      description: 'The team is with customers when Nina looks for an appointment after hours. She can see a suitable time and book without waiting for someone to call back.',
      name: 'Nina', initials: 'N', channel: 'Website booking · After hours', source: 'Website · Booking flow',
      quote: 'Could I book a haircut tomorrow afternoon?',
      outcome: 'A clear schedule. A confident customer.', value: 'The booking, confirmation and reminder stay connected. The team starts the day with the details already in place.',
      image: 'assets/scenario-appointments.webp', alt: 'A stylist working with a customer while another appointment takes place in a warm independent salon.', photoCaption: 'A full salon. A clear schedule.',
      request: 'Haircut & finish', location: 'In-studio appointment', priority: 'Standard booking', slot: '2:30 PM', day: 'Tomorrow', duration: '60 minutes',
      summary: 'Nina booked a haircut and finish through the website. She chose the available 2:30 PM slot tomorrow. Her confirmation is ready, and a reminder is scheduled using the studio’s settings.',
      tags: ['Website booking', 'Confirmation ready', 'Reminder scheduled'],
      next: 'Review tomorrow’s appointment list and any customer notes.',
      conversation: [['Nina', 'Could I book a haircut tomorrow afternoon?'], ['Booking assistant', 'Tomorrow at 2:30 PM is available for a haircut and finish.'], ['Nina', 'That works. Book it, please.'], ['Booking assistant', 'Your appointment is confirmed. Your details include a link if you need to reschedule.']],
      action: 'Preview confirmation', actionDone: 'Confirmation previewed',
      actionPreview: 'Hi Nina, your haircut and finish is confirmed for tomorrow at 2:30 PM. Please allow 60 minutes. Your booking details include the studio information and a way to reschedule if your plans change.',
      teamTitle: 'Tomorrow’s appointment, organised', teamBrief: 'Nina — haircut and finish, tomorrow at 2:30 PM. Allow 60 minutes. The booking includes her contact details and the confirmation. Reminder scheduled using the studio’s settings.',
      tasks: [['Check the appointment', 'Tomorrow, 2:30 PM · 60 minutes.'], ['Review customer notes', 'Details stay attached to the booking.'], ['Prepare the confirmation', 'Time, service and a rescheduling route.']],
      stages: ['Booking requested', 'Details captured', '2:30 PM confirmed', 'Ready for the studio'],
      steps: [['A customer finds a time', 'Nina checks availability after hours.'], ['The booking captures the details', 'Service, contact and chosen slot.'], ['The calendar updates', 'Tomorrow, 2:30 PM · 60 minutes.'], ['Everyone knows what’s next', 'Confirmation, reminder and team view.']]
    },
    professional: {
      label: 'Professional services', title: 'A promising inquiry.\nA clear place to start.',
      description: 'While a small studio is deep in client work, Sam sends a new project inquiry. The request needs context and a thoughtful next step, without getting lost in the inbox.',
      name: 'Sam', initials: 'S', channel: 'Project inquiry · Website form', source: 'Website · Guided intake',
      quote: 'We’re opening a second location and need a new website. Where do we start?',
      outcome: 'Useful context. A prepared first meeting.', value: 'The inquiry becomes an organised lead brief and a follow-up task. The owner can review the opportunity and decide how to move it forward.',
      image: 'assets/scenario-professional.webp', alt: 'Two professionals discussing project plans at a desk in a warm independent design studio.', photoCaption: 'Stay in the work. Keep the next project moving.',
      request: 'Website for a second location', location: 'Discovery call · Remote', priority: 'Owner review needed', slot: '10:00 AM', day: 'Tomorrow', duration: 'Follow-up task · 30 minutes',
      summary: 'Sam’s business is opening a second location and wants a new website. The intake captures the project goal and prepares a lead brief. Budget and launch date still need clarification before the owner scopes the work.',
      tags: ['New project inquiry', 'Brief prepared', 'Owner review needed'],
      next: 'Review the brief, clarify budget and timing, then offer a discovery call.',
      conversation: [['Sam', 'We’re opening a second location and need a new website.'], ['Intake assistant', 'Thanks, Sam. What launch date are you working toward?'], ['Sam', 'We’re still deciding and would like to discuss the options.'], ['Intake assistant', 'Your inquiry is recorded for the studio. The next step is to review the brief and arrange a conversation.']],
      action: 'Preview follow-up draft', actionDone: 'Follow-up draft previewed',
      actionPreview: 'Hi Sam, thanks for getting in touch about the website for your second location. Could you share your target launch date and an approximate budget? We can then arrange a discovery conversation and discuss the right scope. This draft is ready for the owner to review.',
      teamTitle: 'A lead brief, ready for review', teamBrief: 'New inquiry from Sam: a website for a second business location. Review the project goal, clarify the launch date and budget, and offer a discovery conversation. No customer appointment is booked yet.',
      tasks: [['Review the project goal', 'New website for a second location.'], ['Clarify budget and timing', 'Both are still open questions.'], ['Offer a discovery conversation', 'Owner reviews the reply before sending.']],
      stages: ['Inquiry received', 'Details organised', 'Follow-up task created', 'Ready for owner review'],
      steps: [['A new project comes in', 'Sam submits the website inquiry.'], ['The intake organises it', 'The goal, context and open questions.'], ['A follow-up task is created', 'Budget and timing need review.'], ['The owner starts informed', 'A brief and a draft next step.']]
    }
  };
  let current = 'home', stage = 3, view = 'leads', timer = 0, running = false;
  const previewed = new Set();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const text = (id, value) => { const el = byId(id); if (el) el.textContent = value; };
  function motionPaused() { return reduced.matches || document.documentElement.classList.contains('motion-paused'); }
  function stop() {
    clearTimeout(timer); timer = 0; running = false;
    byId('storyPlay').innerHTML = '<span aria-hidden="true">▶</span> Play the workflow';
  }
  function setStage(next, announce = true) {
    stage = Math.max(0, Math.min(3, next));
    steps.forEach((button, i) => {
      button.setAttribute('aria-current', i === stage ? 'step' : 'false');
      button.parentElement.classList.toggle('is-complete', i < stage);
    });
    if (announce) text('storyStatus', stories[current].steps[stage][0] + '. ' + stories[current].steps[stage][1]);
    renderDesk();
  }
  function setStory(key) {
    if (!stories[key]) return;
    stop(); film?.pause(); current = key;
    byId('deskScenario').value = key;
    const s = stories[key];
    tabs.forEach(tab => { const selected = tab.dataset.story === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected) byId('storyPanel').setAttribute('aria-labelledby', tab.id); });
    text('storyCategory', s.label); text('storyTitle', s.title); text('storyDescription', s.description);
    text('storyInitials', s.initials); text('storyCustomer', s.name); text('storyChannel', s.channel); text('storyQuote', '“' + s.quote + '”');
    text('storyOutcome', s.outcome); text('storyValue', s.value); text('deskBusiness', s.label + ' · Example workspace');
    byId('storyHomeMedia').hidden = key !== 'home'; byId('storyPhotoMedia').hidden = key === 'home';
    if (s.image) { byId('storyPhoto').src = s.image; byId('storyPhoto').alt = s.alt; text('storyPhotoCaption', s.photoCaption); }
    s.steps.forEach(([title, copy], i) => { text('storyStep' + i, title); text('storyStepCopy' + i, copy); });
    setStage(3, false);
    text('storyStatus', s.label + ': explore the completed example, or play the workflow step by step.');
  }
  function setView(next) {
    if (!['leads', 'calendar', 'conversations', 'team'].includes(next)) return;
    view = next;
    deskTabs.forEach(tab => { const selected = tab.dataset.deskView === view; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected) byId('deskPanel').setAttribute('aria-labelledby', tab.id); });
    renderDesk();
  }
  function fields(pairs) { return '<dl class="desk-fields">' + pairs.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('') + '</dl>'; }
  function empty(title, copy) { return `<div class="desk-empty"><span aria-hidden="true">↳</span><h4>${escape(title)}</h4><p>${escape(copy)}</p></div>`; }
  function renderDesk() {
    const s = stories[current];
    const titles = { leads: ['Customer overview', 'One inquiry. The full picture.'], calendar: ['Schedule & next steps', current === 'professional' ? 'A follow-up task, in view.' : 'A place on the calendar.'], conversations: ['Customer conversation', 'The context stays with the customer.'], team: ['Team handoff', s.teamTitle] };
    text('deskEyebrow', titles[view][0]); text('deskTitle', titles[view][1]); text('deskStage', s.stages[stage]);
    let markup = '';
    if (view === 'leads') {
      if (stage === 0) markup = empty('A new request is coming in.', 'The customer has reached the business. The next step captures the details and creates a useful record.');
      else markup = `<div class="desk-grid"><article class="desk-card"><div class="desk-person"><span class="desk-avatar" aria-hidden="true">${escape(s.initials)}</span><div><strong>${escape(s.name)}</strong><p>${escape(s.request)}</p></div></div>${fields([['Source', s.source], ['Priority', s.priority], ['Next step', stage >= 2 ? current === 'professional' ? 'Owner follow-up' : s.day + ', ' + s.slot : 'Confirm next step'], ['Record', 'Customer context captured']])}</article><article class="desk-card"><h4><span class="desk-spark" aria-hidden="true">✧</span>${current === 'home' ? 'Elliot’s brief' : 'Prepared for the owner'}</h4><p class="desk-summary">${escape(stage >= 2 ? s.summary : s.name + ' reached out about ' + s.request.toLowerCase() + '. The request and context are captured; the next step is still being arranged.')}</p><div class="desk-tags">${s.tags.slice(0, stage >= 2 ? 3 : 1).map(tag => `<span>${escape(stage < 2 ? 'Details captured' : tag)}</span>`).join('')}</div><div class="desk-next"><span>Next action</span>${escape(stage >= 3 ? s.next : 'Continue the workflow to prepare the next action.')}</div></article></div>`;
    } else if (view === 'calendar') {
      if (stage < 2) markup = empty('The next step is being arranged.', 'The calendar will update after the booking is confirmed or an owner follow-up task is created.');
      else {
        const rows = current === 'home' ? ['2:00 PM', '3:00 PM', '4:00 PM'] : current === 'appointments' ? ['1:30 PM', '2:30 PM', '3:30 PM'] : ['9:00 AM', '10:00 AM', '11:00 AM'];
        markup = `<div class="desk-grid"><div class="desk-schedule"><div class="desk-schedule-top"><span>${escape(s.day)}</span><span>Example schedule</span></div>${rows.map((time, i) => `<div class="desk-slot"><time>${time}</time>${i === 1 ? `<div class="desk-appointment">${escape(s.name)} · ${escape(current === 'professional' ? 'Owner follow-up task' : s.request)}<small>${escape(s.duration)} · ${current === 'professional' ? 'Internal task' : 'Confirmed'}</small></div>` : '<span>—</span>'}</div>`).join('')}</div><article class="desk-card"><h4>${current === 'professional' ? 'Owner review comes first' : 'The details travel with the booking'}</h4><p class="desk-summary">${escape(current === 'professional' ? 'This is an internal follow-up task, not a confirmed customer meeting. The owner reviews the inquiry and offers a discovery conversation.' : s.summary)}</p><div class="desk-next"><span>${current === 'professional' ? 'Still needed' : 'Customer confirmation'}</span>${escape(current === 'professional' ? 'Budget, launch date and an agreed meeting time.' : s.day + ' at ' + s.slot + '. The customer knows what happens next.')}</div></article></div>`;
      }
    } else if (view === 'conversations') {
      const count = stage === 0 ? 1 : stage === 1 ? 2 : 4;
      markup = `<div class="desk-conversation">${s.conversation.slice(0, count).map(([speaker, message], i) => `<div class="desk-message${i % 2 ? ' reply' : ''}"><strong>${escape(speaker)}</strong>${escape(message)}</div>`).join('')}<p class="desk-thread-note">Illustrative conversation summary · ${escape(s.channel)}</p></div>`;
    } else {
      if (stage < 3) markup = empty('The handoff is being prepared.', 'Once the details and next step are ready, the owner can review the brief and coordinate the team.');
      else markup = `<div class="desk-grid"><article class="desk-card"><h4>Ready for review</h4><p class="desk-summary">${escape(s.teamBrief)}</p><button id="deskAction" class="desk-action" type="button" ${previewed.has(current) ? 'disabled' : ''}>${escape(previewed.has(current) ? s.actionDone : s.action)} <span aria-hidden="true">↗</span></button><p class="desk-action-note">Preview only · No message is sent.</p><div id="deskActionPreview" ${previewed.has(current) ? '' : 'hidden'} class="desk-next" role="status"><span>Preview ready</span>${escape(s.actionPreview || s.teamBrief)}</div></article><article class="desk-card"><h4>The team’s next steps</h4><ul class="desk-task-list">${s.tasks.map(([title, detail]) => `<li><span aria-hidden="true">↳</span><div>${escape(title)}<small>${escape(detail)}</small></div></li>`).join('')}</ul></article></div>`;
    }
    byId('deskContent').innerHTML = markup;
    byId('deskAction')?.addEventListener('click', event => {
      previewed.add(current); byId('deskActionPreview').hidden = false;
      event.currentTarget.disabled = true; event.currentTarget.textContent = s.actionDone;
    });
  }
  function wireTabs(buttons, choose, dataKey, vertical = false) {
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => choose(button.dataset[dataKey]));
      button.addEventListener('keydown', event => {
        let next = index;
        const isVertical = vertical && !compact.matches;
        if (event.key === (isVertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % buttons.length;
        else if (event.key === (isVertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else return;
        event.preventDefault(); choose(buttons[next].dataset[dataKey]); buttons[next].focus({ preventScroll: true });
      });
    });
  }
  wireTabs(tabs, setStory, 'story');
  wireTabs(deskTabs, setView, 'deskView', true);
  byId('deskScenario').addEventListener('change', event => setStory(event.target.value));
  steps.forEach(button => button.addEventListener('click', () => { stop(); setStage(Number(button.dataset.storyStep)); }));
  byId('storyPlay').hidden = false;
  byId('storyPlay').addEventListener('click', () => {
    if (running) { stop(); text('storyStatus', 'Workflow paused. Choose any step to explore it.'); return; }
    if (motionPaused()) { setStage(3); text('storyStatus', 'The completed workflow is shown. Choose individual steps while motion is paused.'); return; }
    film?.pause(); running = true; setStage(0);
    byId('storyPlay').innerHTML = '<span aria-hidden="true">Ⅱ</span> Pause the workflow';
    function advance() {
      if (!running) return;
      if (motionPaused() || document.hidden) { stop(); return; }
      setStage(stage + 1);
      if (stage === 3) { stop(); return; }
      timer = setTimeout(advance, 1800);
    }
    timer = setTimeout(advance, 1800);
  });
  function pauseIfNeeded() { if (motionPaused() && running) { stop(); text('storyStatus', 'Motion paused. Choose a workflow step to explore it.'); } }
  new MutationObserver(pauseIfNeeded).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  reduced.addEventListener('change', pauseIfNeeded);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  film?.addEventListener('play', stop);
  document.addEventListener('abacoa-conversation-open', stop);

  const systems = {
    intake: ['Website & forms', 'Give a customer a clear way to reach you. Forms and booking flows capture useful details at the start.', 'Name, contact details, request and source.'],
    assistant: ['AI assistant', 'A voice or chat assistant can answer questions and capture context using your business’s knowledge and rules.', 'Conversation context, intent and the agreed next step.'],
    crm: ['Custom CRM', 'Bring the customer record, conversations and activity into a workspace built around the team’s actual day.', 'One connected record for the people doing the work.'],
    calendar: ['Calendar & tasks', 'Check availability and record agreed bookings, or create a follow-up task when an owner needs to review the request.', 'Confirmed times, assignments and follow-up tasks.'],
    team: ['Messaging & handoffs', 'Prepare useful notifications and customer confirmations. Give the owner control over actions that need a human decision.', 'Customer updates, job briefs and the next action.'],
    insights: ['Activity & reporting', 'See what came in, how it was handled and where work still needs attention. Connect the activity to a useful view of the business.', 'Inquiry sources, response activity and outstanding work.']
  };
  const systemTabs = [...document.querySelectorAll('[data-system]')];
  function setSystem(key) {
    const data = systems[key]; if (!data) return;
    systemTabs.forEach(tab => { const selected = tab.dataset.system === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected) byId('systemMapPanel').setAttribute('aria-labelledby', tab.id); });
    text('systemMapTitle', data[0]); text('systemMapCopy', data[1]); text('systemMapData', data[2]);
  }
  wireTabs(systemTabs, setSystem, 'system');
  function revealService() {
    let target; try { target = byId(decodeURIComponent(location.hash.slice(1))); } catch (_) { return; }
    if (target?.classList.contains('service-detail')) target.open = true;
  }
  window.addEventListener('hashchange', revealService);
  document.addEventListener('click', event => {
    if (event.defaultPrevented) return;
    const storyLink = event.target.closest?.('[data-story-link]');
    if (storyLink) setStory(storyLink.dataset.storyLink);
    const link = event.target.closest?.('a[href^="#service-"]');
    if (link) { const target = byId(link.getAttribute('href').slice(1)); if (target?.classList.contains('service-detail')) target.open = true; }
  });
  setStory('home'); setSystem('crm'); revealService();
})();
