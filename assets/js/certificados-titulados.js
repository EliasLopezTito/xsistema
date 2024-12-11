$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });

    cargarInstituciones(true);

    $('#inputBuscar').focus();
    $("#inputBuscar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Certificados/tramites",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarCodigoAndAlumnos'
                },
                success: function (data) {
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
        select: function (event, ui) {
            $('#inputBuscar').attr('data-code', ui.item.codigo);
            $("#inputBuscar").val(ui.item.nombre);
            $("#inputBuscar").next('i').removeClass('glyphicon-remove');
            $("#inputBuscar").next('i').addClass('glyphicon-ok');
            $("#inputBuscar").parent().removeClass('has-error');
            $("#inputBuscar").parent().addClass('has-success');

            $('#codigo_alumno_lista').val(ui.item.codigo.trim());

            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.codigo + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    // $('#tablaListado').DataTable();
    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Certificados/titulados",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarCodigoAndAlumnos'
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
            $("#institucion").val(ui.item.Cod_local.trim());
            $("#sede").val(ui.item.NroLocalMinedu.trim());
            $("#tipoEspecialidad").val(ui.item.Tipo_espe.trim());
            $("#especialidad").val(ui.item.Cod_espe.trim());
            $("#inicio").val(ui.item.Inicio != null ? ui.item.Inicio.trim() : '' );
            $("#termino").val(ui.item.Termino != null ? ui.item.Termino.trim() : '' );
            
            $("#alumno").next('i').removeClass('glyphicon-remove');
            $("#alumno").next('i').addClass('glyphicon-ok');
            $("#alumno").parent().removeClass('has-error');
            $("#alumno").parent().addClass('has-success');

            $('#codigo_alumno').val(ui.item.codigo.trim());
            //seleccionarEspecialidadAutomatico(ui.item.codigo.trim(), null);

            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.codigo + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };
    
});

// $(document).on("change", "#institucion", function () {
//     cargarTipoEspecialidades(true);
// });

// $(document).on("change", "#tipoEspecialidad", function () {
//     cargarEspecialidades(true);
// });

$(document).on("change", "input[name='opcionReporte']", function () {
    valorActivo = document.querySelector('input[name="opcionReporte"]:checked').value;
    let elementoActivo = document.querySelector('input[name="opcionReporte"]:checked');
    console.log(elementoActivo);
    if (elementoActivo.value == 1) {
        $('.ver_anio').show()
        $('.ver_mes').hide()
    } else {
        $('.ver_anio').show()
        $('.ver_mes').show()
    }
});


document.addEventListener('click', (e) => {
    if (e.target.matches('#btnVerModalNuevo')) {
        $("#tituloModal").html("REGISTRAR TITULOS");
        $("#btn_modal").addClass("btn-info").removeClass("btn-primary")
        $("#btn_modal").html("Registrar");

        $("#codigoTramite").val("");
        $("#alumno").prop("readonly", false);
        document.getElementById("form-titulado").reset();

        $("#modalNuevoTramite").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches("#btnReporte")) {
        $('.ver_anio').show()
        $('.ver_mes').hide()
        $("#modalReporte").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches("#btnBuscar")) {
        mostrarData();
    }

    if (e.target.matches('#btnCancelar')) {
        $("#modalEditarOficio").modal('hide');
        $("#alumno_edit").next('i').removeClass('glyphicon-remove');
        $("#alumno_edit").parent().removeClass('has-error');
    }

    if (e.target.matches('#selectAll')) {
        $(".column input[type=checkbox]").trigger('click');
    }

});

function desactivarFecha(){
    if($("#cbxFecha").prop("checked") == true){
        $("#fecha_recojo").attr("readonly",true);
    }else{
        $("#fecha_recojo").attr("readonly",false);
    }
}


