<?php
/**
 * @var $controller Foyer
 */
?>
<div class="row justify-content-center mb-2">
    <div class="card col-md-6 g-2">
        <div class="card-body text-center">
            <form id="form" action="<?= $controller->getUrl("index.php") ?>" method="post">
                <h3 class="card-title text-secondary">Chad Chats</h3>
                <div class="row justify-content-center mb-3">
                    <div class="col-md-9">
                        <div class="input-group">
                            <span class="input-group-text">Username:</span>
                            <input id="username" class="form-control" type="text"  name="user" value="<?= $_SESSION["user"] ?? ""?>" required="required" autocomplete="off">
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center mb-3">
                    <div class="col-md-9">
                        <div class="input-group">
                            <span class="input-group-text">Chatroom name</span>
                            <input id="room_name" class="form-control" type="text"  name="room_name" required="required" autocomplete="off">
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center mb-3">
                    <div class="col-md-9">
                        <button id="create" class="btn btn-outline-primary w-100" type="submit">Create chatroom</button>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-9">
                        <button id="join" class="btn btn-outline-primary w-100" type="submit">Join chatroom</button>
                    </div>
                </div>
                <input id="controller" type="hidden" name="controller">
            </form>
        </div>
    </div>
</div>
<script src="<?= $controller->getUrl("js/foyer.js") ?>"></script>

