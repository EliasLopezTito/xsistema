var coloresAsesores = {};
const coloresFondo  = [ 
    "rgba(54, 162, 235, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(255, 205, 86, 0.3)",
    "rgba(255, 99, 132, 0.3)",
    "rgba(201, 203, 207, 0.3)",
    "rgba(83, 211, 87, 0.3)",
    "rgba(237, 208, 98, 0.3)"  
]

$(document).ready(function () {
    cargarInstituciones(true);
    cargarInstituciones2(true);

    // $("#inputBuscar").autocomplete({
    //     source: function(request, response){
    //         $.ajax({
    //             url: path + "Programacion/descargarBoleta",
    //             dataType: "json",
    //             type: 'post',
    //             data: {
    //                 term: request.term,
    //                 opcion: 'searchAlumnos'
    //             },
    //             success: function(data){
    //                 $("#inputBuscar").attr("codigo","");
    //                 $("#inputBuscar").next('i').removeClass('glyphicon-ok');
    //                 $("#inputBuscar").next('i').addClass('glyphicon-remove');
    //                 $("#inputBuscar").parent().removeClass('has-success');
    //                 $("#inputBuscar").parent().addClass('has-error');
    //                 let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
    //                 response(result);
    //             }
    //         });
    //     },
    //     minLength: 2,
    //     select: function(event, ui){
    //         if (ui.item.vacio) {
    //             event.preventDefault();
    //         } else{
    //             $("#inputBuscar").val(ui.item.cod_alumno + " - " + ui.item.nombre);
    //             $("#inputBuscar").attr('codigo', ui.item.cod_alumno);
    //             $("#inputBuscar").next('i').removeClass('glyphicon-remove');
    //             $("#inputBuscar").next('i').addClass('glyphicon-ok');
    //             $("#inputBuscar").parent().removeClass('has-error');
    //             $("#inputBuscar").parent().addClass('has-success');
    //         }
    //         return false;
    //     }
    // })
    // .autocomplete( "instance" )._renderItem = function( ul, item ) {

    //     if (item.hasOwnProperty('vacio')) {
    //         return $( "<li>" )
    //         .append( "<div>No se encontraron resultados</div>" )
    //         .appendTo( ul );
    //     }

    //     return $( "<li>" )
    //         .append( "<div>"+item.nombre+"</div>" )
    //         .appendTo( ul );
    // };
    $("#inputBuscar").focus();
    
});

function generarColorAleatorio() {
    return coloresFondo[Math.floor(Math.random() * coloresFondo.length)];
}
function getColorAsesor(asesor) {
    if (!coloresAsesores[asesor]) {
        coloresAsesores[asesor] = generarColorAleatorio();
    }
    return coloresAsesores[asesor];
}

var checkboxHTML = function(valor) {
    return valor === 1 ? '☑' : '<input type="checkbox" disabled>';
};

$(".archivosAdjuntar").change(function () {

    let archivo = $(this)[0].files[0];
    if (archivo === undefined) {
        $(this).val(null);
        return;
    }

    const extension = archivo["name"].split(".")[archivo["name"].split(".").length - 1];

    console.log("extexion", extension)
    if(extension === "pdf"){
        if (archivo.size <= 1048576) {
            Notiflix.Notify.Success('IMAGEN ACEPTADA');
        } else {
            $(this).val(null);
            Notiflix.Report.Warning('AVISO', "EL ARCHIVO DEBE PESAR MÁXIMO 1MB", "Cerrar");
        }
    }else{
        $(this).val(null);
        Notiflix.Report.Warning('AVISO', "SOLO SE ACEPTA FORMATO PDF", "Cerrar");
        return;
    }
})

$("#btnBuscar").click(function(){
    buscarCertificados()
})

