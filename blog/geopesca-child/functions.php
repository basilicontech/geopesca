/**
 * Footer personalizado de Bitácora Pesca
 */
add_action( 'wp_footer', 'gp_footer_personalizado', 100 );

function gp_footer_personalizado() {
    ?>
    <footer class="footer">
      <p>
        © 2026 - Registro de Jornadas de Pesca Recreativa |
        <a href="/aviso-legal.html">Aviso legal</a> |
        <a href="/politica-privacidad.html">Política de privacidad</a> |
        <a href="/politica-de-cookies.html">Política de cookies</a> |
        <a href="/condiciones-de-uso.html">Condiciones de uso</a> |
        <a href="mailto:basilicontech@gmail.com">Contacto: basilicontech@gmail.com</a>
      </p>
      <p>Sistema de Información Geográfica para pescadores recreativos</p>
    </footer>
    <?php
}