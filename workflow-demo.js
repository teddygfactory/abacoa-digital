(() => {
  'use strict';
  const form=document.getElementById('workflowForm');
  if(!form||!window.AbacoaWorkflow)return;
  const engine=window.AbacoaWorkflow,input=document.getElementById('workflowInput'),error=document.getElementById('workflowError'),output=document.getElementById('workflowOutput'),status=document.getElementById('workflowStatus'),run=document.getElementById('workflowRun'),copy=document.getElementById('workflowCopy');
  const scenarioButtons=[...document.querySelectorAll('[data-scenario]')];
  let currentResult=null;
  function put(id,text){document.getElementById(id).textContent=text;}
  function clear(){currentResult=null;output.hidden=true;document.getElementById('workflowEmpty').hidden=false;copy.disabled=true;copy.textContent='Copy draft';error.textContent='';status.textContent='Ready for an inquiry';run.textContent='Run example';document.getElementById('workflowSteps').removeAttribute('data-complete');}
  function preset(key){const scenario=engine.scenarios[key];if(!scenario)return;clear();input.value=scenario.message;scenarioButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===key)));}
  function render(result){
    put('workflowName',result.name||'Not provided');put('workflowEmail',result.email||'Not provided');put('workflowService',result.service||'Needs review');put('workflowBudget',result.budget||'Not provided');put('workflowTimeline',result.timeline||'Not provided');
    const badges={hot:'Ready to scope',warm:'Needs a few details',cold:'Needs context'};
    put('workflowBadge',badges[result.intent]);document.getElementById('workflowBadge').dataset.intent=result.intent;
    put('workflowSummary',result.summary);put('workflowReason',result.reasoning);put('workflowNext',result.suggested_action==='book_call'?'Suggest a scoping call':'Ask qualifying questions');
    put('workflowMissing',result.missing.length?`Still needed: ${result.missing.join(', ')}.`:'Core intake details are present.');
    put('workflowSubject',result.draft.subject);put('workflowDraft',result.draft.body);
    document.getElementById('workflowEmpty').hidden=true;output.hidden=false;copy.disabled=false;document.getElementById('workflowSteps').setAttribute('data-complete','true');run.textContent='Run again';status.textContent='Lead preview and reply draft are ready';
  }
  form.addEventListener('submit',event=>{event.preventDefault();error.textContent='';try{currentResult=engine.analyze(input.value);render(currentResult);}catch(e){clear();error.textContent=e.message;input.focus();}});
  input.addEventListener('input',()=>{clear();scenarioButtons.forEach(b=>b.setAttribute('aria-pressed','false'));});
  scenarioButtons.forEach(button=>button.addEventListener('click',()=>preset(button.dataset.scenario)));
  copy.addEventListener('click',async()=>{const result=currentResult;if(!result)return;try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(`${result.draft.subject}\n\n${result.draft.body}`);if(result===currentResult){copy.textContent='Copied';status.textContent='Draft copied. Nothing has been sent.';}}catch{status.textContent='Select the draft text to copy it; clipboard access is unavailable.';}});
  preset('calls');
})();
