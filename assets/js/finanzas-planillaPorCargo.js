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

$("#btnCargarGraficos").click(function(){

    const anio = $("#anioBusqueda").val() 
    const mes = $("#mesBusqueda").val()
    const sede = $("#sedeBusqueda").val()
    const planilla = $("#planillaBusqueda").val()
    cargarData(anio , mes , sede , planilla);

})

function cargarData(anio , mes , sede , planilla){
    $.ajax({
        url: path + "finanzas/planillaPorCargo",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarBusqueda",
            anio : anio ,
            mes : mes ,
            sede : sede , 
            planilla : planilla
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO GRÁFICOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (res) {
            console.log(res)
            if(res.respuesta === "success"){
                
                graficoPlanillaPorCargoDetalle(res.data1);
                graficoPlanillaPorCargoGeneral(res.data2);
                Notiflix.Notify.Success("Los gráficos han sido cargados con éxito.");
    
            }else{

                Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor vuelva a intentarlo.");

            }
        }
    })
}

function graficoPlanillaPorCargoGeneral(data){

    if(data.length > 0){

        $("#divPlanillaPorCargoGeneral").html("<canvas id='graficoPlanillaPorCargoGeneral' height='330'></canvas>");
        const ctx = $('#graficoPlanillaPorCargoGeneral');

        let labels = [];
        let datasets = [
            {
                backgroundColor: [],
                borderColor : [],
                data: []
            }
        ];

        data.forEach(function(value,key){
            labels.push( value.DetallePlanilla.trim().replace("PLANILLA","P. ") );
            datasets[0].backgroundColor.push( rgb[key][0] );
            datasets[0].borderColor.push( rgb[key][1] );
            datasets[0].data.push( value.Importe );
        });

        const options = {
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'RESUMEN PLANILLA POR CARGO',
                    font: {
                        size: 13
                    }
                },
                legend: {
                    display: false,
                    labels: {
                        font: {
                            //size: 14
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: new Intl.NumberFormat('en-US').format ,
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    padding : 2
                },
                font: {
                    size: 10
                }
            },                                    
            reponsive : false,
            maintainAspectRatio : false,

        }

        Chart.defaults.font.size = 10;
        new Chart( ctx ,  {
            plugins : [ChartDataLabels],
            type: 'bar',
            data: {
                labels : labels,
                datasets : datasets
            },
            options: options
        });

    }else{

        $("#divPlanillaPorCargoGeneral").html('<b style="font-size:13px">No se encontro información disponible</b>');

    }

}

function graficoPlanillaPorCargoDetalle(data){
    if(data.length > 0){

        let height = (data.length)*(26) 
        if(data.length === 1){
            height = 90
        }
        $("#divPlanillaPorCargo").html("<canvas id='graficoPlanillaPorCargo' height='"+height+"'></canvas>");
        const ctx = $('#graficoPlanillaPorCargo');

        let labels = [];
        let datasets = [
            {
                backgroundColor: [],
                borderColor : [],
                data: []
            }
        ];

        data.forEach(function(value,key){
            labels.push( value.Cargo.trim() );
            datasets[0].backgroundColor.push( colorAleatorio() );
            //datasets[0].borderColor.push( rgb[key][1] );
            datasets[0].data.push( value.Importe );
        });

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
                    text: 'RESUMEN PLANILLA POR CARGO',
                    font: {
                        size: 13
                    }
                },
                legend: {
                    display: false,
                    labels: {
                        font: {
                            //size: 14
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: new Intl.NumberFormat('en-US').format ,
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    padding : 2
                },
                font: {
                    size: 10
                }
            },                                    
            reponsive : false,
            maintainAspectRatio : false,

        }

        Chart.defaults.font.size = 10;
        new Chart( ctx ,  {
            plugins : [ChartDataLabels],
            type: 'bar',
            data: {
                labels : labels,
                datasets : datasets
            },
            options: options
        });

    }else{

        $("#divPlanillaPorCargo").html('<b style="font-size:13px">No se encontro información disponible</b>');

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