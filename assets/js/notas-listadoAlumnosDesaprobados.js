$(document).ready(function () {
    cargarSedes(true);      

 });
$("#btnGenerarListado").click(function(){
    
    data = {
        "opcion" : "generarListado",
        "especialidad" : $("#especialidad").val(),
        "periodo" : $("#periodo").val(),
        "sede" : $("#sede").val()
    };
    
    $("#especialidad").prop("disabled",true)
    $("#periodo").prop("disabled",true)
    $("#btnGenerarListado").prop("disabled",true)
    $("#btnDescargarExcel").prop("disabled",true)
    $("#loader").css({"display" : "block"})

    $.ajax({
        url: path + "notas/listadoAlumnosDesaprobados",
        type: "POST",
        dataType: "JSON",
        data: data,
        success: function (response) {

            $("#especialidad").prop("disabled",false)
            $("#periodo").prop("disabled",false)
            $("#btnGenerarListado").prop("disabled",false)
            $("#btnDescargarExcel").prop("disabled",false)
            $("#loader").css({"display" : "none"})
            
            if (response.respuesta === "success") {
                
                Notiflix.Notify.Success("CONSULTA EXITOSA")
                $('#tablaListadoAlumnosDesaprobados tbody').html("")
                $('#tablaListadoAlumnosDesaprobados').DataTable().destroy();   
                cargarInformacionTabla( response.listado )
                
            } else {
                
                Notiflix.Notify.Failure("Ocurrio un error al generar el listado, por favor intentelo nuevamente.")
                $('#tablaListadoAlumnosDesaprobados tbody').html("")
                $('#tablaListadoAlumnosDesaprobados').DataTable().destroy();   
                cargarInformacionTabla( [] )

            }
        }
    });
})

$("#btnDescargarExcel").click(function(){

    $("#opcion").val("descargarExcel")
    $("#frmGenerarListado").submit()

})

function cargarInformacionTabla(data){
    $('#tablaListadoAlumnosDesaprobados').DataTable( {
        ordering: false,
        responsive: true,
        language: {
            "emptyTable": "No hay registros para mostrar",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros ",
            "infoEmpty": "Mostrando 0 registros de un total de 0.",
            "infoFiltered": "(filtrados de un total de _MAX_ registros)",
            "infoPostFix": "",
            "lengthMenu": "Mostrar _MENU_ registros",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "searchPlaceholder":"" ,
            zeroRecords: "No se encontraron resultados",
            "paginate": {
                "first": "Primera",
                "last": "Última",
                "next":" Siguiente",
                "previous":"Anterior"
            },
            "aria": {
                "sortAscending": "Orden ascendente",
                "sortDescending": "Orden descendente",
            } 
        },
        "lengthMenu": [[20, 50, 100 -1], [20, 50, 100, "Todos"]],
        "iDisplayLength": 20,
        data : data,
        columns:[
            {data: {}, render: function (data, type, row, meta) {          
                return meta.row + meta.settings._iDisplayStart + 1;     
            },"className":"text-center" },
            {data:  null,render:function(data,type,row){ 
                return data.Especialidad.trim();
            },"className":"text-center"},
            {data:  null, render:function(data,type,row){           
                return "<b>"+data.CodAlumno.trim()+"</b> - "+data.Alumno.trim();
            },"className":""},
            {data:  null, render:function(data,type,row){              
                return data.telefono;
            },"className":"text-center"},
            {data:  null, render:function(data,type,row){                
                return data.Curso.trim();
            },"className":""},
            /**{data:  null,render:function(data,type,row){
                return data.Docente.trim();
            },"className":""},**/
            {data:  null, render:function(data,type,row){    
                return data.año;            
            },"className":"text-center"},
            {data:  null, render:function(data,type,row){    
                return data.Semestre;
            },"className":"text-center"},
            {data:  null, render:function(data,type,row){    
                if( data.PR.trim() !== "" ){
                    return "<span class='text-red' style='font-size:16px'><b>"+data.PF+"</b></span>";
                }else{
                    return "<span class='text-red' style='font-size:16px'><b>-</b></span>";
                }    
            },"className":"text-center"}
        ]           
    })
}