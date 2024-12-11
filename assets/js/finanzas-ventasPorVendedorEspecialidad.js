const language = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "No se encontraron registros",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    "search": "Buscar:",
    "infoThousands": ",",
    "loadingRecords": "Cargando...",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
};

$(document).ready(function(){

    $("#tablaListadoDetalle").DataTable({
        data : {},
        language : language
    })

})

$("#btnBuscar").click(function(){

    const desde = $("#desde").val();
    const hasta = $("#hasta").val();
    const local = $("#local").val();
    const asesor = $("#asesor").val();
    cargarData(desde,hasta,asesor,local);

})

function cargarData( desde , hasta , asesor , local){

    $.ajax({
        url: path + "finanzas/ventasPorVendedorEspecialidad",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarBusqueda",
            desde : desde,
            hasta : hasta,
            local : local,
            asesor : asesor
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {

            graficoVentasPorVendedor(response.datagrafico);
            detalleVentasPorVendedor(response.datadetalle)          
    
        }
    })

}

function graficoVentasPorVendedor(data){

    if(data.length > 0){
        $("#divGrafico").html("<canvas id='graficoventasporvendedor' height='430'></canvas>");
        const ctx = $('#graficoventasporvendedor');

        let labels = [];
        let datasets = [
            {   
                //label : ""
                backgroundColor: [],
                borderColor : [],
                data: [],
            }
        ];

        data.forEach(function(value,key){
            labels.push( value.Especialidad.toUpperCase().trim() );
            datasets[0].data.push( value.Importe );
            datasets[0].backgroundColor.push( colorAleatorio() );
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
                    display: true,
                    text: 'Montos expresados en soles',
                    font: {
                        size: 12
                    }
                },
                legend: {
                    display: false,
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: function(value, context) {
                        
                        if(value !== 0){
                            return "S/. " + new Intl.NumberFormat('en-US').format(value);
                        }else{
                            return "";
                        }
                                            
                    },
                    font: {
                        weight: 'bold',
                        size: 13
                    }            
                }      
            },                                    
            reponsive : false,
            maintainAspectRatio : false,
            //color : "orange"

        }

        Chart.defaults.font.size = 11;
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
        $("#graficoventasporvendedor").html('<b style="font-size:13px">No se encontro información disponible</b>');
    }

}

function detalleVentasPorVendedor(data){
    $('#tablaListadoDetalle').empty();
    $('#tablaListadoDetalle').dataTable().fnDestroy();
    $("#tablaListadoDetalle").DataTable({
        data : data , 
        dom: 'lBfrtip',
        buttons: [
            { "extend": 'excel', 
                "text":'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename' : 'Reporte'}
        ],       
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10 ,20, 25, 50, 75, 100], 
            [10 ,20, 25, 50, 75, 100]
        ],
        columns: [
            {data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {data: null,
                render: function (data) {
                    return data.Local;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.CodigoAlumno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Alumno.trim().toUpperCase();
                } 
            },                    
            {data: null ,
                render: function(data){                         
                    return data.Especialidad.trim().toUpperCase();
                }
            },
            {data: null ,
                render: function(data){                                                
                    return data.Observacion.trim().toUpperCase(); 
                }
            }
        ],
        language : language
    });
}

function colorAleatorio() {
    var makingColorCode = '0123456789ABCDEF';
    var finalCode = '#';
    for (var counter = 0; counter < 6; counter++) {
       finalCode = finalCode + makingColorCode[Math.floor(Math.random() * 16)];
    }
    return finalCode;
}