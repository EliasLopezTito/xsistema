<div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
    <!--begin::Sidebar-->
    <div id="kt_app_sidebar" class="app-sidebar flex-column" data-kt-drawer="true" data-kt-drawer-name="app-sidebar"
        data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="225px"
        data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
        <!--begin::Logo-->
        <div class="app-sidebar-logo px-6" id="kt_app_sidebar_logo">
            <!--begin::Logo image-->
            <a href="index.html">
                <img alt="Logo" src="assets/media/logos/default-dark.svg" class="h-30px app-sidebar-logo-default" />
            </a>
            <!--end::Logo image-->

            <!--begin::Sidebar toggle-->
            <div id="kt_app_sidebar_toggle" class="app-sidebar-toggle btn btn-icon btn-sm h-30px w-30px rotate"
                data-kt-toggle="true" data-kt-toggle-state="active" data-kt-toggle-target="body"
                data-kt-toggle-name="app-sidebar-minimize">
                <i class="bi bi-chevron-double-left"></i><span class="path1"></span><span class="path2"></span></i>
            </div>
            <!--end::Sidebar toggle-->
        </div>
        <!--end::Logo-->
        <!--begin::sidebar menu-->
        <div class="app-sidebar-menu overflow-hidden flex-column-fluid">
            <!--begin::Menu wrapper-->
            <div id="kt_app_sidebar_menu_wrapper" class="app-sidebar-wrapper">
                <!--begin::Scroll wrapper-->
                <div id="kt_app_sidebar_menu_scroll" class="hover-scroll-y my-5 mx-3" data-kt-scroll="true"
                    data-kt-scroll-activate="true" data-kt-scroll-height="auto"
                    data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
                    data-kt-scroll-wrappers="#kt_app_sidebar_menu" data-kt-scroll-offset="5px"
                    data-kt-scroll-save-state="true">
                    <!--begin::Menu-->
                    <div class="menu menu-column menu-rounded menu-sub-indention fw-semibold" id="#kt_app_sidebar_menu"
                        data-kt-menu="true" data-kt-menu-expand="false">
                        <div class="menu-item pt-5">
                            <!--begin:Menu content-->
                            <div class="menu-content">
                                <span class="menu-heading fw-bold text-uppercase fs-7">Menu</span>
                            </div>
                            <!--end:Menu content-->
                        </div>

                        <?php

                        // $nivel11 = new stdClass();
                        // $nivel11->id_menu = "1";
                        // $nivel11->descripcion = "Libreta";
                        // $nivel11->icono = "icon-cog";
                        // $nivel11->href = "#";
                        // $nivel11->nivel = "1";
                        // $nivel11->padre = "0";
                        // $nivel11->orden = "1";

                        // $nivel22 = new stdClass();
                        // $nivel22->id_menu = "2";
                        // $nivel22->descripcion = "Estructura";
                        // $nivel22->icono = "icon";
                        // $nivel22->href = "#";
                        // $nivel22->nivel = "2";
                        // $nivel22->padre = "1";
                        // $nivel22->orden = "2";

                        // $nivel33 = new stdClass();
                        // $nivel33->id_menu = "3";
                        // $nivel33->descripcion = "Contacto";
                        // $nivel33->icono = "icon-contacto";
                        // $nivel33->href = "#";
                        // $nivel33->nivel = "3";
                        // $nivel33->padre = "2";
                        // $nivel33->orden = "1";

                        // $nivel1 = $nivel11;
                        // $nivel2 = $nivel22;
                        // $nivel3 = $nivel33;
                        // echo"<pre>";print_r($nivel1);echo"</pre>";

                            if ($nivel1 != null && $nivel1 != "vacio") {
                                foreach ($nivel1 as $n1) {

                                    $class = "";
                                    $target = "";
                                    if ($n1->href == "#") {
                                        $class = "menu-item menu-accordion";
                                        $target = "";
                                    } else {
                                        $class = "";
                                        $target = "_blank";
                                    }
                                    ?>

                                    <?php
                                    foreach ($nivel2 as $n2) {
                                        $break = "no";
                                        if ($n2->padre === $n1->id_menu) {
                                            foreach ($nivel3 as $n3) {
                                                if ($n3->padre === $n2->id_menu) {
                                                    if ($n3->href == str_replace('/siga/', '', $_SERVER['REQUEST_URI'])) {
                                                        $break = "si";
                                                        $active1 = "active";
                                                        break;
                                                    } else {
                                                        $active1 = "";
                                                    }
                                                }
                                            }
                                        }
                                        if ($break === "si") {
                                            break;
                                        }
                                    }
                                    ?>


                                    <div data-kt-menu-trigger="click" class="<?= $class ?> <?= (isset($active1) ? $active1 : '') ?>">
                                        <span class="menu-link">
                                            <span class="menu-icon"><i class="<?= $n1->icono ?>" style="margin-right: 5px;"></i></span>
                                            <span class="menu-title"><?= $n1->descripcion ?>
                                            </span><span class="menu-arrow"></span>
                                        </span>


                                        <?php
                                        if ($nivel2 != null && $nivel2 != "vacio") {
                                            ?>
                                            <div class="menu-sub menu-sub-accordion">
                                                <?php
                                                foreach ($nivel2 as $n2) {

                                                    foreach ($nivel3 as $n3) {
                                                        if ($n3->padre === $n2->id_menu) {
                                                            if ($n3->href == str_replace('/siga/', '', $_SERVER['REQUEST_URI'])) {
                                                                $break2 = "si";
                                                                $active2 = "active";
                                                                break;
                                                            } else {
                                                                $active2 = "";
                                                            }
                                                        }
                                                    }

                                                    if ($n2->padre == $n1->id_menu) {
                                                        ?>
                                                        <div data-kt-menu-trigger="click" class="menu-item menu-accordion <?= (isset($active2) ? $active2 : '') ?>"><!--active-->
                                                            <span class="menu-link">
                                                                <span class="menu-bullet">
                                                                    <span class="bullet bullet-dot"></span>
                                                                </span>
                                                                <span class="menu-title"><?php echo $n2->descripcion; ?></span>
                                                                <span class="menu-arrow"></span>
                                                            </span>
                                                            <?php
                                                            if ($nivel3 != null && $nivel3 != "vacio") {
                                                                ?>
                                                                <div class="menu-sub menu-sub-accordion menu-active-bg">
                                                                    <?php
                                                                    foreach ($nivel3 as $n3) {
                                                                        if ($n3->padre == $n2->id_menu) {
                                                                            ?>
                                                                                <div class="menu-item">
                                                                                    <a href="<?= base_url($n3->href) ?>" class="menu-link"
                                                                                        style="<?= ($n3->href === str_replace('/xsistema/', '', $_SERVER['REQUEST_URI']) ? 'color:#003bff' : '') ?>">
                                                                                        
                                                                                        <span class="menu-bullet"><span class="bullet bullet-dot"></span></span>
                                                                                        <span class="menu-title"><?= $n3->descripcion ?></span>
                                                                                    </a>
                                                                                </div>
                                                                        <?php
                                                                        }
                                                                    }
                                                                    ?>
                                                                </div>
                                                                <?php
                                                            }
                                                            ?>
                                                        </div>
                                                    <?php
                                                    }
                                                }
                                                ?>
                                            </div>
                                        <?php
                                        }
                                        ?>
                                    </div>
                                <?php
                                }
                            }
                        ?>
                    </div>
                    <!--end::Menu-->
                </div>
                <!--end::Scroll wrapper-->
            </div>
            <!--end::Menu wrapper-->
        </div>
        <!--end::sidebar menu-->
        <!--begin::Footer-->
        <div class="app-sidebar-footer flex-column-auto pt-2 pb-6 px-6" id="kt_app_sidebar_footer">
            <a href="https://preview.keenthemes.com/html/keen/docs"
                class="btn btn-flex flex-center btn-custom btn-primary overflow-hidden text-nowrap px-0 h-40px w-100"
                data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-dismiss-="click"
                title="200+ in-house components and 3rd-party plugins">
                <span class="btn-label"> Cerrar sesion </span>

                <i class="ki-duotone ki-document btn-icon fs-2 m-0"><span class="path1"></span><span
                        class="path2"></span></i>
            </a>
        </div>
        <!--end::Footer-->
    </div>
    <!--end::Sidebar-->
</div>