<?php

class LoadChatMsgsAjax extends AjaxBaseController
{
    use Decryption;

    /**
     * loads list of chat messages by chat_room_id and echoes them as <div> string
     * @return void
     */
    protected function executeSqlQuery()
    {
        $oChatMsgs = new ChatMessage();
        $sChatroomId = $this->getRequestParameter("id");
        $iLastId = $this->getRequestParameter("lastMessage");
        $sMsgsDivsString = "";
        $blPlaySound = false;

        if ($iLastId === false || $iLastId !== $oChatMsgs->loadByColumnValue("chat_room_id",$sChatroomId,1,"id DESC")[0]["id"]) {
            $sWhere = "(chat_room_id = '".$sChatroomId."') AND (id > '".$iLastId."')";
            $aMsgs = $oChatMsgs->loadList($sWhere);
            if ($aMsgs !== false) {
                foreach ($aMsgs as $aChatMsg) {
                    if ($aChatMsg["user"] === "") {
                        $sMsgsDivsString .= "<div class='text-center'><span>".$aChatMsg["msg_text"]."</span></div>";
                    } else {
                        $text = $this->decrypt($aChatMsg["msg_text"], Conf::getParam("key"));
                        $sMsgsDivsString .=
                        '<div class="col-12">
                            <div class="row '.( $_SESSION["user"] === $aChatMsg["user"] ? 'justify-content-end' : '' ).' g-0">
                                <div class="col-sm-8 mb-2 g-2">
                                    <div class="card shadow ">
                                        <div class="card-body">
                                            <h6 class="card-title">'.$aChatMsg["user"].':</h6>';
                        if ($aChatMsg["picture_url"] !== null && $aChatMsg["picture_url"] !== "") {
                            $sMsgsDivsString .= '<img class="img-fluid" src="'.$this->decrypt($aChatMsg["picture_url"], Conf::getParam("key")).'">';
                        }
                        $sMsgsDivsString .= '<span class="card-text">'.$text.'</span>
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
                $iLastId = end($aMsgs)["id"];
            }
        }
        $aEchoArray = ["text" => $sMsgsDivsString, "notification" => $blPlaySound, "lastId" => $iLastId];
        echo json_encode($aEchoArray);
    }
}