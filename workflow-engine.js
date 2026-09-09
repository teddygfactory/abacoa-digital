/* Deterministic demo rules. No AI request, persistence, or external side effect. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AbacoaWorkflow = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const scenarios = {
    calls: {
      label: 'Missed calls',
      message: "Name: Maya\nEmail: maya@example.com\nWe miss customer calls while we're out on jobs. I need a voice agent that answers common questions and captures callback requests.\nBudget: $3,000\nTimeline: within 2 weeks"
    },
    followup: {
      label: 'Lead follow-up',
      message: "Name: Jordan\nEmail: jordan@example.com\nOur website leads sit in a spreadsheet and we forget to follow up. I'd like an automation that organizes requests and prepares responses for our team.\nTimeline: next month\nWe haven't set a budget yet."
    },
    knowledge: {
      label: 'Private AI',
      message: "Name: Alex\nOur team keeps searching the same internal documents. Could a private AI assistant help us find answers using our own knowledge? We are exploring options."
    }
  };
  const serviceRules = [
    {label:'Voice agent',pattern:/\b(voice agent|miss(?:ed)? calls|miss customer calls|answer(?:s|ing)? calls|phone calls|callback requests)\b/i,context:'how you handle calls today',subject:'your voice agent inquiry'},
    {label:'Private AI',pattern:/\b(private ai|internal documents|knowledge|internal assistant)\b/i,context:'which documents your team needs to search and who should have access',subject:'your private AI inquiry'},
    {label:'Workflow automation',pattern:/\b(automation|workflow|follow.up|spreadsheet|manual tasks)\b/i,context:'how a request moves through your team today',subject:'your workflow inquiry'},
    {label:'Web or app build',pattern:/\b(website|web app|portal|dashboard|mobile app)\b/i,context:'what customers need to do on your site or app',subject:'your build inquiry'}
  ];
  function field(text, label) {
    const match=text.match(new RegExp('^\\s*'+label+'\\s*:\\s*([^\\r\\n]+)','im'));
    return match ? match[1].trim() : null;
  }
  function analyze(message) {
    if(typeof message!=='string') throw new TypeError('Enter an inquiry to run the demo.');
    const text=message.trim();
    if(text.length<20) throw new Error('Add a little more detail about what the business needs (at least 20 characters).');
    if(text.length>1800) throw new Error('Keep this demo inquiry under 1,800 characters.');
    const name=field(text,'name'),email=text.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)?.[0]||null;
    // Only explicit labeled values are extracted. Unknowns stay unknown.
    const budgetField=field(text,'budget');
    const budget=budgetField && /^\$\s*(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?\s*[kK]?(?:\s*(?:to|[-–])\s*\$?\s*(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?\s*[kK]?)?\.?$/.test(budgetField) ? budgetField.replace(/\.$/,'') : null;
    const timelineField=field(text,'timeline');
    const timeline=timelineField && !/\b(unknown|unsure|undecided|not set|not sure|tbd|none)\b/i.test(timelineField) ? timelineField : null;
    const service=serviceRules.find(rule=>rule.pattern.test(text));
    const intent=service && budget && timeline ? 'hot' : (service||budget||timeline) ? 'warm' : 'cold';
    const missing=[];
    if(!service) missing.push('a specific project goal');
    if(!budget) missing.push('budget');
    if(!timeline) missing.push('timeline');
    if(!email) missing.push('email');
    const suggested_action=intent==='hot'?'book_call':'qualify';
    const summary=service ? `${service.label} inquiry${budget?` with a ${budget} budget`:''}${timeline?` and a ${timeline} timeline`:''}.` : 'The request needs a clearer project goal before it can be scoped.';
    const reasoning=intent==='hot'?'A recognized service, explicit budget, and timeline are present. Suggest a scoping call.':service?'There is a recognizable need, with details to clarify before scoping.':'No supported service was recognized by these sample rules. Ask for context and review the request.';
    const greeting=name?`Hi ${name},`:'Hi,';
    const questions=[];
    if(!service) questions.push('What would you like the system to help your business do?');
    else questions.push(`Could you walk me through ${service.context}?`);
    if(!budget) questions.push('What budget range are you considering?');
    if(!timeline) questions.push('When would you like to get started?');
    const body=[greeting,'',service?`Let's look at what a ${service.label.toLowerCase()} would need to do for your team.`:"I'd like to understand the project before suggesting a solution.",...(budget?[`I've noted your ${budget} budget${timeline?` and ${timeline} timeline`:''}.`]:timeline?[`I've noted your ${timeline} timeline.`]:[]),...questions,intent==='hot'?'What time window would work for a 20-minute scoping call?':'Reply with those details and we can work out the next step.','','Mike'].join('\n');
    return {name,email,service:service?.label||null,budget,timeline,intent,summary,suggested_action,reasoning,missing,draft:{subject:`Re: ${service?.subject||'your inquiry'}`,body}};
  }
  return {scenarios,analyze};
});
