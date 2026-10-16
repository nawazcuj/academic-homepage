#!/usr/bin/env python3
"""Faithful static export of public pages of TheTrefoil. No server/database/admin files exported."""
from pathlib import Path
from urllib.parse import quote
from types import SimpleNamespace
import os, shutil, json, zlib, base64
from jinja2 import Environment, FileSystemLoader, select_autoescape
from bs4 import BeautifulSoup

SCRIPT_DIR=Path(__file__).resolve().parent
ROOT=Path(os.environ.get('TT_SOURCE_DIR',SCRIPT_DIR))
OUTPUT=Path(os.environ.get('TT_DEST',ROOT/'_export'))
BASE='/academic-homepage/'
TYPES={'course':'Courses','note':'Lecture Notes','video':'YouTube Lectures','publication':'Publications / Preprints','project':'Research Projects','resource':'Resources','post':'Blog & Updates','event':'Conferences & Workshops','person':'Collaborators'}
SOCIAL={'institution':'Institutional profile','scholar':'Google Scholar','orcid':'ORCID','researchgate':'ResearchGate','arxiv':'arXiv','mathscinet':'MathSciNet','zbmath':'zbMATH','youtube':'YouTube'}
data=json.loads(zlib.decompress(base64.b64decode((SCRIPT_DIR/'public-data.b64').read_text())).decode('utf-8'))
SETTINGS=data['settings']
ALL=data['content']
CATS={kind:sorted({r['category'] for r in ALL if r['type']==kind and r['category']}) for kind in TYPES}
# Only public academic data is exported. The original private database is never included.
SETTINGS['cv_url']='' if not (ROOT/'static/documents/academic_cv.pdf').exists() else SETTINGS.get('cv_url','')
def rows(kind=None):return [r for r in ALL if not kind or r['type']==kind]
def url_for(endpoint,**kw):
 if endpoint=='static':return 'static/'+kw.get('filename','')
 if endpoint=='home':return './'
 if endpoint=='about':return 'about/'
 if endpoint=='contact':return 'contact/'
 if endpoint=='cv':return 'cv/'
 if endpoint=='search':return 'search/'
 if endpoint=='listing':return str(kw['kind'])+'/'
 if endpoint=='detail':return str(kw['kind'])+'/'+quote(kw['slug'])+'/'
 if endpoint=='files':return 'files/'+quote(kw.get('filename',''))
 if endpoint.startswith('admin'):return '#'
 return '#'
def youtube_id(url):
 import urllib.parse
 p=urllib.parse.urlparse(url or '')
 if p.netloc in ('youtu.be','www.youtu.be'):return p.path.strip('/').split('/')[0]
 if p.netloc in ('youtube.com','www.youtube.com','m.youtube.com'):
  return urllib.parse.parse_qs(p.query).get('v',[''])[0] if p.path=='/watch' else ''
 return ''
