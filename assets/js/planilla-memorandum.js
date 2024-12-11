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

const meses = {
    '01': 'ENERO',
    '02': 'FEBRERO',
    '03': 'MARZO',
    '04': 'ABRIL',
    '05': 'MAYO',
    '06': 'JUNIO',
    '07': 'JULIO',
    '08': 'AGOSTO',
    '09': 'SEPTIEMBRE',
    '10': 'OCTUBRE',
    '11': 'NOVIEMBRE',
    '12': 'DICIEMBRE',
}

$(document).ready(function(){
    
    $("#tablaPersonalMemorandum").DataTable({
        language : language,
        data : {}
    })

})

$(document).on("change", ".selectCheckbox", function() {
    if ($('.selectCheckbox:checked').length > 0) {
        $("#btnVistaPrevia").prop('disabled', false).show();
    } else {
        $("#btnVistaPrevia").prop('disabled', true).hide();
    }
});

$(document).ready(function(){
    $("#cerraModal").on("click", function(){
        $("#modalVistaPreviaMemorandum").modal("hide");
    });
});


$("#memorandum_realizados").change(function(){
         
    cargarPersonalSeleccionado( $(this).val() , false );

})

function cargarHistorialFechas(){

    $.ajax({
        url: path + "planilla/memorandum",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "cargarHistorialFechas" ,
            empleador: $("#empleadores").val(),
            planilla: $("#planillas").val()           
        },    
        beforeSend: function () {
            $("#memorandum_realizados").html("");  
        },    
        success: function (response) {
                       
            if (response.respuesta === "success") {

                if(response.data.length > 0){

                    $("#memorandum_realizados").append(`
                        <option value="" selected disabled >SELECCIONE</option>
                    `);

                    response.data.forEach( val => {
                        $("#memorandum_realizados").append(`
                            <option value="${val.fecha}" >${val.fecha.split("-")[2]} - ${meses[val.fecha.split("-")[1]]} - ${val.fecha.split("-")[0]} </option>
                        `);
                    });

                }else{
            
                    $("#memorandum_realizados").html(`
                        <option value="" selected disabled>SIN REGISTROS</option>
                    `);

                }
                                           
            }

        },
    });

}

