const language = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "Realice una búsqueda",
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

document.addEventListener("DOMContentLoaded", () => {
    
    $("#tablaListado").DataTable({ 
        data : [],
        language : language
    })

    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){

                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    $("#btnGrabar").prop("disabled",true)
                    $("#espeActual").html("")

                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;            
                    response(result);

                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{

                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.cod_alumno );
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');            
                                
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div>"+item.cod_alumno+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#alumno").focus();

});

$("#btnConsultar").click(function(){

    const anio = $("#anio").val();
    const mes = $("#mes").val();
    const alumno = $("#alumno").val() === "" ? "" : $("#alumno").attr("codigo");

    $.ajax({     
        url: path + "caja/pensionesPendientePago",
        type: 'POST',
        dataType: 'JSON',
        data: {
            opcion: 'consultar',
            anio: anio,
            mes: mes,
            alumno: alumno
        },
        beforeSend: function() {
            
            $("#tablaListado").empty();
            $('#tablaListado').dataTable().fnDestroy();
            $('.text-loader').text('Consultando información, por favor espere...');
            $("#modalLoader").modal();

        },
        success: function(data) {            

            if (data.respuesta === 'success') {
                
                $("#tablaListado").DataTable({       
                    ordering:  false,  
                    dom: 'lBfrtip',
                    buttons: [
                        { "extend": 'excel', 
                            "text":'Exportar Excel',
                            "className": 'btn_excel_datatable',
                            'filename' : 'Reporte'}
                    ],                  
                    lengthMenu: [
                        [10, 25, 50, 100], 
                        [10, 25, 50, 100]
                    ],
                    iDisplayLength: 25,
                    data: data.data ,        
                    columns: [            
                        { 
                            data: null ,
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            },
                            className : "text-center"
                        },
                        { 
                            data: 'Alumno' ,
                            className : "text-center"
                        },
                        { 
                            data: 'codigoAlumno' ,
                            className : "text-center"
                        },
                        { 
                            data: 'anio' ,
                            className : "text-center"
                        },
                        { 
                            data: null ,
                            render : function(data){
                                return data.Mes.toUpperCase();
                            },
                            className : "text-center"
                        },
                        { 
                            data: 'concepto' , 
                            className : "text-center"
                        },
                        { 
                            data: 'Importe' ,
                            className : "text-center"
                        },
                                                
                    ],
                    language: language
                });
                               
            } else{

                Notiflix.Notify.Failure('Ocurrió un error al cargar la información');

            }

        },        
        complete: function() {

            $("#modalLoader").modal("hide");

        }
    });

})