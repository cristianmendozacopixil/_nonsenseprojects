(
  async () => {
    let response = await fetch('https://cdn.statically.io/gh/cristianmendozacopixil/_nonsenseprojects/develop/nonsensecdns/mh.list.json')
    const sagas = await response.json()
    const list=Object.entries(document.querySelectorAll('.post-body a')).map(([k,v])=>v).filter(el=>RegExp('Capitulo').test(el.outerHTML));
    const setChapter = (params, el, cNumber) => {
      Object.keys(params).forEach((k) => {
        const { range_chapters, data } = params[k];
        if (data !== undefined) {
          setChapter(data, el, cNumber)
        } else {
          const [rI, rE] = range_chapters.split("-");
          if (cNumber >= Number(rI) && cNumber <= Number(rE)) {
            params[k]["chapters"] = params[k]["chapters"] !== undefined ? params[k]["chapters"] : [];
            params[k]["chapters"].push(el);
            return false;
          }
        }
      });
    }
    list.forEach((el) => {
      const cNumber = el.outerHTML.substring(el.outerHTML.indexOf("capitulo-") + 9, el.outerHTML.indexOf(".html"));
      setChapter(sagas, el, cNumber)
    });
    const displayContent = (params) => {
      let content = '';
      params.forEach((el) => {
        content += `<details><summary>${el.range_chapters ?? '+'} ${el.name} ${el.chapters !== undefined ? el.chapters.length : ''}</summary><section>`
        if (el.data !== undefined) {
          content += displayContent(el.data)
        } else {
          if (el.chapters !== undefined) {
            content += `<ul>${el.chapters.map(ch=>`<li><span class="item-link" role="link" data-id="${ch.innerHTML.substring(ch.innerHTML.indexOf("Capitulo")+8, ch.innerHTML.length).trim()}" onClick="openElement(this, '${ch.getAttribute('href')}')">${ch.innerHTML.substring(ch.innerHTML.indexOf("Capitulo"), ch.innerHTML.length)}</span></li>`)}</ul>`.replaceAll('>,', '>')
          }
        }
        content += `</section></details>`
      })
      return content
    }
    document.querySelector('body').innerHTML=`<nav id="sidebar" class="col-12 col-xl-2"><section class="list">${displayContent(sagas)}</section><button class="floating-button" id="hide-sidebar" onclick="hideSidebar(this)">x</button></nav><section id="content" class="col d-md-block"></section>`

    const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML=css;

    addCSS(`body{font-size:18px!important;height:99vh!important;display:flex!important;padding:0!important;min-height:initial!important}#sidebar{height:100vh;position:relative!important}#sidebar .list{overflow:hidden scroll;height:100%}.col-2{flex:0 0 auto;width:16.66666667%}.col-12{flex:0 0 auto;width:100%}.col{flex:1 0 0%;width:100%}.d-none{display:none!important}details{cursor:pointer;padding-left:12px}.item-link{color:#f4a900}.item-link.selected,.item-link:hover{color:#c60}.floating-button{position:absolute;width:26px;height:45px;top:0;right:-26px;border-radius:0 8px 8px 0;z-index:9999;display:flex;align-items:center;text-align:center;padding-left:8px;cursor:pointer;border:none}#hide-sidebar{background-color:gray;color:#fff!important}.hidden{width:0!important;height:0!important;display:block!important}@media (max-width:767px){.floating-button{right:0!important;transform:scaleX(-1)}.hidden .floating-button{right:-26px!important;transform:scaleX(1)}}@media (min-width:768px){.d-md-block{display:block!important}}@media (min-width:1200px){.col-xl-2{flex:0 0 auto;width:16.66666667%}}`)
    /* const getUrlParam = (p) => (new URLSearchParams(window.location.search)).get(p);
    const setCurrentChapter = () => {
      if (getUrlParam('chapter') ?? false) {
        let el = document.querySelector(`.item-link[data-id='${getUrlParam('chapter')}']`)
        el.click()
        selectAllParents(el, "details")
      }
    }
    setCurrentChapter() */
  }
)()

let hideSidebar = (param) =>  {
  let c = param.closest('#sidebar');
  if (!c.classList.contains('hidden')) {
    c.classList.remove('col-2')
    c.classList.add('hidden')
    document.querySelector('#content').classList.remove('d-none')
  } else {
    c.classList.add('col-2')
    c.classList.remove('hidden')
    document.querySelector('#content').classList.add('d-none')
  }
}
let openElement = (t,p)=>{
  document.querySelectorAll('span.item-link').forEach(el=>el.classList.remove('selected'))
  t.classList.add('selected')
  let id = t.getAttribute('data-id')
  history.replaceState(null, null, `${window.location.origin}${window.location.pathname}?chapter=${id}`)
  document.querySelector('#content').innerHTML = `<embed src="${p}" style="width:100%;height:100%;">`
}
