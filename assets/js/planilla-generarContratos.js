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

const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

$(document).ready(function(){

    $("#tablaPersonalContratos").DataTable({
        language : language
    });

})

$("#planillas").change(function(){
    if($("#empleadores").val() !== null){

        $("#imputss").html("");
        cargarPersonalSeleccionado(true);
        
    }
})

$("#empleadores").change(function(){
    if($("#planillas").val() !== null){

        $("#imputss").html("");
        cargarPersonalSeleccionado(true);
        
    }
})

$("#contratos_realizados").change(function(){

    $("#imputss").html("");
    cargarPersonalSeleccionado( false , $(this).val() );
    
})

function cargarPersonalSeleccionado( listadoRegistros , dataContratoRealizado = null ){ 

    $.ajax({
        url: path + "planilla/generarContratos",
        type: "POST",
        dataType:"JSON",
        data: {
            "opcion" : "buscar",
            "planilla" : $("#planillas").val(),
            "empleador" : $("#empleadores").val(),
            "realizados" : dataContratoRealizado
        } ,
        beforeSend: function () {

            $('.text-loader').text('CARGANDO PERSONAL, POR FAVOR ESPERE...');
            $("#modalLoader").modal();

            $("#fechaInicio").prop("disabled",true);
            $("#fechaFin").prop("disabled",true);
            $("#btnGenerarContrato").prop("disabled",true);

            $('#tablaPersonalContratos').empty();
            $('#tablaPersonalContratos').dataTable().fnDestroy();

            $("#imputss").html("");

        },
        complete : function(){
            $("#modalLoader").modal("hide"); 
            $("#fechaInicio").prop("disabled",false);
            $("#fechaFin").prop("disabled",false);
            $("#btnGenerarContrato").prop("disabled",false);
        },
        success: function (response) {

            if(response.respuesta === "success"){

                $("#imputss").html("");
                //$('#cantContratos').html("");
                $('#cantContratos').html(response.count);

                console.log(response.count);

                if(listadoRegistros){
                    
                    if(response.registros.length > 0){
                        const reversed = response.registros.reverse(); 
                        $("#contratos_realizados").html(`<option disabled selected >SELECCIONE</option>`)
                        reversed.forEach( val => {
                            
                            const dia = val.fecha.substring(8,10)
                            const mes = val.fecha.substring(5,7)
                            const anio = val.fecha.substring(0,4)

                            $("#contratos_realizados").append(`<option value="${val.fecha}">${dia} - ${ meses[Number(mes)-1] } - ${anio} </option>`)

                        });
                    }else{
                        $("#contratos_realizados").html("<option disabled selected>SIN REGISTROS</option>")
                    }
                }

                if(response.personal.length > 0){

                    $("#tablaPersonalContratos").DataTable({
                        data : response.personal ,        
                        columnDefs: [
                            {
                                targets: '_all',
                                className: 'celda-centrada',
                                orderable: false
                            }
                        ],
                        lengthMenu: [
                            [25, 50, 75, 100], 
                            [25, 50, 75, 100]
                        ],
                        columns: [
                            {data: null,
                                render: function (data,type, row, meta) {
                                    return meta.row + meta.settings._iDisplayStart + 1;
                                }
                            },
                            {data: null,
                                render: function (data) {
                                    return data.Empleado
                                } 
                            },
                            {data: null,
                                render: function (data) {
                                    return data.DNI;
                                } 
                            },
                            {data: null,
                                render: function (data) {
                                    return data.CodEmpleado;
                                } 
                            },
                            {data: null,
                                render: function (data) {
                                    return `
                                        <input style="width:100%" class="fechaIndividualInicio" type="date">                                     
                                    `;
                                } 
                            },
                            {data: null,
                                render: function (data) {
                                    return `
                                        <input style="width:100%" class="fechaIndividualFin" type="date">                                     
                                    `;
                                } 
                            },
                            {data: null ,
                                render: function(data){
                                    return `<select class="selectpicker form-control form-control-sm mipanel-combo selectFunciones" style="font-size: 11px;height: 25px;">   
                                            <option>SI</option>
                                            <option selected>NO</option>           
                                    </select>`;
                                }
                            },         
                            {data: null,
                                render: function(data){
                                    let options = "";
                                    options += `<option>${data.Area.toUpperCase()}</option>`;
                                    data.areas.forEach(function(val){
                                        options += `<option>${val.Nombre.toUpperCase()}</option>`
                                    });
                                    return `
                                        <select class="selectpicker form-control form-control-sm mipanel-combo selectArea" style="font-size: 11px;height: 25px;">   
                                            ${options}                                
                                        </select>
                                    `;
                                }
                            },
                            {data: null ,
                                render: function(data){

                                    const regex = /'/i;
                                    const nombres_ = data.Empleado.trim().replace(regex,"").split(' ').join('');                                  
                                                                  
                                    if(data.checked){

                                        if( $(`#${$("#planillas").val()}_${nombres_}_${(data.CodEmpleado.trim())}`).length === 0 ){

                                            $("#formGenerarContratos").children("#imputss").append(`<input style='width:400px' type='hidden' class='inputs_codigos' id="${$("#planillas").val()}_${nombres_}_${data.CodEmpleado.trim()}" name="codigos[]" value="${$('#planillas').val()}_${nombres_}_${data.CodEmpleado.trim()}_${data.areas[0].Nombre.trim()}_NO_VACIO_VACIO_${data.Cargo.trim()}_${data.Sueldo}_${data.CodHorario.trim()}_${data.HoraIngreso.trim()}_${data.HoraSalida.trim()}_${data.SabadoIngreso}_${data.SabadoSalida}" ></input>`);
                                            return `         
                                                <input type="hidden" name="cargosId" class="cargosId" value="${$("#planillas").val()}_${nombres_}_${data.CodEmpleado.trim()}" />                   
                                                <input type="hidden" name="cargosTodos" class="cargosTodos" value="_${data.Cargo.trim()}_${data.Sueldo}_${data.CodHorario.trim()}_${data.HoraIngreso.trim()}_${data.HoraSalida.trim()}_${data.SabadoIngreso}_${data.SabadoSalida}" />
                                                <input style="cursor:pointer" checked type="checkbox" class="selectCheckbox" />
                                            `;

                                        }else{

                                            return `
                                                <input type="hidden" name="cargosId" class="cargosId" value="${$("#planillas").val()}_${nombres_}_${data.CodEmpleado.trim()}" />
                                                <input type="hidden" name="cargosTodos" class="cargosTodos" value="_${data.Cargo.trim()}_${data.Sueldo}_${data.CodHorario.trim()}_${data.HoraIngreso.trim()}_${data.HoraSalida.trim()}_${data.SabadoIngreso}_${data.SabadoSalida}" />
                                                <input style="cursor:pointer" checked type="checkbox" class="selectCheckbox" />
                                            `;

                                        }                          
                                        
                                    }else{

                                        return `                                        
                                            <input type="hidden" name="cargosId" class="cargosId" value="${$("#planillas").val()}_${nombres_}_${data.CodEmpleado.trim()}">
                                        
                                            <input type="hidden" name="cargosTodos" class="cargosTodos" value="_${data.Cargo.trim()}_${data.Sueldo}_${data.CodHorario.trim()}_${data.HoraIngreso.trim()}_${data.HoraSalida.trim()}_${data.SabadoIngreso}_${data.SabadoSalida}" />
                                            <input style="cursor:pointer" type="checkbox" class="selectCheckbox"></input>
                                        `;

                                    }
                                    
                                }
                            }
                        ],
                        language : language,
                        rowCallback : function( row, data, index ) {
                            if(data.checked === true){
                                $(row).addClass("success");
                            }
                        }
                    });
                    Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO."); 

                }else{

                    $("#imputss").html("");
                    $("#tablaPersonalContratos").DataTable({
                       language : language,
                       data : []
                    });
                    Notiflix.Notify.Warning("NO SE ENCONTRO INFORMACIÓN DISPONIBLE."); 

                }
            }else{
                
                $("#imputss").html("");
                $("#tablaPersonalContratos").DataTable({
                    language : language,
                    data : []
                });
                Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar"); 

            }

        },
    });
}

