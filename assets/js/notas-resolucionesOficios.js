$(document).ready(function () {
    $('#inputBuscar').focus();
    // $('#tablaListado').DataTable();
    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Notas/resolucionesOficios",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarAlumnos'
                },
                success: function(data){
                    $("#alumno").removeAttr("data-code");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');

                    response(data.alumnos);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            $('#alumno').attr('data-code', ui.item.codigo);
            $("#alumno").val(ui.item.nombre); 
            $("#cod_alumno").val(ui.item.codigo);
            $("#alumno").next('i').removeClass('glyphicon-remove');
            $("#alumno").next('i').addClass('glyphicon-ok');
            $("#alumno").parent().removeClass('has-error');
            $("#alumno").parent().addClass('has-success');

            cargarEspecialidadesEgresados(ui.item.codigo.trim());

            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.codigo + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };

    $("#alumno_edit").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Notas/resolucionesOficios",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarAlumnos'
                },
                success: function(data){
                    $("#alumno_edit").removeAttr("data-code");
                    $("#alumno_edit").next('i').removeClass('glyphicon-ok');
                    $("#alumno_edit").next('i').addClass('glyphicon-remove');
                    $("#alumno_edit").parent().removeClass('has-success');
                    $("#alumno_edit").parent().addClass('has-error');

                    response(data.alumnos);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            $('#alumno_edit').attr('data-code', ui.item.codigo);
            $("#alumno_edit").val(ui.item.nombre);
            $("#edit_cod_alumno").val(ui.item.codigo);
            $("#alumno_edit").next('i').removeClass('glyphicon-remove');
            $("#alumno_edit").next('i').addClass('glyphicon-ok');
            $("#alumno_edit").parent().removeClass('has-error');
            $("#alumno_edit").parent().addClass('has-success');
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.codigo + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };

    $("#modalNuevoOficio").on("hidden.bs.modal", function() {
        $("#alumno").removeAttr("data-code");
        $("#alumno").next('i').removeClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-error');
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").parent().removeClass('has-success');
        $('#editCorrelativo').checked = false;
        document.getElementById('correlativo').disabled = true;
        document.getElementById('correlativo').value = '';
        document.getElementById("formNuevoOficio").reset();
    });

    $("#modalEditarOficio").on("hidden.bs.modal", function() {
        $("#alumno_edit").removeAttr("data-code");
        $("#alumno_edit").next('i').removeClass('glyphicon-remove');
        $("#alumno_edit").parent().removeClass('has-error');
        $("#alumno_edit").next('i').removeClass('glyphicon-ok');
        $("#alumno_edit").parent().removeClass('has-success');
        document.getElementById("formEditarOficio").reset();
    });
    
});

$("#tipo").change(function(){
    if ($("#alumno").attr("data-code") != undefined){        
        cargarEspecialidadesEgresados($("#alumno").attr("data-code"));
    }
})

function cargarEspecialidadesEgresados(codigo){

    $.ajax({
        url: path + "Notas/resolucionesOficios",
        type: "POST",
        dataType: "JSON",
        data: {
            codigo: codigo,            
            opcion: 'cargarEspecialidadesEgresados'
        },
        beforeSend: function(){
            $("#especialidad").html("<option value='NINGUNO'>NINGUNO</option>");
        },
        success: function (data) {      
            
            if (data.respuesta === 'success') {

                if ($("#tipo").val() == "4" || $("#tipo").val() == "5"){

                    data.data.forEach(e => {
                        $("#especialidad").append(`                            
                            <option value="${e.descripcion.trim()}">${e.descripcion.trim()}</option>
                        `); 
                    }); 

                } else{

                    data.data2.forEach(e => {
                        $("#especialidad").append(`                            
                            <option value="${e.descripcionM.trim()}">${e.descripcionM.trim()}</option>
                        `);
                    }); 

                }             

                $('#especialidad').val(data.dataEspAlum[0].Descripcion.trim());

            }

        }
    });

}

document.addEventListener('click', (e) => {
    if (e.target.matches('#btnVerModalNuevo')) {
        $("#modalNuevoOficio").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches('#btnGuardar')) {
        e.preventDefault();
        guardarOficio();
    }

    if (e.target.matches('#btnBuscar')) {
        mostrarData();
    }

    if (e.target.matches('#btnCancelar')) {
        $("#modalEditarOficio").modal('hide');
        $("#alumno_edit").next('i').removeClass('glyphicon-remove');
        $("#alumno_edit").parent().removeClass('has-error');
    }

    if (e.target.matches('#btnActualizar')) {
        actualizarDocumento(e);
    }

    if (e.target.matches('#btnReporte')) {
        verReporte();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.target.matches('#alumno')) {
        if ($('#alumno').val().length < 3) {
            $("#docente").removeAttr("data-code");
            $("#alumno").next('i').removeClass('glyphicon-ok');
            $("#alumno").next('i').addClass('glyphicon-remove');
            $("#alumno").parent().removeClass('has-success');
            $("#alumno").parent().addClass('has-error');
        }
    }

    if (e.target.matches("#inputBuscar")) {

        if (e.key === 'Enter') {
            mostrarData();
        }
    }

});

