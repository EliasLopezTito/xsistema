$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });

    $('#notasAlumno1').hide()
    $('#notasAlumno2').hide()

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
            $('#notasAlumno1').show('200')
            //seleccionarEspecialidadAutomatico(ui.item.codigo.trim(), null);

            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.codigo + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };

    $("#alumno2").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Certificados/tramites",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarCodigoAndAlumnos'
                },
                success: function(data){
                    $("#alumno2").removeAttr("data-code");
                    $("#alumno2").next('i').removeClass('glyphicon-ok');
                    $("#alumno2").next('i').addClass('glyphicon-remove');
                    $("#alumno2").parent().removeClass('has-success');
                    $("#alumno2").parent().addClass('has-error');

                    response(data.alumnos);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            $('#alumno2').attr('data-code', ui.item.codigo);
            $("#alumno2").val(ui.item.nombre);
            $("#alumno2").next('i').removeClass('glyphicon-remove');
            $("#alumno2").next('i').addClass('glyphicon-ok');
            $("#alumno2").parent().removeClass('has-error');
            $("#alumno2").parent().addClass('has-success');

            $('#codigo_alumno2').val(ui.item.codigo.trim());
            $('#notasAlumno2').show('200')
            //seleccionarEspecialidadAutomatico(ui.item.codigo.trim(), null);

            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.codigo + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };

    $("#vocalsecre").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Titulacion/actaTitulacion",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarDocentes'
                },
                success: function (data) {
                    $("#alumno").removeAttr("data-code");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');

                    response(data.docente);
                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            $('#vocalsecreCod').val(ui.item.codigo);
            $("#vocalsecre").val(ui.item.Nombres);
            $("#vocalsecre").next('i').removeClass('glyphicon-remove');
            $("#vocalsecre").next('i').addClass('glyphicon-ok');
            $("#vocalsecre").parent().removeClass('has-error');
            $("#vocalsecre").parent().addClass('has-success');

            //$('#codigo_alumno_lista').val(ui.item.codigo.trim());

            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.codigo + " - " + item.Nombres + "</div>")
            .appendTo(ul);
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
        $("#tituloModal").html("REGISTRAR ACTA TITULACION");
        $("#btn_modal").addClass("btn-info").removeClass("btn-primary")
        $("#btn_modal").html("Registrar");
        $('#editar').val('NO')
        $("#codigoTramite").val("");
        $("#alumno").prop("readonly", false);
        document.getElementById("form-actaTitulacion").reset();

        $('#notasAlumno1').hide()
        $('#notasAlumno2').hide()

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

function sumaNotas(elemento)
{

    var n1 = ($(elemento).parent().parent().find("select").eq(0).val()).trim();
    var n2 = ($(elemento).parent().parent().find("select").eq(1).val()).trim();
    var n3 = ($(elemento).parent().parent().find("select").eq(2).val()).trim();
    var n4 = ($(elemento).parent().parent().find("select").eq(3).val()).trim();

    console.log("a", n1);

    if(n1  != "" && n2 != "" && n3 != "" && n4 != "")
    {

        var pr1 = ((parseInt(n1) + parseInt(n2) + parseInt(n3) + parseInt(n4))).toFixed(0);
        
        console.log("pr1", pr1);
        $(elemento).parent().parent().find("input:text").eq(0).val(pr1);

    }else{
        Notiflix.Report.Info("Aviso","Campos vacios.","Cerrar");        
        return;
    }

}