$(document).on("change",".selectCheckbox",function(){ 
    if($(this).is(":checked")){
        $('#cantContratos').html(Number($('#cantContratos').html()) + 1)
        $(this).parent().parent("tr").addClass("success");
        const codigo = $(this).closest("tr").find('td').last().find('input').first().val();
        const area = $(this).parent().prev().children("select").val();
        const funciones = $(this).parent().prev().prev().children("select").val();
        const fechaInicial =  $(this).parent().prev().prev().prev().prev().children(".fechaIndividualInicio").val();
        const fechaFin =  $(this).parent().prev().prev().prev().children(".fechaIndividualFin").val();   
        const cargosTodos =  $(this).prev('input[name="cargosTodos"]').val(); 
        console.log("carg", codigo);
        console.log("cargosTodos", cargosTodos);
        console.log("area", area);
        
        // const cargosTodos =  $(this).prev().children(".cargosTodos").val(); 
        $("#formGenerarContratos").children("#imputss").append(`  <input style="width:400px" type="hidden" class="inputs_codigos" id="${codigo.trim()}" name="codigos[]" value="${codigo.trim()}_${area.trim()}_${funciones}_${(fechaInicial === '' ? 'VACIO' : fechaInicial)}_${(fechaFin === '' ? 'VACIO' : fechaFin)+cargosTodos}" />`);
    }else{
        $('#cantContratos').html(Number($('#cantContratos').html()) - 1)
        $(this).parent().parent("tr").removeClass("success");
        $(this).prev("input").prop("disabled",true);
        const codigo = $(this).prev("input").val();
        $("#formGenerarContratos").find("#"+codigo+"").remove();
    }  
})

