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

$(document).ready(function(){

    Notiflix.Loading.Init({
        clickToClose: true
    });

    //$('#modalAvisoChat').modal('show')

    $('#tablaSoliitudes').DataTable({
        data : {},
        language : language,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
    });

    $("#alum").autocomplete({
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
                    $("#alum").attr("codigo","");
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
                    response(result);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                console.log("data proce",ui.item)
                $("#alum").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alum").next('i').removeClass('glyphicon-remove');
                $("#alum").next('i').addClass('glyphicon-ok');
                $("#alum").parent().removeClass('has-error');
                $("#alum").parent().addClass('has-success');
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

})

document.addEventListener('click', (e) => {
    if (e.target.matches('#btnVerModalNuevo')) {
        $('#tituloModal').html('NUEVO TRAMITE MODULAR');
        $('#btn_modal').html('REGISTRAR');
        $('#seccion_cato').show();
        $('#listaNormal').show();
        $('#tablaListadoJefe tbody').html("");
        $('#tablaListado tbody').html("");
        $('#tablaListadoJefe_new tbody').html("");
        $('#alum').val(null)
        $('#especialidad_new').val('03')
        $('#sede_new').val('01')
        $('#Observacion_cabeza').val(null)
        $('#importe_completo').val(null)
    
        $('#moduloPer_new').attr('disabled', false)
        $('#btn_modal').attr('disabled', false)
        $('#btn_agregar').attr('disabled', true)
        
        $("#modalNuevaSolicitud_new").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches('#btn_agregar')) {
        $('#ciclo_detalle').val('---')
        $('#horas_detalle').val('---')
        $('#creditos_detalle').val('---')
        $('#precio_detalle').val('---')
        $("#especialidad_detalle").val("");
        $("#modulo_detalle").html("<option value=''>Seleccione...</option>");
        
        $("#modalAgregarTramiteModular").modal("show");
    }

    if (e.target.matches('#listo_detalle')) {        
        $("#modalNuevaSolicitud_new").modal("hide");
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

$("#btn-buscar").click(function(){
    cargarSolicitudes();
})

$("#btn_agregar_modal_detalle").click(function(){
    $.ajax({
        url: path + "Certificados/pendientesModular",
        dataType: "JSON",
        type: "POST",
        data: {
            opCabeza: $('#opcabeza_new').val(),
            fechaIni: $('#fecha_inicio_detalle').val(),
            fechaFinal: $("#fecha_final_detalle").val(),
            codmodulo: $("#modulo_detalle").val(),
            ciclo: $("#ciclo_detalle").val(),
            horas: $("#horas_detalle").val(),
            creditos: $("#creditos_detalle").val(),
            Precio: Number($("#precio_detalle").val()),
            opcion: 'registrarDetalles'
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
        },
        complete: function () {
            $("#NotiflixLoadingWrap").trigger("click");
        },
        success: function (data) {
            console.log("data_detalle",data)
            if (data.respuesta === 'success') {
                e = data.data_detalle[0]  
                plantilla = `<tr>
                                <td class="text-center"><input type="hidden" value="${e.OpEF}" name="detalleOpEf[]"><input type="hidden" value="${e.codmod.trim()}" name="codmodulo[]">${e.OpEF}</td>
                                <td class="text-center"><input type="date" class="form-control" value="${e.FechaI == '1900-01-01' ? null : e.FechaI}" name="fechaIni[]"/></td>
                                <td class="text-center"><input type="date" class="form-control" value="${e.FechaF == '1900-01-01' ? null : e.FechaF}" name="fechaFinal[]"/></td>
                                <td class="text-center"><input type='hidden' class='ciclo' name='ciclo[]' id='ciclo[]' value="${e.ciclo}">${e.ciclo}</td>
                                <td class="text-center"><input type='hidden' class='horas' name='horas[]' id='horas[]' value="${e.Horas}">${e.Horas}</td>
                                <td class="text-center"><input type='hidden' class='creditos' name='creditos[]' id='creditos[]' value="${e.creditos}">${e.creditos}</td>
                                <td class="text-center"><input type='hidden' class='Precio' name='Precio[]' id='Precio[]' value="${e.Precio}">${e.Precio}</td>
                                <td class="text-center"><button class="btn boton-tabla boton-rojo" type="button" onclick="eliminarDetalle_new('${e.Id}', this)" ><span class="icon-cross"></span></button></td>
                            </tr>`;
                

                $('#tablaListadoJefe_new tbody').append(plantilla);
                $("#importe_completo").val(data.data_detalle_importe.Importe)                
                $('#anydates').hide();
                $("#modalAgregarTramiteModular").modal("hide");

            }else{
                Notiflix.Notify.Failure('No se pudo registrar. Recargue la pagina');
            }
        }
    });
})

$(document).on("change", "#especialidad_detalle", function () {
    $.ajax({
        url: path + "Certificados/tramiteModular",
        dataType: "JSON",
        type: "POST",
        data: {
            codigoPeriodo: $('#moduloPer_new').val(),
            cod_espe: $("#especialidad_detalle").val(),
            opcion: 'descripcionModulos'
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
            $('#ciclo_detalle').val('---')
            $('#horas_detalle').val('---')
            $('#creditos_detalle').val('---')
            $('#precio_detalle').val('---')
            $("#modulo_detalle").html("<option value=''>Seleccione...</option>");
        },
        complete: function (data) {
            $("#NotiflixLoadingWrap").trigger("click");
        },
        success: function (data) {
            console.log("dataprra",data)
            if (data.respuesta === 'success') {  
                data.dataModulo.forEach(e => {
                    $("#modulo_detalle").append(`                            
                            <option value="${e.cod_modulo.trim()}">${e.modulo.trim()}</option>
                        `);
                });         
            }else{
                Notiflix.Notify.Failure('No se encontro la especialidad, por favor coloque manualmente');
            }
        }
    });
});

$(document).on("change", "#modulo_detalle", function () {
    $.ajax({
        url: path + "Certificados/tramiteModular",
        dataType: "JSON",
        type: "POST",
        data: {
            cod_modulo_detalle: $("#modulo_detalle").val(),
            opcion: 'codigo_modulo_detalle'
        },
        beforeSend: function () {
            // Notiflix.Loading.Hourglass('Cargando...');
            $('#ciclo_detalle').val('---')
            $('#horas_detalle').val('---')
            $('#creditos_detalle').val('---')
            $('#precio_detalle').val('---')
        },
        complete: function (data) {
            // $("#NotiflixLoadingWrap").trigger("click");
        },
        success: function (data) {
            console.log("dataprra",data)
            if (data.respuesta === 'success') {  
                $('#ciclo_detalle').val(data.dataModulo[0].ciclos)
                $('#horas_detalle').val(data.dataModulo[0].ciclos)
                $('#creditos_detalle').val(data.dataModulo[0].ciclos)
                $('#precio_detalle').val(data.dataModulo[0].precio)
            }else{
                Notiflix.Notify.Failure('No se encontro la especialidad, por favor coloque manualmente');
            }
        }
    });
});

function cargarSolicitudes(){

    const desde = $("#desde").val();
    const hasta = $("#hasta").val();
    const alumno = $("#alumno").val();
    const especialidad = $("#especialidad2").val();
    $('#tablaSoliitudes').empty();
    $('#tablaSoliitudes').dataTable().fnDestroy();

    $.ajax({
        url: path + "certificados/tramiteModular",
        type: "POST",
        dataType: "JSON",
        data: { 
            opcion: "cargarTramites",
            desde: desde,
            hasta: hasta,
            especialidad: especialidad,
            alumno: alumno
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO SOLICITUDES, POR FAVOR ESPERE...');
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });        
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
            if(response.respuesta === "success"){
                        
                if(response.solicitudes.length < 1){
                    Notiflix.Notify.Warning('NO SE ENCONTRARON SOLICITUDES EN EL RANGO DE FECHAS INGRESADOS.',{timeout:3000});                    
                }
                
                tablaTramite = $("#tablaSoliitudes").DataTable({
                    data : response.solicitudes , 
                    ordering: false ,           
                    columnDefs: [
                        {
                            targets: '_all',
                            className: 'celda-centrada',
                            orderable: false
                        }
                    ],
                    dom: 'lBfrtip',
                    buttons: [
                        {
                            "extend": 'excel',
                            "text": 'Exportar Excel',
                            "className": 'btn_excel_datatable',
                            'filename': 'Reporte'
                        }
                    ],
                    lengthMenu: [
                        [10, 25, 50, 75, 100], 
                        [10, 25, 50, 75, 100]
                    ],
                    columns: [
                        {data: null,
                            render: function (data,type, row, meta) { return data.Op }
                        },
                        {data: null,
                            render: function (data) { return data.Alumno.trim() } 
                        },
                        {data: null,
                            render: function (data) { return data.CodAlumno.trim() } 
                        },
                        {
                            data: null,
                            render: function (data) {
                                let colorAsesor = getColorAsesor(data);
                                return "<input type=\"text\" disabled id=\'op_nroCerti_"+data.Id+"\' value='"+data.NroCertificado+"' class=\"btn mipanel-btn-img-texto\" style=\"background-color: " + colorAsesor + "; font-weight: bold; color: black !important; font-size: 14px; width: 100%;\">"+
                                    "<button class=\"btn boton-tabla btnw-warning\" id=\'editar_nroCerti_"+data.Id+"\' data-op=\'"+data.Id+"\' type=\"button\" onclick=\"mostrarEditarNumeroCertificado(this)\" title=\"Editar Numero Certificado\"><span class=\"icon-pencil2\"></span></button>"+
                                    "<button class=\"btn boton-tabla btnw-success\" id=\'guardar_nroCerti_"+data.Id+"\' data-op=\'"+data.Id+"\' type=\"button\" onclick=\"editarNumeroCertificado(this)\" style=\"display: none;\" title=\"Guardar Numero Certificado\"><span class=\"icon-floppy-disk\"></span></button>"
                            }   
                        },
                        {data: null,
                            render: function (data) { return data.Sede } 
                        }, 
                        {data: null,
                            render: function (data) { return data.Especialidad } 
                        }, 
                        {data: null,
                            render: function (data) { return data.Modulo.trim() } 
                        },
                        {data: null,
                            render: function (data) { return data.FI } 
                        },                    
                        {data: null ,
                            render: function (data) { return data.FF } 
                        },
                        {data: null ,
                            render: function (data) { return data.Precio } 
                            
                        },
                        {
                            data: null,
                            render: function (data) {
                                let colorAsesor = getColorAsesor(data);
                                return "<input type=\"date\" disabled id=\'op_fechaExpedi_"+data.Id+"\' value='"+data.FechaExpedicion+"' class=\"btn mipanel-btn-img-texto\" style=\"background-color: " + colorAsesor + "; font-weight: bold; color: black !important; font-size: 14px; width: 82%;\">"+
                                    "<button class=\"btn boton-tabla btnw-warning\" id=\'editar_fechaExpedi_"+data.Id+"\' data-op=\'"+data.Id+"\' type=\"button\" onclick=\"mostrarEditarFechaExpedi(this)\" title=\"Editar Fecha Expedicion\"><span class=\"icon-pencil2\"></span></button>"+
                                    "<button class=\"btn boton-tabla btnw-success\" id=\'guardar_fechaExpedi_"+data.Id+"\' data-op=\'"+data.Id+"\' type=\"button\" onclick=\"editarFechaExpedi(this)\" style=\"display: none;\" title=\"Guardar Fecha Expedicion\"><span class=\"icon-floppy-disk\"></span></button>"
                            }   
                        },
                        {
                            data: null,
                            render: function (data) {
                                let colorAsesor = getColorAsesor2(data);
                                return "<input type=\"date\" disabled id=\'op_fechaEntrega_"+data.Op+"\' value='"+data.FechaEntrega+"' class=\"btn mipanel-btn-img-texto\" style=\"background-color: " + colorAsesor + "; font-weight: bold; color: black !important; font-size: 14px; width: 82%;\">"+
                                    "<button class=\"btn boton-tabla btnw-warning\" id=\'editar_fechaEntrega_"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"mostrarEditarFechaEntrega(this)\" title=\"Editar Fecha Entrega\"><span class=\"icon-pencil2\"></span></button>"+
                                    "<button class=\"btn boton-tabla btnw-success\" id=\'guardar_fechaEntrega_"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"editarFechaEntrega(this)\" style=\"display: none;\" title=\"Guardar Fecha Entrega\"><span class=\"icon-floppy-disk\"></span></button>"
                            }   
                        },
                        {data: null ,
                            render: function (data) { return data.observaciones } 
                        },         
                        {data: null,
                            render: function (data) {
                                let color = '';
                                if(data.Estado === 1){ color = "color:red"; }else if(data.Estado === 'Registrado'){ color = "color:orange" }else{ color = "color:#00b300" }
                                return `<span style="${color}">${data.Estado.toUpperCase()}</span>`;
                            } 
                        },
                        {data: null ,
                            render: function (data) { return data.Usuario } 
                        }, 
                        {data: null ,
                            render: function (data) { return data.FechaReg } 
                        },  
                        {data: null,
                            render: function (data) {
                                return `<button class="btn boton-tabla boton-azul" type="button" op="${data.Op}" onclick="editarDetalle(this)" ><span class="icon-pencil"></span></button>                                
                                <button class="btn boton-tabla boton-azul" type="button" op="${data.Op}" onclick="verReportePDF('${data.Id}')" ><span class="icon-download"></span></button>
                                <button class="btn boton-tabla boton-azul" type="button" op="${data.Op}" onclick="eliminarDetalle(this)" ><span class="icon-cross"></span></button>`;
                            } 
                        }, 
                    ],
                    language : language,                    
                });

            }else{
                
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL CARGAR LA INFORMACIÓN!');              
                $('#tablaSoliitudes').DataTable({
                    data : {},
                    language : language
                });

            }
    
        }
    })
}

$(document).on('click', '#tablaSoliitudes tbody tr', function () {    
    $('#tablaSoliitudes tbody tr').removeClass("info");
    $(this).addClass("info");
});

$('#form-requerimiento_new').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrarCabeza" });
    console.log("data", form)
    if($('#alum').val() == ""){
        Notiflix.Notify.Failure('COMPLETE LOS CAMPOS');
    }else{
        $.ajax({
            url: path + "certificados/pendientesModular",
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
                console.log(datos);
                if (datos.respuesta === 'success') {   
                    $("#modalNuevaSolicitud").modal("hide");
                    $("#modalEditarSolicitud").modal("hide");
                    results = []
                    $("#modalAgregarTramiteModular").modal("show");
                    $('#opcabeza_new').val(datos.opCabeza)
                    $('#moduloPer_new').attr('disabled', true)
                    $('#btn_modal').attr('disabled', true)
                    $('#btn_agregar').attr('disabled', false)
                    
                    //document.getElementsByClassName("form-requerimiento_new").reset();
                    //limpiarTabla();
                    // if(temporal.length !== 0){
                    //     temporal.forEach(element => {
                    //         eliminarArticulo(element)
                    //     });
                    //     temporal = [];
                    //     console.log("SE ELIMINARON LOS DETALLES ", temporal);
                    // }
                    
                    //listaReq.ajax.reload(null, false);
                    Notiflix.Notify.Success('Registrado correctamente');
                } else{
                    Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
                }
            }
        });
    }
    

})

