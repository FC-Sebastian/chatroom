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
            const intervalTime = 1000;
        </script>
    </head>
    <body class="bg-primary d-flex flex-column vh-100 bg-opacity-10">
    <?php if (get_class($controller) === "Chat") { ?>
        <nav class="navbar navbar-expand bg-primary d-sm-none px-1 justify-content-between">
            <button class="btn btn-secondary" data-bs-toggle="offcanvas" data-bs-target="#offcanvas" aria-controls="#offcanvas">Active users</button>
            <a class="btn btn-danger end" href="<?= $controller->getUrl() ?>">Leave chat</a>
        </nav>

        <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas" aria-labelledby="offLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offLabel">Active users:</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div>
                    <ul id="offList" class="overflow-auto list-group"></ul>
                </div>
            </div>
        </div>
    <?php } ?>
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

