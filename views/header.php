<?php
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>
            <?php if (isset($title)) {echo $title;}?>
        </title>
        <link rel="stylesheet" href="<?= $url;?>">
        <link rel="stylesheet" href="<?= $controller->getUrl("css/myCss.css");?>">
        <script src="<?= $controller->getUrl("js/jquery-3.6.3.js") ?>"></script>
        <script src="<?= $controller->getUrl("js/bootstrap.js") ?>"></script>
        <script>
            const domain = "<?= $controller->getUrl() ?>";
            const nodeDomain = "<?= Conf::getParam("node") ?>";
            const publicKey = "<?= Conf::getParam("pushPublicKey") ?>";
            const intervalTime = 100;
        </script>
    </head>
    <body class="bg-primary d-flex flex-column vh-100 bg-opacity-10">
    <?php if ($controller->getError() !== false):?>
        <div class="bg-danger bg-opacity-25 border border-5 border-danger border-end-0 border-start-0">
            <div class="w-50 m-auto">
                <h1 class="fw-bold fs-2">Error:</h1>
                <p class="fs-5">
                    <?php echo $controller->getError()?>
                </p>
            </div>
        </div>
    <?php endif;?>
        <div class="container d-flex flex-column flex-grow-1 shadow bg-white">

