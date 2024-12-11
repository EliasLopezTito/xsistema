$(document).ready(function () {
    $('#btnActualizar').attr('disabled', true)
})

function subirExcel(){
    $("#modalSubirExcel").modal("show")
}

function listaCargaCuentas(datax) {
    tablaContactos = $("#tablaDescargas").DataTable({
        destroy: 'true',
        searching: false,
        data: datax,
        lengthMenu: [
            [50, 100, -1],
            [50, 100, 'TODO']
        ],
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            {
                data: null,
                render: function (data) {
                    return data[0];
                }
            },
            {
                data: null,
                render: function (data) {
                    return data[1];
                }
            },
            {
                data: null,
                render: function (data) {
                    let color = '';
                    if (data.codemp != '') { color = "color:#00b300"; descrip = data[2]; } else { color = "color:red"; descrip = data[2]; }
                    return `<span style="${color}">${descrip}</span>`;

                }
            },
            {
                data: null,
                render: function (data) {
                    return data[3];
                }
            },

        ],
        language: {
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
        }
    });
}

$("#inputSubirExcel").change(function(){
    let archivo = $(this)[0].files[0];
    if(archivo["type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        Notiflix.Notify.Success('DOCUMENTO EXCEL ACEPTADO');    
    }else{
        $(this).val(null);
        Notiflix.Report.Warning('AVISO',"EL ARCHIVO DEBE DE SER UN DOCUMENTO EXCEL","Cerrar");    
    }
})

$("#btnActualizar").on("click",function(e){
    // e.preventDefault();

    tipo = $('#tipoCta').val()
    banco = $('#tipoBanco').val() 
    temporal = JSON.parse($('#guardar_array_temporal').val())

    // let data = new FormData();
    // let excel = $("#inputSubirExcel")[0].files[0];
    // data = new Array();
    // data.append("opcion","importarExcel");
    // data.append("tipo",tipo);
    // data.append("banco",banco);
    // data.append("array_temp",temporal);
    // data.append('excel',excel);
    
    Notiflix.Confirm.Show(
        'Confirmación',
        `¿Está segura de importar los datos?`,
        'Si',
        'No',
        function () {
            
            $.ajax({
                url: path + "planilla/cargasCuentas",
                type: "POST",
                dataType: "JSON",
                data: {
                    opcion: "importarExcel",
                    tipo: tipo,
                    banco: banco,
                    array_temp: temporal
                },
                // cache: false,
                // contentType: false,
                // processData: false,
                beforeSend : function(){
                    $('.text-loader').text('Cargando información, por favor espere..');
                    $("#modalLoader").modal();
                },
                complete : function(){
                    $("#modalLoader").modal("hide");
                },
                success: function (response) {
                    
                    if(response.respuesta === "success"){
    
                        Notiflix.Notify.Success("SE IMPORTARON "+ response.cantidad +" CUENTAS CON ÉXITO.", { timeout : 10000 } );  
                        $("#modalSubirExcel").modal("hide");
                        $('#guardar_array_temporal').val(null)
                        document.getElementById("tablaDescargas").querySelector("tbody").innerHTML="";
                        $('#btnActualizar').attr('disabled', true)
    
                    }else if(response.respuesta === "warning"){
    
                        Notiflix.Notify.Warning( response.error , { timeout : 10000 }); 
    
                    }else{
    
                        Notiflix.Notify.Failure( 'OCURRIO UN ERROR INESPERADO, POR FAVOR ASEGURESE QUE CADA CELDA CUMPLA CON EL FORMATO CORRECTO.' , { timeout : 10000 } );    
                    
                    }
    
                }
            })

        },
        function () {
            
        }
    );

})


$("#formSubirExcel").on("submit",function(e){
    e.preventDefault();

    let data = new FormData();
    let excel = $("#inputSubirExcel")[0].files[0];
    data.append("opcion","importarExcelVer");
    data.append('excel',excel);
    
    $.ajax({
        url: path + "planilla/cargasCuentas",
        type: "POST",
        dataType: "JSON",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend : function(){
            $('.text-loader').text('Cargando información, por favor espere..');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {

            console.log("res", response);
            listaCargaCuentas(response.datos);

            //let seleccionados = JSON.parse($("#secciones_new").val());
            //seleccionados.push(sec);
            $("#guardar_array_temporal").val(JSON.stringify(response.datos));
            $('#btnActualizar').attr('disabled', false)
            $("#modalSubirExcel").modal("hide")
            
            // if(response.respuesta === "success"){

            //     Notiflix.Notify.Success("SE IMPORTARON "+ response.cantidad +" CUENTAS CON ÉXITO.", { timeout : 10000 } );  
            //     $("#modalSubirExcel").modal("hide");
            //     $("#inputSubirExcel").val(null);  

            // }else if(response.respuesta === "warning"){

            //     Notiflix.Notify.Warning( response.error , { timeout : 10000 }); 

            // }else{

            //     Notiflix.Notify.Failure( 'OCURRIO UN ERROR INESPERADO, POR FAVOR ASEGURESE QUE CADA CELDA CUMPLA CON EL FORMATO CORRECTO.' , { timeout : 10000 } );    
            
            // }

        }
    })
})



