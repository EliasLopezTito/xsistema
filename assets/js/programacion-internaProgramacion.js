$(document).ready(function(){

    Notiflix.Loading.Init({
        clickToClose: true
    });
    
    cargarInstituciones(true);  
    cargarSedes(true)
    cargarTipoEspecialidades(true);      
    cargarInstituciones2(true);
	
});

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

$("#institucion_").change(function () {
    $("#horarioM").html("");
    $("#primeraHoraM").val("");
    $("#segundaHoraM").val("");
    cargarTipoEspecialidades2(true);
})

$("#tipoEspecialidad_").change(function () {
    $("#horarioM").html("");
    $("#primeraHoraM").val("");
    $("#segundaHoraM").val("");
    cargarEspecialidades2();
})

$("#institucion").change(function(){
    cargarTipoEspecialidades(true);
})

$("#tipoEspecialidad").change(function () {
    cargarEspecialidades();
})

//Para filtro de listado
$("#especialidad").change(function () {

    //$("#contenedor_listado").css("display","block");
    //cargarHorariosPorAula();

});

//Para filtro de listado
$("#btnBuscar").click(function () {

    $("#contenedor_listado").css("display", "block");
    //cargarListaCurricular();

});

$("#anioProg").change(function(){
    //cargarHorariosPorAula();
});

$("#mesProg").change(function(){
    //cargarHorariosPorAula();
});

//Para crear las configuraciones de horarios x aula
$("#btnNuevo").click(function ()
{   
    cargarInstituciones2(true);
    $("#tituloModal").html("NUEVA CURRICULA INTERNA");
    $("#btnGrabarM").attr("title","Crear");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Crear");

    $("#modalTurnoVirtual").modal({backdrop: 'static', keyboard: false});
});

$("#especialidad_").change(function () {

    cargarHorariosByCarrera();

});



$("#btnGrabarM").click(function ()
{   
    var anioProg = $("#anioProg").val();
    var anioProgNuevo = $("#anioProgM").val();
    var local = $("#institucion").val();
    var tipo_espe = $("#tipoEspecialidad").val();
    var ciclo = $("#ciclo").val();
    var programaAcademico = $("#especialidad").val();

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de crear nueva Curricula?',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "programacion/CurriculaInterna",
                type: "POST",
                data: {
                    opcion: "create",
                    anioProg: anioProg,
                    anioProgNuevo: anioProgNuevo,
                    local: local,
                    tipo_espe: tipo_espe,
                    ciclo: ciclo,
                    programaAcademico: programaAcademico
                },
                success: function (data) {
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        console.log("datos", datos)
                        //cargarInstituciones2(true);

                        $("#modalTurnoVirtual").modal("hide");

                        Notiflix.Notify.Success('LA OPERACIÓN SE REALIZO CON ÉXITO');
                    
                    } else if (datos.respuesta == "ya_existe"){
                        Notiflix.Notify.Warning('LA CURRICULA CON EL AÑO ' + anioProgNuevo +' YA EXISTE');          
                    } else {
                        var errores = "";
                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }
                        mostrarMensaje("error", "ERROR", errores);
                    }
                }
            });
        },
        function cancelCb() {

        },
        {
        },
    );
    
});

$("#mensaje-boton-aceptar").click(function ()
{

    $("#modalMensaje").modal("hide");
    var codAula = $("#codAulaD").val();
    var anioProg = $("#anioProgD").val();
    var mesProg = $("#mesProgD").val();
    var opcion = $("#opcionD").val();
        
    if(codAula != null && anioProg != null && mesProg != null && codAula != "" && anioProg != "" && mesProg != "")
    {
        var tbody = $("#tablaCambioTurnoVirtual tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "programacion/confHorarioPorAula",
            type: "POST",
            data: {
                opcion: opcion,
                codAula: codAula,
                anioProg: anioProg,
                mesProg: mesProg
            },
            success: function(data){

                var datos = JSON.parse(data);

                if(datos.respuesta=="success")
                {
                    cargarListaCurricular();
                }else{
                    var errores = "";
                    for(i=0; i<datos.errores.length; i++){
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error","ERROR",errores);
                }
            }
        });
    }
});


