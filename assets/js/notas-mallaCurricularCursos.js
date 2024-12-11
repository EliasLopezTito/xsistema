$(document).ready(function(){

    cargarInstituciones(true);
    cargarInstituciones2(true);
    $("#institucion2").change(function () {
        cargarTipoEspecialidades2(true, false);
    })
    $("#tipoEspecialidad2").change(function(){
        cargarEspecialidades2(true,false, function() {
            var cboEspecialidad = $("#especialidad2");
            cboEspecialidad.find('option[value="0"]').remove();
        });
    })
    $("#modalEditarMalla").on("hidden.bs.modal", function () {
        $(".fila-seleccionada").removeClass("fila-seleccionada");
    });

})

$(document).on( "change" , "#institucion" , function () {
    cargarTipoEspecialidades(true);
});

$(document).on( "change" , "#tipoEspecialidad" , function () {
    cargarEspecialidades(true);
});

$("#form-buscar").submit(function(e){
    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"select"})
    cargarTabla(data);
})

function cargarTabla(data) {
    $.ajax({
        url: path + "notas/mallaCurricularCursos",
        type: "POST",
        dataType: "JSON",
        data: data,
        beforeSend: function () {
            $("#tablaMalla tbody").html("");
        },
        success: function (datos) {
            const regex = /"/gi;
            if (datos.respuesta === "success") {
                for (let i = 0; i < datos.data.length; i++) {
                    const malla = datos.data[i];
                    const local = malla.Local.trim().replace(regex, "");
                    const tr = `<tr>
                                    <td class="celda-centrada">${i + 1}</td>
                                    <td class="celda-centrada">${malla.malla_curricular.trim()}</td>
                                    <td class="celda-centrada">${malla.Cod_Curso.trim()}</td>
                                    <td class="celda-centrada">${malla.Curso.trim()}</td>
                                    <td class="celda-centrada">${malla.Especialidad.trim()}</td>
                                    <td class="celda-centrada">${malla.Tipo.trim()}</td>
                                    <td class="celda-centrada">${malla.creditos.trim()}</td>
                                    <td class="celda-centrada">${malla.HoraPract}</td>
                                    <td class="celda-centrada">${malla.HoraTeoria}</td>
                                    <td class="celda-centrada">${malla.Secuencia}</td>
                                    <td class="celda-centrada">${malla.Fechareg.substring(0, 10)}</td>
                                    <td class="celda-centrada">
                                        <button class="btn boton-tabla boton-verde" type="button"
                                                cod_curso="${malla.Cod_Curso}" curso="${malla.Curso.trim()}"
                                                ciclo="${malla.Ciclo}" cod_espe="${malla.Cod_espe}"
                                                espe="${malla.Especialidad}" cod_local="${malla.Cod_local}"
                                                local="${local}" malla="${malla.malla_curricular}"
                                                cod_tipo_espe="${malla.Tipo_espe}" tipo_espe="${malla.Tipo.trim()}"
                                                creditos="${malla.creditos}" hPrac="${malla.HoraPract}"
                                                hTeoria="${malla.HoraTeoria}" secuencia="${malla.Secuencia}"
                                                onclick='editarFila(this)' ><span class="icon-pencil"></span></button>
                                    </td>
                                </tr>`;
                    $("#tablaMalla tbody").append(tr);
                }
                Notiflix.Notify.Success('Información cargada correctamente.');
            } else {
                Notiflix.Notify.Failure('Ocurrió un error inesperado.');
            }
        }
    });
}

function editarFila(boton) {
    $(".fila-seleccionada").removeClass("fila-seleccionada");
    $(boton).closest("tr").addClass("fila-seleccionada");
    updateMalla(boton)
}

function updateMalla(btn){

    const malla = $(btn).attr("malla").trim();
    const cod_local = $(btn).attr("cod_local").trim();
    const local = $(btn).attr("local").trim();
    const cod_tipo_espe = $(btn).attr("cod_tipo_espe").trim();
    const tipo_espe = $(btn).attr("tipo_espe").trim();
    const cod_espe = $(btn).attr("cod_espe").trim();
    const espe = $(btn).attr("espe").trim();
    const cod_curso = $(btn).attr("cod_curso").trim();
    const curso = $(btn).attr("curso").trim();
    const creditos = $(btn).attr("creditos").trim();
    const hPrac = $(btn).attr("hPrac").trim();
    const hTeoria = $(btn).attr("hTeoria").trim();
    const secuencia = $(btn).attr("secuencia").trim();
    const ciclo = $(btn).attr("ciclo")

    cargarInstituciones2(true, false, function() {
        $("#institucion2").val(cod_local).prop("selected", true);
        cargarTipoEspecialidades2(true, false, function () {
            $("#tipoEspecialidad2").val(cod_tipo_espe).prop("selected", true);

            cargarEspecialidades2(true, false, function () {
                $("#especialidad2").val(cod_espe).prop("selected", true);
            });
        });
    });
    $("#malla_").val(malla);
    $("#ciclo_").val(ciclo);
    $("#curso_").val(cod_curso);
    $("#creditos_").val(creditos);
    $("#hTeoria_").val(hTeoria);
    $("#hPrac_").val(hPrac);
    $("#secuencia_").val(secuencia);

    $("#modalEditarMalla").modal({backdrop: 'static',keyboard: false})

}

function modalAgregarMalla(){

    $(".class-remove-id").attr("id","")
    $(".class-remove-id-modal").each(function(index){
        $(this).attr("id",$(this).attr("idOld"))
    })
    cargarInstituciones(true);
    $("#modalAgregarMalla").modal({backdrop: 'static',keyboard: false});
    
}

$("#cerrarModal").click(function(){
    $(".class-remove-id-modal").attr("id","")
    $(".class-remove-id").each(function(index){
        $(this).attr("id",$(this).attr("idOld"))
    })
    $("#modalAgregarMalla").modal("hide");
})

$("#formAgregarMalla").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"create"});

    $.ajax({
        url: path + "notas/mallaCurricularCursos",
        type: "POST",
        dataType : "JSON",
        data: $.param(data),  
        beforeSend: function(){
            $("#tablaMalla tbody").html("");
        },     
        success: function ( datos ) { 

            /* console.log(datos); */

            if (datos.respuesta === "success"){  

                let data_ = $("#form-buscar").serializeArray();
                data_.push({name:"opcion",value:"select"})
                cargarTabla(data_);

                Notiflix.Notify.Success('Información cargada correctamente.');

            } else {
                
                Notiflix.Notify.Failure('Ocurrio un error inesperado.');
            
            }

        }
    });

})

$("#formEditarMalla").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"update"});

    /* console.log("editar:",data); */

    $.ajax({
        url: path + "notas/mallaCurricularCursos",
        type: "POST",
        dataType : "JSON",
        data: $.param(data),  
        beforeSend: function(){
            $("#tablaMalla tbody").html("");
        },  
        complete : function(){
            $("#modalEditarMalla").modal("hide")   
        },   
        success: function ( datos ) { 

            /* console.log(datos); */

            if (datos.respuesta === "success"){  

                let data_ = $("#form-buscar").serializeArray();
                data_.push({name:"opcion",value:"select"})
                cargarTabla(data_);

                Notiflix.Notify.Success('Operación exitosa');

            } else {
                
                Notiflix.Notify.Failure('Ocurrio un error inesperado.');
            
            }

        }
    }); 

})