$('#form-titulado').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrar" });
    console.log("data", form)

    $.ajax({
        url: path + "Certificados/titulados",
        type: "POST",
        data: form,
        beforeSend: function(){
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function(data){
            $("#modalLoader").modal("hide");

            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {         
                $("#modalNuevoTramite").modal("hide");
                $("#codigoTramite").val(null);
                Notiflix.Notify.Success('Registrado correctamente');
                tablaTitulado.ajax.reload(null, false);
                document.getElementById("form-titulado").reset();
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})


function seleccionarEspecialidadAutomatico(codigo, cod_sede) {

    $.ajax({
        url: path + "certificados/tramites",
        type: "POST",
        dataType: "JSON",
        data: {
            codigo: codigo,
            opcion: 'cargarEspecialidadesPorAlumno'
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
            $("#especialidad").html("<option value='NINGUNO'>NINGUNO</option>");
        },
        complete: function (data) {
            $("#NotiflixLoadingWrap").trigger("click");
        },
        success: function (data) {
            console.log("dataprra",data)
            if (data.respuesta === 'success') {  
                data.data2.forEach(e => {
                    $("#especialidad").append(`                            
                            <option value="${e.cod_espe.trim()}">${e.descripcionM.trim()}</option>
                        `);
                });        
                if (data.dataEspAlum != "vacio"){
                    $('#especialidad').val(data.dataEspAlum[0].cod_espe.trim());
                    
                    data.dataEspAlum.forEach(a => {
                    //var selected = a.cod_localinst.trim() === "01" ? "selected" : "";
                    $("#sede").append(`                            
                            <option value="${a.cod_localinst.trim()}">${a.Sede.trim()}</option>
                        `);
                    }); 

                    if(cod_sede === null){
                        $("#sede").val("01");
                    }else if(cod_sede != ''){
                        $('#sede').val(cod_sede);
                    }
                    
                }else{
                    Notiflix.Notify.Failure('No se encontro la especialidad, por favor coloque manualmente');
                }
                
            }

        }
    });

}

function mostrarData()
{
    const cod_alumno = $("#inputBuscar").val();
    const especialidad = $("#carrera").val();
    const mes = $("#mes").val();
    const anio = $("#anio").val();
    // const fecha_1 = $("#fecha_1").val();
    // const fecha_2 = $("#fecha_2").val();

    tablaTitulado = $("#tablaListado").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        lengthMenu: [
            [20, 100, -1], 
            [20, 100, 'TODO']
        ],
        ajax: {
            url: path + "Certificados/titulados",
            type: "POST",
            data: {
                cod_alumno: cod_alumno,
                especialidad: especialidad,
                mes: mes,
                anio: anio,
                // fecha_1: fecha_1,
                // fecha_2: fecha_2,
                opcion: 'listaBuscarTitulados'
            },
            dataSrc: function(data){      
                console.log("dataListBuscarAlumnos", data) 
                if(data.respuesta == "success" && data.lista !== "vacio"){
                    return data.lista; 
                }else{
                    return {};
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
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Cod_Titulado;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Sede
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Cod_Alumno
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Nro_titulo
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.RegAuxiliar
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Nro_resolucion
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaDRELM
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaIngresoExp;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaRecojo != null ? data.FechaRecojo : ""; 
                }
            },
            {
                data: null,
                render: function (data) {

                    if(data.validar == "SI"){
                        return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarTitulado("+data.Cod_Titulado+");\" title=\"Editar Trámite\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                            "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminarTitulado("+data.Cod_Titulado+");\" title=\"Eliminar Trámite\"><span class=\"icon-cross\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    }else{
                        return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarTitulado("+data.Cod_Titulado+");\" title=\"Editar Trámite\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    }
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

function editarTitulado(Cod_Titulado) {

    //var codigo_tramite = $(btn).parent().parent().find("td").eq(15).html();

    //var alumno = $(btn).parent().parent().find("td").eq(6).html();

    $.ajax({
        url: path + "Certificados/titulados",
        type: "POST",
        data: {
            Cod_Titulado: Cod_Titulado,
            opcion: 'buscar_editar'
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                
                const datex = datos.datex[0];
                console.log("dtex", datex);
                
                $("#codigoTramite").val(Cod_Titulado);

                $("#codigo_alumno").val(datex.Cod_Alumno.trim());
                //$("#alumno").val(alumno);
                $("#institucion").val(datex.Cod_local);
                $("#tipoEspecialidad").val(datex.Tipo_espe);
                $("#especialidad").val(datex.Cod_espe);
                $("#inicio").val(datex.Inicio != null ? datex.Inicio.trim() : '' );
                $("#termino").val(datex.Termino != null ? datex.Termino.trim() : '' );
                $("#nro_titulado").val(datex.Nro_titulo.trim());
                $("#auxiliar").val(datex.Reg_auxiliar.trim());
                $("#NroMinedu").val(datex.NroMinedu.trim());
                $("#resolucion").val(datex.Nro_resolucion.trim());
                $("#fecha_ingreso").val(datex.FechaIngresoExp.substr(0, 10));
                $("#fecha_drelm").val(datex.FechaDRELM.substr(0, 10));
                $("#fecha_recojo").val(datex.FechaRecojo.substr(0, 10));

                $("#btn_modal").addClass("btn-primary").removeClass("btn-info")
                $("#btn_modal").html("Editar");

                //seleccionarEspecialidadAutomatico(datex.Cod_Alumno, datex.Cod_LocalInst)

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
    $("#tituloModal").html("Editar Titulado");
    $("#modalNuevoTramite").modal({ backdrop: 'static', keyboard: false });

}

function eliminarTitulado(Cod_Titulado) {

    //var codigo_tramite = $(btn).parent().parent().find("td").eq(15).html();

    //var alumno = $(btn).parent().parent().find("td").eq(6).html();
     Notiflix.Confirm.Show(
        'Eliminar Titulado',
        '¿Esta segura de eliminar? ',
        'Si',
        'No',
        function okCb() {

                $.ajax({
                    url: path + "Certificados/titulados",
                    type: "POST",
                    data: {
                        Cod_Titulado: Cod_Titulado,
                        opcion: 'cambiarEstadoTitulo'
                    },
                    success: function (data) {
                        var datos = JSON.parse(data);
                        if (datos.respuesta == "success") {

                             Notiflix.Notify.Success('Eliminado correctamente');
                             tablaTitulado.ajax.reload(null, false);

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

}

function eliminarTramite(cod_tramite, numero) {

    var codigo_tramite = cod_tramite;

    var nro_certificado = numero;
    //var alumno = $(btn).parent().parent().find("td").eq(6).html();

    Notiflix.Confirm.Show(
        'Eliminar Tramite',
        '¿Esta segura de eliminar el certificado? Nro. : '+ nro_certificado +'',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "Certificados/tramites",
                type: "POST",
                data: {
                    codigo_tramite: codigo_tramite,
                    opcion: 'eliminar_trami'
                },
                success: function (data) {
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        tablaTitulado.ajax.reload(null, false);
                        console.log(datos)

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
        },
        function cancelCb() {

        },
        {
        },
    );

}

function reporteTitulados() {
    const anio = $('#anioProg').val();
    const mes = $('#mesProg').val();
    const opcionReporte = document.querySelector('input[name="opcionReporte"]:checked').value

    $.ajax({
        url: path + "Certificados/titulados",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "exportarReporte",
            opcionReporte: opcionReporte,
            mesProg: mes,
            anioProg: anio
        },
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function () {
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
            console.log(response);

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.reporte + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Notify.Failure("No hay datos la fecha seleccionada");

            }
        },
    })
}