env=Environment(loader=FileSystemLoader(ROOT/'templates'),autoescape=select_autoescape(['html','xml']))
env.globals.update(url_for=url_for,site=SETTINGS,social=SOCIAL,csrf_token='',types=TYPES,base_url='https://nawazcuj.github.io/academic-homepage/',get_flashed_messages=lambda **x:[])
env.filters['paragraphs']=lambda x:(x or '').split('\n\n')
env.filters['youtube']=youtube_id
def render(name,title,path,**vars):
 env.globals['request']=SimpleNamespace(path=path,base_url='https://nawazcuj.github.io/academic-homepage/'+path.strip('/')+'/',args={})
 html=env.get_template(name).render(title=title,**vars)
 soup=BeautifulSoup(html,'lxml')
 if soup.head:
  base=soup.new_tag('base',href=BASE)
  soup.head.insert(0,base)
  for script in list(soup.head.find_all('script',src=True))+list(soup.body.find_all('script',src=True)):
   if script.get('src','').endswith('js/live-search.js'):script.decompose()
  soup.head.append(soup.new_tag('link',rel='stylesheet',href='static/css/tt-static-site.css'))
  soup.head.append(soup.new_tag('script',src='static/js/tt-static-site.js',defer=''))
 for e in soup.select('form[action*="/admin"]'):e.decompose()
 for tag in soup.find_all(True):
  for attr in ('src','href','poster'):
   val=tag.get(attr)
   if isinstance(val,str) and val.startswith('/static/'):tag[attr]=val.lstrip('/')
 if path=='contact/':
  form=soup.select_one('form.ttc-form')
  if form:
   box=soup.new_tag('div')
   a=soup.new_tag('a',href='mailto:'+SETTINGS.get('email',''))
   a['class']='ttc-submit';a.string='Email for academic correspondence ↗'
   p=soup.new_tag('p');p.string='The GitHub Pages edition is static. Email opens your mail application; no message is saved on this website.'
   box.append(a);box.append(p);form.replace_with(box)
 if path=='search/':
  container=soup.select_one('section.section .container')
  if container:
   results=soup.new_tag('div',id='tt-static-search-results');results['class']='cards';container.append(results)
 for form in soup.select('form.filter-bar'):
  if path!='search/':form['data-tt-static-filter']='true'
 out=OUTPUT/path/'index.html' if path else OUTPUT/'index.html'
 out.parent.mkdir(parents=True,exist_ok=True)
 out.write_text(str(soup),encoding='utf-8')
if OUTPUT.exists():shutil.rmtree(OUTPUT)
OUTPUT.mkdir(parents=True)
shutil.copytree(ROOT/'static',OUTPUT/'static',ignore=shutil.ignore_patterns('.DS_Store','__MACOSX','*.zip'))
shutil.copy2(SCRIPT_DIR/'tt-static-site.js',OUTPUT/'static/js/tt-static-site.js')
shutil.copy2(SCRIPT_DIR/'tt-static-site.css',OUTPUT/'static/css/tt-static-site.css')
render('home.html','Home','',courses=rows('course'),notes=rows('note'),videos=rows('video'),publications=rows('publication'),posts=rows('post'),resources=rows('resource'))
render('about.html','About','about/')
render('cv.html','Curriculum Vitae','cv/')
render('contact.html','Contact','contact/')
render('search.html','Search','search/',q='',results=[])
for kind in TYPES:
 if kind=='publication':
  pub=[r for r in rows(kind) if 'preprint' not in (r['category'] or '').lower()]
  prep=[r for r in rows(kind) if 'preprint' in (r['category'] or '').lower()]
  render('publications.html','Publications & Preprints',kind+'/',published=pub,preprints=prep)
 elif kind=='post':
  entries=rows('post')
  render('blog.html','Blog',kind+'/',entries=entries[1:],featured=entries[0] if entries else None,categories=CATS[kind],q='',category='',page=1,pages=1,page_size=8,total=len(entries))
 else:render('listing.html',TYPES[kind],kind+'/',kind=kind,entries=rows(kind),q='',category='',categories=CATS[kind])
 for entry in rows(kind):render('detail.html',entry['title'],kind+'/'+entry['slug']+'/',entry=entry,kind=kind,attachments=[])
index=[{'title':r['title'],'type':r['type'],'category':r['category'],'summary':r['summary'] or '','href':url_for('detail',kind=r['type'],slug=r['slug'])} for r in ALL]
(OUTPUT/'static/data').mkdir(exist_ok=True)
(OUTPUT/'static/data/public-index.json').write_text(json.dumps(index,ensure_ascii=False,indent=0),encoding='utf-8')
(OUTPUT/'.nojekyll').write_text('')
(OUTPUT/'README.md').write_text('Generated public static edition of TheTrefoil. Flask admin/database/messaging functions require a server and are not included.\n')
print('Built',len(list(OUTPUT.glob('**/index.html'))),'HTML pages;',len(ALL),'public academic records.')
