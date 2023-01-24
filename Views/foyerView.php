<?php
/**
 * @var $controller Foyer
 */
?>
<div class="row justify-content-center g-1">
    <div class="card col-md-6">
        <div class="card-body text-center">
            <form id="form" method="post">
                <h3 class="card-title text-secondary">Chad Chats</h3>
                <div class="row justify-content-center mb-3">
                    <div class="col-md-9">
                        <div class="input-group">
                            <span class="input-group-text">Username:</span>
                            <input id="username" class="form-control" type="text"  name="user" required="required" autocomplete="off">
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center mb-3">
                    <div class="col-md-9">
                        <button id="create" class="btn btn-outline-primary w-100" type="submit">Chatroom erstellen</button>
                    </div>
                </div>
                <div class="row  justify-content-center">
                    <div class="col-md-9">
                        <button id="join" class="btn btn-outline-primary w-100" type="submit">Chatroom beitreten</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="<?= $controller->getUrl("js/foyer.js") ?>"></script>