function editarDetalle( btn ) {

    const op = $(btn).attr("op");
    $(".tr-bg").removeClass("info");
    $(btn).parent().parent(".tr-bg").addClass("info"); 

    $.ajax({
        url: path + "certificados/tramiteModular",
        type: "POST",
        dataType: "JSON",
        data: { 
            opcion: "verEditar",
            op: op            
        },
        beforeSend: function name(params) {
            $("#archivos-modal").html("");  
        },
        success: function (response) {
            console.log("res", response);        
                 
            if(response.respuesta === "success"){
            
                const dat = response.data[0];
                listaFinal = response.data
                console.log(dat);
                
                $("#opCabeza").val( op );
                $("#fecha").val(dat.Fecha);
                $("#moduloPer").val( dat.modper );
                $("#especialidad").val( dat.cod_espe );
                $("#sede").val( dat.cod_localInst );
                $("#codigo_alumno").val( dat.cod_alumno +" - "+ dat.Alumno );
                $("#Observacion_cabeza").val( dat.Obscabeza );
                $("#importe_completo").val( dat.Importe );

                $('#tablaListadoJefe tbody').html("");
                plantilla = listaFinal.map(e => 
                        `<tr>
                            <td class="text-center"><input type="hidden" value="${e.Id}" name="detalleId[]"><input type="hidden" value="${e.OpEF}" name="detalleOpEf[]"><input type="hidden" value="${e.codmod.trim()}" name="codmodulo[]">${e.OpEF}</td>
                            <td class="text-center"><input type="date" class="form-control" name="fechaIni[]" value="${e.FechaI}"/></td>
                            <td class="text-center"><input type="date" class="form-control" name="fechaFinal[]" value="${e.FechaF}"/></td>
                            <td class="text-center"><input type='hidden' class='ciclo' name='ciclo[]' id='ciclo[]' value="${e.ciclo}">${e.ciclo}</td>
                            <td class="text-center"><input type='hidden' class='horas' name='horas[]' id='horas[]' value="${e.Horas}">${e.Horas}</td>
                            <td class="text-center"><input type='hidden' class='creditos' name='creditos[]' id='creditos[]' value="${e.creditos}">${e.creditos}</td>
                            <td class="text-center"><input type='hidden' class='Precio' name='Precio[]' id='Precio[]' value="${e.Precio}">${e.Precio}</td>
                        </tr>`
                )

                $('#tablaListadoJefe tbody').append(plantilla);
                

                $("#modalNuevaSolicitud").modal({backdrop: 'static', keyboard: false})


                // if(dat.estadoCod === 1){
                //     $(".div-respuesta").css({'display':'none'});                    
                //     $("#boton-modal").html(`<button class="btn btn-primary mipanel-btn-img-texto btn-block btnCambiarEstado" enviarEmail="0" estado="2" op="${dat.Op}" style="max-width: 230px;margin:auto"><span class="icon-close" style="padding-right: 10px;"></span> EN PROCESO </button>`);
                // }else if(dat.estadoCod === 2){
                //     $(".div-respuesta").css({'display':'block'});
                //     $("#boton-modal").html(`<button class="btn btn-success mipanel-btn-img-texto btn-block btnCambiarEstado" enviarEmail="1" estado="3" op="${dat.Op}" style="max-width: 230px;margin:auto"><span class="icon-close" style="padding-right: 10px;"></span> ATENDIDO </button>`);
                // }else if(dat.estadoCod === 3){                    
                //     $("#boton-modal").html(`<button class="btn btn-warning mipanel-btn-img-texto btn-block btnCambiarEstado" enviarEmail="0"  estado="0" op="${dat.Op}" style="max-width: 230px;margin:auto"><span class="icon-close" style="padding-right: 10px;"></span> Actualizar Respuesta </button>`);
                //     $(".div-respuesta").css({'display':'block'});
                //     $("#respuesta-modal").val( ( dat.Respuesta === null ? "" : dat.Respuesta ) ).prop( "disabled" , false ).prop( "placeholder" , "" );
                // }

                // $("#modalAdministrarTramite").modal()

            }    
        }
    })

}