$(document).on("change",".selectArea",function(){
    if($(this).parent().next().children(".selectCheckbox").is(":checked")){
        const codigo = $(this).parent().next().children("input:first").val();
        const area = $(this).val();
        const funciones = $(this).parent().prev().children("select").val();
        const fechaInicial =  $(this).parent().prev().prev().prev().children(".fechaIndividualInicio").val();
        const fechaFin =  $(this).parent().prev().prev().children(".fechaIndividualFin").val();
        const cargosTodos =  $(this).parent().next().children(".cargosTodos").val();
        $("#"+codigo).val(codigo.trim()+"_"+area.trim()+"_"+funciones+"_"+(fechaInicial === '' ? 'VACIO' : fechaInicial)+"_"+(fechaFin === '' ? 'VACIO' : fechaFin)+cargosTodos);
    }
})

$(document).on("change",".selectFunciones",function(){
    if($(this).parent().next().next().children(".selectCheckbox").is(":checked")){
        const codigo = $(this).parent().next().next().children("input:first").val();
        const area = $(this).parent().next().children("select").val();
        const funciones = $(this).val();
        const fechaInicial =  $(this).parent().prev().prev().children(".fechaIndividualInicio").val();
        const fechaFin =  $(this).parent().prev().children(".fechaIndividualFin").val();
        const cargosTodos =  $(this).parent().next().next().children(".cargosTodos").val();
        $("#"+codigo).val(codigo.trim()+"_"+area.trim()+"_"+funciones+"_"+(fechaInicial === '' ? 'VACIO' : fechaInicial)+"_"+(fechaFin === '' ? 'VACIO' : fechaFin)+cargosTodos);
    }
})

