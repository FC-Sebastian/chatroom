<?php

class SetUserInactiveAjax extends AjaxBaseController
{
    /**
     * loads user id by username and chat_room_id and deletes it
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sUser = $this->getRequestParameter("user");
        $sRoomId = $this->getRequestParameter("roomId");
        $sWhere = " (chat_room_id = '{$sRoomId}') AND (user = '{$sUser}')";
        $oActive = new ChatActive();
        $aActiveUser = $oActive->loadList($sWhere,1)[0];
        $aActiveUser["active"] = 0;
        $oActive->assign($aActiveUser);
        $oActive->save();
    }

    /**
     * sends "user left chat" message
     * @param $oChatMsg
     * @param $sRoomId
     * @param $sUser
     * @return void
     */
    protected function sendUserLeftNotification ($oChatMsg, $sRoomId, $sUser)
    {
        $oChatMsg->setChat_room_id($sRoomId);
        $oChatMsg->setMsg_text($sUser." left the chat");
        $oChatMsg->save();
    }
}