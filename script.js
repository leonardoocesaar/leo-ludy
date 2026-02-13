let tabela = document.querySelector("#tabela tbody");
let graficoAtual, graficoMeta;

for (let i = 0; i < 10; i++) adicionarLinha();

function adicionarLinha(nome="", atual=0, meta=0){
let tr = document.createElement("tr");
tr.innerHTML = `
<td><input value="${nome}"></td>
<td><input type="number" value="${atual}" oninput="atualizarGraficos()"></td>
<td><input type="number" value="${meta}" oninput="atualizarGraficos()"></td>
<td><button onclick="this.parentElement.parentElement.remove(); atualizarGraficos()">X</button></td>
`;
tabela.appendChild(tr);
}

function pegarDados(coluna){
let dados=[];
let labels=[];
[...tabela.rows].forEach(row=>{
let nome=row.cells[0].children[0].value;
let valor=parseFloat(row.cells[coluna].children[0].value)||0;
if(nome && valor>0){
labels.push(nome);
dados.push(valor);
}
});
return {labels,dados};
}

function criarGrafico(ctx, labels, valores){
return new Chart(ctx,{
type:'pie',
data:{
labels:labels,
datasets:[{
data:valores,
backgroundColor:['#4e79a7','#f28e2b','#e15759','#76b7b2','#edc948','#b07aa1','#ff9da7','#9c755f','#59a14f','#bab0ac'],
borderColor:'#fff',
borderWidth:2
}]
},
options:{
plugins:{
legend:{
labels:{color:'white'}
},
datalabels:{
color:'#fff',
formatter:(value,ctx)=>{
let total=ctx.chart.data.datasets[0].data.reduce((a,b)=>a+b,0);
return ((value/total)*100).toFixed(1)+"%";
}
}
}
},
plugins:[ChartDataLabels]
});
}

function atualizarGraficos(){
let atual=pegarDados(1);
let meta=pegarDados(2);

if(graficoAtual) graficoAtual.destroy();
if(graficoMeta) graficoMeta.destroy();

graficoAtual=criarGrafico(document.getElementById("graficoAtual"),atual.labels,atual.dados);
graficoMeta=criarGrafico(document.getElementById("graficoMeta"),meta.labels,meta.dados);
}

function salvarLayout(){
let dados=[];
[...tabela.rows].forEach(row=>{
dados.push({
nome:row.cells[0].children[0].value,
atual:row.cells[1].children[0].value,
meta:row.cells[2].children[0].value
});
});
localStorage.setItem("layout",JSON.stringify(dados));
alert("Layout salvo!");
}

function carregarLayout(){
let dados=JSON.parse(localStorage.getItem("layout")||"[]");
if(dados.length){
tabela.innerHTML="";
dados.forEach(d=>adicionarLinha(d.nome,d.atual,d.meta));
}
atualizarGraficos();
}

function exportarPDF(){
let doc=new jspdf.jsPDF();
doc.text("Leo & Ludy - Asset Allocation",20,20);
doc.save("portfolio.pdf");
}

window.onload=carregarLayout;
