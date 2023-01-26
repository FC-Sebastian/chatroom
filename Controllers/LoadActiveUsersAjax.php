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

        $oActive = new ChatActive();
        $aActiveUsers = $oActive->loadByColumnValue("chat_room_id",$sChatroomId);

        $sReturnString = "";
        if ($aActiveUsers !== false) {
            $sReturnString .= '<li class="list-group-item list-group-item-dark">Active Users:<a class="btn btn-sm btn-danger float-end" href="'.$this->getUrl().'">Leave Chat</a></li>';
            foreach ($aActiveUsers as $user) {
                $sReturnString .= '<li class="list-group-item"><p>'.$user["user"].'</p></li>';
            }
        }
        echo $sReturnString;
    }
}