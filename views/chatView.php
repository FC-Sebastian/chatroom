<?php
/**
 * @var $controller Chat
 */
?>
<div id="modal" class="modal fade">
    <div class="modal-dialog modal-lg modal-dialog-centered justify-content-center">
        <div class="modal-content bg-transparent w-auto">
            <div id="modalBody" class="modal-body text-center text-white p-0 m-0">
                <p id="lightboxIndex" class="position-absolute top-0 start-50 bg-secondary rounded px-1 translate-middle-x "></p>
                <img id="prev" class="position-absolute top-50 start-0 translate-middle-y" src="<?= $controller->getUrl("icons/prev.svg") ?>">
                <img id="lightBoxPic" class="img-fluid rounded d-inline" src="">
                <img id="next" class="position-absolute top-50 end-0 translate-middle-y" src="<?= $controller->getUrl("icons/next.svg") ?>">
            </div>
        </div>
    </div>
</div>
<div class="row flex-grow-1">
    <div class="col-4 vh-100 d-sm-flex d-none flex-flow-column p-2">
        <div class="row fit-content g-2 mb-2">
            <select id="notificationSelect" class="form-select">
                <option>Notification sound active</option>
                <option>Notification sound when in background</option>
                <option>Notification sound inactive</option>
            </select>
            <button id="push" class="btn btn-primary">Get push notifications</button>
        </div>
        <ul id="userList" class="remaining-space overflow-auto list-group"></ul>
    </div>
    <div class="col-sm-8 col-12 vh-100 d-flex flex-flow-column p-2">
        <nav class="navbar navbar-expand bg-primary d-sm-none px-1 justify-content-between mx-neg-2 mb-2">
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
        <div id="chatDiv" class="border remaining-space rounded bg-secondary bg-opacity-10 overflow-auto g-0 align-content-start"></div>
        <div class="fit-content">
            <div class="col mt-2">
                <div id="previewDiv" class="d-none">
                    <div class="col-12">
                        <div class="row justify-content-end g-0">
                        <div class="col-sm-6 mb-2 mt-0 g-2">
                            <div class="card shadow max-vh-50 overflow-auto">
                                <div class="card-body rounded bg-opacity-10 bg-success">
                                    <button id="closePreview" class="btn btn-outline-secondary float-end p-1 py-0">X</button>
                                    <h6 class="card-title"><?= $_SESSION["user"] ?>:</h6>
                                    <img id="preview" class="rounded mw-100 d-block max-vh-50" src="">
                                    <span id="previewText" class="card-text whiteSpace-normal"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <div class="input-group">
                    <textarea id="chatInput" class="form-control whiteSpace-normal" name="chatText"></textarea>
                    <label for="picUpload" class="btn btn-primary d-flex px-4">
                        <img class="h-50 w-100 position-absolute start-50 top-50 translate-middle" src="<?= $controller->getUrl("icons/paperclip.svg") ?>" alt="attach">
                    </label>
                    <span class="badge bg-secondary"></span>
                    <input id="picUpload" class="d-none" type="file" accept="image/*">
                    <button id="send" class="btn btn-primary px-4" type="button">
                        <img class="h-50 w-100 position-absolute start-50 top-50 translate-middle" src="<?= $controller->getUrl("icons/send.svg") ?>" alt="send">
                    </button>
                </div>
            </div>
        </div>
    </div>
    <input id="chatHidden" type="hidden" value="<?= $_SESSION["user"]."|".$controller->aChatRoom["id"] ?>">
    <input id="lastMessage" type="hidden" value="<?= $_SESSION["chat".$controller->aChatRoom["id"]] ?>">
</div>

<script src="<?= $controller->getUrl("js/chat.js") ?>"></script>