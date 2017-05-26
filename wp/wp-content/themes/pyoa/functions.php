<?php
/**
 * PYOA
 */

add_filter( 'run_wptexturize', '__return_false' );
remove_filter( 'the_excerpt', 'wpautop' );

