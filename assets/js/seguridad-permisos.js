document.addEventListener("DOMContentLoaded", () => {
    $("#usuarios").autocomplete({
        source: function(request, response){
            $('.seccion_menu').hide()
            $('#filtrar__area').val(0)
            $.ajax({
                url: path + "Seguridad/permisos",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'searchUsers'
                },
                success: function(data){
                    $("#usuarios").removeAttr("data-code");
                    $("#usuarios").next('i').removeClass('glyphicon-ok');
                    $("#usuarios").next('i').addClass('glyphicon-remove');
                    $("#usuarios").parent().removeClass('has-success');
                    $("#usuarios").parent().addClass('has-error');
                    $("#tablaPermisos tbody").find('tr').remove();
                    $("#rowButton").css('display','none');
                    
                    let result = (!data.usuarios) ? [{ vacio: true }] : data.usuarios;
                    
                    response(result);

                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#usuarios").val(ui.item.nombre);
                $("#usuarios").attr('data-code', ui.item.usuario);
                $("#usuarios").next('i').removeClass('glyphicon-remove');
                $("#usuarios").next('i').addClass('glyphicon-ok');
                $("#usuarios").parent().removeClass('has-error');
                $("#usuarios").parent().addClass('has-success');
                let id_usuario = $("#usuarios").attr('data-code');
                cargarPermisosUsuarios(id_usuario);
                $('.seccion_menu').show()
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
            .append( "<div><b>Usuario: </b>" + item.usuario + "<br><b>Nombre: </b> " +item.nombre + "</div>" )
            .appendTo( ul );
    };
    
    $("#usuarios").focus();
});

document.addEventListener('change', (e) => {
    if (e.target.matches('#checkMenu')) {
        if (e.target.checked) {
            $label = e.target.parentNode;
            $celda = $label.parentNode;
            $celda.classList.add('true');
        }else{
            $label = e.target.parentNode;
            $celda = $label.parentNode;
            $celda.classList.remove('true');
        }
    }

    if (e.target.matches('#filtrar__area')) {

        valor = $("#filtrar__area").val();
        if(valor == 0){
            $('.all').show();
        }else{
            $('.all').hide();
        }        
        $('.'+valor).show();
    }

});

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnGuardarPermisos')) {
        actualizarPermisos();
    }
    if (e.target.matches('#usuarios')) {
        document.getElementById('usuarios').select();
    }
});


function cargarPermisosUsuarios(id_usuario) {
    
    console.log(id_usuario);
    $.ajax({
        url: path + "seguridad/permisos",
        type: 'POST',
        data: {
            opcion: 'selectMenusPermisos',
            id_usuario: id_usuario
        },
        success: function(res) {

            let data = JSON.parse(res);

            let permisos = data.permisos.map(permiso => permiso.id_menu);

            let menus_nivel_1 = data.nivel_1;
            let menus_nivel_2 = data.nivel_2;
            let menus_nivel_3 = data.nivel_3;
            
            const $table = document.querySelector('#tablaPermisos tbody');
            let $template = document.getElementById('templateCbo').content;
            let tr, celda, rowspan;

            /** Limpiamos la tabla **/
            while($table .hasChildNodes()){
                $table .removeChild($table .lastChild)
            }
            
            const $fragment = document.createDocumentFragment();

            menus_nivel_1.forEach((menu_1, index) => {
                
                tr = document.createElement('tr');
                let uno = true;
                let dos = true;

                if (menu_1.id_menu === 5) {
                    celda = document.createElement('td');
                    rowspan = getRowspanMenuUno(menu_1.id_menu, menus_nivel_2, menus_nivel_3);
                    celda.setAttribute('rowspan', 1);
                    celda.classList.add('celda-centrada');
                    celda.textContent = index + 1;
                    tr.appendChild(celda);

                    celda = document.createElement('td');
                    celda.classList.add('celda-izquierda');
                    tr.classList.add('id_'+ menu_1.id_menu);
                    tr.classList.add('all');
                    // celda.setAttribute('rowspan', rowspan);
                    $template.querySelector('span').textContent = menu_1.descripcion.toUpperCase();
                    $template.getElementById('checkMenu').setAttribute('data-id',menu_1.id_menu);
                    if (permisos.includes(menu_1.id_menu)) {
                        $template.getElementById('checkMenu').checked = true;
                        celda.classList.add('true');
                    }else{
                        $template.getElementById('checkMenu').checked = false;
                    }

                    $clone = document.importNode($template, true);
                    celda.appendChild($clone);
                    tr.appendChild(celda);
                    celda = document.createElement('td');
                    tr.appendChild(celda);
                    celda = document.createElement('td');
                    tr.appendChild(celda);
                    // $table.appendChild(tr);
                    $fragment.appendChild(tr);
                    return;
                }

                /** Agregar menu nivel 1 **/
                celda = document.createElement('td');
                rowspan = getRowspanMenuUno(menu_1.id_menu, menus_nivel_2, menus_nivel_3);
                celda.setAttribute('rowspan', rowspan);
                celda.classList.add('celda-centrada');
                tr.classList.add('id_'+ menu_1.id_menu);
                tr.classList.add('all');
                celda.textContent = index + 1;
                tr.appendChild(celda);
                
                celda = document.createElement('td');
                celda.classList.add('celda-izquierda');
                tr.classList.add('id_'+ menu_1.id_menu);
                tr.classList.add('all');
                celda.setAttribute('rowspan', rowspan);
                $template.querySelector('span').textContent = menu_1.descripcion.toUpperCase();
                $template.getElementById('checkMenu').setAttribute('data-id',menu_1.id_menu);
                if (permisos.includes(menu_1.id_menu)) {
                    $template.getElementById('checkMenu').checked = true;
                    celda.classList.add('true');
                }else{
                    $template.getElementById('checkMenu').checked = false;
                }

                $clone = document.importNode($template, true);
                celda.appendChild($clone);
                tr.appendChild(celda);

                /** Fin menu nivel 1 **/

                menus_nivel_2.forEach(menu_2 => {

                    if (menu_2.padre === menu_1.id_menu) {
                        
                        /** Agregar menu nivel 2 **/
                        if (uno) {
                            celda = document.createElement('td');
                            rowspan = getRowspanMenuDos(menu_2.id_menu, menus_nivel_3);
                            celda.setAttribute('rowspan', rowspan);
                            celda.classList.add('celda-izquierda');
                            tr.classList.add('id_'+ menu_1.id_menu);
                            tr.classList.add('all');
                            $template.querySelector('span').textContent = menu_2.descripcion.toUpperCase();
                            $template.getElementById('checkMenu').setAttribute('data-id',menu_2.id_menu);
                            if (permisos.includes(menu_2.id_menu)) {
                                $template.getElementById('checkMenu').checked = true;
                                celda.classList.add('true');
                            }else{
                                $template.getElementById('checkMenu').checked = false;
                            }

                            $clone = document.importNode($template, true);
                            celda.appendChild($clone);
                            tr.appendChild(celda);

                        } else {
 
                            tr = document.createElement('tr');
                            celda = document.createElement('td');

                            rowspan = getRowspanMenuDos(menu_2.id_menu, menus_nivel_3);
                            $template = document.getElementById('templateCbo').content;
                            celda.setAttribute('rowspan', rowspan);
                            celda.classList.add('celda-izquierda');
                            tr.classList.add('id_'+ menu_1.id_menu);
                            tr.classList.add('all');
                            $template.querySelector('span').textContent = menu_2.descripcion.toUpperCase();
                            $template.getElementById('checkMenu').setAttribute('data-id',menu_2.id_menu);
                            if (permisos.includes(menu_2.id_menu)) {
                                $template.getElementById('checkMenu').checked = true;
                                celda.classList.add('true');
                            }else{
                                $template.getElementById('checkMenu').checked = false;
                            }
                            $clone = document.importNode($template, true);
                            celda.appendChild($clone);
                            tr.appendChild(celda);
                            dos = true;
                        }

                        /** Fin menu nivel 2 **/
                        
                        menus_nivel_3.forEach(menu_3 => {

                            if (menu_2.padre === menu_1.id_menu && menu_3.padre === menu_2.id_menu) {
   
                                if (uno && dos) {
                                    celda = document.createElement('td');
                                    $template = document.getElementById('templateCbo').content;
                                    $template.querySelector('span').textContent = menu_3.descripcion;
                                    $template.getElementById('checkMenu').setAttribute('data-id',menu_3.id_menu);
                                    if (permisos.includes(menu_3.id_menu)) {
                                        $template.getElementById('checkMenu').checked = true;
                                        celda.classList.add('true');
                                    }else{
                                        $template.getElementById('checkMenu').checked = false;
                                    }
                                    celda.classList.add('celda-izquierda');
                                    tr.classList.add('id_'+ menu_1.id_menu);
                                    tr.classList.add('all');
                                    $clone = document.importNode($template, true);
                                    celda.appendChild($clone);
                                    tr.appendChild(celda);
                                    
                                    /** Agregamos a la tabla **/
                                    $fragment.appendChild(tr);
                                    uno = false;
                                    dos = false;

                                } else if(dos){
                                    celda = document.createElement('td');
                                    $template = document.getElementById('templateCbo').content;
                                    celda.classList.add('celda-izquierda');
                                    tr.classList.add('id_'+ menu_1.id_menu);
                                    tr.classList.add('all');
                                    $template.querySelector('span').textContent = menu_3.descripcion;
                                    $template.getElementById('checkMenu').setAttribute('data-id',menu_3.id_menu);
                                    if (permisos.includes(menu_3.id_menu)) {
                                        $template.getElementById('checkMenu').checked = true;
                                        celda.classList.add('true');
                                    }else{
                                        $template.getElementById('checkMenu').checked = false;
                                    }
                                    $clone = document.importNode($template, true);
                                    celda.appendChild($clone);
                                    tr.appendChild(celda);
                                    dos = false;

                                    $fragment.appendChild(tr);
    
                                } else {
                                    tr = document.createElement('tr');
                                    celda = document.createElement('td');

                                    $template = document.getElementById('templateCbo').content;
                                    celda.classList.add('celda-izquierda');
                                    tr.classList.add('id_'+ menu_1.id_menu);
                                    tr.classList.add('all');
                                    $template.querySelector('span').textContent = menu_3.descripcion;
                                    $template.getElementById('checkMenu').setAttribute('data-id',menu_3.id_menu);
                                    if (permisos.includes(menu_3.id_menu)) {
                                        $template.getElementById('checkMenu').checked = true;
                                        celda.classList.add('true');
                                    }else{
                                        $template.getElementById('checkMenu').checked = false;
                                    }
                                    $clone = document.importNode($template, true);
                                    celda.appendChild($clone);
                                    tr.appendChild(celda);

                                    $fragment.appendChild(tr);
                                }

                            }

                        });

                    }

                    
                });
                
            });

        $table.appendChild($fragment);

        document.getElementById('rowButton').style.display = '';

        },
        error: function(error) {
            console.log(error);
        }
    });
}

function actualizarPermisos(){
    
    let id_usuario = document.getElementById('usuarios').getAttribute("data-code");
    const checkboxs = document.querySelectorAll('#checkMenu');
    const permisos = new Array();
    checkboxs.forEach(element => {
        if(element.checked) permisos.push(element.dataset.id);
    });
    
    $.ajax({
        url: path + "seguridad/permisos",
        type: 'POST',
        data: {
            opcion: 'actualizarPermisos',
            id_usuario: id_usuario,
            permisos: permisos
        },
        success: function(data) {
            console.log(data);
            let resp = JSON.parse(data);

            if (resp.respuesta == "success") {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                Notiflix.Notify.Success('Permisos actualizados correctamente');
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al actualizar los permisos');
            }
        },
        error: function(e) {
            console.error("No es posible completar la operación");
        }
    });
}

function getRowspanMenuUno(id_uno, menus_nivel_2, menus_nivel_3){
    let cont = 0;

    menus_nivel_2.forEach(menu_n2 => {
        menus_nivel_3.forEach(menu_n3 => {
            if(menu_n2.padre === id_uno && menu_n3.padre === menu_n2.id_menu) cont++;
        });
    });

    return cont;
}

function getRowspanMenuDos(id_dos, menus_nivel_3) {
    let cont = 0;
    menus_nivel_3.forEach(menu_n3 => {
        if(menu_n3.padre === id_dos) cont++;
    });

    return cont;
}