$(document).on("change",".fechaIndividualInicio",function(){
    if($(this).parent().next().next().next().next().children(".selectCheckbox").is(":checked")){
        console.log("entra");
        
        const codigo = $(this).parent().next().next().next().next().children("input:first").val();
        const area = $(this).parent().next().next().next().children("select").val();
        const funciones = $(this).parent().next().next().children("select").val();
        const fechaInicial =  $(this).val();
        const fechaFin =  $(this).parent().next().children(".fechaIndividualFin").val();
        const cargosTodos =  $(this).parent().next().next().next().next().children(".cargosTodos").val(); 
        console.log("codigo", codigo);
        
        $("#"+codigo).val(codigo.trim()+"_"+area.trim()+"_"+funciones+"_"+(fechaInicial === '' ? 'VACIO' : fechaInicial)+"_"+(fechaFin === '' ? 'VACIO' : fechaFin)+cargosTodos);
    }
    console.log("AFUERA");
})

$(document).on("change",".fechaIndividualFin",function(){
    if($(this).parent().next().next().next().children(".selectCheckbox").is(":checked")){
        const codigo = $(this).parent().next().next().next().children("input:first").val();
        const area = $(this).parent().next().next().children("select").val();
        const funciones = $(this).parent().next().children("select").val();
        const fechaInicial =  $(this).parent().prev().children(".fechaIndividualInicio").val();
        const fechaFin =  $(this).val();
        const cargosTodos =  $(this).parent().next().next().next().children(".cargosTodos").val(); 
        $("#"+codigo).val(codigo.trim()+"_"+area.trim()+"_"+funciones+"_"+(fechaInicial === '' ? 'VACIO' : fechaInicial)+"_"+(fechaFin === '' ? 'VACIO' : fechaFin)+cargosTodos);
    }
})
   
$("#formGenerarContratos").submit(function(e){
    e.preventDefault();
    let form = $(this).serializeArray();
    form.push({name: "opcion", value: "generarContratoWord"});
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de generar el contrato?',
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "planilla/generarContratos",
                type: "POST",
                dataType:"JSON",
                data: $.param(form) ,
                beforeSend: function () {
                    $('.text-loader').text('GENERANDO CONTRATOS, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                complete : function(){
                    $("#modalLoader").modal("hide"); 
                },
                success: function (response) {
                    console.log(response)
                    if(response.respuesta === "success"){

                        let $a = $("<a>");
                        $a.attr("href",response.word);
                        $("body").append($a);
                        $a.attr("download","contratos.docx");
                        $a[0].click();
                        $a.remove();

                        if(response.word2 !== null){
                            let $a2 = $("<a>");
                            $a2.attr("href",response.word2);
                            $("body").append($a);
                            $a2.attr("download","adicionalDocentes.docx");
                            $a2[0].click();
                            $a2.remove();    
                        }

                        if(response.excel !== null){
                            var date = new Date();
                            var mes = date.getMonth();

                            let $a3 = $("<a>");
                            $a3.attr("href",response.excel);
                            $("body").append($a);
                            $a3.attr("download","DOCENTES-"+meses[mes]+".xlsx");
                            $a3[0].click();
                            $a3.remove();    
                        }

                        Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");
                       
                    }else if(response.respuesta === "warning"){

                        $("#modalLoader").modal("hide"); 
                        Notiflix.Notify.Warning(response.error.toUpperCase());  
                        
                    }else{

                        $("#modalLoader").modal("hide"); 
                        Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar"); 

                    }
                                                 
                },
            });
        }
        ,function(){ 
        });
})

$("#btnEnviarContratos").click(function () {
    
    $("#modalEnviarContratos").modal({backdrop:'static',keyboard:true});

})

$("#btnRealizarEnvio").click(function(){
    
    let form = $("#formGenerarContratos").serializeArray();
    form.push({ name: "opcion", value: "enviarContratos" });
    form.push({ name: "anio", value: $("#anio").val() });
    form.push({ name: "mes", value: $("#mes").val() });
        
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de enviar los contratos seleccionados?',
        'Si',
        'No',
        function () {
            $.ajax({
                url: path + "planilla/generarContratos",
                type: "POST",
                dataType: "JSON",
                data: $.param(form),
                beforeSend: function () {
                    $('.text-loader').text('GENERANDO Y ENVIANDO CONTRATOS, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                complete: function () {
                    $("#modalLoader").modal("hide");
                },
                success: function (response) {
                    
                    if (response.respuesta === "success") {
                        
                        Notiflix.Notify.Success("LOS CONTRATOS SE ENVIARON CON ÉXITO.",{timeout:8000});
                        $("#modalEnviarContratos").modal("hide");
                                                                    
                    } else if (response.respuesta === "warning") {
                        
                        Notiflix.Notify.Warning(response.error.toUpperCase());

                    } else {
                        
                        Notiflix.Report.Failure('ERROR INESPERADO, VUELVA A INTENTARLO', response.error, "Cerrar");

                    }

                },
            });
        }
        , function () {
        });

})

