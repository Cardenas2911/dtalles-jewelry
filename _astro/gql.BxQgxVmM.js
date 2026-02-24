const c=(g,...r)=>g.reduce((n,$,t)=>`${n}${$}${t in r?String(r[t]):""}`,"");export{c as g};
