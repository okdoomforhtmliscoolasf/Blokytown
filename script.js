const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const N=12,STORE="blocktown_project_006",W=1000,H=700,TW=58,TH=29;
const palette={grass:"#a9c28a",road:"#777a78",water:"#83b9c8",park:"#91b77c",house:"#d7aa83",apartment:"#a8b7c7",shop:"#e4c27d",office:"#9cabb7",tree:"#6f9b60",lamp:"#e5ce82",fountain:"#8cb9c5",erase:"#d8a4a0"};
let map=Array.from({length:N},()=>Array.from({length:N},()=>({type:"grass"})));
let selected="grass",rotation=0,zoom=1,cityName="Little Somewhere";
let canvas=$("#city-canvas"),ctx=canvas.getContext("2d");
function uid(){return window.crypto&&crypto.randomUUID?crypto.randomUUID():"bt-"+Date.now()+"-"+Math.random().toString(36).slice(2)}
function save(){localStorage.setItem(STORE,JSON.stringify({map,cityName,rotation}));$("#save-status").textContent="SAVED LOCALLY"}
function toast(s){let t=$("#toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900)}
function point(i,j){let ri,rj;switch(rotation%4){case 1:ri=N-1-j;rj=i;break;case 2:ri=N-1-i;rj=N-1-j;break;case 3:ri=j;rj=N-1-i;break;default:ri=i;rj=j}return{x:W/2+(ri-rj)*TW/2,y:95+(ri+rj)*TH/2}}
function polygon(points,fill,stroke="#6d7861",line=1){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let p of points.slice(1))ctx.lineTo(p[0],p[1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=line;ctx.stroke()}}
function diamond(x,y,fill,stroke="#7d8d6d"){polygon([[x,y],[x+TW/2,y+TH/2],[x,y+TH],[x-TW/2,y+TH/2]],fill,stroke,.8)}
function block(x,y,w,d,h,top,left,right){let a=[x-w/2,y],b=[x,y+d/2],c=[x+w/2,y],e=[x,y-d/2];polygon([[e[0],e[1]],[a[0],a[1]],[a[0],a[1]+h],[e[0],e[1]+h]],left,"#5d625d",1);polygon([[e[0],e[1]],[c[0],c[1]],[c[0],c[1]+h],[e[0],e[1]+h]],right,"#5d625d",1);polygon([e,c,b,a],top,"#5d625d",1)}
function drawObject(type,x,y){
 if(type==="grass")return;
 if(type==="road"){diamond(x,y+3,"#777b79","#666b68");ctx.strokeStyle="#e9e3c8";ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(x-10,y+TH/2+1);ctx.lineTo(x+10,y+TH/2+1);ctx.stroke();ctx.setLineDash([]);return}
 if(type==="water"){diamond(x,y+3,"#78b7c9","#568da0");ctx.strokeStyle="#c8edf0";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-13,y+TH/2);ctx.lineTo(x-5,y+TH/2+4);ctx.lineTo(x+3,y+TH/2);ctx.lineTo(x+12,y+TH/2+4);ctx.stroke();return}
 if(type==="park"){diamond(x,y+3,"#7fa96e","#65875a");for(let k=0;k<3;k++){let tx=x+(k-1)*11,ty=y+TH/2-4+(k%2)*3;tree(tx,ty,0.75)}return}
 if(type==="tree"){tree(x,y+TH/2-2,1);return}
 if(type==="lamp"){ctx.strokeStyle="#54564d";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y+8);ctx.lineTo(x,y-25);ctx.stroke();ctx.fillStyle="#f5df86";ctx.beginPath();ctx.arc(x,y-28,5,0,Math.PI*2);ctx.fill();return}
 if(type==="fountain"){diamond(x,y+4,"#aaa99a","#76796f");ctx.fillStyle="#80c1d0";ctx.beginPath();ctx.ellipse(x,y+TH/2,12,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#e3f5ed";ctx.fillRect(x-1,y+4,2,12);return}
 if(type==="house"){block(x,y+TH/2-2,32,20,28,"#d9b48c","#bd8e6e","#a8755a");polygon([[x-19,y+TH/2-30],[x,y+TH/2-46],[x+19,y+TH/2-30],[x,y+TH/2-15]],"#a94e3e","#6e4338");ctx.fillStyle="#e9dfbb";ctx.fillRect(x-5,y+TH/2-16,8,14);return}
 if(type==="apartment"||type==="office"){let h=type==="office"?90:66,w=type==="office"?36:34;block(x,y+TH/2-2,w,25,h,type==="office"?"#9fb3b8":"#c4cbd0","#7d9299","#6f838c");for(let r=0;r<(type==="office"?4:3);r++)for(let c=0;c<2;c++){ctx.fillStyle="#e8dcae";ctx.fillRect(x-11+c*13,y+TH/2-h+12+r*15,6,8)}return}
 if(type==="shop"){block(x,y+TH/2-2,36,24,25,"#e8d19b","#c9a76d","#b78e55");ctx.fillStyle="#9e5544";ctx.fillRect(x-16,y+TH/2-29,32,7);ctx.fillStyle="#e8f0df";ctx.fillRect(x-10,y+TH/2-17,20,12);return}
}
function tree(x,y,s=1){ctx.fillStyle="#775f43";ctx.fillRect(x-2*s,y-8*s,4*s,12*s);ctx.fillStyle="#4f8052";ctx.beginPath();ctx.arc(x,y-15*s,10*s,0,Math.PI*2);ctx.fill();ctx.fillStyle="#75a46b";ctx.beginPath();ctx.arc(x-4*s,y-20*s,6*s,0,Math.PI*2);ctx.fill()}
function render(){
 ctx.clearRect(0,0,W,H);ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);
 for(let sum=0;sum<2*N-1;sum++)for(let i=0;i<N;i++){let j=sum-i;if(j<0||j>=N)continue;let p=point(i,j);diamond(p.x,p.y,"#b7ca98","#8da17d");}
 for(let sum=0;sum<2*N-1;sum++)for(let i=0;i<N;i++){let j=sum-i;if(j<0||j>=N)continue;let p=point(i,j),t=map[i][j].type;drawObject(t,p.x,p.y)}
 ctx.restore();updateStats();
}
function updateStats(){let counts={};map.flat().forEach(c=>counts[c.type]=(counts[c.type]||0)+1);let homes=(counts.house||0)*4+(counts.apartment||0)*18;$("#population").textContent=homes.toLocaleString();$("#buildings").textContent=(counts.house||0)+(counts.apartment||0)+(counts.shop||0)+(counts.office||0);$("#greenery").textContent=(counts.tree||0)+(counts.park||0);$("#roads").textContent=counts.road||0;$("#water").textContent=counts.water||0;$("#check-house").classList.toggle("done",!!(counts.house||counts.apartment));$("#check-road").classList.toggle("done",!!counts.road);$("#check-park").classList.toggle("done",!!(counts.park||counts.tree));$("#check-shop").classList.toggle("done",!!counts.shop)}
function selectTool(t){selected=t;$$(".tool").forEach(b=>b.classList.toggle("active",b.dataset.tool===t));$("#active-tool-label").textContent="TOOL: "+t.toUpperCase()}
$$(".tool").forEach(b=>b.onclick=()=>selectTool(b.dataset.tool));
function toTile(px,py){let x=(px-W/2)/zoom+W/2,y=(py-H/2)/zoom+H/2;let dx=(x-W/2)*2/TW,dy=(y-95)*2/TH;let ri=Math.round((dx+dy)/2),rj=Math.round((dy-dx)/2);let i,j;switch(rotation%4){case 1:i=rj;j=N-1-ri;break;case 2:i=N-1-ri;j=N-1-rj;break;case 3:i=N-1-rj;j=ri;break;default:i=ri;j=rj}return{i,j}}
canvas.addEventListener("click",e=>{let r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H,{i,j}=toTile(x,y);if(i<0||j<0||i>=N||j>=N)return;map[i][j]={type:selected==="erase"?"grass":selected};save();render()});
$("#rotate-map").onclick=()=>{rotation=(rotation+1)%4;save();render();toast("Map rotated")};
$("#zoom-in").onclick=()=>{zoom=Math.min(1.35,zoom+.1);render()};$("#zoom-out").onclick=()=>{zoom=Math.max(.7,zoom-.1);render()};
$("#city-name").oninput=e=>{cityName=e.target.value;save()};
$("#clear-city").onclick=()=>{if(confirm("Clear every tile and start over?")){map=Array.from({length:N},()=>Array.from({length:N},()=>({type:"grass"})));save();render();toast("Map cleared")}};
$("#new-city").onclick=()=>{if(confirm("Start a new city? This clears the current map.")){map=Array.from({length:N},()=>Array.from({length:N},()=>({type:"grass"})));cityName="Little Somewhere";$("#city-name").value=cityName;rotation=0;zoom=1;save();render();toast("New city ready")}};
$("#export-city").onclick=()=>{let a=document.createElement("a"),u=URL.createObjectURL(new Blob([JSON.stringify({map,cityName,rotation},null,2)],{type:"application/json"}));a.href=u;a.download="blocktown-city.json";a.click();URL.revokeObjectURL(u);toast("City JSON exported")};
$("#import-city").onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let d=JSON.parse(await f.text());if(!Array.isArray(d.map)||d.map.length!==N||d.map.some(row=>!Array.isArray(row)||row.length!==N))throw 0;map=d.map;cityName=String(d.cityName||"Imported City").slice(0,28);rotation=Number(d.rotation||0)%4;$("#city-name").value=cityName;save();render();toast("City imported")}catch(err){toast("Invalid city file")}e.target.value=""};
$("#export-png").onclick=()=>{let a=document.createElement("a");a.download=(cityName||"blocktown").toLowerCase().replace(/[^a-z0-9]+/g,"-")+".png";a.href=canvas.toDataURL("image/png");a.click();toast("Map image exported")};
$("#theme-toggle").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("blocktown-dark",document.body.classList.contains("dark"))};
if(localStorage.getItem("blocktown-dark")==="true")document.body.classList.add("dark");
try{let d=JSON.parse(localStorage.getItem(STORE));if(d&&Array.isArray(d.map)&&d.map.length===N){map=d.map;cityName=d.cityName||cityName;rotation=d.rotation||0;$("#city-name").value=cityName}}catch(e){}
selectTool("grass");render();
