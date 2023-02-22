<?php
/**
 * @var $controller Chat
 */
?>
<div class="row">
    <div class="col-4 vh-100 d-flex flex-flow-column pt-2">
        <div class="row fit-content g-2 mb-2">
            <select id="notificationSelect" class="form-select">
                <option>notification sound active</option>
                <option>notification sound when in background</option>
                <option>notification sound inactive</option>
            </select>
            <button id="push" class="btn btn-primary">get push notifications</button>
        </div>
        <ul id="userList" class="remaining-space overflow-auto list-group"></ul>
    </div>
    <div class="col-8 vh-100 d-flex flex-flow-column pt-2">
        <div id="chatDiv" class="border remaining-space rounded bg-secondary bg-opacity-10 overflow-auto g-0 align-content-start"></div>
        <div class="fit-content">
            <div class="col mt-2">
                <div id="previewDiv" class="position-relative text-center">
                    <img id="preview" class="position-absolute bottom-100 start-0 w-75 rounded" src="">
                </div>
                <div class="input-group">
                    <textarea id="chatInput" class="form-control" name="chatText"></textarea>
                    <label for="picUpload" class="btn btn-primary d-flex align-items-center">
                        <img class="h-50" src="<?= $controller->getUrl("icons/paperclip.svg") ?>" alt="attach">
                    </label>
                    <span class="badge bg-secondary"></span>
                    <input id="picUpload" class="d-none" type="file" accept="image/*">
                    <button id="send" class="btn btn-primary" type="button"><img class="rotate-45" src="<?= $controller->getUrl("icons/send.svg") ?>" alt="send"></button>
                </div>
            </div>
        </div>
    </div>
    <input id="chatHidden" type="hidden" value="<?= $_SESSION["user"]."|".$controller->aChatRoom["id"] ?>">
    <input id="lastMessage" type="hidden" value="<?= $_SESSION["chat".$controller->aChatRoom["id"]] ?>">
</div>

<script src="<?= $controller->getUrl("js/chat.js") ?>"></script>