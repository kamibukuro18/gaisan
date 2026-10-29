/* Run a local static server, then: node tests/models-browser.cjs http://127.0.0.1:8000/
   Requires Playwright + Chromium. Screenshots are kept outside the public repository. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = process.argv[2] || 'http://127.0.0.1:8000/';
const url = new URL('models.html',root).href;
const artifacts = process.env.QA_ARTIFACTS || '/tmp/gaisan-model-catalog-qa';
(async () => {
  fs.mkdirSync(artifacts,{recursive:true});
  const browser = await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const errors = [];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);
  await page.locator('.model-card').nth(102).waitFor();
  assert.equal(await page.locator('.model-card').count(),103);
  const ids = await page.locator('.model-card').evaluateAll(nodes=>nodes.map(node=>node.id));
  assert.equal(new Set(ids).size,103);
  // Eager-decode every image, including those far below the fold.
  const imageResults = await page.locator('.model-preview img').evaluateAll(async images=>Promise.all(images.map(async image=>{
    image.loading='eager';
    try {await image.decode();return {src:image.getAttribute('src'),ok:image.naturalWidth>0};}catch{return {src:image.getAttribute('src'),ok:false};}
  })));
  assert.equal(imageResults.filter(image=>!image.ok).length,0,JSON.stringify(imageResults.filter(image=>!image.ok)));
  await page.screenshot({path:path.join(artifacts,'desktop.png'),fullPage:false});
  const input = page.getByLabel('名前・ID・タグで検索');
  await input.fill('コーヒー');
  assert.ok(await page.locator('.model-card').count()>0);
  await input.fill('CoFfEe');
  assert.ok(await page.locator('.model-card').count()>0);
  await input.fill('ｍ３００－００１');
  assert.equal(await page.locator('.model-card').count(),1);
  assert.equal(await page.locator('.model-card').first().getAttribute('id'),'M300-001');
  await input.fill('no-such-model-zzzz');
  assert.equal(await page.locator('.model-card').count(),0);
  assert.equal(await page.locator('#model-empty').isVisible(),true);
  await page.getByRole('button',{name:'条件をリセットして全件表示'}).click();
  assert.equal(await page.locator('.model-card').count(),103);
  assert.equal(await input.inputValue(),'');
  const categoryButtons = page.locator('.models-category');
  const categoryCount = await categoryButtons.count();
  assert.ok(categoryCount>2);
  // Repeated filtering must not accumulate stale cards or event handlers.
  for (let index=1;index<categoryCount;index++) {
    const button=categoryButtons.nth(index);
    await button.click();
    const category=await button.getAttribute('data-category');
    assert.equal(await button.getAttribute('aria-pressed'),'true');
    assert.ok(await page.locator('.model-card').count()>0);
    assert.ok((await page.locator('.model-category').allTextContents()).every(value=>value===category));
  }
  await page.getByRole('button',{name:'リセット',exact:true}).click();
  assert.equal(await page.locator('.model-card').count(),103);
  await categoryButtons.nth(1).click();
  const firstCategory=await categoryButtons.nth(1).getAttribute('data-category');
  await categoryButtons.nth(2).click();
  await page.goBack();
  assert.equal(new URL(page.url()).searchParams.get('category'),firstCategory);
  assert.ok((await page.locator('.model-category').allTextContents()).every(value=>value===firstCategory));
  await page.goForward();
  assert.equal(await categoryButtons.nth(2).getAttribute('aria-pressed'),'true');
  await page.getByRole('button',{name:'リセット',exact:true}).click();
  await input.fill('<script>');
  assert.equal(await page.locator('.model-card').count(),0);
  assert.equal(await page.locator('script').count(),1);
  await page.getByRole('button',{name:'リセット',exact:true}).click();
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:path.join(artifacts,'mobile.png'),fullPage:false});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile horizontal overflow');
  await page.locator('#M300-103').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(artifacts,'mobile-last-model.png'),fullPage:false});
  await page.getByRole('link',{name:'← 作品棚に戻る'}).last().click();
  assert.ok(page.url().includes('index.html#works'));
  await page.goBack();
  await page.locator('.model-card').nth(102).waitFor();
  assert.equal(await page.locator('.model-card').count(),103);
  const publicLinks=await page.locator('a[href^="https:"]').evaluateAll(nodes=>nodes.map(node=>node.href));
  assert.deepEqual(publicLinks,['https://github.com/kamibukuro18']);
  assert.equal(errors.length,0,errors.join('\n'));
  // Failed data requests have an accessible retry and do not claim zero results.
  await page.route('**/assets/models/index.json*',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.reload();
  await page.locator('#model-error').waitFor({state:'visible'});
  assert.equal(await page.getByRole('button',{name:'もう一度読み込む'}).isEnabled(),true);
  await page.unroute('**/assets/models/index.json*');
  await page.getByRole('button',{name:'もう一度読み込む'}).click();
  await page.locator('.model-card').nth(102).waitFor();
  await browser.close();
  console.log(JSON.stringify({ok:true,models:103,images:imageResults.length,categories:categoryCount-1,desktop:'1440x1000',mobile:'390x844',artifacts},null,2));
})().catch(error=>{console.error(error);process.exit(1);});
