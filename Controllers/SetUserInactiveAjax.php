<?php

class SetUserInactiveAjax extends AjaxBaseController
{
    /**
     * loads user id by username and chat_room_id and deletes it
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sUser = htmlspecialchars($this->getRequestParameter("user"));
        $sRoomId = $this->getRequestParameter("roomId");
        $sWhere = " (chat_room_id = '{$sRoomId}') AND (user = '{$sUser}')";
        $oActive = new ChatActive();
        $aActiveUser = $oActive->loadList($sWhere,1)[0];
        if ($aActiveUser !== false) {
            $aActiveUser["active"] = 0;
            $oActive->assign($aActiveUser);
            $oActive->save();
        }
    }
}