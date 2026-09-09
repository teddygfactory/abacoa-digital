(() => {
  const byId = id => document.getElementById(id);
  const dialog = byId('elliotDialog');
  if (!dialog) return;
  const topics = {
    general: { label: 'Explore a project', brief: 'I would like to talk about where AI or custom software could help my business. The part I want to improve is…' },
    calls: { label: 'Answer more customer calls', brief: 'We miss customer calls while the team is busy or after hours. I would like to explore an AI receptionist that captures the need and helps us follow up.' },
    followup: { label: 'Follow up with leads', brief: 'We receive inquiries through different channels and follow-up is inconsistent. I would like one customer record, a clear next step and reminders for the team.' },
    operations: { label: 'Connect the work and information', brief: 'Our team moves information between separate tools and spreadsheets. I would like a connected workspace for customer details, tasks and owner visibility.' },
    website: { label: 'Build a website that does more', brief: 'I would like a website that helps customers understand our services and take the next step, with inquiries connected to our business systems.' },
    pricing: { label: 'Find the right starting scope', brief: 'I would like help choosing a sensible first project or managed plan. The problem, tools, approximate budget and timing I have in mind are…' },
    client: { label: 'Help with an existing project', brief: 'I am an existing client. My business and project are…\nThe system or workflow I need help with is…\nWhat changed, when it started and the impact on our team are…' }
  };
  const routes = {
    calls: {
      title: 'Give every caller a clear next step.',
      copy: 'Start at the phone. Add the connections that make the conversation useful to the rest of your business.',
      steps: [['Capture the call', 'Answer common questions and collect the customer’s need, contact details and urgency.'], ['Connect the follow-through', 'Link the call brief to a customer record, available appointments and a team notification.'], ['Improve with evidence', 'Review call outcomes and unresolved requests to refine how the assistant helps.']],
      control: 'You set availability, escalation rules and the situations that need a person.', cta: 'Explore a voice assistant'
    },
    followup: {
      title: 'Keep a good inquiry from going quiet.',
      copy: 'Bring scattered inquiries into a clear process, from the first hello to the owner’s next decision.',
      steps: [['Organise the inquiry', 'Capture the source, customer request and contact details in one record.'], ['Keep the conversation moving', 'Prepare replies, assign a next step and remind the right person when follow-up is due.'], ['See where people get stuck', 'Review response times and open opportunities to improve the customer journey.']],
      control: 'You decide which replies can be automated and which need your review.', cta: 'Connect our lead follow-up'
    },
    operations: {
      title: 'Give your team one place to see the work.',
      copy: 'Build around a real working day. Start with the handoff that creates the most chasing and retyping.',
      steps: [['Make the work visible', 'Bring a priority workflow, its customer details and its next action into a clear workspace.'], ['Connect the handoffs', 'Move the right information between your CRM, calendar and team tools.'], ['Grow with the business', 'Add reporting, knowledge assistance and new workflows as the operation needs them.']],
      control: 'Your team keeps ownership of approvals, access and operational decisions.', cta: 'Plan our connected workspace'
    },
    website: {
      title: 'Turn interest into a useful conversation.',
      copy: 'Your website can explain the value and help someone act while your team is doing the work.',
      steps: [['Make the next step clear', 'Show the service, answer the important questions and make it easy to call or inquire.'], ['Connect the inquiry', 'Send the request into a useful intake, customer record or suitable booking flow.'], ['Build on real behaviour', 'Use inquiry quality and customer feedback to guide new pages, tools and improvements.']],
      control: 'Your brand, customer experience and priorities guide what gets built.', cta: 'Explore a more useful website'
    }
  };
  const routeTabs = [...document.querySelectorAll('[data-future]')];
  const compact = window.matchMedia('(max-width: 820px)');
  const tablist = byId('futureChoices');
  let selectedRoute = 'calls', returnFocus = null, activeTopic = 'general';
  const drafts = new Map();
  function setRoute(key) {
    if (!routes[key]) return;
    selectedRoute = key;
    const route = routes[key];
    routeTabs.forEach(tab => {
      const selected = tab.dataset.future === key;
      tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
      if (selected) byId('futurePanel').setAttribute('aria-labelledby', tab.id);
    });
    byId('futureTitle').textContent = route.title;
    byId('futureCopy').textContent = route.copy;
    route.steps.forEach(([title, copy], i) => {
      byId('futureTitle' + i).textContent = title; byId('futureCopy' + i).textContent = copy;
    });
    byId('futureControl').textContent = route.control;
    byId('futureAction').dataset.agentTopic = key;
    byId('futureActionLabel').textContent = route.cta;
  }
  const orient = () => tablist?.setAttribute('aria-orientation', compact.matches ? 'horizontal' : 'vertical');
  compact.addEventListener('change', orient); orient();
  routeTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => setRoute(tab.dataset.future));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === (compact.matches ? 'ArrowRight' : 'ArrowDown')) next = (index + 1) % routeTabs.length;
      if (event.key === (compact.matches ? 'ArrowLeft' : 'ArrowUp')) next = (index + routeTabs.length - 1) % routeTabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = routeTabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); routeTabs[next].focus(); setRoute(routeTabs[next].dataset.future);
    });
  });

  function updateEmail() {
    const body = byId('agentBrief').value.trim();
    byId('agentEmail').href = 'mailto:hello@abacoadigital.com?subject=' + encodeURIComponent('Abacoa Digital — ' + topics[activeTopic].label) + '&body=' + encodeURIComponent(body);
  }
  function saveDraft() { drafts.set(activeTopic, byId('agentBrief').value); }
  function setTopic(key) {
    activeTopic = topics[key] ? key : 'general';
    byId('agentTopic').value = activeTopic;
    byId('agentBrief').value = drafts.has(activeTopic) ? drafts.get(activeTopic) : topics[activeTopic].brief;
    byId('agentDialogTitle').textContent = activeTopic === 'client' ? 'Let’s get your project moving.' : 'Start with what you want to fix.';
    byId('agentDialogIntro').textContent = activeTopic === 'client'
      ? 'Tell our team you’re an existing client and include the project and what needs attention. Email your brief or call our AI receptionist.'
      : 'Tell us about your business and the work you want to make easier. Share a brief with the team, or call our AI receptionist to talk it through.';
    byId('agentDialogStatus').textContent = '';
    updateEmail();
  }
  function openDialog(trigger, topic, brief) {
    if (typeof dialog.showModal !== 'function') return false;
    if (dialog.open) saveDraft();
    returnFocus = trigger;
    setTopic(topic === 'selected' ? selectedRoute : topic);
    if (typeof brief === 'string' && brief.trim()) { byId('agentBrief').value = brief.slice(0, 2500); saveDraft(); updateEmail(); }
    dialog.showModal();
    document.documentElement.classList.add('agent-dialog-open');
    const film = byId('elliotFilm'); film?.pause();
    document.dispatchEvent(new Event('abacoa-conversation-open'));
    byId('agentDialogClose').focus();
    return true;
  }
  // Only prepare a conversation. No remote request, microphone or call starts here.
  document.addEventListener('click', event => {
    const trigger = event.target.closest?.('[data-agent-topic]');
    if (!trigger || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (openDialog(trigger, trigger.dataset.agentTopic)) event.preventDefault();
  });
  document.addEventListener('abacoa-prepare-brief', event => {
    const detail = event.detail;
    if (detail && typeof detail.brief === 'string') openDialog(byId('chatDock'), detail.topic, detail.brief);
  });
  byId('agentTopic').addEventListener('change', () => { saveDraft(); setTopic(byId('agentTopic').value); });
  byId('agentBrief').addEventListener('input', () => { saveDraft(); updateEmail(); byId('agentDialogStatus').textContent = ''; });
  byId('agentDialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    saveDraft(); document.documentElement.classList.remove('agent-dialog-open'); returnFocus?.focus();
  });
  byId('agentCopy').addEventListener('click', async () => {
    const brief = byId('agentBrief');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(brief.value);
      byId('agentDialogStatus').textContent = 'Opening note copied. Share it with our team or use it when you call.';
    } catch (_) {
      brief.focus(); brief.select();
      byId('agentDialogStatus').textContent = 'Your opening note is selected. Copy it using your keyboard or device menu.';
    }
  });
  // A phone link opens the visitor's calling app; the brief is never silently sent.
  byId('agentCall').addEventListener('click', () => {
    byId('agentDialogStatus').textContent = 'Opening your calling app for (561) 589-7339. If it does not open, dial the number on your phone.';
  });
  setRoute('calls'); setTopic('general');
})();
