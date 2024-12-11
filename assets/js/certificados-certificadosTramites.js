let coloresAsesores = {};
const coloresFondo  = [ 
    "#818cf8",
    "#a78bfa",
    "#2dd4bf",
    "#4ade80",
    "#f472b6",
    "#eab308",
    "#ef4444",
    "#10b981",
    "#c084fc"
]
let coloresAsesores2 = {};
const coloresFondo2  = [ 
    "#818cf8",
    "#a78bfa",
    "#2dd4bf",
    "#4ade80",
    "#f472b6",
    "#eab308",
    "#ef4444",
    "#10b981",
    "#c084fc"
]
$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });

    cargarInstituciones(true);
    cargarInstituciones2(true);

    // $('#inputBuscar').focus();
    // $("#inputBuscar").autocomplete({
    //     source: function (request, response) {
    //         $.ajax({
    //             url: path + "Certificados/tramites",
    //             dataType: "json",
    //             data: {
    //                 term: request.term,
    //                 opcion: 'buscarCodigoAndAlumnos'
    //             },
    //             success: function (data) {
    //                 $("#alumno").removeAttr("data-code");
    //                 $("#alumno").next('i').removeClass('glyphicon-ok');
    //                 $("#alumno").next('i').addClass('glyphicon-remove');
    //                 $("#alumno").parent().removeClass('has-success');
    //                 $("#alumno").parent().addClass('has-error');

    //                 response(data.alumnos);
    //             }
    //         });
    //     },
    //     minLength: 3,
    //     select: function (event, ui) {
    //         $('#inputBuscar').attr('data-code', ui.item.codigo);
    //         $("#inputBuscar").val(ui.item.nombre);
    //         $("#inputBuscar").next('i').removeClass('glyphicon-remove');
    //         $("#inputBuscar").next('i').addClass('glyphicon-ok');
    //         $("#inputBuscar").parent().removeClass('has-error');
    //         $("#inputBuscar").parent().addClass('has-success');

    //         $('#codigo_alumno_lista').val(ui.item.codigo.trim());

    //         return false;
    //     }
    // })
    // .autocomplete("instance")._renderItem = function (ul, item) {
    //     return $("<li>")
    //         .append("<div>" + item.codigo + " - " + item.nombre + "</div>")
    //         .appendTo(ul);
    // };
    // $('#tablaListado').DataTable();
    $("#alumno").autocomplete({
        source: function(request, response){
            $('.contenidoSede span').remove();
            $('.contenidoPagos span').remove();
            $.ajax({
                url: path + "Certificados/tramites",
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
            $("#alumno").next('i').removeClass('glyphicon-remove');
            $("#alumno").next('i').addClass('glyphicon-ok');
            $("#alumno").parent().removeClass('has-error');
            $("#alumno").parent().addClass('has-success');

            $('#codigo_alumno').val(ui.item.codigo.trim());
            seleccionarEspecialidadAutomatico(ui.item.codigo.trim(), null);
            mostrarPagosPorAlumno(ui.item.codigo.trim())

            $('.seccionDatos').show();

            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.codigo + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };
    
});

$(document).on("change", "#institucion", function () {
    cargarTipoEspecialidades(true);
});

$(document).on("change", "#tipoEspecialidad", function () {
    cargarEspecialidades(true);
});

$(document).on("change", "#ciclo1, #ciclo2", function () {

    let n1 = Number($('#ciclo1').val());    
    let n2 = Number($('#ciclo2').val()) + 1;
    $.ajax({
        url: path + "Certificados/certificadosTramites",
        type: "POST",
        data: {
            opcion: 'tramitesPrecio',
            local: $('#institucion').val(),
            tipo_espe: '01',
            cod_espe: $('#especialidad').val()
        },
        beforeSend: function(){
        },
        success: function(data){            
            let datos = JSON.parse(data);
            console.log("asd", datos);
            
            if (datos.respuesta === 'success') {         
                total = (n2 - n1)*Number(datos.monto);
                $('#costo').val(Number(total))
            } else{
                Notiflix.Notify.Failure('Ocurrió un error, recargue la pagina');
                setTimeout(() => {
                     window.location.reload();
                }, 1000);
            }
        }
    });

});

$('#modalNuevoTramite').on('hidden.bs.modal', function () {
    $('#fechaEntrega').val('')
    console.log("cerrar modal");
});
$('#cerraModalProceso').click(function () {
    $('#modalProcesarTramite').hide()
    console.log("cerrar modaasdl");
});

$('#modalVistaPreviaCertificado').on('hidden.bs.modal', function () {
    $("body").css({ "padding": 0 });
});


document.addEventListener('click', (e) => {
    if (e.target.matches('#btnVerModalNuevo')) {
        $("#tituloModal").html("REGISTRAR TRÁMITE");
        $("#btn_modal").addClass("btn-info").removeClass("btn-primary")
        $("#btn_modal").html("Registrar");

        $("#codigoTramite").val("0"); //Op
        $("#codigo_alumno").val('');
        $("#sede").html('');
        $('.contenidoSede span').remove();
        $('.contenidoPagos span').remove();
        cargarInstituciones(true);
        cargarInstituciones2(true);
        $("#alumno").prop("readonly", false);
        document.getElementById("form-tramite").reset();

        $("#tipoTramite").val('');
        $("#tipoModalidad").val('');
        $("#pagoTramite").html('');
        $("#modalNuevoTramite").modal({
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

    if (e.target.matches("#btnReporte")) {
        reporteTramites();
    }

});

function seleccionarEspecialidadAutomatico(codigo, cod_sede) {

    $.ajax({
        url: path + "certificados/certificadosTramites",
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
                    Notiflix.Report.Info('Aviso', 'El alummno no se encuentra registrado en NOMINAS', 'Okey');
                    $(".contenidoSede").append('<span style="color: red">No tiene sede porque no esta en Nominas.</span>');
                }
                
            }

        }
    });

}
function mostrarPagosPorAlumno(codigo) {

    $.ajax({
        url: path + "certificados/certificadosTramites",
        type: "POST",
        dataType: "JSON",
        data: {
            codigo: codigo,
            opcion: 'listaPagos'
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
            $("#pagoTramite").html("<option value=''>Seleccione...</option>");
        },
        complete: function (data) {
            //$("#NotiflixLoadingWrap").trigger("click");
        },
        success: function (data) {
            console.log("asdasddd",data)
            if (data.respuesta === 'success') {  
                data.pagos.forEach(e => {
                    console.log("e", e);
                    
                    $("#pagoTramite").append(`
                            <option value="${e.Transaccion.trim()}">${e.Concepto.trim()} - ${e.Transaccion.trim()} - ${e.Fecha.trim()} - Importe(${e.Importe})</option>
                        `);
                });        
                    
            }else{
                $(".contenidoPagos").append('<span style="color: red">No tiene ningun pago.</span>');
            }
                

        }
    });

}

function mostrarData()
{
    const cod_alumno = $("#codigo_alumno_lista").val();
    const local = $("#institucion2").val();
    const tipo_espe = $("#tipoEspecialidad2").val();
    const especialidad = $("#especialidad_lista").val();

    const fecha_1 = $("#fecha_1").val();
    const fecha_2 = $("#fecha_2").val();

    const estado = $("#estadoFiltro").val();


    tablaTramite = $("#tablaListado").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn-important'},
            // { "extend": 'pdf', "text":'Reporte PDF',"className": 'btn-important'}
        ],
        lengthMenu: [
            [20, 50, -1], 
            [20, 50, 'TODO']
        ],
        ajax: {
            url: path + "Certificados/certificadosTramites",
            type: "POST",
            data: {
                cod_alumno: cod_alumno,
                local_lista: local,
                tipo_lista: tipo_espe,
                especialidad: especialidad,
                fecha_1: fecha_1,
                fecha_2: fecha_2,
                estado: estado,
                opcion: 'listaBuscarAlumnos'
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
                render: function (data) {
                    return data.Op;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Fecha;
                }
            },
            {
                data: null,
                render: function (data) {
                    let colorAsesor = getColorAsesor(data);
                    return "<input type=\"text\" disabled id=\'op_nroCerti_"+data.Op+"\' value='"+data.NroCertificado+"' class=\"btn mipanel-btn-img-texto\" style=\"background-color: " + colorAsesor + "; font-weight: bold; color: black !important; font-size: 14px; width: 100%;\">"+
                           "<button class=\"btn boton-tabla btnw-warning\" id=\'editar_nroCerti_"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"mostrarEditarNumeroCertificado(this)\" title=\"Editar Numero Certificado\"><span class=\"icon-pencil2\"></span></button>"+
                           "<button class=\"btn boton-tabla btnw-success\" id=\'guardar_nroCerti_"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"editarNumeroCertificado(this)\" style=\"display: none;\" title=\"Guardar Numero Certificado\"><span class=\"icon-floppy-disk\"></span></button>"
                }   
            },
            {
                data: null,
                render: function (data) {
                    return data.Tipo.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Modalidad.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Transaccion.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.CodAlumno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cicloI;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cicloF;
                }
            },
            {
                data: null,
                render: function (data) {
                    let colorAsesor = getColorAsesor2(data);
                    return "<input type=\"date\" disabled id=\'op_fechaExpedi_"+data.Op+"\' value='"+data.FechaExpedicion+"' class=\"btn mipanel-btn-img-texto\" style=\"background-color: " + colorAsesor + "; font-weight: bold; color: black !important; font-size: 14px; width: 82%;\">"+
                           "<button class=\"btn boton-tabla btnw-warning\" id=\'editar_fechaExpedi_"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"mostrarEditarFechaExpedi(this)\" title=\"Editar Fecha Expedicion\"><span class=\"icon-pencil2\"></span></button>"+
                           "<button class=\"btn boton-tabla btnw-success\" id=\'guardar_fechaExpedi_"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"editarFechaExpedi(this)\" style=\"display: none;\" title=\"Guardar Fecha Expedicion\"><span class=\"icon-floppy-disk\"></span></button>"
                }   
            },
            {
                data: null,
                render: function (data) {
                    return data.Precio;
                }
            },
            {
                data: null,
                render: function (data) {
                    let bloqueo = data.Estado == 'Registrado' ? 'disabled' : ''
                    if(data.FechaEntrega == null){
                        return "<button class=\"btn boton-tabla btn-warning\" "+bloqueo+" id=\'mostrarModalFechaEntrega"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"mostrarModalFechaEntrega('"+data.Op+"')\" title=\"Colocar Fecha Entrega\"><span class=\"icon-arrow-right2\"></span></button>"
                    }else{
                        return data.FechaEntrega+" <button class=\"btn boton-tabla btn-success\" "+bloqueo+" id=\'mostrarModalFechaEntrega"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"mostrarModalFechaEntrega('"+data.Op+"')\" title=\"Editar Fecha Entrega\"><span class=\"icon-arrow-right2\"></span></button>"
                    }
                }
            },  
            {
                data: null,
                render: function (data) {
                    return data.observaciones.trim();
                }
            },
            {
                data: null,
                render: function (data) {

                    if (data.Estado == "Registrado"){
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #3b82f6; border-radius: 0px;\">" + data.Estado + "</span>"
                    } else if (data.Estado == "Generado"){
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #22c55e; border-radius: 0px;\">" + data.Estado + "</span>"
                    }else{
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #198754; border-radius: 0px;\">" + data.Estado + "</span>"
                    }
                }
            },          
            {
                data: null,
                render: function (data) {
                    return data.Usuario.trim();
                }
            },   
            {
                data: null,
                render: function (data) {
                    return data.FechaReg;
                }
            },   
            {
                data: null,
                render: function (data) {
                    return "<div class=\"certificado-container\"><button title=\"Procesar Certificado\" class=\"btn btn-sm btn-success\" onclick=\"verOpcionesProcesar('"+ data.Op +"','"+ data.CodAlumno +"','10','01','"+ data.cod_espe.trim() +"','"+ data.cicloI.trim() +"','"+ data.cicloF.trim() +"')\"><i class='icon-spinner'></i></button></div>";
                }
            },
            {
                data: null,
                render: function(data){                    
                    return  "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"verTramite('"+ data.CodAlumno +"','10','01','"+ data.cod_espe.trim() +"','"+ data.idcertPK +"','"+ data.TipoProceso +"');\" title=\"Ver Trámite\"><span class=\"icon-eye\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                            "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarTramite('"+ data.Op +"','"+ data.Alumno.trim() +"');\" title=\"Editar Trámite\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                            "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarTramite('"+ data.Op +"','"+ data.numero +"');\" title=\"Eliminar Trámite\"><span class=\"icon-cross\"></span></button>";
                                        
                
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

$('#form-tramite').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrar" });
    console.log("data", form)

    $.ajax({
        url: path + "Certificados/certificadosTramites",
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
                $("#codigoTramite").val("");
                Notiflix.Notify.Success('Registrado correctamente');
                document.getElementById("form-tramite").reset();
                tablaTramite.ajax.reload(null, false);
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

function editarTramite(op, alumnoData) {

    //var alumno = $(btn).parent().parent().find("td").eq(6).html();
    var alumno = alumnoData;

    $.ajax({
        url: path + "Certificados/certificadosTramites",
        type: "POST",
        data: {
            op: op,
            opcion: 'buscar_editar'
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                console.log(datos)

                const datex = datos.datex[0];
 
                $("#codigoTramite").val(op);
                $("#codigo_alumno").val(datex.cod_alumno);
                $("#alumno").val(alumno);
                $("#institucion").val(datex.cod_local);
                $("#tipoTramite").val(datex.Tipo);
                $("#tipoModalidad").val(datex.codmod);

                //$("#tipoEspecialidad").val(datex.Tipo_Espe);
                $("#fecha").val(datex.Fecha.substr(0, 10));
                //$("#fecha_expedicion").val(datex.FechaExpedicion.substr(0, 10));
                $("#ciclo1").val(datex.cicloI);
                $("#ciclo2").val(datex.cicloF);
                $("#costo").val(datex.Precio);

                $("#observaciones").val(datex.Observaciones);

                $("#btn_modal").addClass("btn-primary").removeClass("btn-info")
                $("#btn_modal").html("Guardar cambios");

                seleccionarEspecialidadAutomatico(datex.cod_alumno, datex.cod_local)

                mostrarPagosPorAlumno(datex.cod_alumno.trim())

                setTimeout(() => {
                    $("#sede").val(datex.cod_localInst);
                    $("#especialidad").val(datex.cod_espe);
                    $("#pagoTramite").val(datex.transaccion);
                }, 500);

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

function verTramite(cod_alumno, cod_local, tipo_espe, cod_espe, idcertPK, tipoProceso){
    $("body").css({ "padding": 0 });
    switch(tipoProceso) {
        case '2020-2024':
                $.ajax({
                    url: path + "notas/certificados",
                    type: "POST",
                    dataType:"JSON",
                    data: {
                        opcion : "descargarCertificado",
                        parametros : tipo_espe+'-'+cod_espe+'-'+cod_local+'-'+cod_alumno,
                        idcertPK : idcertPK        
                    } ,
                    beforeSend: function () {
                        $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
                        $("#modalLoader").modal();
                    },
                    complete : function(){
                        $("#modalLoader").modal("hide");
                    },
                    success: function (response) {
                        if(response.respuesta === "success" ){
                            $("#modalVistaPreviaCertificado").modal("show")
                            $('#modalTituloVerTram').html('VISTA PREVIA DEL CERTIFICADO: '+tipoProceso+' | idcertPK: '+idcertPK) 
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                            let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);     
                        }else{  
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");                   
                            Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                        }   
                    },
                })
            console.log('2024');
            break;
        case '2014-2019':
                $.ajax({
                    url: path + "notas/certificadosModular",
                    type: "POST",
                    dataType:"JSON",
                    data: {
                        opcion : "descargarCertificado",
                        parametros : tipo_espe+'-'+cod_espe+'-'+cod_local+'-'+cod_alumno,
                        idcertPK : idcertPK        
                    } ,
                    beforeSend: function () {
                        $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
                        $("#modalLoader").modal();
                    },
                    complete : function(){
                        $("#modalLoader").modal("hide");
                    },
                    success: function (response) {
                        if(response.respuesta === "success" ){
                            $("#modalVistaPreviaCertificado").modal("show")
                            $('#modalTituloVerTram').html('VISTA PREVIA DEL CERTIFICADO: '+tipoProceso+' | idcertPK: '+idcertPK) 
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                            let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);     
                        }else{  
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");                   
                            Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                        }   
                    },
                })
                console.log('2019');
            break;
        case '2013':
                $.ajax({
                    url: path + "notas/certificadosTradicional",
                    type: "POST",
                    dataType:"JSON",
                    data: {
                        opcion : "descargarCertificado",
                        parametros : tipo_espe+'-'+cod_espe+'-'+cod_local+'-'+cod_alumno,
                        idcertPK : idcertPK        
                    } ,
                    beforeSend: function () {
                        $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
                        $("#modalLoader").modal();
                    },
                    complete : function(){
                        $("#modalLoader").modal("hide");
                    },
                    success: function (response) {
                        if(response.respuesta === "success" ){
                            $("#modalVistaPreviaCertificado").modal("show")
                            $('#modalTituloVerTram').html('VISTA PREVIA DEL CERTIFICADO: '+tipoProceso+' | idcertPK: '+idcertPK) 
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                            let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);     
                        }else{  
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");                   
                            Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                        }   
                    },
                })
                console.log('2013');
            break;
        default:
                Notiflix.Notify.Warning("No existe IdcertPK o tipo proceso")
                console.log('Default');
                // code block
        }
   
}

function reporteTramites() {
    const cod_alumno = $("#inputBuscar").val();
    const local = $("#institucion2").val();
    const tipo_espe = $("#tipoEspecialidad2").val();
    const especialidad = $("#especialidad_lista").val();

    const fecha_1 = $("#fecha_1").val();
    const fecha_2 = $("#fecha_2").val();

    const estado = $("#estadoFiltro").val();
    const tipoCert = $("#tipoCertificadoFiltro").val();

    $.ajax({
        url: path + "Certificados/tramites",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "exportarReporteTramites",
            cod_alumno: cod_alumno,
            local_lista: local,
            tipo_lista: tipo_espe,
            especialidad: especialidad,
            fecha_1: fecha_1,
            fecha_2: fecha_2,
            estado: estado,
            tipoCert: tipoCert            
        },
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
            $("body").css({ "padding": 0 });
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

function eliminarTramite(op) {

    //var alumno = $(btn).parent().parent().find("td").eq(6).html();

    Notiflix.Confirm.Show(
        'Eliminar Tramite',
        '¿Esta segura de eliminar el certificado? OP: '+ op +'',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "Certificados/certificadosTramites",
                type: "POST",
                data: {
                    op: op,
                    opcion: 'eliminar_trami'
                },
                success: function (data) {
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        tablaTramite.ajax.reload(null, false);
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

function verReportePDF(cod_tramite, nombre, especialidad) {
    //const op = $(btn).attr("codigo");
    $.ajax({
        url: path + "Certificados/tramites",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "solicitudPDF",
            codigo_tramite: cod_tramite,
            nombre: nombre,
            especialidad: especialidad
        },
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.solicitud + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })
}

function mostrarModalFechaEntrega(op){
    $('#op_fecha').val(op)
    $('#modalFechaEntrega').show();
}

function guardarFechaEntrega(){
    $.ajax({
        url: path + "certificados/certificadosTramites",
        type: "POST",
        data: {
            op: $('#op_fecha').val(),
            fechaEntrega: $('#fechaEntrega').val(),
            observa: $('#observacion_entrega').val(),
            opcion: 'fechaEntrega'
        },
        beforeSend: function () {

        },
        success: function (data) {

            let datos = JSON.parse(data);

            if (datos.respuesta === 'success') {
                tablaTramite.ajax.reload(null, false);
                $("#op_fecha").val('');
                $("#fechaEntrega").val('');
                $("#observacion_entrega").val('');
                $("#modalFechaEntrega").hide();                        
                Notiflix.Report.Success('Felicidades', 'ENTREGADO CORRECTAMENTE', 'Okey baby'); 
            } else {
                Notiflix.Report.Failure('Ocurrió un error al editar, recargue la pagina');
            }
        }
    });
}

function verOpcionesProcesar(op, cod_alumno, cod_local, tipo_espe, cod_espe, ciclo1, ciclo2){
    $('#procesar_op').val(op);
    $('#procesar_CodAlumno').val(cod_alumno);
    $('#procesar_codLocal').val(cod_local);
    $('#procesar_tipoEspe').val(tipo_espe);
    $('#procesar_codEspe').val(cod_espe);
    $('#procesar_ciclo1').val(ciclo1);
    $('#procesar_ciclo2').val(ciclo2);
    $('#modalProcesarTramite').show();
}

function generarTramiteTipo(tipoProceso){
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de generar el certificado?',
        'Si',
        'No',
        function(){
            $('#procesar_TIPOPROCESO').val(tipoProceso);
            $("#modalNumeroCertificado").show(); 
            $("#modalProcesarTramite").hide();
        }
        ,function(){  
            $("#modalNumeroCertificado").hide(); 
        }
    );
}

$("#btnGenerarCertificado_NumCert").click(function(){
    switch($('#procesar_TIPOPROCESO').val()) {
        case '2024':
                $.ajax({
                    url: path + "notas/procesarCertificado",
                    type: "POST",
                    dataType:"JSON",
                    data: {
                        opcion : "generarCertificado",
                        parametros : $("#procesar_tipoEspe").val()+'-'+$("#procesar_codEspe").val()+'-'+$("#procesar_codLocal").val(),
                        convalidacion : '',
                        observacion : '',
                        codigo : $('#procesar_CodAlumno').val(),
                        desde : $('#procesar_ciclo1').val(),
                        hasta : $('#procesar_ciclo2').val(),
                        nro_certificado_modal : $("#nro_certificado_modal").val(),
                        op : $("#procesar_op").val()
                    } ,
                    beforeSend: function () {
                        $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
                        $("#modalLoader").modal();
                    },
                    complete : function(){
                        $("#modalLoader").modal("hide");
                    },
                    success: function (response) {
                        
                        $("#nro_certificado_modal").val('');
                        $("#modalNumeroCertificado").hide();
                        $("#modalProcesarTramite").hide();
                        if(response.respuesta === "success" ){
                            
                            $("#modalVistaPreviaCertificado").modal("show")
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                            let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);    
                            
                        }else{  
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");                   
                            Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                        }    
                    },
                })
            console.log('2024');
            break;
        case '2019':
                $.ajax({
                    url: path + "notas/procesarCertificadosModular",
                    type: "POST",
                    dataType:"JSON",
                    data: {
                        opcion : "generarCertificado",
                        parametros : $("#procesar_tipoEspe").val()+'-'+$("#procesar_codEspe").val()+'-'+$("#procesar_codLocal").val(),
                        convalidacion : "",//$("#convalidacion").val(),
                        observacion : "",//$("#observacion").val(),
                        codigo : $('#procesar_CodAlumno').val(),
                        desde : $('#procesar_ciclo1').val(),
                        hasta : $('#procesar_ciclo2').val(),
                        nro_certificado_modal : $("#nro_certificado_modal").val(),
                        op : $("#procesar_op").val()
                    },
                    beforeSend: function () {

                        $("#modalNumeroCertificado").hide();
                        $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
                        $("#modalLoader").modal();
                    },
                    complete : function(){
                        $("#modalLoader").modal("hide");
                    },
                    success: function (response) {

                        $("#nro_certificado_modal").val('');
                        $("#modalProcesarTramite").hide();                        
                        if(response.respuesta === "success" ){
                            $("#modalVistaPreviaCertificado").modal("show")
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                            let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);    
                            
                        }else{  
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");                   
                            Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                        }    
                    },
                })
                console.log('2019');
            break;
        case '2013':
                $.ajax({
                    url: path + "notas/procesarCertificadosTradicional",
                    type: "POST",
                    dataType:"JSON",
                    data: {
                        opcion : "generarCertificado",
                        parametros : $("#procesar_tipoEspe").val()+'-'+$("#procesar_codEspe").val()+'-'+$("#procesar_codLocal").val(),
                        convalidacion : "",//$("#convalidacion").val(),
                        observacion : "",//$("#observacion").val(),
                        codigo : $('#procesar_CodAlumno').val(),
                        desde : $('#procesar_ciclo1').val(),
                        hasta : $('#procesar_ciclo2').val(),
                        nro_certificado_modal : $("#nro_certificado_modal").val(),
                        op : $("#procesar_op").val()
                    },
                    beforeSend: function () {
                        $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
                        $("#modalLoader").modal();
                    },
                    complete : function(){
                        $("#modalLoader").modal("hide");
                    },
                    success: function (response) {
                        $("#nro_certificado_modal").val('');
                        $("#modalNumeroCertificado").hide();
                        $("#modalProcesarTramite").hide();
                        if(response.respuesta === "success" ){
                            $("#modalVistaPreviaCertificado").modal("show")
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                            let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);      
                        }else{  
                            $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");                   
                            Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                        }    
                    },
                })
                console.log('2013');
            break;
        default:
                console.log('Default');
                // code block
        }
   
})

$("#cerraModalCrt").click(function(){
    $("#nro_certificado_modal").val('');
    $("#modalNumeroCertificado").hide();
    $("body").css({"padding-right" : 0 })
})

$("#cerraModalFE").click(function(){
    $("#op_fecha").val('');
    $("#fechaEntrega").val('');
    $("#observacion_entrega").val('');
    $("#modalFechaEntrega").hide();
    $("body").css({"padding-right" : 0 })
})

function mostrarEditarNumeroCertificado(data){
    let op = $(data).attr("data-op");
    $('#op_nroCerti_'+op).attr("disabled", false)
   // $('#editar_'+op).hide(300)
    $('#guardar_nroCerti_'+op).toggle(300)
}

function editarNumeroCertificado(data){
    let op = $(data).attr("data-op");
    $('#op_nroCerti_'+op).attr("disabled", true)
    let nro = $('#op_nroCerti_'+op).val()
   // $('#editar_'+op).hide(300)
    $('#guardar_nroCerti_'+op).hide(300)
    
    Notiflix.Confirm.Show(
        'EDITAR NUMERO CERTIFICADO: ',
        'Esta opcion permitira cambiar el numero de certificado',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "certificados/certificadosTramites",
                type: "POST",
                data: {
                    op: op,
                    nro: nro,
                    opcion: 'editarNumCerti'
                },
                beforeSend: function () {

                },
                success: function (data) {

                    let datos = JSON.parse(data);

                    if (datos.respuesta === 'success') {
                        tablaTramite.ajax.reload(null, false);
                        Notiflix.Notify.Success("MODIFICADO CORRECTAMENTE"); 
                    } else {
                        Notiflix.Notify.Failure('Ocurrió un error al editar, recargue la pagina');
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

function generarColorAleatorio() {
    return coloresFondo[Math.floor(Math.random() * coloresFondo.length)];
}
function getColorAsesor(asesor) {
    if (!coloresAsesores[asesor]) {
        coloresAsesores[asesor] = generarColorAleatorio();
    }
    return coloresAsesores[asesor];
}

function mostrarEditarFechaExpedi(data){
    let op = $(data).attr("data-op");
    $('#op_fechaExpedi_'+op).attr("disabled", false)
   // $('#editar_'+op).hide(300)
    $('#guardar_fechaExpedi_'+op).toggle(300)
}

function editarFechaExpedi(data){
    let op = $(data).attr("data-op");
    $('#op_fechaExpedi_'+op).attr("disabled", true)
    let nro = $('#op_fechaExpedi_'+op).val()
   // $('#editar_'+op).hide(300)
    $('#guardar_fechaExpedi_'+op).hide(300)
    
    Notiflix.Confirm.Show(
        'EDITAR FECHA EXPEDICION: ',
        'Esta opcion permitira cambiar la fecha de expedicion',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "certificados/certificadosTramites",
                type: "POST",
                data: {
                    op: op,
                    nro: nro,
                    opcion: 'editarFechaExpedi'
                },
                beforeSend: function () {

                },
                success: function (data) {

                    let datos = JSON.parse(data);

                    if (datos.respuesta === 'success') {
                        tablaTramite.ajax.reload(null, false);
                        Notiflix.Notify.Success("MODIFICADO CORRECTAMENTE"); 
                    } else {
                        Notiflix.Notify.Failure('Ocurrió un error al editar, recargue la pagina');
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

function generarColorAleatorio2() {
    return coloresFondo2[Math.floor(Math.random() * coloresFondo2.length)];
}
function getColorAsesor2(asesor) {
    if (!coloresAsesores2[asesor]) {
        coloresAsesores2[asesor] = generarColorAleatorio();
    }
    return coloresAsesores2[asesor];
}