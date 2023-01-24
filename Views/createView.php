<?php
/**
 * @var $controller Create
 */
?>
<div class="row justify-content-center g-1">
    <div class="col-md-6 card">
        <div class="card-body text-center">
            <form id="form" action="<?= $controller->getUrl("create/createRoom/") ?>" method="post">
                <pre><?= print_r($_REQUEST) ?></pre>
                <input name="user" type="hidden" value="<?= $controller->getRequestParameter("user")?>">
                <h3 class="card-title text-secondary"><?= $controller->getRequestParameter("user")."'s Chatroom" ?></h3>
                <div class="row justify-content-center mb-3">
                    <div class="col-md-9">
                        <div class="input-group">
                            <span class="input-group-text">Room name</span>
                            <input id="room_name" class="form-control" type="text"  name="room_name" required="required" autocomplete="off">
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center mb-3">
                    <div class="col-md-9">
                        <button id="create" class="btn btn-outline-primary w-100" type="submit">Create Chatroom</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
