$(document).ready(function(){
    $("#docente").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Notas/verRegistro",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarDocente'
                },
                success: function(data){
                    $("#docente").removeAttr("data-code");
                    $("#docente").next('i').removeClass('glyphicon-ok');
                    $("#docente").next('i').addClass('glyphicon-remove');
                    $("#docente").parent().removeClass('has-success');
                    $("#docente").parent().addClass('has-error');
                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){

            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#docente").val(ui.item.nombre);
                $("#docente").attr('data-code', ui.item.cod_emp);
                $("#docente").next('i').removeClass('glyphicon-remove');
                $("#docente").next('i').addClass('glyphicon-ok');
                $("#docente").parent().removeClass('has-error');
                $("#docente").parent().addClass('has-success');
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        if (item.vacio) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div>" + item.cod_emp + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };

    $("#docente").focus();
})


$("#btnCargaHoraria").click(function (){

    $('#tablaCargaHoraria tbody').empty();
    $('#tablaCargaHoraria').dataTable().fnDestroy();
    $("#tablaCargaHoraria").DataTable({
        lengthMenu: [
            [10, 20, 50], 
            [10, 20, 50]
        ],
        ajax: {
            url: path + "supervisor/cargaHorariaDocente",
            dataType: "JSON",
            method: "POST",
            data: {
                opcion: "consultarCargaHoraria",
                docente: $("#docente").attr('data-code'),
                anio : $("#anioProg").val(),
                mes: $("#mesProg").val()
            },
            beforeSend: function () {
                $('.text-loader').text('CONSULTANDO POR FAVOR ESPERE...');
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                $("body").css({ "padding": 0 });                  
            },
            dataSrc: function (response) {
                if (response.respuesta === "success") {
                    return response.data;
                } else {
                    return {};
                }
            },
            complete: function () {
                $("#modalLoader").modal("hide");
                $("body").css({ "padding": 0 });
            }
        },
        columns: [           
            {   
                data: null,
                render : function(data){
                    return data.cod_emp.trim();
                }, 
                className: "text-center" },
            {
                data: null,
                render: function (data) {
                    return data.nombres.trim() + " " + data.apellidos.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Local.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Curso.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoTurno.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.horario.trim();
                },
                className: "text-center"
            },            
            {
                data: null,
                render: function (data) {
                    return data.Especialidad.trim();
                },
                className: "text-center"
            },
            
            {
                data: null,
                render: function (data) {
                    return data.Horas.trim()+ " Hora" + " / "+ "Ciclo " + data.Ciclo.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Aula.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Fec_inicio;
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Fec_Termino;
                },
                className: "text-center"
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

})

$("#btnImprimir").click(function (event){
    event.preventDefault();
    var docente = $("#docente").attr('data-code');
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
       
    if (!docente || !anioProg || !mesProg) {
        Notiflix.Report.Warning('AVISO',"Todos los campos marcados con (*) son obligatorios. Por favor, complete los campos requeridos.", "Cerrar");
        return; 
    }

    document.getElementById('docente').value = docente;
    document.getElementById('anioProg').value = anioProg;
    document.getElementById('mesProg').value = mesProg;
    $("#opcion").val("pdf");
    $("#frmCargaHoraria").attr("target","_blank");
    $("#frmCargaHoraria").submit();
});

$("#frmCargaHoraria").submit(function() {
    var docente = $("#docente").attr('data-code');
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();

    if (!docente || !anioProg || !mesProg) {
        Notiflix.Report.Warning('AVISO',"Todos los campos marcados con (*) son obligatorios. Por favor, complete los campos requeridos.", "Cerrar");
        return; 
    }
    
    $.ajax({
        type: "POST",
        url: path + "supervisor/cargaHorariaDocente",
        data: {
            opcion: "pdf",
            docente: docente,
            anio : anioProg,
            mes: mesProg
        },
        beforeSend: function () {
            $('.text-loader').text('CONSULTANDO POR FAVOR ESPERE...');
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });                  
        },
        success: function (data) {
            console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta === "success") {
                if (datos.programacionByDocente == null || datos.programacionByDocente == "vacio") {
                    Notiflix.Report.Warning('Alerta', 'No se encontraron programaciones asignadas a su carga horaria.', "Cerrar");
                } else {
                    Notiflix.Notify.Success('Se mostró correctamente el PDF');
                }
            } else {
                Notiflix.Report.Failure('Error', 'Ocurrió un error al generar la carga horaria!', 'Cerrar');
            }
        },
        complete: function () {
            $("#modalLoader").modal("hide");
            $("body").css({ "padding": 0 });
        }
    });
});





