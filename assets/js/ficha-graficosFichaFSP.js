$(document).ready(function(){
    //cargarTablas($("#anioBusqueda").val());
})

$("#btnGraficos").click(function(){
    sede = $("#sede").val()
    cargarTablas(sede)
})

function cargarTablas(sede){


    console.log("sede", sede);

    $.ajax({
        url: path + "psicopedagogico/graficosFichaFSP",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarBusqueda",
            sede : sede
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {

            console.log("res", response);
 
            cargarTablaGrafico1(response.data[0])
            cargarGrafico1(response.data[0]);
            cargarTablaGrafico2(response.data[1])
            cargarGrafico2(response.data[1]);
            cargarTablaGrafico3(response.data[2])
            cargarGrafico3(response.data[2]);
            cargarTablaGrafico4(response.data[3])
            cargarGrafico4(response.data[3]);
            cargarTablaGrafico5(response.data[4])
            cargarGrafico5(response.data[4]);
            cargarTablaGrafico6(response.data[5])
            cargarGrafico6(response.data[5]);
            cargarTablaGrafico7(response.data[6])
            cargarTablaGrafico8(response.data[7])
            cargarGrafico8(response.data[7])
            cargarTablaGrafico9(response.data[9])
            cargarGrafico9(response.data[9])
            cargarTablaGrafico10(response.data[8])
            cargarGrafico10(response.data[8])
            Notiflix.Notify.Success('Operación éxitosa.');
    
        }
    })
}

function cargarTablaGrafico1(data){
    $("#tablaGrafico1 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Edad}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico1 tbody").append(tr);

    });

}

function cargarGrafico1(data){

    $("#divGrafico1").html("<canvas id='grafico1' width='600' height='380'></canvas>")
    const ctx = $('#grafico1');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.Edad.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'EDAD'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

function cargarTablaGrafico2(data){
    $("#tablaGrafico2 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Especialidad}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico2 tbody").append(tr);

    });

}

function cargarGrafico2(data){

    $("#divGrafico2").html("<canvas id='grafico2' width='600' height='380'></canvas>")
    const ctx = $('#grafico2');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.Especialidad.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'PROGRAMA DE ESTUDIO'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

function cargarTablaGrafico3(data){
    $("#tablaGrafico3 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Sede}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico3 tbody").append(tr);

    });

}

function cargarGrafico3(data){

    $("#divGrafico3").html("<canvas id='grafico3' width='600' height='380'></canvas>")
    const ctx = $('#grafico3');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.Sede.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'LOCAL DE ESTUDIO'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

function cargarTablaGrafico4(data){
    $("#tablaGrafico4 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.P21}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico4 tbody").append(tr);

    });

}

function cargarGrafico4(data){

    $("#divGrafico4").html("<canvas id='grafico4' width='600' height='380'></canvas>")
    const ctx = $('#grafico4');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.P21.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'VIVE ACTUALMENTE'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

function cargarTablaGrafico5(data){
    $("#tablaGrafico5 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.P22}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico5 tbody").append(tr);

    });

}

function cargarGrafico5(data){

    $("#divGrafico5").html("<canvas id='grafico5' width='600' height='380'></canvas>")
    const ctx = $('#grafico5');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.P22.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'RELACION CON FAMILIA'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

function cargarTablaGrafico6(data){
    $("#tablaGrafico6 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.P26}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico6 tbody").append(tr);

    });

}

function cargarGrafico6(data){

    $("#divGrafico6").html("<canvas id='grafico6' width='600' height='380'></canvas>")
    const ctx = $('#grafico6');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.P26.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'TRABAJO'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

function cargarTablaGrafico7(data){
    $("#tablaGrafico7 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Problemas}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.P5}</td>    
                    <td style="padding:0px 7px;" class="celda-centrada">${value.P4}</td>       
                    <td style="padding:0px 7px;" class="celda-centrada">${value.P3}</td>       
                    <td style="padding:0px 7px;" class="celda-centrada">${value.P2}</td>       
                    <td style="padding:0px 7px;" class="celda-centrada">${value.P1}</td>       
                    <td style="padding:0px 7px;" class="celda-centrada">${Number(value.P5) + Number(value.P4) + Number(value.P3) + Number(value.P2) + Number(value.P1)}</td>                       
                </tr>`;

        $("#tablaGrafico7 tbody").append(tr);

    });

}

function cargarTablaGrafico8(data){

    $("#tablaGrafico8 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.EstadoSalud}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico8 tbody").append(tr);

    });

}

function cargarGrafico8(data){

    $("#divGrafico8").html("<canvas id='grafico8' width='600' height='380'></canvas>")
    const ctx = $('#grafico8');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.EstadoSalud.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'Estado de Salud'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

function cargarTablaGrafico9(data){

    $("#tablaGrafico9 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Satisfecho}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico9 tbody").append(tr);

    });

}

function cargarGrafico9(data){

    $("#divGrafico9").html("<canvas id='grafico9' width='600' height='380'></canvas>")
    const ctx = $('#grafico9');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.Satisfecho.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: 'Presencia de sintomas'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

function cargarTablaGrafico10(data){

    $("#tablaGrafico10 tbody").html("")
    data.forEach(function(value,key){

        let tr = `<tr>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Satisfecho}</td>
                    <td style="padding:0px 7px;" class="celda-centrada">${value.Cantidad}</td>                    
                </tr>`;

        $("#tablaGrafico10 tbody").append(tr);

    });

}

function cargarGrafico10(data){

    $("#divGrafico10").html("<canvas id='grafico10' width='600' height='380'></canvas>")
    const ctx = $('#grafico10');

    let datachart = [];
    let labels = [];
    data.forEach(function(value){
        labels.push( value.Satisfecho.trim() );
        datachart.push( value.Cantidad.toFixed(2) );
    });

    const dataGrafico = {
        labels: labels,
        datasets: [{
            data: datachart,
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(112, 173, 70)',
                'rgb(230, 148, 92)',
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(255, 99, 132)',
                'rgb(201, 203, 207)',
                'rgb(83, 211, 87)',
                'rgb(237, 208, 98)'
            ],
            hoverOffset: 5,
            borderColor: "white",
            borderWidth: 0.5
        }] 
    }
    const opcionesGrafico = {
        plugins: {
            title: {
                display: true,
                text: '¿Estas satisfecho(a) con tu vida?'
            },
            legend: {
                display: true,
                position : "left",
            },
            datalabels: {                         
                anchor: "center",
                formatter: (dato) => dato,
                color: "white",
                font: {
                    family: '"Arial"',
                    size: "13",
                    weight: "700",
                },
            }
        },
        layout: {
            padding: 5
        },
        reponsive : false,
        maintainAspectRatio : false
    }
    var chartx =  new Chart( ctx , {
        plugins: [ChartDataLabels],
        type: 'pie',
        data: dataGrafico,
        options : opcionesGrafico
    });

}

$("#close__modal").click(function(){

    $('#tablaListadoDetalle').empty();
    $('#tablaListadoDetalle').dataTable().fnDestroy();
    $("#modalDetalleVentaLocalesPorAnio").modal("hide")

})