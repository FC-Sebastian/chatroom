<?php

class LoadActiveUsersAjax extends AjaxBaseController
{

    /**
     * loads list of active users by chat_room_id and echoes <li> string for each entry
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sChatroomId = $this->getRequestParameter("id");
        $aChatList = $this->getRequestParameter("userIds");

        $oActive = new ChatActive();
        $sWhere = "chat_room_id = '{$sChatroomId}'";
        $aActiveUsers = $oActive->loadList($sWhere);

        $sReturnString = "";
        if ($aActiveUsers !== false) {

            foreach ($aActiveUsers as $user) {
                if ($aChatList === false || in_array($user["id"], $aChatList) === false) {
                    $sReturnString .= '<li id="'.$user["id"].'" class="list-group-item"><span class="text-break">'.$user["user"].'</span></li>';
                } else {
                    unset($aChatList[array_search($user["id"],$aChatList)]);
                }
            }
        }

        echo json_encode(["text" => $sReturnString, "deleteIds" => $aChatList]);
    }
}