$('#frmListados').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "select" });
    console.log("data", form)

    var institucion = $("#institucion").val();
    var tipo_espe = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var ciclo = $("#ciclo").val();
    var turno = $("#turno").val();
    var sede = $("#sede").val();

    $('#tablaInternaProgramacion').dataTable().fnDestroy();
    var tablaInternaProgramacion = $("#tablaInternaProgramacion").DataTable({
        ordering: false,
        responsive: true,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        ajax: {
            url: path + "programacion/internaProgramacion",
            type: "POST",
            dataType: "JSON",
            data: { institucion: institucion, 
                    tipo_espe: tipo_espe, 
                    especialidad: especialidad, 
                    anioProg: anioProg, 
                    mesProg: mesProg, 
                    ciclo: ciclo, 
                    turno: turno, 
                    sede: sede,
                    opcion: "select"},
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                // $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                $("#container-listaAlumnos").hide();
                console.log(response);
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.datax;
                }
            },
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            },
            {
                "targets": [1],
                "visible": false,
                "searchable": true
            },
            {
                "targets": [13],
                "visible": false,
                "searchable": true
            },
            {
                "targets": [14],
                "visible": false,
                "searchable": true
            }
        ],
        lengthMenu: [
            [15, 20, 50, 75, 100],
            [15, 20, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_prof;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Aula;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Codigo;
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
                    return data.cod_curso;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Hora;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Profesor == null ? '-' : data.Profesor;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Capacidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NumAlumnos;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NumHoras;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_localInst;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.ANO;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.MES;
                }
            },
            {
                data: null,
                render: function (data) {

                    return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"asignarDocente(this);\" title=\"Asignar Docente\"><span class=\"icon-star-full\"></span></button> &nbsp;&nbsp;"+
                           "<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"historicoDocente(this);\" title=\"Ver historico\"><span class=\"icon-eye\"></span></button>";

                }
            }
        ],
        language: language
    });
    $('#tablaInternaProgramacion tbody').on('click', 'tr', function() {
        $('#tablaInternaProgramacion tbody tr').removeClass('selected').css('background-color', '');

        $(this).addClass('selected').css('background-color', '#b9def0');

        var selectedData = tablaInternaProgramacion.row(this).data();
        if (selectedData) {
            var selectedAula = selectedData.Aula;
            var selectedTurno = selectedData.Turno;
            var selectedHora = selectedData.Hora;
            var selectedCodCurso = selectedData.cod_curso;
            var selectedSede = selectedData.cod_localInst;
            if (selectedAula !== undefined && selectedTurno !== undefined && selectedHora !== undefined && selectedCodCurso !== undefined) {
                procesarSeleccion(institucion, tipo_espe, especialidad, anioProg, mesProg, ciclo,selectedSede,selectedCodCurso,selectedHora,selectedTurno,selectedAula); 
                $("#container-listaAlumnos").show();
            } else {
                console.error('Algunos datos están indefinidos:', {
                    selectedAula,
                    selectedTurno,
                    selectedHora,
                    selectedCodCursoI
                });
            }
        } else {
            console.error('No se encontró información para la fila seleccionada.');
        }
    });
})