document.addEventListener('change', (e) => {
    if (e.target.matches('#editCorrelativo')) {
        if (e.target.checked) {
            document.getElementById('correlativo').disabled = false;
        } else{
            document.getElementById('correlativo').disabled = true;
            document.getElementById('correlativo').value = '';
        }
    }
    // if (e.target.matches("#editCorrelativo") && e.target.checked) {
    //     document.getElementById('correlativo').disabled = false;
    // }else{
    //     document.getElementById('correlativo').disabled = true;
    //     document.getElementById('correlativo').value = '';
    // }
})

document.addEventListener('keydown', (e) => {
    if (e.target.matches("#inputBuscar") && e.key === 'Enter') {
        e.preventDefault();
    }
})

function verReporte(){
    document.getElementById("frmExcel").submit();
}

function guardarOficio(){
    $code = $('#alumno').attr('data-code');
    $tipo = $('#tipo').val();
    $fecha = $('#fecha').val();
    $espe = $('#especialidad').val();
    $motivo = $('#motivo').val();
    $area = $('#area').val();

    if ($('#alumno').attr('data-code') !== undefined && $tipo !== null && $espe !== null && $motivo !== '' && $area !== null) {
        guardarOficioBD();
    } else{
        Notiflix.Notify.Failure('Ingresa todos los datos');
    }
}

