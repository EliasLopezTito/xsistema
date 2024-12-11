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

    $("#tablaTardanzas").DataTable({
        language : language,
        data : []
    });

})

$("#btnBuscar").click(function(){

    $.ajax({
        url: path + "planilla/tardanzas",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion: "select",
            anio: $("#anio").val(),
            mes: $("#mes").val(),
            area: $("#area").val(),
            empleado: "",
            local: $("#institucion").val()
        } ,
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal({backdrop:'static',keyboard:false});   

            $('#tablaTardanzas').empty();
            $('#tablaTardanzas').dataTable().fnDestroy();
            $("#btnBuscar").prop("disabled",true);

            $("body").css({ "padding": 0 });            
        },
        complete : function(){     

            $("#btnBuscar").prop("disabled",false);
            $("#modalLoader").modal("hide"); 
            $("body").css({ "padding": 0 });
            
        },
        success: function (response) {

            graficoTopTardanzas(response.data1);
            console.log(response);
            console.log(response.data1);

            if(response.respuesta === "success"){

                $("#tablaTardanzas").DataTable({
                    dom: 'Bfrtip',
                    buttons: [
                        { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
                    ],
                    data : response.data ,        
                    columnDefs: [
                        {
                            targets: '_all',
                            className: 'celda-centrada',
                            orderable: false
                        }
                    ],
                    lengthMenu: [
                        [20, 25, 50, 75, 100], 
                        [20, 25, 50, 75, 100]
                    ],
                    columns: [
                        {data: null,
                            render: function (data,type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        {data: null,
                            render: function (data) {
                                return data.Cod_emp;
                            } 
                        },
                        {data: null,
                            render: function (data) {
                                return data.Personal;
                            } 
                        }, 
                        {data: null,
                            render: function (data) {
                                return data.Empresa.trim();
                            } 
                        },
                        {data: null,
                            render: function (data) {
                                return data.Area.trim();
                            } 
                        },                    
                        {data: null ,
                            render: function (data) {
                                return data.Cargo.trim();
                            } 
                        },
                        {data: null,
                            render: function (data) {
                                return data.Fecha.trim();
                            } 
                        },                    
                        {data: null ,
                            render: function (data) {
                                return data.Ingreso.trim();
                            } 
                        }
                    ],
                    language : language,                    
                });

                Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO."); 

            }else{
                                
                $("#tablaTardanzas").DataTable({
                    language : language,
                    data : []
                });
                Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar"); 

            }

        }
    });
    
})

function colorAleatorio() {
    var makingColorCode = '0123456789ABCDEF';
    var finalCode = '#';
    for (var counter = 0; counter < 6; counter++) {
       finalCode = finalCode + makingColorCode[Math.floor(Math.random() * 16)];
    }
    return finalCode;
}

function graficoTopTardanzas(data){
    if(data.length > 0){
        let height = (data.length)*(60) 
        $("#divTardanzas").html("<canvas id='graficoTardanza' height='"+height+"'></canvas>");
        const ctx = $('#graficoTardanza');
        console.log(ctx)
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
            labels.push( value.Personal.toUpperCase().trim() );
            datasets[0].backgroundColor.push( colorAleatorio() );
            datasets[0].data.push( value.Cta );
            
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
                    text: 'TOP DE TARDANZAS'
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
                    padding : -3
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
        $("#divTardanzas").html('<b style="font-size:13px">No se encontro información disponible</b>');
    }

}