/**function generarContrato(codigo){
    $.ajax({
        url: path + "planilla/generarContratos",
        type: "POST",
        dataType:"JSON",
        data: {
            "opcion" : "generarContrato",
            "codigo" : codigo
        } ,
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CONTRATO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            console.log(response)
            if(response.respuesta === "success" ){

                $("#codEmp").val(codigo)
                $("#fechaInicio").val(response.fechas.FI)
                $("#fechaFin").val(response.fechas.FF)
                $("#idFechasContrato").val(response.fechas.ID)

                $("#modalVistaPreviaPdf").modal("show")
                $('#modalVistaPreviaPdf .modal-body #divIframeContrato').html("");
                let pdf  = '<iframe src="'+response.contrato+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaPdf .modal-body #divIframeContrato').html(pdf);
                
                $("#modalLoader").modal("hide");

            }else{

                $("#modalLoader").modal("hide");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }         
        },

    });
}**/

/**$("#personal").autocomplete({
    source: function(request, response){
        $.ajax({
            url: path + "planilla/generarContratos",
            dataType: "json",
            type : "POST",
            data: {
                personal: request.term,
                opcion: 'buscar'
            },
            success: function(data){
                $("#personal").removeAttr("data-code");
                $("#personal").next('i').removeClass('glyphicon-ok');
                $("#personal").next('i').addClass('glyphicon-remove');
                $("#personal").parent().removeClass('has-success');
                $("#personal").parent().addClass('has-error');
                $("#tablaCursosProgramados tbody").html(""); 
                let result = (!data.personal) ? [{ vacio: true }] : data.personal;
                response(result);
            }
        });
    },
    minLength: 2,
    select: function(event, ui){
        if (ui.item.vacio) {
            event.preventDefault();
        } else{     
            $("#personal").val(ui.item.cod_emp+" - "+ui.item.nombre)              
            $("#personal").next('i').removeClass('glyphicon-remove');
            $("#personal").next('i').addClass('glyphicon-ok');
            $("#personal").parent().removeClass('has-error');
            $("#personal").parent().addClass('has-success');       
            cargarPersonalSeleccionado(ui.item);
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
**/

/**$("#frmFechaInicioFinalContrato").submit(function(e){
    e.preventDefault();
    let form = $(this).serializeArray();
    //form.push({name: "opcion", value: "mantenimientoFechas"});
    let pregunta = "¿Está seguro de actualizar las fechas de contrato?" 
    if(form[5]){
        pregunta = "¿Está seguro de agregar nuevas fechas de contrato?"
    }
    Notiflix.Confirm.Show(
        'Confirmación',
        pregunta,
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "planilla/generarContratos",
                type: "POST",
                dataType:"JSON",
                data: $.param(form) ,
                beforeSend: function () {
                    $('.text-loader').text('ACTUALIZANDO FECHA, PORFAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                success: function (response) {
                    if(response.respuesta === "success"){
                        Notiflix.Notify.Success(response.data.toUpperCase()); 
                    }else{
                        Notiflix.Report.Failure('ERROR',reponse.error,"Cerrar");  
                    }
                    generarContrato(form[0].value)             
                    $("#modalLoader").modal("hide");             
                },
            });
        }
        ,function(){ 
        });   
})**/

/**$("#opcionFechaContrato").change(function(){
    if($(this).is(":checked")){
        $(this).next("span").html("Nuevo Horario")
    }else{
        $(this).next("span").html("Actualizar Horario")
    }
})**/