<?php

class SendChatMsgAjax extends AjaxSqlQueryController
{

    protected function executeSqlQuery()
    {
        $oChatMsg = new ChatMessage();
        $aData = [];
        $aData["chat_room_id"] = $this->getRequestParameter("roomId");
        $aData["user"] = $this->getRequestParameter("user");
        $aData["msg_text"] = $this->getRequestParameter("text");
        $aData["created_at"] = date("Y.m.d H:i:s",time());
        $oChatMsg->data = $aData;
        $oChatMsg->save();
        $sMsgString ='<div class="row justify-content-end">
                        <div class="col-sm-6 gx-4 mb-2">
                            <div class="card shadow ">
                                <div class="card-body">
                                    <h6 class="card-title">'.$aData["user"].':</h6>
                                    <span class="card-text">'.$aData["msg_text"].'</span>
                                </div>
                            </div>
                        </div>
                    </div>';
        echo ($sMsgString);
    }
}