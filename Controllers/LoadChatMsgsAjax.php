<?php

class LoadChatMsgsAjax extends AjaxBaseController
{

    /**
     * loads list of chat messages by chat_room_id and echoes them as <div> string
     * @return void
     */
    protected function executeSqlQuery()
    {
        $oChatMsgs = new ChatMessage();
        $sChatroomId = $this->getRequestParameter("id");
        $lastId = $this->getRequestParameter("lastId");
        $sMsgsDivsString = "";
        $blPlaySound = false;

        if ($lastId === false || $lastId !== $oChatMsgs->loadByColumnValue("chat_room_id",$sChatroomId,1,"id DESC")) {
            $aMsgs = $oChatMsgs->loadByColumnValue("chat_room_id", $sChatroomId,false,"created_at");
            if ($aMsgs !== false) {
                foreach ($aMsgs as $aChatMsg) {
                    if ($aChatMsg["user"] === "") {
                        $sMsgsDivsString .= "<div class='text-center'><span>".$aChatMsg["msg_text"]."</span></div>";
                    } else {
                        $sMsgsDivsString .=
                            '<div class="col-12">
                            <div class="row '.( $_SESSION["user"] === $aChatMsg["user"] ? 'justify-content-end' : '' ).' g-0">
                                <div class="col-sm-8 mb-2 g-2">
                                    <div class="card shadow ">
                                        <div class="card-body">
                                            <h6 class="card-title">'.$aChatMsg["user"].':</h6>
                                            <span class="card-text">'.$aChatMsg["msg_text"].'</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>';
                    }
                }
                if (end($aMsgs)["user"] !== $_SESSION["user"] && end($aMsgs)["user"] !== "") {
                    $blPlaySound = true;
                }
                $lastId = end($aMsgs)["id"];
            }
        }
        $aEchoArray = ["text" => $sMsgsDivsString, "notification" => $blPlaySound, "lastId" => $lastId];
        echo json_encode($aEchoArray);
    }
}