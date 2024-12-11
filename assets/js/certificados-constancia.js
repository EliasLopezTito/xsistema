$(document).ready(function (){
    buscarConstancia()
    $("#codigo_alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "certificados/certificadoEstudios",
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
                console.log("data proce",ui.item)
                $("#codigo_alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $('#celular').val(ui.item.telefono);
                $('#tipoDoc').val(ui.item.TipoDocumento);
                $('#numDoc').val(ui.item.NumDocumento);
                $('#email').val(ui.item.email);
                $('#institucion').val(ui.item.Cod_local);
                $('#sede').val(ui.item.Sede);
                $('#tipoEspecialidad').val(ui.item.Tipo_espe);
                $('#especialidad').val(ui.item.Cod_espe);
                $("#codigo_alumno").next('i').removeClass('glyphicon-remove');
                $("#codigo_alumno").next('i').addClass('glyphicon-ok');
                $("#codigo_alumno").parent().removeClass('has-error');
                $("#codigo_alumno").parent().addClass('has-success');
                cargarEspecialidades();
                $("#qr-estudiante").attr( 'src', 'https://istalcursos.edu.pe/intranet/assets/temp-qr/'+ui.item.cod_alumno+'.png' );

                const url = 'https://ialintra.edu.pe/intranet/assets/files/FotoPerfil/'+ui.item.cod_alumno+'.jpg'
                verificarImagen(url)
                    .then(result => {
                        if (result) {
                            console.log('La URL contiene una imagen.');
                            $("#foto-estudiante").attr( 'src', url );
                        } else {
                            console.log('La URL no contiene una imagen o hubo un error al cargarla.');
                            if(ui.item.sexo == 'F'){
                                $("#foto-estudiante").attr( 'src', '../assets/img/femenino.png' );
                            }else{
                                $("#foto-estudiante").attr( 'src', '../assets/img/user.png' );
                            }
                        }
                    });
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

    $("#codigo_alumno").focusout(function() {
        if ($("#codigo_alumno").val().trim() === "") {
            $("#especialidad").empty();
            $("#ciclo").empty();
            $("#tablaConstancia").DataTable().clear().draw();
            actualizarEstadoBoton()
        }
    });

    $("#especialidad").change(function() {
        cargarCiclo();
    });
    
});

function verificarImagen(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = function() {
            // La imagen se cargó correctamente
            resolve(true);
        };
        img.onerror = function() {
            // Hubo un error al cargar la imagen
            resolve(false);
        };
        img.src = url;
    });
}

function cargarEspecialidades() {
    var codigo_alumno = $("#codigo_alumno").val().split(' ')[0];
    if (!codigo_alumno) {
        $("#especialidad").empty();
        $("#ciclo").empty();
        return;
    }

    $.ajax({
        url: path + "certificados/constancia",
        type: "POST",
        data: {
            opcion: "especialidades",
            codigo_alumno: codigo_alumno
        },
        success: function (data) {
            var especialidadCbo = $("#especialidad");
            especialidadCbo.empty();
            var datos = JSON.parse(data);
            if (datos.respuesta === "success") {
                if (datos.especialidad !== "vacio") {
                    var especialidad = datos.especialidad;
                    for (var i = 0; i < especialidad.length; i++) {
                        especialidadCbo.append("<option value=\"" + especialidad[i].cod_espe + "\" >" + especialidad[i].DescripcionEspecialidad + "</option>");
                    }
                    cargarCiclo();
                    $("#especialidad").change(function() {
                        buscarConstancia()
                    });
                    buscarConstancia()
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.error);
            }
        }
    });
}

function cargarCiclo() {
    var codigo_alumno = $("#codigo_alumno").val().split(' ')[0]; 
    var especialidad = $("#especialidad").val();
    if (!codigo_alumno || !especialidad) {
        $("#ciclo").empty();
        $("#tablaConstancia").DataTable().clear().draw();
        return;
    }

    $.ajax({
        url: path + "certificados/constancia",
        type: "POST",
        data: {
            opcion: "cargarCiclo",
            especialidad: especialidad,
            codigo_alumno: codigo_alumno
        },
        success: function (data) {
            var cboCiclo = $("#ciclo");
            cboCiclo.empty();
            var datos = JSON.parse(data);
            if (datos.respuesta === "success") {
                if (datos.ciclo !== "vacio") {
                    var ciclo = datos.ciclo;
                    for (var i = 0; i < ciclo.length; i++) {
                        cboCiclo.append("<option value=\"" + ciclo[i].cod_local+"-"+ciclo[i].tipo_espe+"-"+ciclo[i].cod_espe+"-"+ciclo[i].cod_ciclo + "\" data-cod_local=\"" + ciclo[i].cod_local + "\" data-tipo_espe=\"" + ciclo[i].tipo_espe + "\" data-cod_espe=\"" + ciclo[i].cod_espe + "\" data-cod_ciclo=\"" + ciclo[i].cod_ciclo + "\" >" + ciclo[i].cod_ciclo + "</option>");
                    }
                    $("#ciclo").change(function() {
                        buscarConstancia()
                    });
                    buscarConstancia()
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.error);
            }
        }
    });
}

function buscarConstancia() {
    var codigo_alumno = $("#codigo_alumno").val();
    var alumno = codigo_alumno.split(' ')[0];
    var cicloSeleccionado = $('#ciclo option:selected');

    var cod_local = cicloSeleccionado.data('cod_local');
    var tipo_espe = cicloSeleccionado.data('tipo_espe');
    var cod_espe = cicloSeleccionado.data('cod_espe');
    var cod_ciclo = cicloSeleccionado.data('cod_ciclo');

    if (!alumno || !cod_local || !tipo_espe || !cod_espe || !cod_ciclo) {
        $("#tablaConstancia").DataTable().clear().draw();
        return;
    }

    tablaTramite = $("#tablaConstancia").DataTable({
        destroy: true,
        searching: true,
        ordering: false,
        lengthMenu: [
            [50, 100, -1],
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "certificados/constancia",
            type: "POST",
            data: {
                alumno: alumno,
                cod_local: cod_local,
                tipo_espe: tipo_espe,
                cod_espe: cod_espe,
                cod_ciclo: cod_ciclo,
                opcion: "listaConstancia"
            },
            dataSrc: function(data) {
                console.log("data", data);
                if (data.respuesta === "success" && data.lista !== "vacio") {
                    actualizarEstadoBoton()
                    var lista = data.lista;
                    return lista;
                } else {
                    return [];
                }
            }            
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            { data: 'cod_curso', title: 'Cod Curso' },
            { data: 'Curso', title: 'Unidad Didáctica' },
            { data: 'creditos', title: 'Créditos' },
            { data: 'HTeoria', title: 'H. Teoría' },
            { data: 'HPractica', title: 'H. Práctica' }
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
function actualizarEstadoBoton() {
    var codigo_alumno = $("#codigo_alumno").val()
    var especialidad = $("#especialidad").val()
    var ciclo = $("#ciclo").val()

    if (codigo_alumno && especialidad && ciclo) {
        $("#btnDescargarPDF").prop("disabled", false);
    } else {
        $("#btnDescargarPDF").prop("disabled", true);
    }
}

function descargarCursosMatriculados() {
	console.log("descarga pdf");
    $('#tipo_cursoMatri').val("cursosMatriculados")
	document.getElementById("form_cursosMatri").submit();
}