<?php

class ChatMessage extends BaseModel
{
    protected $tablename = "chat_messages";

    public function deleteJoinNotificationsByRoomId($roomId)
    {
        $query = "DELETE FROM ".$this->getTableName()." WHERE chat_room_id='$roomId' AND user =''";
        DbConnection::executeMysqlQuery($query);
    }
}