<?php
/**
 * @var $controller Chat
 */
?>
<div class="row">
    <div class="col-12 h-auto">

    </div>
    <div class="col-4">
        <ul id="userList" class="vh-100 overflow-auto list-group pt-2"></ul>
    </div>
    <div class="col-8 vh-100 pt-2">
        <div id="chatDiv" class="row h-90 border rounded bg-secondary bg-opacity-10 overflow-auto g-0 align-content-start"></div>
        <div class="row">
            <div class="col mt-2">
                <div class="input-group">
                    <textarea id="chatInput" class="form-control" name="chatText"></textarea>
                    <button id="send" class="btn btn-primary" type="button"><img src="<?= $controller->getUrl("icons/send.svg") ?>" alt="Send"></button>
                </div>
            </div>
        </div>

    </div>
    <input id="chatHidden" type="hidden" value="<?= $_SESSION["user"]."|".$controller->aChatRoom["id"] ?>">
</div>

<script src="<?= $controller->getUrl("js/chat.js") ?>"></script>