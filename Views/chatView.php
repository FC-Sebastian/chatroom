<?php
/**
 * @var $controller Chat
 */
?>
<nav class="navbar bg-primary fixed-top">
    <div class="container-fluid">
        <button class="btn btn-sm btn-dark" type="button" data-bs-toggle="offcanvas" data-bs-target="#UserOffCanvas" aria-controls="offcanvasScrolling">Active Users</button>
        <a class="btn btn-sm btn-danger" href="<?= $controller->getUrl() ?>">Leave Chat</a>
    </div>
</nav>

<div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="UserOffCanvas" aria-labelledby="label">
    <div class="offcanvas-body">
        <ul class="list-group">
            <li class="list-group-item list-group-item-dark">Active Users:<button class="btn-close float-end" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button></li>
            <?php if ($controller->aActiveUsers !== false) { ?>
                <?php foreach ($controller->aActiveUsers as $user) { ?>
                    <li class="list-group-item"><p><?= $user["user"] ?></p></li>
                <?php } ?>
            <?php } ?>
        </ul>
    </div>
</div>

<div class="row vh-100">
    <div id="chatDiv" class="col-12 h-90 overflow-auto pt-5"></div>
    <div class="col-12 input-group mb-1">
        <textarea id="chatInput" class="form-control" name="chatText"></textarea>
        <button id="send" class="btn btn-primary" type="button"><img src="<?= $controller->getUrl("icons/send.svg") ?>" alt="Send"></button>
    </div>
    <input id="chatHidden" type="hidden" value="<?= $_SESSION["user"]."|".$controller->aChatRoom["id"] ?>">
</div>

<script src="<?= $controller->getUrl("js/chat.js") ?>"></script>