$('#form-actaTitulacion').submit(function (e) {
   

    //  Notiflix.Confirm.Show(
    //     'Confirmación',
    //     '¿Desea continuar?',
    //     'Si',
    //     'No',
    //     function(){
            e.preventDefault();
            
            // var form = $(this).serializeArray();
            // form.push({ name: "opcion", value: "registrar" });
            // console.log("data", form)

            var form = new FormData($(this).get(0));
            form.append('opcion', 'registrar');

            $.ajax({
                url: path + "Titulacion/actaTitulacion",
                type: "POST",
                data: {titulo: $('#titulo').val().trim(), opcion: "verificarRepositorioTitulo"},
                success: function(data){

                    console.log("veri", data);
                    let datos = JSON.parse(data);
                    
                    if(datos.datex == "vacio"){

                        

                        $.ajax({
                            url: path + "Titulacion/actaTitulacion",
                            type: "POST",
                            data: form,
                            contentType: false,
                            processData: false,
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
                                    //tablaTitulado.ajax.reload(null, false);
                                    document.getElementById("form-actaTitulacion").reset();
                                } else{
                                    Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
                                }
                            }
                        });
                    }else{
                        Notiflix.Report.Info("Aviso","No se puede registrar por que el TITULO ya existe en el REPOSITORIO.","Cerrar");
                        return;
                    }

                }
            });
            
        // }
        // ,function(){
        //     // No button callbackalert('If you say so...');
        // });

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
    const fecha_1 = $("#fecha_1").val();
    const fecha_2 = $("#fecha_2").val();
    const titulo = $("#inputTitulo").val();
    const cod_alumno = $("#inputBuscar").val();

    tablaTitulado = $("#tablaListado").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'<b>Exportar Excel</b>',"className": 'btn-important'}
        ],
        lengthMenu: [
            [50, 100, -1], 
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "Titulacion/actaTitulacion",
            type: "POST",
            data: {
                fecha_1: fecha_1,
                fecha_2: fecha_2,
                titulo: titulo,
                cod_alumno: cod_alumno,
                opcion: 'listaBuscarActas'
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
                    return data.OpA;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Fecha
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Cod_alumno
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
                    return data.Titulo
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Veredicto.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Presidente.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return Number(data.JN1) + Number(data.JN2) + Number(data.JN3) + Number(data.JN4) 
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Vocal.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return Number(data.VN1) + Number(data.VN2) + Number(data.VN3) + Number(data.VN4) 
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Secretario.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return Number(data.SN1) + Number(data.SN2) + Number(data.SN3) + Number(data.SN4) 
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Observacion.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.UsuarioReg.trim()
                }
            },
            {
                data: null,
                render: function (data) {
                    return '';
                }
            },
            {
                data: null,
                render: function (data) {

                    return "<button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"descargarActaPDF('" + data.OpA + "')\"><span class=\"icon-download\"></span></button>&nbsp;&nbsp;&nbsp;" + 
                            "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"descargarFichaPDF('" + data.OpA + "')\"><span class=\"icon-download\"></span></button>";
                    

                }
            },
            {
                data: null,
                render: function (data) {

                    return "<button class=\"btn boton-tabla boton-amarillo\" type=\"button\" onclick=\"editarActasTitulacion('" + data.OpA + "')\"><span class=\"icon-pencil2\"></span></button>&nbsp;&nbsp;&nbsp;"+
                            "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminarCambiarEstado('" + data.OpA + "')\"><span class=\"icon-cross\"></span></button>";
                    

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

    tablaTitulado.button(0).container().appendTo($('#buttonContainer'));
    $('#tablaListado_filter').appendTo($('#searchContainer'));
    $('#searchContainer input').addClass('form-control mipanel-combo');

}



function editarActasTitulacion(Op) {
    $("#alumno").prop("readonly", false);
    //var codigo_tramite = $(btn).parent().parent().find("td").eq(15).html();

    //var alumno = $(btn).parent().parent().find("td").eq(6).html();

    $.ajax({
        url: path + "Titulacion/actaTitulacion",
        type: "POST",
        data: {
            Op: Op,
            opcion: 'buscar_editar'
        },
        beforeSend: function () {
                $("#codigo_alumno").val("");

                $('#IdAlumnoActa').val("")

                $('#idACTA1').val("")
                $('#idACTA2').val("")
                $('#idACTA3').val("")

                $("#n1_presidente").val("");
                $("#n2_presidente").val("");
                $("#n3_presidente").val("");
                $("#n4_presidente").val("");        

                $("#n1_vocal").val("");
                $("#n2_vocal").val("");
                $("#n3_vocal").val("");
                $("#n4_vocal").val("");      
                
                $("#n1_secre").val("");
                $("#n2_secre").val("");
                $("#n3_secre").val("");
                $("#n4_secre").val("");      
            

                $('#contenedor_alumno2').hide()
                $("#codigo_alumno2").val("");
                $('#notasAlumno2').hide()  

                $('#IdAlumnoActa2').val("")

                $('#idACTA3').val("")
                $('#idACTA4').val("")
                $('#idACTA5').val("")

                // $("#n1_presidente_b").val("");
                // $("#n2_presidente_b").val("");
                // $("#n3_presidente_b").val("");
                // $("#n4_presidente_b").val("");        

                // $("#n1_vocal_b").val("");
                // $("#n2_vocal_b").val("");
                // $("#n3_vocal_b").val("");
                // $("#n4_vocal_b").val("");      
                
                // $("#n1_secre_b").val("");
                // $("#n2_secre_b").val("");
                // $("#n3_secre_b").val("");
                // $("#n4_secre_b").val("");      
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {

                $('#notasAlumno1').show()                
                
                const datex = datos.datex;
                console.log("dtex", datex);

                $('#editar').val('SI')
                $('#Opa').val(datex[0].Op)

                $("#institucion").val(datex[0].cod_local);
                $("#fechaDocumento").val(datex[0].Fecha.substr(0, 10));
                $("#tipoEspecialidad").val(datex[0].TipoEspe);
                $("#especialidad").val(datex[0].cod_espe);
                $("#titulo").val(datex[0].Titulo);
                $("#presidente").val(datex[0].CodPresidente);
                $("#vocal").val(datex[0].CodVocal);
                $("#vocalsecre").val(datex[0].Secretario);
                $("#vocalsecreCod").val(datex[0].CodSecretario);
                
                $("#obs").val(datex[0].Observacion);                

                $("#codigo_alumno").val(datex[0].codAlumno1);

                    $('#IdAlumnoActa').val(datex[0].IdcodAlumno1)

                    $('#idACTA1').val(datex[0].ID)
                    $('#idACTA2').val(datex[1].ID)
                    $('#idACTA3').val(datex[2].ID)

                    $("#n1_presidente").val(datex[0].N1);
                    $("#n2_presidente").val(datex[0].N2);
                    $("#n3_presidente").val(datex[0].N3);
                    $("#n4_presidente").val(datex[0].N4); 
                    totalPre = datex[0].N1 + datex[0].N2 + datex[0].N3 + datex[0].N4
                    $("#total_presidente").val(totalPre);                       

                    $("#n1_vocal").val(datex[1].N1);
                    $("#n2_vocal").val(datex[1].N2);
                    $("#n3_vocal").val(datex[1].N3);
                    $("#n4_vocal").val(datex[1].N4);   
                    totalVocal = datex[1].N1 + datex[1].N2 + datex[1].N3 + datex[1].N4
                    $("#total_vocal").val(totalVocal);   
                    
                    $("#n1_secre").val(datex[2].N1);
                    $("#n2_secre").val(datex[2].N2);
                    $("#n3_secre").val(datex[2].N3);
                    $("#n4_secre").val(datex[2].N4);      
                    totalSecre = datex[2].N1 + datex[2].N2 + datex[2].N3 + datex[2].N4
                    $("#total_secre").val(totalSecre);  

                    $("#veredicto_1").val(datex[0].codVeredicto1);    
                
                if(datex[0].codAlumno2 != null){

                    $('#contenedor_alumno2').show()
                    $('#notasAlumno2').show()  
                    $("#codigo_alumno2").val(datex[0].codAlumno2);

                    $('#IdAlumnoActa2').val(datex[0].IdcodAlumno2)

                    $('#idACTA3').val(datex[3].ID)
                    $('#idACTA4').val(datex[4].ID)
                    $('#idACTA5').val(datex[5].ID)

                    $("#n1_presidente_b").val(datex[3].N1);
                    $("#n2_presidente_b").val(datex[3].N2);
                    $("#n3_presidente_b").val(datex[3].N3);
                    $("#n4_presidente_b").val(datex[3].N4);       
                    totalPre2 = datex[3].N1 + datex[3].N2 + datex[3].N3 + datex[3].N4
                    $("#total2_presidente").val(totalPre2);        

                    $("#n1_vocal_b").val(datex[4].N1);
                    $("#n2_vocal_b").val(datex[4].N2);
                    $("#n3_vocal_b").val(datex[4].N3);
                    $("#n4_vocal_b").val(datex[4].N4);    
                    totalVocal2 = datex[4].N1 + datex[4].N2 + datex[4].N3 + datex[4].N4
                    $("#total2_vocal").val(totalVocal2);     
                    
                    $("#n1_secre_b").val(datex[5].N1);
                    $("#n2_secre_b").val(datex[5].N2);
                    $("#n3_secre_b").val(datex[5].N3);
                    $("#n4_secre_b").val(datex[5].N4);  
                    totalSecre2 = datex[5].N1 + datex[5].N2 + datex[5].N3 + datex[5].N4
                    $("#total2_secre").val(totalSecre2);     

                    $("#veredicto_2").val(datex[3].codVeredicto2);            

                }        

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
    $("#tituloModal").html("Editar Acta Titulacion");
    $("#modalNuevoTramite").modal({ backdrop: 'static', keyboard: false });

}

function eliminarCambiarEstado(codigo_titulacion)
{
    Notiflix.Confirm.Show(
    'Confirmación',
    '¿Desea continuar?',
    'Si',
    'No',
    function(){
        $.ajax({
            url: path + "Titulacion/actaTitulacion",
            type: "POST",
            data: {
                tipo: '3',
                opcion: "validarPermiso"
            },
            success: function(data)
            {
                var datos = JSON.parse(data);

                console.log("permiso", datos);

                if(datos.respuesta=="success")
                {
                    if(datos.data !="vacio")
                    {     
                            //PERMISO PARA REGINA
                            $.ajax({
                                url: path + "Titulacion/actaTitulacion",
                                type: "POST",
                                data: {
                                        codigo_titulacion: codigo_titulacion,
                                        estado: '0',
                                        opcion: 'eliminar_cambiarEstado'},
                                success: function(data)
                                {
                                    console.log(data);
                                    var datos = JSON.parse(data);
                                    if(datos.respuesta=="success")
                                    {
                                        Notiflix.Report.Success("Aviso","Se ha eliminado con exito.","Cerrar");
                                        tablaTitulado.ajax.reload(null, false);
                                    }else
                                    {
                                        var errores = "";
                        
                                        for(i = 0; i < datos.errores.length; i++){
                                            errores += datos.errores[i] + "<br>";
                                        }
                        
                                        Notiflix.Report.Failure('Error',errores,"Cerrar");
                                    }
                                }
                            });

                    }else{
                        Notiflix.Report.Info("Aviso", "Comuniquese con su jefe de area para realizar esta accion.","Cerrar");
                    }

                }else
                {   
                    var errores = "";
                    for(i = 0; i < datos.errores.length; i++){
                        errores += datos.errores[i] + "<br>";
                    }
                    Notiflix.Report.Failure('Error',errores,"Cerrar");

                }
            }
        });
    }
    ,function(){
        // No button callbackalert('If you say so...');
    });
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

$("#firma").change(function () {

    let archivo = $(this)[0].files[0];
    if (archivo === undefined) {
        $(this).val(null);
        return;
    }

    const extension = archivo["name"].split(".")[archivo["name"].split(".").length - 1];

    console.log("extexion", extension)
    if(extension === "jpg" || extension === "png"){
        if (archivo.size <= 1048576) {
            Notiflix.Notify.Success('IMAGEN ACEPTADA');
        } else {
            $(this).val(null);
            Notiflix.Report.Warning('AVISO', "EL ARCHIVO DEBE PESAR MÁXIMO 1MB", "Cerrar");
        }
    }else{
        $(this).val(null);
        Notiflix.Report.Warning('AVISO', "SOLO SE ACEPTA FORMATO JPG O PNG", "Cerrar");
        return;
    }
})

function descargarActaPDF(op) {

    $.ajax({
        url: path + "Titulacion/actaTitulacion",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "actaPDF",
            op: op
        },
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
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

function descargarFichaPDF(op) {
    $.ajax({
        url: path + "Titulacion/actaTitulacion",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "fichaPDF",
            op: op
        },
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
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