$('.form-requerimiento').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrar" });
    console.log("data", form)

    $.ajax({
        url: path + "certificados/tramiteModular",
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

                results = []
                //document.getElementsByClassName("form-requerimiento").reset();
                //limpiarTabla();
                // if(temporal.length !== 0){
                //     temporal.forEach(element => {
                //         eliminarArticulo(element)
                //     });
                //     temporal = [];
                //     console.log("SE ELIMINARON LOS DETALLES ", temporal);
                // }
                
                $("#modalNuevaSolicitud").modal('hide')
                Notiflix.Notify.Success('Registrado correctamente');
                setTimeout(() => {
                    cargarSolicitudes()
                }, 500);
                
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

$(document).on("click",".btnCambiarEstado",function(){

    const id = $(this).attr("op");
    const estado = $(this).attr("estado");
    const enviarEmail = $(this).attr("enviarEmail");
  
    if (estado === "3" || estado === 3 || estado === "0" || estado === 0 ){
        if($("#respuesta-modal").val() === "" || $("#respuesta-modal").val() === null){
            Notiflix.Notify.Warning('INGRESE UNA RESPUESTA');       
            return;
        }
    }
    
    $.ajax({
        url: path + "certificados/tramiteModular",
        type: "POST",
        dataType: "JSON",
        data: { 
            opcion: "actualizarEstado",
            id: id,
            estado: estado,
            respuesta: $("#respuesta-modal").val(),
            enviarEmail: enviarEmail 
        },
        beforeSend: function () { 
            $(".btnCambiarEstado").prop("disabled",true); 
        },
        complete: function(){ 
            $("#modalAdministrarTramite").modal("hide")
            $(".btnCambiarEstado").prop("disabled",false);
        },
        success: function (response) {
                   
            if(response.respuesta === "success"){
                                
                if( estado === "3" || estado === 3 ){
                    Notiflix.Notify.Success('LA SOLICITUD HA SIDO CERRADA, SE ENVIO UN CORREO DE RESPUESTA AL ALUMNO.',{timeout:6000});                                           
                }else if(estado === 0 || estado === "0"){
                    Notiflix.Notify.Success('LA RESPUESTA SE ACTUALIZO CON ÉXITO');                
                }else{
                    Notiflix.Notify.Success('LA SOLICITUD ESTÁ EN PROCESO');              
                }
                cargarSolicitudes(); 
                
            }else{
                
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA Y VUELVA A INTENTARLO.');              
            
            }
    
        }
    })

})

function eliminarDetalle_new( id, boton ){

    $.ajax({
        url: path + "certificados/tramiteModular",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "eliminarDetalleNew",
            id : id
        } ,
        beforeSend: function (){            
        },
        complete : function(){            
        },
        success: function (response) {

            console.log(response);
            
            if(response.respuesta === "success" ){ 
                let fila = boton.parentNode.parentNode;
                fila.remove();

                Notiflix.Notify.Success("Eliminado correctamente"); 
            }else{  
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
            }    
        },
    })

}

function cursoFormatoFutPdf( btn ){

    const op = $(btn).attr("op");

    $.ajax({
        url: path + "certificados/tramiteModular",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "descargarPdf",
            op : op
        } ,
        beforeSend: function (){            
        },
        complete : function(){            
        },
        success: function (response) {

            console.log(response);
            
            if(response.respuesta === "success" ){

                $("#modalVistaPreviaFormularioFut").modal({backdrop: 'static', keyboard: false})
                $('#modalVistaPreviaFormularioFut .modal-body #divIframeFormularioFut').html("");
                let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaFormularioFut .modal-body #divIframeFormularioFut').html(pdf);   

            }else{  

                $('#modalVistaPreviaFormularioFut .modal-body #divIframeFormularioFut').html("");                   
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }    
        },
    })

}

