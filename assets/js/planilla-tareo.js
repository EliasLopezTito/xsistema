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

const formatoPeru = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1,';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp,rep);
    return arr[1] ? arr.join('.'): arr[0];
  }

$("#btnBuscar").click(function(){

    $.ajax({
        url: path + "planilla/tareo",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion: "listadoTareo",
            fecha_1: $("#fecha_1").val(),
            fecha_2: $("#fecha_2").val(),
            planilla: $("#planilla").val()
        } ,
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal({backdrop:'static',keyboard:false});   
            $("#btnBuscar").prop("disabled",true);
        
        },
        complete : function(){

            $("#btnBuscar").prop("disabled",false);
            $("#modalLoader").modal("hide"); 

            
        },
        success: function (response) {

            console.log("reps",response);
            if(response.respuesta === "success"){

                datax = response.res
                
                $("#tablaTareo").DataTable({
                    destroy: 'true',
                    searching: true,
                    processing: false,
                    responsive: true,
                    ordering: false,
                    bLengthChange: false,
                    dom: 'lBfrtip',
                    buttons: [
                        {
                            "extend": 'excel',
                            "text": 'Exportar Excel',
                            "className": 'btn_excel_datatable',
                            'filename': 'Reporte'
                        }
                    ],
                    data : datax.length != 0 ? datax : [],   
                    columnDefs: [
                        {
                            targets: '_all',
                            className: 'celda-derecha',
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
                                return data.cod_emp;
                            } 
                        },
                        {data: null,
                            render: function (data) {
                                return data.Empleado;
                            } 
                        }, 
                        {data: null,
                            render: function (data) {
                                return data.Rubro.trim();
                            } 
                        },
                        {data: null,
                            render: function (data) {
                                return data.Concepto.trim();
                            } 
                        },                    
                        {data: null ,
                            render: function (data) {
                                return formatoPeru(data.Monto);
                            } 
                        },
                        {data: null,
                            render: function (data) {
                                return data.Usuario.trim();
                            } 
                        },                    
                        {data: null ,
                            render: function (data) {
                                return data.Valor;
                            } 
                        },
                        {data: null ,
                            render: function (data) {
                                return data.FechaInicio;
                            } 
                        },
                        {data: null ,
                            render: function (data) {
                                return data.FechaFin;
                            } 
                        },
                        {data: null ,
                            render: function (data) {
                                return data.NumDias;
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