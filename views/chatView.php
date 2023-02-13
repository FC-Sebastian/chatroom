<?php
/**
 * @var $controller Chat
 */
?>
<div class="row">
    <div class="col-4 vh-100 pt-2">
        <select id="notificationSelect" class="form-select mb-2">
            <option>notifications active</option>
            <option>notifications when in background</option>
            <option>notifications inactive</option>
        </select>
        <ul id="userList" class="overflow-auto list-group"></ul>
    </div>
    <div class="col-8 vh-100 pt-2">
        <div id="chatDiv" class="row h-90 border rounded bg-secondary bg-opacity-10 overflow-auto g-0 align-content-start"></div>
        <div class="row">
            <div class="col mt-2">
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
</div>

<script src="<?= $controller->getUrl("js/chat.js") ?>"></script>