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

        if ($iLastId === false || $iLastId !== $oChatMsgs->loadList("chat_room_id = '{$sChatroomId}'",1,"id DESC")[0]["id"]) {
            $sWhere = "(chat_room_id = '".$sChatroomId."') AND (id > '".$iLastId."')";
            $aMsgs = $oChatMsgs->loadList($sWhere);

            if ($aMsgs !== false) {
                foreach ($aMsgs as $aChatMsg) {
                    if ($aChatMsg["user"] === "") {
                        $sMsgsDivsString .= "<div class='text-center'><span>".$aChatMsg["msg_text"]."</span></div>";
                    } else {
                        $sMsgsDivsString .= $this->buildMessageString($aChatMsg);
                    }
                }

                if (htmlspecialchars(end($aMsgs)["user"]) !== $_SESSION["user"] && end($aMsgs)["user"] !== "") {
                    $blPlaySound = true;
                }
                $iLastId = end($aMsgs)["id"];
            }
        }
        $aEchoArray = ["text" => $sMsgsDivsString, "notification" => $blPlaySound, "lastId" => $iLastId];
        echo json_encode($aEchoArray);
    }

    /**
     * builds message string from message array and returns it
     * @param $aChatMsg
     * @return string
     */
    protected function buildMessageString($aChatMsg)
    {
        $text = nl2br($this->decrypt($aChatMsg["msg_text"], Conf::getParam("key")));
        $sMessage ='<div class="col-12">
                            <div class="row '.( $_SESSION["user"] === htmlspecialchars($aChatMsg["user"]) ? 'justify-content-end' : '' ).' g-0">
                                <div class="col-sm-8 mb-2 g-2">
                                    <div class="card shadow">
                                        <div class="card-body rounded bg-opacity-10 '.( $_SESSION["user"] === htmlspecialchars($aChatMsg["user"]) ? 'bg-success' : 'bg-primary' ).'">
                                            <h6 class="card-title">'.htmlspecialchars($aChatMsg["user"]).':</h6>';
        if ($aChatMsg["picture_url"] !== null && $aChatMsg["picture_url"] !== "") {
            $sMessage .= '<img class="lightbox d-block rounded mw-100" src="'.$this->decrypt($aChatMsg["picture_url"], Conf::getParam("key")).'">';
        }
        $sMessage .= '<span class="card-text whiteSpace-preWrap">'.$text.'</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>';
        return $sMessage;
    }
}