<?php

class ValidateJoinAjax extends AjaxBaseController
{

    /**
     * checks if a given user exist in that chatroom
     * echoes valid if no and invalid if yes
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sRoomId = $this->getRequestParameter("roomId");
        $sUser = $this->getRequestParameter("user");
        $oActive = new ChatActive();
        $sWhere = "(chat_room_id = '".$sRoomId."') AND (user = '".$sUser."')";

        if ($oActive->loadList($sWhere,1) === false) {
            echo "valid";
        } else {
            echo "invalid";
        }
    }
}