function limpiarTabla(){
    tabla = '<tr>'
                + '<td class="text-center text-primary" colspan="5" id="anydates" >'
                + 'agregue un articulo'
                + '</td>'
            + '</tr>';
    $("#tablaListado tbody").html(tabla);
}

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
                url: path + "certificados/tramiteModular",
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
                        cargarSolicitudes()
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

$("#cerraModal2").click(function(){
    $('#modalVistaPreviaFormularioFut .modal-body #divIframeFormularioFut').html("");
    $("#modalVistaPreviaFormularioFut").modal("hide");
    //$("body").css({"padding-right" : 0 })
})

function mostrarEditarFechaEntrega(data){
    let op = $(data).attr("data-op");
    $('#op_fechaEntrega_'+op).attr("disabled", false)
   // $('#editar_'+op).hide(300)
    $('#guardar_fechaEntrega_'+op).toggle(300)
}

function editarFechaEntrega(data){
    let op = $(data).attr("data-op");
    $('#op_fechaEntrega_'+op).attr("disabled", true)
    let nro = $('#op_fechaEntrega_'+op).val()
   // $('#editar_'+op).hide(300)
    $('#guardar_fechaEntrega_'+op).hide(300)
    
    Notiflix.Confirm.Show(
        'EDITAR FECHA EXPEDICION: ',
        'Esta opcion permitira cambiar la fecha de entrega',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "certificados/tramiteModular",
                type: "POST",
                data: {
                    op: op,
                    nro: nro,
                    opcion: 'editarFechaEntrega'
                },
                beforeSend: function () {

                },
                success: function (data) {

                    let datos = JSON.parse(data);

                    if (datos.respuesta === 'success') {
                        cargarSolicitudes()
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
                url: path + "certificados/tramiteModular",
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
                        cargarSolicitudes()
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

function verReportePDF(id) {
    //const op = $(btn).attr("codigo");
    $.ajax({
        url: path + "Certificados/tramiteModular",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "solicitudPDF",
            id: id
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

function generarColorAleatorio2() {
    return coloresFondo2[Math.floor(Math.random() * coloresFondo2.length)];
}
function getColorAsesor2(asesor) {
    if (!coloresAsesores2[asesor]) {
        coloresAsesores2[asesor] = generarColorAleatorio2();
    }
    return coloresAsesores2[asesor];
}