function procesarSeleccion(institucion, tipo_espe, especialidad, anioProg, mesProg, ciclo, sede, selectedCodCursoI, selectedHora, selectedTurno, selectedAula) {

    if ($.fn.DataTable.isDataTable('#tablaInternaProgramacionAlumno')) {
        $('#tablaInternaProgramacionAlumno').DataTable().destroy();
    }

    tablaInternaProgramacionAlumno = $('#tablaInternaProgramacionAlumno').DataTable({
        destroy: true,
        searching: true,
        processing: false,
        responsive: true,
        ordering: false,
        lengthMenu: [
            [20, 100, -1],
            [20, 100, 'TODO']
        ],
        dom: '<"top"lfB>rt<"bottom"ip>',
        buttons: [
            {
                text: '<span class="icon-plus" style="padding-right: 5px;"></span>Agregar Alumno',
                className: 'btn btn-block',
                attr: {
                    id: 'btnNuevo',
                    title: 'Agregar Alumno',
                    style: 'padding-left: 20px; padding-right: 20px; width: 100%; margin-left: 10px; text-align: center; color: white; background-color: #00a65a; font-weight: 800; border-radius: 7px;' // Estilos personalizados
                },
                action: function () {
                    limpiarFormulario()
                    agregarAlumno(institucion, tipo_espe, especialidad, anioProg, mesProg, ciclo, sede, selectedCodCursoI, selectedHora, selectedTurno, selectedAula);
                }
            }
        ],
        ajax: {
            url: path + 'programacion/internaProgramacion',
            type: 'POST',
            data: {
                institucion: institucion,
                tipo_espe: tipo_espe,
                especialidad: especialidad,
                anioProg: anioProg,
                mesProg: mesProg,
                ciclo: ciclo,
                sede: sede,
                cod_curso: selectedCodCursoI,
                hora: selectedHora,
                turno: selectedTurno,
                cod_aula: selectedAula,
                opcion: 'select2'
            },
            beforeSend: function() {
                $('.text-loader').text('Consultando datos, por favor espere...');
                $("#modalLoader").modal();
            },
            dataSrc: function (response) {
                if (response.respuesta === "error") {
                    return {};
                } else {
                    return response.datax;
                }
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            }
        },
        columnDefs: [
            { targets: '_all', className: 'celda-centrada' }
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: 'Especialidad' },
            { data: 'pabellon' },
            { data: 'cod_aula' },
            { data: 'Codigo' },
            { data: 'cod_curso' },
            { data: 'Curso' },
            { data: 'cod_alumno' },
            { data: 'Alumno' },
            { data: 'cod_ciclo' },
            { data: 'Hora' },
            { data: 'idgrupo' },
            { data: 'telefono' },
            { data: 'email' },
            { data: 'cod_turno' },
            { data: 'Semestre' },
            { data: 'Horario' },
            { data: 'Sede' },
            { data: 'Local' },
            { data: 'cod_interno' },
            {
                data: null,
                render: function (data) {
                    return "<button class='btn boton-tabla btn-danger' type='button' id='btnEliminar' onclick='eliminarAlumno(\"" + data.id_ProgramacionAcademica + "\");' title='Eliminar Alumno'><span class='icon-cross'></span></button>&nbsp;&nbsp;&nbsp;";
                }
            }
        ],
        language: language
    });
}