$("#btnVistaPrevia").click(function(e) {
    e.preventDefault(); 
    let form = $("#formGenerarMemorandum").serializeArray();
    form.push({name: "opcion", value: "generarVistaPrevia"});
    
    $.ajax({
        url: path + "planilla/memorandum",
        type: "POST",
        dataType: "JSON",
        data: $.param(form),
        beforeSend: function() {
            $('.text-loader').text('GENERANDO MEMORANDUM, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function() {
            $("#modalLoader").modal("hide");
        },
        success: function(response) {
            if (response.respuesta === "success") {
                $("#modalVistaPreviaMemorandum").modal("show");
                $('#modalVistaPreviaMemorandum .modal-body #divIframeMemorandum').html("");
                let pdf = '<iframe src="'+response.pdf.pdf+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>';
                $('#modalVistaPreviaMemorandum .modal-body #divIframeMemorandum').html(pdf); 
            } else {  
                $('#modalVistaPreviaMemorandum .modal-body #divIframeMemorandum').html("");                   
                Notiflix.Report.Failure("Ooops, Ocurrió un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
            }   
        },
    });
});

$("#planillas").change(function(){
    
    cargarPersonalSeleccionado();    

})

function cargarPersonalSeleccionado( historial = "" , refresh = true ){
    
    $.ajax({
        url: path + "planilla/memorandum",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "buscar",
            planilla : $("#planillas").val(),
            empleador : $("#empleadores").val(),
            historial: historial
        } ,
        beforeSend: function () {

            $('.text-loader').text('CARGANDO PERSONAL, POR FAVOR ESPERE...');
            $("#modalLoader").modal();

            $("#fechaMemo").prop("disabled",true);
            $("#btnGenerarMemorandum").prop("disabled",true);

            $('#tablaPersonalMemorandum').empty();
            $('#tablaPersonalMemorandum').dataTable().fnDestroy();

            $("#div_inputs").html("");

        },
        complete : function(){

            $("#modalLoader").modal("hide"); 
            $("#fechaMemo").prop("disabled",false);
            $("#btnGenerarMemorandum").prop("disabled",false);
            if(refresh){
                cargarHistorialFechas();
            }

        },
        success: function (response) {
           
            if(response.respuesta === "success"){

                $("#div_inputs").html("");
              
                $("#tablaPersonalMemorandum").DataTable({
                    data : response.data ,        
                    columnDefs: [
                        {
                            targets: '_all',
                            className: 'celda-centrada',
                            orderable: false
                        }
                    ],
                    lengthMenu: [
                        [20, 25, 50, 75, 100], 
                        [20, 25, 50, 75, 100]
                    ],
                    columns: [
                        {data: null,
                            render: function (data,type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            }
                        },
                        {data: null,
                            render: function (data) {
                                return data.CodEmpleado;
                            } 
                        },
                        {data: null,
                            render: function (data) {
                                return data.DNI;
                            } 
                        }, 
                        {data: null,
                            render: function (data) {
                                return data.Empleado
                            } 
                        },                        
                        {data: null,
                            render: function (data) {
                                return `<input type="text" codigo="${data.CodEmpleado}" placeholder="Ejemplo : 10,12,15,19,20,22,23,25,28" class="form-control dias_seleccionado"/>`;
                            } 
                        },                    
                        {data: null ,
                            render: function(data){
                                                                
                                return `
                                    <input type="hidden" value="${data.CodEmpleado}">
                                    <input style="cursor:pointer" type="checkbox" class="selectCheckbox"></input>
                                `;
             
                            }
                        }
                    ],
                    language : language,
                    rowCallback : function( row, data, index ) {
                        if(data.checked){
                            
                            $("#diasTardanzas").val(data.diasGrupal);

                            $(row).addClass("success");
                            $(row).children(":last-child").children("input:checkbox").prop("checked",true);

                            $("#formGenerarMemorandum").children("#div_inputs").append(`
                                <input type='hidden' id='${data.CodEmpleado}' name='codigos[]' value='${data.CodEmpleado}-${data.diasIndividual}' />
                            `);

                            $(row).find(".dias_seleccionado").val(data.diasIndividual)

                        }
                    }
                });

                Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO."); 

            }else{
                
                $("#div_inputs").html("");
                $("#tablaPersonalMemorandum").DataTable({
                    language : language,
                    data : []
                });
                Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar"); 

            }

        },
    });
}

$(document).on( "keyup" , ".dias_seleccionado" ,function(){
    const codigo = $(this).attr("codigo");
    const dias = $(this).val().trim(); 

    if($("#"+codigo)){

        $("#"+codigo).val(codigo+"-"+dias)  
        console.log("entra");
        guardarHistorial();

    }
    
})

$("#formGenerarMemorandum").submit(function(e){
    
    e.preventDefault();
    let form = $(this).serializeArray();

    form.push({name: "opcion", value: "generarMemorandum"});

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de generar el documento?',
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "planilla/memorandum",
                type: "POST",
                dataType:"JSON",
                data: $.param(form) ,
                beforeSend: function () {
                    $('.text-loader').text('GENERANDO DOCUMENTO, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                complete : function(){
                    $("#modalLoader").modal("hide"); 
                    cargarHistorialFechas();
                },
                success: function (response) {

                    if(response.respuesta === "success"){

                        let $a = $("<a>");
                        $a.attr("href",response.word);
                        $("body").append($a);
                        $a.attr("download","memorandum.docx");
                        $a[0].click();
                        $a.remove();

                        Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");

                    }else if(response.respuesta === "warning"){

                        $("#modalLoader").modal("hide"); 
                        Notiflix.Notify.Warning(response.mensaje.toUpperCase());  
                        
                    }else{

                        $("#modalLoader").modal("hide"); 
                        Notiflix.Report.Failure('ERROR INESPERADO POR FAVOR VUELVA A INTENTARLO',"Cerrar"); 

                    }
                                                 
                },
            });
        }
        ,function(){ 
        });
})

$(document).on("change",".selectCheckbox",function(){ 
    const codigo = $(this).prev("input").val();
    if($(this).is(":checked")){

        $(this).parent().parent("tr").addClass("success");
        $("#formGenerarMemorandum").children("#div_inputs").append(`<input type='hidden' id='${codigo}' name='codigos[]' value='${codigo}-${ $(this).parent().prev().children('input').val().trim() }' />`);
        guardarHistorial();

    }else{

        $(this).parent().parent("tr").removeClass("success");
        $("#"+codigo).remove();
    }  
})

function guardarHistorial(){
      
    let form = $("#formGenerarMemorandum").serializeArray();
    form.push({ name: "opcion", value: "guardarHistorial" });  
    $.ajax({
        url: path + "planilla/memorandum",
        type: "POST",
        dataType: "JSON",
        data: $.param(form),        
        success: function (response) {            
            //console.log(response);
        },
    });            
    
}