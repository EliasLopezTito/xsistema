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
document.addEventListener("DOMContentLoaded", () => {  
    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "notas/procesarCertificadosTradicional",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'buscarAlumnos'
                },
                success: function(data){
                    $("#btnGenerarCertificado").prop("disabled",true)
                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
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
                $("#alumno").attr('codigo', ui.item.cod_alumno);
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
            .append( "<div><b>" + item.cod_alumno + "</b> - " +item.nombre + "</div>" )
            .appendTo( ul );
    };
    $("#alumno").focus();
});

$("#alumno").keyup(function(){
    if( $(this).val().length < 1){      
        $("#alumno").attr("codigo", "");  
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');
    }
})

$('#btnBuscar').click(function () {
    cargarCertificadoTradicional()
})

function cargarCertificadoTradicional(){
    var alumno = $('#alumno').val().split(' ')[0];
    var periodo = $('#periodo').val();
    var especialidad = $('#especialidad').val();
    var fecha_1 = $('#fecha_1').val();
    var fecha_2 = $('#fecha_2').val();
    console.log(alumno," ",periodo, " ",especialidad," ",fecha_1," ",fecha_2)
    
    $('#tablaListadoCertificadoModular').dataTable().fnDestroy();
    $("#tablaListadoCertificadoModular").DataTable({
        ordering: false,
        ajax: {
            url: path + "notas/listadoTradicional",
            type: "POST",
            dataType: "JSON",
            data: {
                alumno: alumno,
                periodo: periodo,
                especialidad: especialidad,
                fecha_1: fecha_1,
                fecha_2: fecha_2,
                opcion: 'cargarData'
            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log(response)
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.data;
                }
            },
        },
        columnDefs: [
            {
                defaultContent: "-",
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10, 18, 20, 50, 75, 100],
            [10, 18, 20, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_seccion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Turno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Curso;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.creditos;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_ciclo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.pf;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fcreacion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Anio;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.usuariocrea;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Periodo;
                }
            }
        ],
        language: language
    });
}