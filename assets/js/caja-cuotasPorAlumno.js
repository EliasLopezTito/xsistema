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

$(document).ready(function(){
    $("#tablaCuotasPorAlumno").DataTable({
        language : language
    });
   
});

$("#btnConsultar").click(function(){

    const alumno = $("#alumno").val();
    const mes = $("#mes").val();
    const anio = $("#anio").val();
    
    $('#tablaCuotasPorAlumno').dataTable().fnDestroy();
    $('#tablaCuotasPorAlumno tbody').empty();

    cargarTabla(alumno,mes,anio);

})

function cargarTabla(alumno,mes,anio){

    $("#tablaCuotasPorAlumno").DataTable({
        language : language,
        ordering : false,
        responsive : true,
        lengthMenu : [[10,20, 50, 100 -1], [10,20, 50, 100, "Todos"]],
        iDisplayLength : 10,
        ajax : {
            url: path + "caja/cuotasPorAlumnos",
            type: 'post',
            data: {
                opcion : "consultarCuotas",
                anio : anio ,
                mes : mes ,
                alumno : alumno
            },
            beforeSend: function(){
                $("#modalLoader").modal();
                $(".text-loader").html("CARGANDO INFORMACIÓN, POR FAVOR ESPERE...");
            },
            dataSrc: function(r){
                
                if(r.respuesta === "success"){
                    return r.data;      
                }else{
                    return {};
                }

            },
            complete : function(){
                $("#modalLoader").modal("hide");
            }
        },
        columns:[
            { 
                data: {},
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                    
            },"className":"text-center" },
            {data: "CodAlumno" , "className":"text-center"},
            {data:  null, render:function(data){
                return data.Alumno.toUpperCase();
            },"className":"text-center"},
            {data: "Condicion" , "className":"text-center"},
            {data: "Grupo" , "className":"text-center"},
            {data:  null, render:function(data){

                return data.Monto;

            },"className":"text-center text-center"},
            {data: "UltimoPago" , "className":"text-center"},
            {data:  null, render:function(data){

                return "<input type='checkbox' codigo='"+data.CodAlumno+"' class='selectCheckbox'>";

            },"className":"text-center text-center"},
        ]

    });

}

$(document).on("change",".selectCheckbox",function(){ 
    if($(this).is(":checked")){
        $("#formRegistrar").prepend("<input style='width:100px' type='hidden' class='count_codigos' id='"+$(this).attr('codigo')+"' name='codigos[]' value='"+$(this).attr('codigo')+"' />");
        $(".count_codigos").length < 1 ? $("#registrarSeleccionados").prop("disabled" , true) : $("#registrarSeleccionados").prop("disabled" , false) 
    }else{
        $("#formRegistrar").find("#"+$(this).attr('codigo')).remove();
        $(".count_codigos").length < 1 ? $("#registrarSeleccionados").prop("disabled" , true) : $("#registrarSeleccionados").prop("disabled" , false) 
    }  
})

$("#formRegistrar").on("submit",function(e){
    
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({name: "opcion", value: "registrarSeleccionados"});
    
    $.ajax({
        url: path + "caja/cuotasPorAlumnos",
        type: "POST",
        dataType: "JSON",
        data: $.param(form),
        beforeSend: function () {
            $('.text-loader').text('REGISTRANDO SELECCIONADOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
            
            if(response.errores.length > 0){
                        
                var errores = "";
                errores += "<b>Los siguientes códigos no se pudieron registrar, por favor vuelva a intentarlo:</b></br>"
                for (i = 0; i < response.errores.length; i++) {
                    errores += "<b>Código "+i+1+" : </b>"+response.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);

            }
            $("#formRegistrar").find( $(".count_codigos").remove() );
            Notiflix.Notify.Success('LOS ALUMNOS SELECCIONADOS HAN SIDO REGISTRADOS CON ÉXITO.');
            $("#registrarSeleccionados").prop("disabled" , true)
            $('#tablaCuotasPorAlumno').dataTable().fnDestroy();
            $('#tablaCuotasPorAlumno tbody').empty();
            const alumno = $("#alumno").val();
            const mes = $("#mes").val();
            const anio = $("#anio").val();
            cargarTabla(alumno,mes,anio)

        },error: function(error){

            Notiflix.Notify.Failure('OCURRIÓ UN ERROR INESPERADO, POR FAVOR VUELVA A INTENTARLO');
        
        }
    })

})