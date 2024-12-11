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
    ['rgba(54, 162, 235, 0.4)','rgb(54, 162, 235)'],
    ['rgba(75, 192, 192, 0.4)','rgb(75, 192, 192)'],
    ['rgba(255, 205, 86, 0.4)','rgb(255, 205, 86)'],
    ['rgba(255, 99, 132, 0.4)','rgb(255, 99, 132)'],
    ['rgba(201, 203, 207, 0.4)','rgb(201, 203, 207)'],
    ['rgba(45, 142, 85, 0.4)','rgb(45, 142, 85)'],
    ['rgba(20, 192, 135, 0.4)','rgb(20, 192, 135)'],
    ['rgba(12, 45, 86, 0.4)','rgb(12, 45, 86)'],
    ['rgba(192, 90, 132, 0.4)','rgb(192, 90, 132)'],
    ['rgba(201, 123, 207, 0.4)','rgb(201, 123, 207)'],
    ['rgba(78, 44, 85, 0.4)','rgb(78, 44, 85)'],
    ['rgba(89, 192, 11, 0.4)','rgb(89, 192, 11)']
]

$("#btnCargarGraficos").click(function(){

    const anio = $("#anioBusqueda").val() 
    cargarData(anio);

})

function cargarData(anio){
    $.ajax({
        url: path + "finanzas/ventasPorPlanilla",
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
                
                ratioGraficoVentasPlanilla(res.data);
                Notiflix.Notify.Success("Los gráficos han sido cargados con éxito.");
    
            }else{

                Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor vuelva a intentarlo.");

            }
        }
    })
}

function ratioGraficoVentasPlanilla(data){

    data.sort( (a, b) => {
        if(a.Mes < b.Mes) {
          return -1;
        }
        if(a.Mes > b.Mes) {
          return 1;
        }
        return 0;
    });

    console.log(data)

    if(data.length > 0){

        $("#divRatioVentasPlanilla").html("<canvas id='graficoRatioVentasPlanilla' height='400'></canvas>");
        const ctx = $('#graficoRatioVentasPlanilla');

        let labels = [];
        let datasets = [
            {   
                label : "Ventas",
                backgroundColor: "rgba(20, 192, 135, 0.5)",
                borderColor : [],
                data: [],
                fill: false,
                order : 2
            },
            {    
                label : "Planilla",  
                borderColor : "orange",
                type : "line",
                data: [],
                order : 1
            }
        ];

        data.forEach(function(value,key){
            labels.push( meses[value.Mes] );
            //datasets[0].backgroundColor.push( rgb[key][0] );
            datasets[0].data.push( value.Vta );
            datasets[1].data.push( value.Planilla === null ? 0 : value.Planilla );
        });

        const options = {
            scales: {
                y: {
                    beginAtZero: false
                }
            },
            elements : {
                line : {
                    borderWidth : 4
                } 
            },   
            plugins: {
                title: {
                    display: false,
                    text: 'Resumen mensual ventas por planilla',
                    font: {
                        size: 13
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: new Intl.NumberFormat('en-US').format ,
                    font: {
                        weight: 'bold',
                        size: 13
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

        $("#divRatioVentasPlanilla").html('<b style="font-size:13px">No se encontro información disponible</b>');

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