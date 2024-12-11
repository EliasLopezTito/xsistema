$(document).ready(function(){
    //cargarTabla( $("#anioBusqueda").val() , $("#mesBusqueda").val() );
})

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
};

$("#btnBuscar").click(function(){

    const anio = $("#anioBusqueda").val() 
    const mes = $("#mesBusqueda").val()
    const sede = $("#sedeBusqueda").val()
    cargarData(anio , mes , sede);

})

function cargarData(anio , mes , sede){

    $.ajax({
        url: path + "finanzas/ventasPorMes",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarBusqueda",
            anio : anio ,
            mes : mes ,
            sede : sede
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO GRÁFICOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {

            graficoVentasPorAsesor(response.data1);
            graficoVentasPorMes(response.data2);
            graficoVentasPorDocumento(response.data3);
    
        }
    })

}

function colorAleatorio() {
    var makingColorCode = '0123456789ABCDEF';
    var finalCode = '#';
    for (var counter = 0; counter < 6; counter++) {
       finalCode = finalCode + makingColorCode[Math.floor(Math.random() * 16)];
    }
    return finalCode;
}

function graficoVentasPorAsesor(data){

    if(data.length > 0){
        let height = (data.length)*(36) 
        $("#divVentasAsesor").html("<canvas id='graficoventasasesor' height='"+height+"'></canvas>");
        const ctx = $('#graficoventasasesor');

        let rgb = [ 
            ['rgba(54, 162, 235, 0.7)','rgb(54, 162, 235)',],
            ['rgba(75, 192, 192, 0.7)','rgb(75, 192, 192)'],
            ['rgba(255, 205, 86, 0.7)','rgb(255, 205, 86)'],
            ['rgba(255, 99, 132, 0.7)','rgb(255, 99, 132)'],
            ['rgba(201, 203, 207, 0.7)','rgb(201, 203, 207)'],
            ['rgba(83, 211, 87, 0.7)','rgb(83, 211, 87)'],
            ['rgba(237, 208, 98, 0.7)','rgb(237, 208, 98)']  
        ]

        let datachart = {};
        let labels = [];
        let datasets = [{
            backgroundColor: [],
            borderColor : [],
            data: []
        }];

        data.forEach(function(value,key){
           
            labels.push( value.Asesor.toUpperCase().trim() );
            datasets[0].backgroundColor.push( colorAleatorio() );
            //datasets[0].borderColor.push( rgb[key][1] );
            datasets[0].data.push( value.Importe );
            
        });

        datachart.labels = labels;
        datachart.datasets = datasets;

        const options = {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'VENTAS MENSUALES POR CANTIDADES POR ASESOR'
                },
                legend: {
                    display: false
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: new Intl.NumberFormat('en-US').format ,
                    font: {
                        weight: 'bold'
                    },
                    padding : 2
                    //color: 'black',
                }
            },                                    
            reponsive : true,
            maintainAspectRatio : false
        }

        new Chart( ctx ,  {
            plugins : [ChartDataLabels],
            type: 'bar',
            data: datachart,
            options: options
        });
    }else{
        $("#divVentasAsesor").html('<b style="font-size:13px">No se encontro información disponible</b>');
    }

}

function graficoVentasPorMes(data){

    if(data.length > 0){
        
        let plantilla = "";
        data.forEach(element => {
            plantilla += `<div class="${(data.length === 1 ? "col-xs-12" : "col-xs-12 col-sm-6 col-md-3")} text-center" style="margin-bottom:10px">
                <span style="display:block"><b>${element.Locales}</b></span>
                <div><span style="color: #2874b9;font-weight: 900;"> S/ ${new Intl.NumberFormat('en-US').format(element.Importe)}</span></div>
            </div>`
        });
        
        $("#divVentasPorMes").html(`<div class="row">${plantilla}</div>`);

    }else{
        $("#divVentasPorMes").html('<b style="font-size:13px">No se encontro información disponible</b>');
    }

}

function graficoVentasPorDocumento(data){

    if(data.length > 0){

        $("#divVentasDocumentos").html("<canvas id='graficoVentasPorDocumentos' height='400'></canvas>");
        const ctx = $('#graficoVentasPorDocumentos');

        let rgb = [ 
            ['rgba(54, 162, 235, 0.7)','rgb(54, 162, 235)',],
            ['rgba(75, 192, 192, 0.7)','rgb(75, 192, 192)'],
            ['rgba(255, 205, 86, 0.7)','rgb(255, 205, 86)'],
            ['rgba(255, 99, 132, 0.7)','rgb(255, 99, 132)'],
            ['rgba(201, 203, 207, 0.7)','rgb(201, 203, 207)'],
            ['rgba(83, 211, 87, 0.7)','rgb(83, 211, 87)'],
            ['rgba(237, 208, 98, 0.7)','rgb(237, 208, 98)']  
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
            labels.push( value.Asesor.toUpperCase() );
            datasets[0].backgroundColor.push( rgb[key][0] );
            datasets[0].borderColor.push( rgb[key][1] );
            datasets[0].data.push( value.Importe );
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
                    text: 'RESUMEN DE VENTAS POR ASESOR'
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

        $("#divVentasDocumentos").html('<b style="font-size:13px">No se encontro información disponible</b>');

    }

}