<?php
	header('Content-Type: text/cache-manifest');
	echo "CACHE MANIFEST\n";

	$hashes = "";

	$dir = new RecursiveDirectoryIterator(".");
	foreach(new RecursiveIteratorIterator($dir) as $file) {
		$info = pathinfo($file);
		if ($file->IsFile() && strpos($file, ".svn") === false && !preg_match('/.php$/', $file)) {
			echo substr($file, 2) . "\r\n";
			$hashes .= md5_file($file);
		}
	}

	echo "# Hash: " . md5($hashes) . "\n";
?>