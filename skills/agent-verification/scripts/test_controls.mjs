// All requests intercepted locally. No Agent 360/customer connection is used.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('playwright');
const read=name=>fs.readFileSync(new URL(name,import.meta.url),'utf8');
const controls=vm.runInNewContext(read('controls.js'));
const guard=vm.runInNewContext(fs.readFileSync(new URL('../../browser-navigation/scripts/agent360_guard.js',import.meta.url),'utf8'));
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
const html=`<main><input id="search"><ul id="options"></ul><button id="open">Close case</button>
<div role="dialog" hidden><input id="yes" type="radio" value="yes"><textarea id="reason"></textarea>
<button id="submit">Close case</button></div><p id="state">Open</p></main>
<script>let saves=0;document.querySelector('#search').oninput=e=>{
document.querySelector('#options').innerHTML='<li role="option">agent@example.invalid</li>';
document.querySelector('li').onclick=()=>{document.querySelector('#search').value='agent@example.invalid';document.querySelector('#options').innerHTML='';};};
document.querySelector('#open').onclick=()=>document.querySelector('[role=dialog]').hidden=false;
document.querySelector('#submit').onclick=()=>{saves++;document.querySelector('#submit').disabled=true;
setTimeout(()=>{document.querySelector('[role=dialog]').hidden=true;document.querySelector('#state').textContent='Case Closed';},25);};</script>`;
await context.route('**/*',route=>route.fulfill({contentType:'text/html',body:html}));
const page=await context.newPage();
try {
  await page.goto('http://127.0.0.1/synthetic-controls');
  await page.evaluate(controls.build([{kind:'fill',selector:'#search',value:'agent@example.invalid'}]));
  assert.equal(await page.locator('[role=option]').textContent(),'agent@example.invalid');
  await page.evaluate(controls.build([{kind:'click',selector:'[role=option]',text:'agent@example.invalid'}]));
  assert.equal(await page.locator('#search').inputValue(),'agent@example.invalid');
  await page.evaluate(controls.build([{kind:'click',selector:'button',text:'Close case'}]));
  await page.evaluate(controls.build([{kind:'click',scope:'[role=dialog]',selector:'input[value=yes]'},
    {kind:'fill',scope:'[role=dialog]',selector:'textarea',value:'Confirmed and verified'}]));
  assert.equal(await page.locator('#yes').isChecked(),true);
  assert.equal(await page.locator('#reason').inputValue(),'Confirmed and verified');
  const state={};let writes=0;
  await controls.stage(state,'close-case',guard,async()=>{
    writes++;const value=await page.evaluate(controls.build([{kind:'click',scope:'[role=dialog]',selector:'button',text:'Close case'}]));
    return {content:[{type:'text',text:JSON.stringify(value)}]};
  },async()=>{await page.waitForFunction(()=>document.querySelector('#state').textContent==='Case Closed');return true;});
  await assert.rejects(controls.stage(state,'close-case',guard,async()=>{writes++;},async()=>true));
  assert.equal(writes,1);
  assert.equal(await page.evaluate('saves'),1);
  await assert.rejects(page.evaluate(controls.build([{kind:'click',selector:'#missing'}])));
  await page.evaluate(()=>document.body.insertAdjacentHTML('beforeend','<button>Duplicate</button><button>Duplicate</button>'));
  await assert.rejects(page.evaluate(controls.build([{kind:'click',selector:'button',text:'Duplicate'}])));
  // Prevalidate every field: a missing later control cannot cause a partial fill.
  await assert.rejects(page.evaluate(controls.build([{kind:'fill',selector:'#search',value:'changed'},
    {kind:'click',selector:'#missing'}])));
  assert.equal(await page.locator('#search').inputValue(),'agent@example.invalid');
  const blocked={};
  await assert.rejects(controls.stage(blocked,'select-customer',guard,async()=>({content:[{type:'text',text:JSON.stringify({ok:false,maybe_landed:true})}]}),async()=>false));
  await assert.rejects(controls.stage(blocked,'create-case',guard,async()=>{writes++;},async()=>true));
  assert.equal(writes,1);

  // The readback probes consume synthetic UI on their exact expected origins.
  const customer='<main style="white-space:pre-line">Customer Info\nEmail\nagent@example.invalid\nPhone\n202-555-0123\nTrust level\nAllow\nAgent Info\nLicense #\nSYNTHETIC\nVerification\nVerified</main>';
  await context.unroute('**/*');
  await context.route('**/*',route=>route.fulfill({contentType:'text/html',body:customer}));
  await page.goto('https://opshub.apps.opendoor.com/customers/synthetic');
  const initial=await page.evaluate(read('read_customer.js'));
  const final=await page.evaluate(read('final_customer.js'));
  assert.equal(initial.agent_status,'Verified');assert.equal(final.home_access,'Allow');
  assert.equal(final.page,'final-customer');
  await context.unroute('**/*');
  await context.route('**/*',route=>route.fulfill({contentType:'text/html',body:'<main style="white-space:pre-line">Case Closed\nThreat Triggers\nTrust level: Allow\nVerification status\nVerified\n<a href="https://opshub.apps.opendoor.com/customers/synthetic">Customer</a></main>'}));
  await page.goto('https://alfred.ops.opendoor.com/user-reviews/synthetic');
  const closed=await page.evaluate(read('read_case.js'));
  assert.equal(closed.closed,true);assert.equal(closed.agent_status,'Verified');
  assert.equal(closed.customer_urls[0],'https://opshub.apps.opendoor.com/customers/synthetic');
  await page.evaluate(()=>document.body.insertAdjacentHTML('beforeend','<div role="dialog">Still saving</div>'));
  assert.equal((await page.evaluate(read('read_case.js'))).closed,false);
  await page.evaluate(()=>{document.querySelector('[role=dialog]').remove();document.querySelector('main').innerText='Case Open\nThreat Triggers\nActivity\nCase Closed';});
  assert.equal((await page.evaluate(read('read_case.js'))).closed,false,'An old Activity entry cannot establish current closure');
  console.log('Synthetic UI controls, delayed save, duplicate guards, and exact readback probes passed. Not a live Agent 360 capability test.');
} finally {await browser.close();}
