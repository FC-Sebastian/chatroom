<?php

class LoadChatMsgsAjax extends AjaxSqlQueryController
{

    protected function executeSqlQuery()
    {
        $oChatMsgs = new ChatMessage();
        $sChatroomId = $this->getRequestParameter("id");
        $aMsgs = $oChatMsgs->loadByColumnValue("chat_room_id", $sChatroomId,false,"created_at");

        $sMsgsDivsString = "";
        if ($aMsgs !== false) {
             foreach ($aMsgs as $aChatMsg) {
                 $sMsgsDivsString .=
                '<div class="row '.( $_SESSION["user"] === $aChatMsg["user"] ? 'justify-content-end' : '' ).'">
                    <div class="col-sm-6 gx-4 mb-2">
                        <div class="card shadow ">
                            <div class="card-body">
                                <h6 class="card-title">'.$aChatMsg["user"].':</h6>
                                <span class="card-text">'.$aChatMsg["msg_text"].'</span>
                            </div>
                        </div>
                    </div>
                </div>';
             }
        }
        echo $sMsgsDivsString;
    }
}