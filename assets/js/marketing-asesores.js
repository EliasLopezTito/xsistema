$(document).ready(function(){
    //autocomplete 
    $("#filtrar__asesores").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Marketing/listado_asesores",
                dataType: "json",
                type: 'post',
                data: {
                    "opcion": '',
                    "asesor": $("#filtrar__asesores").val()
                },
                success: function(data){

                    $("#filtrar__asesores").next('i').removeClass('glyphicon-ok');
                    $("#filtrar__asesores").next('i').addClass('glyphicon-remove');
                    $("#filtrar__asesores").parent().removeClass('has-success');
                    $("#filtrar__asesores").parent().addClass('has-error');

                    let result = ( data.result.length === 0 ) ? [{ vacio: true }] : data.result;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{    
                
                $("#filtrar__asesores").val(ui.item.Cod_emp + " - " + ui.item.Nombres +" "+ ui.item.Apellidos);
                $("#filtrar__asesores").next('i').removeClass('glyphicon-remove');
                $("#filtrar__asesores").next('i').addClass('glyphicon-ok');
                $("#filtrar__asesores").parent().removeClass('has-error');
                $("#filtrar__asesores").parent().addClass('has-success');

                tabla_lista_asesores.destroy();

                cargarTablaBusqueda(ui.item.Apellidos+" "+ui.item.Nombres);

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
            .append( "<div><b>Código: </b>" + item.Cod_emp + " &nbsp&nbsp-&nbsp <b>Nombre: </b> " +item.Nombres +" "+ item.Apellidos +"</div>" )
            .appendTo( ul );
    };
    //cargar tabla
    cargarTablaBusqueda("");
    //realizar busqueda
    $('#btn__filtrar__asesores').click(function(){  
        tabla_lista_asesores.destroy();
        let asesor = $("#filtrar__asesores").val()
        if(asesor === ""){
            asesor = "todo"
        }
        cargarTablaBusqueda(asesor);
    });
    //abrir modal
    $("#btn__agregar__asesor").click(function(){
        $("#modal__agregar__asesor").modal("show")
    })
    //reiniciar form
    $("#cerrar__modal__asesor").click(function(){
        $("#form__agregar__asesor").trigger("reset");
    })
    //registrar asesor
    $('#form__agregar__asesor').submit(function(e){
        e.preventDefault();
        let datos = $(this).serialize();
        //let dat = $(this).serializeArray();       
        $.post( path+"marketing/agregar_asesor", datos)
        .done(function(r){ 
            response = JSON.parse(r)
            if(response.success === true){
                Notiflix.Notify.Success(response.result);
                $("#form__agregar__asesor").trigger("reset");
                $("#modal__agregar__asesor").modal("hide")
                tabla_lista_asesores.ajax.reload(null,false);
            }else{
                if(response.result === "codigorepetido"){
                    Notiflix.Notify.Warning('El código de empleado ya está registrado, activelo para poder usarlo.');
                }
                if(response.result === "vacio"){ 
                    //console.log(response.result)
                    Notiflix.Notify.Failure('Ocurrio un error inesperado, vuela a intentarlo');
                }
            } 
        })
        .fail(function(r) {
            //console.log(r) //--->para ver el error
            Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuelva a intentarlo');
        })
    })
    //editar asesor
    $('#form__editar__asesor').submit(function(e){
        e.preventDefault();
        let datos = $(this).serialize();
        //let dat = $(this).serializeArray();       
        $.post( path+"marketing/editar_asesor", datos)
        .done(function(r){
            response = JSON.parse(r)
            if(response.success === true){
                Notiflix.Notify.Success(response.result);
                $("#form__editar__asesor").trigger("reset")
                $("#modal__editar__asesor").modal("hide")
                tabla_lista_asesores.ajax.reload(null,false)
            }else{              
                Notiflix.Notify.Failure('Ocurrio un error inesperado, vuela a intentarlo'); 
            } 
        })
        .fail(function(r) {
            Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuela a intentarlo');
        })
    })
    //filtrar por estado
    $('#slct__estado').on( 'change', function () {
        tabla_lista_asesores
                .column(3)
                .search( this.value )
                .draw();
    });
})

$('#tabla__lista__asesores tbody').on("click" , "tr", function(e){
    $("#tabla__lista__asesores tbody tr").removeClass("success")
    $(this).addClass("success");
})

function pasarInfoEditarAsesor(btn){
    $("#id_editar").val( btn.getAttribute('data-id'))  
    $("#apellido_editar").val( btn.getAttribute('data-ape'))
    $("#nombre_editar").val( btn.getAttribute('data-nom'))
    $("#documento_editar").val( btn.getAttribute('data-doc'))
    $("#codigo_editar").val( btn.getAttribute('data-cod'))

    estado = btn.getAttribute('data-est')
  
    if(estado === "1"){
        $("#estado_editar option[value='1']").prop("selected",true)
    }else{
        $("#estado_editar option[value='0']").prop("selected",true)
    }
     
    $("#modal__editar__asesor").modal("show")
}
function cargarTablaBusqueda(asesor){
    tabla_lista_asesores = $('#tabla__lista__asesores').DataTable( {
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
        "lengthMenu": [[10,20, 50, 100 -1], [10,20, 50, 100, "Todos"]],
        "iDisplayLength": 10,
        "ajax": {
            url: path + "Marketing/listado_asesores",
            type: 'post',
            data: {
                "opcion" : "",
                "asesor" : asesor
            },
            beforeSend: function(){
            },
            dataSrc: function(r){
                //console.log(r)
                if(r.success === true){
                    data = r.result;
                    return data;
                }else{
                    return [];
                }
            },
            complete: function(){
            }
        },
        columns:[
            { 
                data: {},
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                    
            },"className":"text-center" },
            {data:  null, 
                render:function(data,type,row){
                    return (data.Nombres+" "+data.Apellidos).toUpperCase();
            },"className":"text-center"},
            {data:  null, render:function(data,type,row){
                return data.Documento;
            },"className":"text-center"},
            {data:  null, render:function(data,type,row){
                return data.Cod_emp;
            },"className":"text-center"},
            {data:  null, render:function(data,type,row){
                if(data.Estado === 0 ){
                    return "<span style='color:red;font-weight:900'>DESABILITADO</span>";
                }else if(data.Estado === 1){
                    return "<span style='color:green;font-weight:900'>ACTIVO</span>";
                }
            },"className":"text-center"},
            {data:  null, render:function(data,type,row){

                plantilla = `<button class="btn boton-tabla btn-warning" data-id='${data.ID}' data-cod='${data.Cod_emp}' data-nom='${data.Nombres}' data-ape='${data.Apellidos}' data-est='${data.Estado}' data-doc='${data.Documento}' onclick="pasarInfoEditarAsesor(this)" > <span class="icon-pencil"></span> </button>`;

                return plantilla;

            },"className":"text-center text-center"}
        ]           
    })

}