function eliminarAlumno(id) {
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Desea eliminar el registro seleccionado?',
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "programacion/internaProgramacion",
                type: "POST",
                dataType: 'json',
                data: {
                    id: id,
                    opcion: 'eliminarAlumno'
                },
                success: function(data){
        
                    if (data.respuesta === 'success') {
                        tablaInternaProgramacionAlumno.ajax.reload(null,false)
                        Notiflix.Notify.Success('Registro eliminado correctamente!');
                    } else{
                        Notiflix.Notify.Failure('Ocurrió un error al eliminar el registro!');
                    }
                    
                }
            });
        },
        function(){    
        }
    );
}
function agregarAlumno(institucion, tipo_espe, especialidad, anioProg, mesProg, ciclo, sede, selectedCodCurso, selectedHora, selectedTurno, selectedAula){
    $("#institucionR").val(institucion);
    $("#tipo_espeR").val(tipo_espe);
    $("#especialidadR").val(especialidad);
    $("#anioProgR").val(anioProg);
    $("#mesProgR").val(mesProg);
    $("#cicloR").val(ciclo);
    $("#sedeR").val(sede);
    $("#selectedCodCursoR").val(selectedCodCurso);
    $("#selectedHoraR").val(selectedHora);
    $("#selectedTurnoR").val(selectedTurno);
    $("#selectedAulaR").val(selectedAula);
    $("#modalRegistrarAlumno").modal({ backdrop: 'static', keyboard: false });
    $("#codigo_alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "areaReincorporacion/ReincorporaTras",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){
                    $("#codigo_alumno").attr("codigo","");
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
                $("#codigo_alumno").val(ui.item.cod_alumno);
                $("#codigo_alumno").next('i').removeClass('glyphicon-remove');
                $("#codigo_alumno").next('i').addClass('glyphicon-ok');
                $("#codigo_alumno").parent().removeClass('has-error');
                $("#codigo_alumno").parent().addClass('has-success');
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
            .append( "<div><b>"+item.cod_alumno+"</b>"+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#codigo_alumno").focus();
}
$("#btnRegistrar").click(function () {
    var codigo_alumno = $("#codigo_alumno").val();
    var convalidar = $("#convalidar").val();
    var grupo = $("#codGrupal").val();
    var semestre = $("#periodo").val();
    var institucion = $("#institucionR").val(); 
    var tipo_espe = $("#tipo_espeR").val();
    var especialidad = $("#especialidadR").val(); 
    var anioProg = $("#anioProgR").val(); 
    var mesProg = $("#mesProgR").val(); 
    var ciclo = $("#cicloR").val();
    var sede = $("#sedeR").val(); 
    var selectedCodCurso = $("#selectedCodCursoR").val();
    var selectedHora = $("#selectedHoraR").val(); 
    var selectedTurno = $("#selectedTurnoR").val(); 
    var selectedAula = $("#selectedAulaR").val();
    $.ajax({
        url: path + "programacion/internaProgramacion",
        type: "POST",
        data: {
            codigo_alumno: codigo_alumno,
            convalidar: convalidar,
            grupo: grupo,
            semestre: semestre,
            institucion: institucion,
            tipo_espe: tipo_espe,
            especialidad: especialidad,
            anioProg: anioProg,
            mesProg: mesProg,
            ciclo: ciclo,
            turno: selectedTurno,
            sede: sede,
            cod_aula: selectedAula,
            hora: selectedHora,
            cod_curso: selectedCodCurso,
            opcion: 'registrarAlumnos'
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalRegistrarAlumno").modal("hide");
                tablaInternaProgramacionAlumno.ajax.reload(null,false)
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
});

function limpiarFormulario() {
    $('#codigo_alumno').val('');
    $('#selectedAulaR').val('');
    $('#codGrupal').val('');
    $('#periodo').val('');
    $('#institucionR').val('');
    $('#tipo_espeR').val('');
    $('#anioProgR').val('');
    $('#anioProgR').val('');
    $('#mesProgR').val('');
    $('#cicloR').val('');
    $('#sedeR').val('');
    $('#selectedCodCursoR').val('');
    $('#selectedHoraR').val('');
    $('#selectedTurnoR').val('');
    $('#convalidar').val('0');
    $("#codigo_alumno").next('i').removeClass('glyphicon-ok');
    $("#codigo_alumno").next('i').addClass('glyphicon-remove');
    $("#codigo_alumno").parent().removeClass('has-success');
    $("#codigo_alumno").parent().addClass('has-error');
}
//============================

function asignarDocente(btn) {

    var alumno = $(btn).parent().parent().find("td").eq(6).html();

    var cod_emp = $(btn).parent().parent().find("td").eq(1).html();
    console.log(cod_emp)
    return


    $.ajax({
        url: path + "programacion/internaProgramacion",
        type: "POST",
        data: {
            codigo_tramite: codigo_tramite,
            opcion: 'buscar_editar'
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                console.log(datos)

                const datex = datos.datex[0];
                console.log("datex",);

                $("#codigoTramite").val(codigo_tramite);

                $("#codigo_alumno").val(datex.Cod_Alumno);
                $("#alumno").val(alumno);
                $("#institucion").val(datex.Cod_Local);
                $("#tipoEspecialidad").val(datex.Tipo_Espe);
                $("#especialidad").val(datex.Cod_Espe);
                $("#nro_certificado").val(datex.numero);
                $("#fecha").val(datex.FechaTramite.substr(0, 10));
                $("#fecha_expedicion").val(datex.FechaExpedicion.substr(0, 10));
                $("#costo").val(datex.Costo);

                datex.c1 == "1" ? $("#c1").prop("checked", true) : $("#c1").prop("checked", false)
                datex.c2 == "1" ? $("#c2").prop("checked", true) : $("#c2").prop("checked", false)
                datex.c3 == "1" ? $("#c3").prop("checked", true) : $("#c3").prop("checked", false)
                datex.c4 == "1" ? $("#c4").prop("checked", true) : $("#c4").prop("checked", false)
                datex.c5 == "1" ? $("#c5").prop("checked", true) : $("#c5").prop("checked", false)
                datex.c6 == "1" ? $("#c6").prop("checked", true) : $("#c6").prop("checked", false)

                $("#observaciones").val(datex.Observaciones);

                $("#btn_modal").addClass("btn-primary").removeClass("btn-info")
                $("#btn_modal").html("Editar");

            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });

    $("#alumno").prop("readonly", true);

    //$("#alumno").focus();
    $("#tituloModal").html("Editando Trámite");
    $("#modalNuevoTramite").modal({ backdrop: 'static', keyboard: false });

}

function historicoDocente(btn) {

    var local = $("#institucion").val();
    var tipo = $("#tipoEspecialidad").val();
    var espe = $("#especialidad").val();
    var localinst = $(btn).parent().parent().find("td").eq(11).html();
    var Turno = $(btn).parent().parent().find("td").eq(3).html();
    var codigo = $(btn).parent().parent().find("td").eq(2).html();
    var Anio = $("#anioProg").val();

    $('#tablaHistoricoProgramacion').dataTable().fnDestroy();
    $("#tablaHistoricoProgramacion").DataTable({
        ordering: false,
        // dom: 'Bfrtip',
        // buttons: [
        //     { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
        // ],
        ajax: {
            url: path + "programacion/internaProgramacion",
            type: "POST",

            beforeSend: function () {

                Notiflix.Loading.Hourglass('Cargando...');

            },
            data: {
                local: local,
                tipo: tipo,
                espe: espe,
                localinst: localinst,
                Turno: Turno,
                codigo: codigo,
                Anio: Anio,
                opcion: 'historicoDocente'
            },
            dataSrc: function (response) {

                return response.datex;
            },
            complete: function (data) {
                $("#NotiflixLoadingWrap").trigger("click");
                $("#id_cod_grupal").html(' '+codigo);
                $("#modalHistoricoDocente").modal({ backdrop: 'static', keyboard: false });
            }

        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10, 25, 50, 75, 100],
            [10, 25, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Ciclo.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Aula.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Ano.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Mes.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Horas.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Curso.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Ministerio.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Turno.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.cod_cursoM.trim();
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.cod_cursoI.trim();
                }
            }

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

function cargarInstituciones2(enlazado) {
    $.ajax({
        url: path + "institucion/getInstituciones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboInstitucion = $("#institucion_");
            cboInstitucion.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.instituciones != "vacio") {
                    var instituciones = datos.instituciones;
                    for (i = 0; i < instituciones.length; i++) {
                        var institucion = instituciones[i];
                        var selected = institucion.cod_local === "10" ? "selected" : "";
                        cboInstitucion.append("<option " + selected + " value=\"" + institucion.cod_local + "\" >" + institucion.cod_local + " - " + ((institucion.descripcionM === null || institucion.descripcionM === "") ? institucion.descripcion : institucion.descripcionM) + "</option>");
                    }
                    if (enlazado == true) {
                        cargarTipoEspecialidades2(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades2(enlazado) {
    var institucion = $("#institucion_").val();
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad_");
            cboTipoEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.tipoEspecialidades != "vacio") {
                    var tipoEspecialidades = datos.tipoEspecialidades;
                    for (i = 0; i < tipoEspecialidades.length; i++) {
                        var tipoEspecialidad = tipoEspecialidades[i];
                        cboTipoEspecialidad.append("<option value=\"" + tipoEspecialidad.tipo_espe + "\" >" + tipoEspecialidad.tipo_espe + " - " + tipoEspecialidad.descripcion + "</option>");
                    }
                    if (enlazado == true) {
                        cargarEspecialidades2(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades2() {
    var institucion = $("#institucion_").val();
    var tipoEspecialidad = $("#tipoEspecialidad_").val();

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad_");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }                    
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}