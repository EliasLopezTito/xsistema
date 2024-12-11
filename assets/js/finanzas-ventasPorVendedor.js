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
    cargarData(desde,hasta);

})

function cargarData(desde , hasta){

    $.ajax({
        url: path + "finanzas/ventasPorVendedor",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarBusqueda",
            desde : desde,
            hasta : hasta
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
                label : "I.E.S.T.P. ARZOBISPO LOAYZA",
                backgroundColor: "rgba(54, 162, 235, 0.7)",
                borderColor : 'rgb(54, 162, 235)',
                data: [],
                fill: true,
                order : 2
            },
            {    
                label : "ARZOBISPO LOAYZA",  
                backgroundColor: 'rgba(255, 205, 86, 0.7)',
                borderColor : 'rgb(255, 205, 86)',
                type : "bar",
                data: [],
                order : 1
            }
        ];

        data.forEach(function(value,key){
            labels.push( value.Asesor.toUpperCase() );
            datasets[0].data.push( value.L10);
            datasets[1].data.push( value.L17 );
        });

        const options = {
            scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true
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
                    display: true,
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
                            return "S/. "+new Intl.NumberFormat('en-US').format(value);
                        }else{
                            return "";
                        }
                                            
                    },
                    font: {
                        weight: 'bold',
                        size: 13
                    },
                    color : [ "black" ]
                    
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
    console.log(data)
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
                    return data.Asesor.toUpperCase();
                } 
            }, 
            {data: null,
                render: function (data) {
                    return data.CodigoAlumno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Alumno;
                } 
            },                    
            {data: null ,
                render: function(data){                         
                    return data.Especialidad;
                }
            },
            {data: null ,
                render: function(data){                                                
                    return data.Observacion; 
                }
            }
        ],
        language : language
    });
}