function guardarOficioBD(){
    // console.log($('#correlativo').prop('checked'));
    // debugger
    $alumno = $('#alumno').val();
    $tipo = $('#tipo').val();
    $fecha = $('#fecha').val();
    $espe = $('#especialidad').val();
    $motivo = $('#motivo').val();
    $area = $('#area').val();
    $correlativo = $('#correlativo').val();
    $cod_alumno = $('#alumno').attr('data-code');


    $.ajax({
        url: path + "Notas/resolucionesOficios",
        type: "POST",
        data: {
            alumno: $alumno,
            tipo: $tipo,
            correlativo: $correlativo,
            fecha: $fecha,
            especialidad: $espe,
            motivo: $motivo,
            area: $area,
            cod_alumno: $cod_alumno,
            opcion: 'guardar'
        },
        beforeSend: function(){
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function(data){
            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {
                $("#modalLoader").modal("hide");
                $("#modalNuevoOficio").modal("hide");
                Notiflix.Notify.Success('Registrado correctamente');
                document.getElementById("formNuevoOficio").reset();
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al registrar!');
            }
        }
    });

}

function mostrarData()
{
    let search = $("#inputBuscar").val();
    let tipo = $("#filtroTipo").val();

    $("#tablaListado").DataTable({
        destroy: 'true',
        searching: false,
        ordering:  false,
        lengthMenu: [
            [50, 100, -1], 
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "Notas/resolucionesOficios",
            type: "POST",
            data: {
                search: search,
                tipo: tipo,
                opcion: 'mostrarData'
            },
            dataSrc: function(data){                                
                return data.filas;                
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            // { data: 'Op' },
            { data: 'Correlativo' },
            { data: 'Tipo' },
            { data: 'ApellidosNombres' },
            { data: 'Especialidad'},
            { data: 'Motivo' },
            { data: 'Area' },
            { data: 'Fecha' },
            { data: 'Usuario' },
            { data: 'FechaReg' },            
            {
                data: null,
                render: function(data){                    
                    if(data.Tipo === "Resolucion" ){

                        if (data.Motivo.trim() === "RESOLUCIÓN DIRECTORAL DE TITULACIÓN"){
                            return `
                                <button class='btn boton-tabla boton-verde' type='button' onclick='verModalEdit(this)' title='Editar Documento' data-code='${data.Op}'><span class='icon-user-check'></span></button>
                                <form id="form-formato-resoluciones-oficios" method="post" target="_blank" style="display:inline-block">                                    
                                    <input type="hidden" name="id" value="${data.Op}">   
                                    <button class='btn boton-tabla boton-naranja' type='submit' title='Formato Egresado' data-code='${data.Op}'><span class='icon-download'></span></button>
                                </form>
                                <button class='btn boton-tabla boton-rojo' type='button' onclick='eliminarOficio(this)' title='Eliminar Documento' data-code='${data.Op}'><span class='icon-cross'></span></button>
                            `;
                        }else{
                            return `
                                <button class='btn boton-tabla boton-verde' type='button' onclick='verModalEdit(this)' title='Editar Documento' data-code='${data.Op}'><span class='icon-user-check'></span></button>     
                                <button class='btn boton-tabla boton-rojo' type='button' onclick='eliminarOficio(this)' title='Eliminar Documento' data-code='${data.Op}'><span class='icon-cross'></span></button>                       
                            `;
                        }

                    }else{
                        
                        return `
                            <button class='btn boton-tabla boton-verde' type='button' onclick='verModalEdit(this)' title='Editar Documento' data-code='${data.Op}'><span class='icon-user-check'></span></button>                           
                            <form id="form-formato-resoluciones-oficios" method="post" target="_blank" style="display:inline-block">                                    
                                <input type="hidden" name="id" value="${data.Op}">   
                                <button class='btn boton-tabla boton-naranja' type='submit' title='Formato Egresado' data-code='${data.Op}'><span class='icon-download'></span></button>
                            </form>  
                            <button class='btn boton-tabla boton-rojo' type='button' onclick='eliminarOficio(this)' title='Eliminar Documento' data-code='${data.Op}'><span class='icon-cross'></span></button>                                                                
                        `; 
                                                 
                    }
                                        
                }
            },
        ],
        language: {
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

function verModalEdit(btn){
    
    let id = btn.getAttribute('data-code');
    $.ajax({
        url: path + "notas/resolucionesOficios",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 2,
            ruta: "notas/resolucionesOficios"  
        },
        success: function(response) {
            /* console.log(response) */
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $.ajax({
                    url: path + "Notas/resolucionesOficios",
                    type: "POST",
                    data: {
                        id: id,
                        opcion: 'fillUpdate'
                    },
                    success: function(data){
                        $('#idDoc').val(id);
                        let datos = JSON.parse(data);
                        let oficio = datos.oficio;
                        $('#correlativo_edit').val(oficio.Correlativo);
                        $('#alumno_edit').val(oficio.ApellidosNombres);
                        $('#alumno_edit').attr('data-code', id);
                        document.getElementById("tipo_edit").selectedIndex = oficio.Tipo - 1;
                        $('#fecha_edit').val(oficio.Fecha);
                        $('#especialidad_edit').val(oficio.Especialidad);
                        $('#motivo_edit').val(oficio.Motivo);
                        $("#edit_cod_alumno").val(oficio.Cod_alumno)
                        let index = oficio.Area === 'Secretaría Académica' ? 0 : 1;
                        document.getElementById("area_edit").selectedIndex = index;
            
                        $("#modalEditarOficio").modal({
                            backdrop: false,
                            show: true
                        });
                    }
                });
            } else {
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");;
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}

function actualizarDocumento(){

    let id = $('#idDoc').val();
    let nombre = $('#alumno_edit').val();
    // let nombre = $('#alumno_edit').attr('data-code',);
    let tipo = $('#tipo_edit').val();
    let fecha = $('#fecha_edit').val();
    let espe = $('#especialidad_edit').val();
    let motivo = $('#motivo_edit').val();
    let area = $('#area_edit').val();
    let correlativo = $('#correlativo_edit').val();
    let cod_alumno = $("#edit_cod_alumno").val();  

    if ($('#alumno_edit').attr('data-code') !== undefined && id !== '' && nombre !== '' && fecha !== '' && motivo !== '') {
        $.ajax({
            url: path + "Notas/resolucionesOficios",
            type: "POST",
            data: {
                id: id,
                nombre: nombre,
                correlativo: correlativo,
                tipo: tipo,
                fecha: fecha,
                especialidad: espe,
                motivo: motivo,
                area: area,
                cod_alumno: cod_alumno,
                opcion: 'actualizar'
            },
            success: function(data){
                let datos = JSON.parse(data);
                if (datos.respuesta === 'success') {
                    $("#tablaListado").DataTable().ajax.reload();
                    $("#modalEditarOficio").modal("hide");
                    Notiflix.Notify.Success('Registrado correctamente');
                    document.getElementById("formEditarOficio").reset();
                    
                    // mostrarData();
                } else{
                    Notiflix.Notify.Failure('Ocurrió un error al actualizar!');
                }
            }
        });
    } else{
        Notiflix.Notify.Failure('Ingresa todos los datos');
    }
}

function eliminarOficio(btn){
    $.ajax({
        url: path + "notas/resolucionesOficios",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 3,
            ruta: "notas/resolucionesOficios"  
        },
        success: function(response) {
            /* console.log(response) */
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                Notiflix.Confirm.Show(
                    'Eliminar Titulado',
                    '¿Esta segura de eliminar? ',
                    'Si',
                    'No',
                    function okCb() {
            
                        let id = btn.getAttribute('data-code');
            
                            $.ajax({
                                url: path + "Notas/resolucionesOficios",
                                type: "POST",
                                data: {
                                    Op: id,
                                    opcion: 'eliminarOficio'
                                },
                                success: function (data) {
                                    var datos = JSON.parse(data);
                                    if (datos.respuesta == "success") {
            
                                         Notiflix.Notify.Success('Eliminado correctamente');
                                         $("#tablaListado").DataTable().ajax.reload();
            
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
            } else {
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");;
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}

