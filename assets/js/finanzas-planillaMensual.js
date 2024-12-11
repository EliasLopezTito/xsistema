const meses = {
    1 : 'ENERO',
    2 : 'FEBRERO',
    3 : "MARZO",
    4 : "ABRIL",
    5 : "MAYO",
    6 : "JUNIO",
    7 : "JULIO",
    8 : "AGOSTO",
    9 : "SEPTIEMBRE",
    10 : "OCTUBRE",
    11 : "NOVIEMBRE",
    12 : "DICIEMBRE"
}

$(document).ready(function(){
    
})

$("#btnCargarGraficos").click(function(){

    const anio = $("#anioBusqueda").val() 
    cargarData(anio);

})

function cargarData(anio){
    $.ajax({
        url: path + "finanzas/planillaMensual",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarBusqueda",
            anio : anio
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO GRÁFICOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (res) {
            if(res.respuesta === "success"){

                cargarTabla(res.data1);
                graficoResumenPlanilla(res.data2);
                Notiflix.Notify.Success("Los gráficos han sido cargados con éxito.");

            }else{
                Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor vuelva a intentarlo."); 
            }
        }
    })
}

function cargarTabla(data){

    $("#tablaPlanillaMensual tbody").html("")
    let enero = 0;
    let febrero = 0;
    let marzo = 0;
    let abril = 0;
    let mayo = 0;
    let junio = 0;
    let julio = 0;
    let agosto = 0;
    let setiembre = 0;
    let octubre = 0;
    let noviembre = 0;
    let diciembre = 0;
    let totalgeneral = 0;

    data.forEach(function(value,key){
        
        let newarray = [value.M1 , value.M2 , value.M3 , value.M4 , value.M5 , value.M6 , value.M7 , value.M8 ,value.M9 , value.M10 , value.M11 , value.M12];

        enero = (value.M1) + enero
        febrero = (value.M2) + febrero
        marzo = (value.M3) + marzo
        abril = (value.M4) + abril
        mayo = (value.M5) + mayo
        junio = (value.M6) + junio
        julio = (value.M7) + julio
        agosto = (value.M8) + agosto
        setiembre = (value.M9) + setiembre
        octubre = (value.M10) + octubre
        noviembre = (value.M11) + noviembre
        diciembre = (value.M12) + diciembre

        const total = newarray.reduce((acc,el) => acc + el , 0);
        totalgeneral = totalgeneral + total

        let td = newarray.map(function(val){
            if( val.toString().substring(0,1) === "-" ){
                return `<span style="color:red" >${new Intl.NumberFormat('en-US').format(val)}</span>`
            }else{
                return new Intl.NumberFormat('en-US').format(val)
            }
        })
        planilla = value.DetallePlanilla.includes("PLANILLA DE") ? value.DetallePlanilla.trim().replace("PLANILLA DE","") : value.DetallePlanilla.trim().replace("PLANILLA","")  
        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${ (value.DetallePlanilla.includes("GRATIFICACIONES") ? 'GRATIFICACIONES' : planilla ) }</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[0]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[1]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[2]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[3]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[4]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[5]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[6]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[7]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[8]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[9]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[10]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${td[11]}</td>
                    <td style="padding:0px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(total)}</b></td>                       
                </tr>`;

        $("#tablaPlanillaMensual tbody").append(tr);

    });
   
    let tr2 = `<tr style="background:#326299;color:#ffffff">                      
                <td style="padding:5px 7px;" class="celda-centrada"><b>Total General</b></td>                      
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(enero)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(febrero)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(marzo)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(abril)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(mayo)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(junio)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(julio)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(agosto)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(setiembre)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(octubre)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(noviembre)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(diciembre)}</b></td>
                <td style="padding:5px 7px;" class="celda-centrada"><b>${new Intl.NumberFormat('en-US').format(totalgeneral)}</b></td>                       
            </tr>`;
        
    $("#tablaPlanillaMensual tbody").append(tr2);

}

function graficoResumenPlanilla(data){

    if(data.length > 0){

        $("#divResumenPlanillas").html("<canvas id='graficoResumenPlanillas' height='400'></canvas>");
        const ctx = $('#graficoResumenPlanillas');

        const rgb = [ 
            ['rgba(54, 162, 235, 0.7)','rgb(54, 162, 235)'],
            ['rgba(75, 192, 192, 0.7)','rgb(75, 192, 192)'],
            ['rgba(255, 205, 86, 0.7)','rgb(255, 205, 86)'],
            ['rgba(255, 99, 132, 0.7)','rgb(255, 99, 132)'],
            ['rgba(201, 203, 207, 0.7)','rgb(201, 203, 207)'],
            ['rgba(45, 142, 85, 0.7)','rgb(45, 142, 85)'],
            ['rgba(20, 192, 135, 0.7)','rgb(20, 192, 135)'],
            ['rgba(12, 45, 86, 0.7)','rgb(12, 45, 86)'],
            ['rgba(192, 90, 132, 0.7)','rgb(192, 90, 132)'],
            ['rgba(201, 123, 207, 0.7)','rgb(201, 123, 207)'],
            ['rgba(78, 44, 85, 0.7)','rgb(78, 44, 85)'],
            ['rgba(89, 192, 11, 0.7)','rgb(89, 192, 11)']
        ]

        let datachart = {};
        let labels = [];
        let datasets = [
            {
                backgroundColor: [],
                borderColor : [],
                data: []
            }
        ];

        data.forEach(function(value,key){
            labels.push( value.DetallePlanilla.toUpperCase().replace('PLANILLA', 'P.') );
            datasets[0].backgroundColor.push( rgb[key][0] );
            datasets[0].borderColor.push( rgb[key][1] );
            datasets[0].data.push( value.monto );
        });

        datachart.labels = labels;
        datachart.datasets = datasets;
   
        const options = {
            scales: {
                y: {
                beginAtZero: false
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'RESUMEN DE PLANILLAS'
                },
                legend: {
                    display: false
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    formatter: new Intl.NumberFormat('en-US').format,
                    font: {
                        weight: 'bold'
                    }
                }
            },                                    
            reponsive : false,
            maintainAspectRatio : false
        }

        new Chart( ctx ,  {
            plugins : [ChartDataLabels],
            type: 'bar',
            data: datachart,
            options: options
        });

    }else{

        $("#divResumenPlanillas").html('<b style="font-size:13px">No se encontro información disponible</b>');

    }

}

function colorAleatorio() {
    var makingColorCode = '0123456789ABCDEF';
    var finalCode = '#';
    for (var counter = 0; counter < 6; counter++) {
       finalCode = finalCode + makingColorCode[Math.floor(Math.random() * 16)];
    }
    return finalCode;
}