function buscarCertificados() {
    var alumno = $('#inputBuscar').val().split(' ')[0];
    var fecha_inicio = $('#fecha_1').val();
    var fecha_final = $('#fecha_2').val();
    var asesor = $('#lista_asesores').val();
    var cod_espe = $('#especialidad_lista').val();
    
    tablaTramite = $("#tablaCertificadoEstudios").DataTable({
        destroy: true,
        searching: true,
        ordering: false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        lengthMenu: [
            [50, 100, -1],
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "certificados/certificadoEstudios",
            type: "POST",
            data: {
                alumno: alumno,
                fecha_inicio: fecha_inicio,
                fecha_final: fecha_final,
                asesor: asesor,
                cod_espe:cod_espe,
                opcion: "cargarInformacionCertificado"
            },
            dataSrc: function(data) {
                console.log("data", data);
                if (data.respuesta === "success" && data.certificados !== "vacio") {
                    var certificados = data.certificados;
                    return certificados
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
            { data: 'Op', title: 'Op' },
            {   data: 'Asesor', 
                title: 'Asesor(a)',  
                render: function (data) {
                    var colorAsesor = getColorAsesor(data);
                    return  "<div class=\"celda-centrada\" style=\"background-color: " + colorAsesor + ";" + "font-weight: bold;"+ "\">" + data.toUpperCase() + "</div>";
                }
            },
            { data: 'Fecha', title: 'Fecha' },
            { data: 'CodAlumno', title: 'Código' },
            { data: 'Alumno', title: 'Alumno' },
            { data: 'TipoDoc', title: 'TipoDoc' },
            { data: 'NumDocumento', title: 'Número de Documento' },
            { data: 'celular', title: 'Celular' },
            { data: 'Especialidad', title: 'Programa de estudios' },
            {
                data: 'CopiaDNI',
                title: 'Copia DNI',
                render: function (data, type, row) {
                    var rutasArray = row.ruta.split('?');
                    var origenArray = row.Origen.split('?');
                    if (typeof rutasArray[0] !== "undefined" && rutasArray[0] !== "" && rutasArray[0] !== null && data == 1) {
                        return checkboxHTML(data) + "<div class=\"certificado-container\">" +
                            "<button title=\"Ver Copia DNI\" class=\"btn btn-sm btn-primary\" onclick=\"verImagen('" + rutasArray[0] + "', 'COPIA DNI','" + origenArray[0] + "')\"><i class='icon-file-pdf'></i></button>" +
                            "</div>";
                    } else {
                        return checkboxHTML(data);
                    }
                }
            },
            {
                data: 'Foto',
                title: 'Foto',
                render: function (data, type, row) {
                    var rutasArray = row.ruta.split('?');
                    var origenArray = row.Origen.split('?');
                    if (typeof rutasArray[1] !== "undefined" && rutasArray[1] !== "" && rutasArray[1] !== null && data == 1) {
                        return checkboxHTML(data) + "<div class=\"certificado-container\">" +
                            "<button title=\"Ver Foto\" class=\"btn btn-sm btn-primary\" onclick=\"verImagen('" + rutasArray[1] + "', 'FOTO','" + origenArray[1] + "')\"><i class='icon-file-pdf'></i></button>" +
                            "</div>";
                    } else {
                        return checkboxHTML(data);
                    }
                }
            },
            {
                data: 'CERT',
                title: 'Entregó CERT',
                render: function (data, type, row) {
                    var rutasArray = row.ruta.split('?');
                    var origenArray = row.Origen.split('?');
                    if (typeof rutasArray[2] !== "undefined" && rutasArray[2] !== "" && rutasArray[2] !== null && data == 1) {
                        return checkboxHTML(data) +"<div class=\"certificado-container\">" +
                            "<button title=\"Ver Certificado\" class=\"btn btn-sm btn-primary\" onclick=\"verImagen('" + rutasArray[2] + "', 'CERTIFICADO','" + origenArray[2] + "')\"><i class='icon-file-pdf'></i></button>" +
                            "</div>";
                    } else {
                        return checkboxHTML(data);
                    }
                }
            },
            {
                data: 'SolExAdmision',
                title: 'Solicitud Examen Admision',
                render: function (data,type, row) {
                    var rutasArray = row.ruta.split('?');
                    var origenArray = row.Origen.split('?');
                    if (typeof rutasArray[3] !== "undefined" && rutasArray[3] !== "" && rutasArray[3] !== null && data == 1) {
                        return checkboxHTML(data) + "<div class=\"certificado-container\">" +
                            "<button title=\"Ver Solicitud Examen Admision\" class=\"btn btn-sm btn-primary\" onclick=\"verImagen('" + rutasArray[3] + "', 'SOLICITUD EXAMÉN ADMISIÓN','" + origenArray[3] + "')\"><i class='icon-file-pdf'></i></button>" +
                            "</div>";
                    } else {
                        return checkboxHTML(data);
                    }
                }
            },
            { 
                data: 'DeclaracionJurada',
                title: 'Entregó DJ',
                render: function (data,type, row) {
                    var rutasArray = row.ruta.split('?');
                    var origenArray = row.Origen.split('?');
                    if (typeof rutasArray[4] !== "undefined" && rutasArray[4] !== "" && rutasArray[4] !== null && data == 1) {
                        return checkboxHTML(data) + "<div class=\"certificado-container\">" +
                            "<button title=\"Ver Declaración Jurada\" class=\"btn btn-sm btn-primary\" onclick=\"verImagen('" + rutasArray[4] + "', 'DECLARACIÓN JURADA','" + origenArray[4] + "')\"><i class='icon-file-pdf'></i></button>" +
                            "</div>";
                    } else {
                        return checkboxHTML(data);
                    }
                }
            },
            { data: 'Moidalidad', title: 'Modalidad' },
            { data: 'Fechareg', title: 'Fecha de Registro' },
            { data: 'Usuarioreg', title: 'Usuario de Registro' },
            {
                data: 'Op',
                title: 'Acciones',
                render: function(data) {
                    return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarCertificado("+data+");\" title=\"Editar Certificado\"><span class=\"icon-pencil\"></span></button>" +
                           "<button class=\"btn boton-tabla btn-danger\" style=\"margin-left: 2px;\" type=\"button\" onclick=\"eliminarCertificado("+data+");\" title=\"Eliminar Certificado\"><span class=\"icon-cross\"></span></button>";
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

function verImagen(rutas, tipo, origen) {
    if(origen === "siga"){
        var img = new Image();
        img.src = '../' + rutas;
        img.width = 500;
        img.height = 500;
    
        var modal = $('<div class="modal" tabindex="-1" role="dialog"></div>');
        var modalDialog = $('<div class="modal-dialog modal-lg" role="document"></div>'); 
        var modalContent = $('<div class="modal-content"></div>');
    
    
        var closeButton = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
    
        var modalHeader = $('<div class="modal-header" style="background-color: #326299;"></div>');
        modalHeader.append(closeButton);
        modalHeader.append('<h2 class="modal-title" style="font-weight: bold;text-align-last: center;font-size: 29px;">' + tipo + '</h2>');
    
        var modalBody = $('<div class="modal-body text-center"></div>');  
    
        
    
        var modalBody = $('<iframe src="../' + rutas +'" style="width:100%;height:700px;"></iframe>');  
        //modalBody.append(img);
    
        var vistaPrevDiv = $('<div class="mt-3" style="padding: 19px;text-align-last: center;"></div>');
        var vistaPrevButton = $('<button type="button" class="btn btn-warning">Ver completo</button>');
        vistaPrevButton.on('click', function () {
            window.open('../' + rutas, '_blank');
        });
        vistaPrevDiv.append(vistaPrevButton);
        var downloadButton = $('<button type="button" class="btn btn-primary" style="margin-left:12px;">Descargar</button>');
        downloadButton.on('click', function () {
            var fileName = rutas.split('/').pop();
            var link = document.createElement('a');
            link.href = '../' + rutas;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        vistaPrevDiv.append(downloadButton);
    
        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalContent.append(vistaPrevDiv);
        modalDialog.append(modalContent);
        modal.append(modalDialog);
        modal.modal('show');
    
        modal.on('shown.bs.modal', function () {
            $(this).find('.modal-dialog').css({
                'display': 'block',
                'margin-top': function () {
                    return -($(this).height() / 2);
                },
                'margin-left': function () {
                    return -($(this).width() / 2);
                }
            });
        });
    }else{
        var img = new Image();
        img.src = 'https://ialintra.edu.pe/intranet/' + rutas;
        img.width = 500;
        img.height = 500;

        var modal = $('<div class="modal" tabindex="-1" role="dialog"></div>');
        var modalDialog = $('<div class="modal-dialog modal-lg" role="document"></div>'); 
        var modalContent = $('<div class="modal-content"></div>');


        var closeButton = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');

        var modalHeader = $('<div class="modal-header" style="background-color: #326299;"></div>');
        modalHeader.append(closeButton);
        modalHeader.append('<h2 class="modal-title" style="font-weight: bold;text-align-last: center;font-size: 29px;">' + tipo + '</h2>');

        var modalBody = $('<div class="modal-body text-center"></div>');  

        

        var modalBody = $('<iframe src="https://ialintra.edu.pe/intranet/' + rutas +'" style="width:100%;height:700px;"></iframe>');  
        //modalBody.append(img);

        var vistaPrevDiv = $('<div class="mt-3" style="padding: 19px;text-align-last: center;"></div>');
        var vistaPrevButton = $('<button type="button" class="btn btn-warning">Ver completo</button>');
        vistaPrevButton.on('click', function () {
            window.open('https://ialintra.edu.pe/intranet/' + rutas, '_blank');
        });
        vistaPrevDiv.append(vistaPrevButton);
        //var downloadButton = $('<button type="button" class="btn btn-primary" style="margin-left:12px;">Descargar</button>');
        var downloadButton =
            $('<a/>', {
                'html': 'Descargar Archivos',
                'download': true,
                'target': '_blank',
                'href': 'https://ialintra.edu.pe/intranet/' + rutas
            })

        // downloadButton.on('click', function () {
        //     var fileName = rutas.split('/').pop();
        //     var link = document.createElement('a');
        //     link.download = fileName;
        //     link.target = '_blank';
        //     link.href = 'https://ialintra.edu.pe/intranet/' + rutas;
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        // });
        vistaPrevDiv.append(downloadButton);

        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalContent.append(vistaPrevDiv);
        modalDialog.append(modalContent);
        modal.append(modalDialog);
        modal.modal('show');

        modal.on('shown.bs.modal', function () {
            $(this).find('.modal-dialog').css({
                'display': 'block',
                'margin-top': function () {
                    return -($(this).height() / 2);
                },
                'margin-left': function () {
                    return -($(this).width() / 2);
                }
            });
        });
    }
    
}


$("#btnVerModalNuevo").click(function(){
    
    $("#tituloModal").html("Registrar Certificado");
    $("#btn_modal").addClass("btn-info").removeClass("btn-primary")
    $("#btn_modal").html("Registrar");
    $("#codigo_alumno").prop("readonly", false);
    $("#file1").prop("readonly", true);
    $("#file2").prop("readonly", true);
    $("#file3").prop("readonly", true);
    $("#file4").prop("readonly", true);
    $("#file5").prop("readonly", true);
    verificarCheckbox($("#c1"), $('#file1'));
    verificarCheckbox($("#c2"), $('#file2'));
    verificarCheckbox($("#c3"), $('#file3'));
    verificarCheckbox($("#c4"), $('#file4'));
    verificarCheckbox($("#c5"), $('#file5'));

    $("#op").val("");
    document.getElementById("form-certificado").reset();

    $("#modalNuevoCertificado").modal({
        backdrop: 'static',
        keyboard: false
    });

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
})

$('#form-certificado').submit(function (e) {
    e.preventDefault(); 

    var op = $('#op').val();
    var fecha = $('#fecha').val();
    var asesor = $('#asesor').val();
    var codigo_alumno = $('#codigo_alumno').val();
    var tipoDoc = $('#tipoDoc').val();
    var numDoc = $('#numDoc').val();
    var nacionalidad = $('#nacionalidad').val();
    var institucion = $('#institucion').val();
    var sede = $('#sede').val();
    var tipoEspecialidad = $('#tipoEspecialidad').val();
    var especialidad = $('#especialidad').val();
    var modalidad = $('#modalidad').val();

    if (!fecha || !asesor || !codigo_alumno || !tipoDoc || !numDoc || !nacionalidad || !institucion || !sede || !tipoEspecialidad || !especialidad || !modalidad) {
        Notiflix.Report.Warning('AVISO',"Todos los campos marcados con (*) son obligatorios. Por favor, complete los campos requeridos.", "Cerrar");
        return; 
    }

    if(op === ""){
        $.ajax({
            url: path + "certificados/certificadoEstudios",
            type: "POST",
            dataType: "JSON",
            data: {
                codigo_alumno: codigo_alumno,
                opcion: 'existeCodigoAlumno'
            },
            success: function(data) {
                if (data.respuesta === 'error') {
                    Notiflix.Report.Warning('AVISO', data.errores.join("<br>"), "Cerrar");
                } else if (data.respuesta === 'success') {
                    enviarFormulario($('#form-certificado')[0]); 
                } else {
                    Notiflix.Report.Failure('ERROR', 'Ocurrió un error inesperado.', "Cerrar");
                }
            }        
        });
    }else{
        let form = new FormData(this)
        form.append("opcion", "registrar")
        console.log("data", form)

        $.ajax({
            url: path + "certificados/certificadoEstudios",
            type: "POST",
            dataType: "JSON",
            data: form,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $(".text-loader").html("Guardando informacion...");
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                $("body").css({ "padding": 0 });
            },
            success: function(data){
                console.log("data", data);
                $("#modalLoader").modal("hide");
                if (data.respuesta === 'success') {
                    /* tablaTramite.ajax.reload(null, false); */
                    $("#modalNuevoCertificado").modal("hide");
                    $("#op").val("");
                    Notiflix.Notify.Success('Registrado correctamente');
                    document.getElementById("form-certificado").reset();
                    buscarCertificados()

                } else{
                    Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
                }
            }
        });
    }

    
});

function enviarFormulario(formulario) {
    let form = new FormData(formulario);
    form.append("opcion", "registrar");
    console.log("data", form);

    $.ajax({
        url: path + "certificados/certificadoEstudios",
        type: "POST",
        dataType: "JSON",
        data: form,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function(){
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function(data){
            $("#modalLoader").modal("hide");
            if (data.respuesta === 'success') {
                /* tablaTramite.ajax.reload(null, false); */
                $("#modalNuevoCertificado").modal("hide");
                $("#op").val("");
                Notiflix.Notify.Success('Registrado correctamente');
                document.getElementById("form-certificado").reset();
                buscarCertificados()
                
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la página');
            }
        }
    });
}

function editarCertificado(Op) {

    var Op = Op;
    let formData = new FormData();
    formData.append('Op', Op);
    formData.append('opcion', 'editarCertificado');

    $.ajax({
        url: path + "certificados/certificadoEstudios",
        type: "POST",
        dataType: "JSON",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.respuesta == "success") {
                const certificados = data.certificados[0];
                $("#op").val(Op);
                $("#asesor").val(certificados.CodAsesor.trim());
                $("#codigo_alumno").val(certificados.cod_alumno.trim()+ " - " + certificados.Alumno.trim());
                $("#tipoDoc").val(certificados.Tipodoc.trim());
                $("#numDoc").val(certificados.NumDocumento.trim());
                $("#nacionalidad").val(certificados.Procedencia);
                $("#celular").val(certificados.Celular.trim());
                $("#email").val(certificados.email.trim());
                $("#institucion").val(certificados.Cod_local.trim());
                $("#sede").val(certificados.Sede.trim());
                $("#tipoEspecialidad").val(certificados.Tipo_espe.trim());
                $("#especialidad").val(certificados.cod_espe.trim());
                $("#modalidad").val(certificados.Modalidad.trim());
                $("#fecha").val(certificados.Fecha.substr(0, 10));
                $("#observacion").val(certificados.Observaciones);
                $("#origen").val(certificados.Origen);
              
                certificados.CopiaDNI == "1" ? $("#c1").prop("checked", true) : $("#c1").prop("checked", false)
                certificados.Foto == "1" ? $("#c2").prop("checked", true) : $("#c2").prop("checked", false)
                certificados.CERT == "1" ? $("#c3").prop("checked", true) : $("#c3").prop("checked", false)
                certificados.SolExAdmision == "1" ? $("#c4").prop("checked", true) : $("#c4").prop("checked", false)
                certificados.DeclaracionJurada == "1" ? $("#c5").prop("checked", true) : $("#c5").prop("checked", false)

                desbloquearArchivoAdjunto($("#c1"), $('#file1'));
                desbloquearArchivoAdjunto($("#c2"), $('#file2'));
                desbloquearArchivoAdjunto($("#c3"), $('#file3'));
                desbloquearArchivoAdjunto($("#c4"), $('#file4'));
                desbloquearArchivoAdjunto($("#c5"), $('#file5'));

                $("#btn_modal").addClass("btn-primary").removeClass("btn-info")
                $("#btn_modal").html("Editar");

            } else {
                
            }
        }
    });

    verificarCheckbox($("#c1"), $('#file1'));
    verificarCheckbox($("#c2"), $('#file2'));
    verificarCheckbox($("#c3"), $('#file3'));
    verificarCheckbox($("#c4"), $('#file4'));
    verificarCheckbox($("#c5"), $('#file5'));

    $("#codigo_alumno").prop("readonly", true);
    $("#tituloModal").html("Editar Certificado");
    $("#modalNuevoCertificado").modal({ backdrop: 'static', keyboard: false });

}

function eliminarCertificado(op) {

    var op = op;

    Notiflix.Confirm.Show(
        'Eliminar Tramite',
        '¿Esta segura de eliminar el certificado? Nro. : '+ op +'',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "certificados/certificadoEstudios",
                type: "POST",
                data: {
                    op: op,
                    opcion: 'eliminar'
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
function verificarCheckbox(checkbox, fileInput) {
    console.log("Checkbox:", checkbox);
    console.log("FileInput:", fileInput);

    if (!checkbox.prop('checked')) {
        fileInput.prop('readonly', true);
        fileInput.addClass('disabled-input');
    }

    checkbox.change(function() {
        console.log("Checkbox changed:", $(this).prop('checked'));
        if ($(this).prop('checked')) {
            fileInput.prop('readonly', false);
            fileInput.removeClass('disabled-input');
        } else {
            fileInput.prop('readonly', true);
            fileInput.addClass('disabled-input');
        }
    });
}

function desbloquearArchivoAdjunto(checkbox, fileInput) {
    if (checkbox.prop('checked')) {
        console.log("activo");
        fileInput.prop('readonly', false);
        fileInput.removeClass('disabled-input');
    } else {
        console.log("desactivo");
        fileInput.prop('readonly', true);
        fileInput.addClass('disabled-input');
    }
}